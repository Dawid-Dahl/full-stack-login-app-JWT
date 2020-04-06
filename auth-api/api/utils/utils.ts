import path from "path";
import fs from "fs";
import {User, SQLRefreshToken, TokenPayload} from "../types/types";
import jwt from "jsonwebtoken";
import sqlite from "sqlite3";
import {config} from "dotenv";
import {Tables} from "../types/enums";
import {Request, Response, NextFunction} from "express";

interface RequestWithUser extends Request {
	user?: object;
}

config({
	path: "../../.env",
});

const PRIV_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf8");

export const extractPayloadFromJWT = (jwt: string): TokenPayload =>
	[jwt]
		.map((x) => x.split(".")[1])
		.map((x) => Buffer.from(x, "base64"))
		.map((x) => x.toString("utf8"))
		.map((x) => JSON.parse(x))[0];

export const removeBearerFromTokenHeader = (tokenHeader: string) => tokenHeader.split(" ")[1];

export const issueAccessToken = (user: User, expiresIn = "15s") => {
	const payload = {
		sub: user.id,
		username: user.username,
		email: user.email,
		admin: user.admin,
	};

	const signedAccessToken = jwt.sign(payload, PRIV_KEY, {expiresIn, algorithm: "RS256"});

	return `Bearer ${signedAccessToken}`;
};

export const issueRefreshToken = (user: User, expiresIn = "30d") => {
	const payload = {
		sub: user.id,
	};

	const signedRefreshToken = jwt.sign(payload, PRIV_KEY, {expiresIn, algorithm: "RS256"});

	return `Bearer ${signedRefreshToken}`;
};

export const addRefreshTokenToDatabase = (refreshToken: SQLRefreshToken): void => {
	const dbPath = process.env.DB_REFRESH_TOKEN_PATH || "";

	const db = new sqlite.Database(dbPath, (err) =>
		err ? console.error(err) : console.log("Connected to the SQLite database")
	);

	const sql = `INSERT INTO ${Tables.refreshTokens} (sub, iat, refresh_token) VALUES (?, ?, ?)`;
	const values = [refreshToken.sub, refreshToken.iat, refreshToken.refreshToken];

	db.run(sql, values, (err) =>
		!err ? console.log("Refresh Token added to database!") : console.error(err)
	);

	db.close((err) => (err ? console.error(err) : console.log("Closed the database connection")));
};

export const constructUserFromTokenPayload = (payload: TokenPayload) => ({
	id: payload.sub,
	username: payload.username,
	email: payload.email,
	admin: payload.admin,
});

export const attachUserToRequest = (req: RequestWithUser, token: TokenPayload) => {
	req.user = {
		username: token.username,
		admin: token.admin,
	};
};

export const refreshXToken = (req: RequestWithUser, res: Response, next: NextFunction) => (
	accessTokenFromHeader: string,
	refreshTokenFromHeader: string,
	publicKey: string
) => {
	const xToken = removeBearerFromTokenHeader(accessTokenFromHeader);

	const xTokenPayload = extractPayloadFromJWT(xToken);

	jwt.verify(xToken, publicKey, (err) => {
		if (err) {
			const xRefreshToken = removeBearerFromTokenHeader(refreshTokenFromHeader);

			jwt.verify(xRefreshToken, publicKey, (err) => {
				if (err) {
					res.status(401).send("Unauthorized");
				} else {
					const accessToken = issueAccessToken(
						constructUserFromTokenPayload(xTokenPayload)
					);

					attachUserToRequest(req, xTokenPayload);

					res.status(200).json({
						success: true,
						accessToken: accessToken,
						msg: "Your x-token was refreshed!",
					});

					next();
				}
			});
		} else {
			req.user = {
				username: xTokenPayload.username,
				admin: xTokenPayload.admin,
			};
			res.status(200).json({
				success: true,
				msg: "Your x-token is valid!",
			});
			next();
		}
	});
};

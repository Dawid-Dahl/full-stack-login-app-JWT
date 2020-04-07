import {User, SQLRefreshToken, xTokenPayload} from "../types/types";
import jwt from "jsonwebtoken";
import sqlite from "sqlite3";
import {config} from "dotenv";
import {Tables} from "../types/enums";
import {Request} from "express";

interface RequestWithUser extends Request {
	user?: object;
}

config({
	path: "../../.env",
});

export const log = (label: string, expression = "") => (
	console.log(label + " --- " + expression), expression
);

/* export const authJsonResponse = (
	success: boolean,
	message = "No message",
	xToken = false,
	xRefreshToken = false
): AuthJsonResponse => ({
	success,
	message,
	xToken,
	xRefreshToken,
}); */

export const authJsonResponse = (
	success: boolean,
	message?: string,
	xToken?: string,
	xRefreshToken?: string
) =>
	!message && !xToken && !xRefreshToken
		? {success}
		: !xToken && !xRefreshToken
		? {success, message}
		: !xRefreshToken
		? {success, message, xToken}
		: {success, message, xToken, xRefreshToken};

export const removeBearerFromTokenHeader = (tokenHeader: string | undefined) =>
	tokenHeader?.split(" ")[1];

export const extractPayloadFromBase64JWT = (jwt: string | undefined): xTokenPayload | undefined =>
	!jwt
		? undefined
		: [jwt]
				.map(x => x.split(".")[1])
				.map(x => Buffer.from(x, "base64"))
				.map(x => x.toString("utf8"))
				.map(x => JSON.parse(x))[0];

export const issueAccessToken = (user: User, privKey: string, expiresIn = "10s") => {
	const payload = {
		sub: user.id,
		username: user.username,
		email: user.email,
		admin: user.admin,
	};

	const signedXTokenPromise = new Promise<string>((res, rej) => {
		jwt.sign(payload, privKey, {expiresIn, algorithm: "RS256"}, (err, xToken) => {
			if (err) {
				rej(err);
			} else {
				res(`Bearer ${xToken}`);
			}
		});
	});

	return signedXTokenPromise;
};

export const issueRefreshToken = (user: User, privKey: string, expiresIn = "30d") => {
	const payload = {
		sub: user.id,
	};

	const signedXRefreshTokenPromise = new Promise<string>((res, rej) => {
		jwt.sign(payload, privKey, {expiresIn, algorithm: "RS256"}, (err, xRefreshToken) => {
			if (err) {
				rej(err);
			} else {
				res(`Bearer ${xRefreshToken}`);
			}
		});
	});

	return signedXRefreshTokenPromise;
};

export const addRefreshTokenToDatabase = (refreshToken: SQLRefreshToken): void => {
	const dbPath = process.env.DB_REFRESH_TOKEN_PATH || "";

	const db = new sqlite.Database(dbPath, err =>
		err ? console.error(err) : console.log("Connected to the SQLite database")
	);

	const sql = `INSERT INTO ${Tables.refreshTokens} (sub, iat, refresh_token) VALUES (?, ?, ?)`;
	const values = [refreshToken.sub, refreshToken.iat, refreshToken.xRefreshToken];

	db.run(sql, values, err =>
		!err ? console.log("Refresh Token added to database!") : console.error(err)
	);

	db.close(err => (err ? console.error(err) : console.log("Closed the database connection")));
};

export const constructUserWithoutPasswordFromSqlResult = (payload: User): User => ({
	id: payload.id,
	username: payload.username,
	email: payload.email,
	admin: payload.admin,
});

export const constructUserFromTokenPayload = (payload: xTokenPayload): User => ({
	id: payload.sub,
	username: payload.username,
	email: payload.email,
	admin: payload.admin,
});

export const attachUserToRequest = (req: RequestWithUser, user: User) => {
	req.user = {
		username: user.username,
		admin: user.admin,
	};
};

/* export const refreshXToken = (req: RequestWithUser, res: Response, next: NextFunction) => (
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
						constructUserFromTokenPayload(user),
						PRIV_KEY
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
}; */

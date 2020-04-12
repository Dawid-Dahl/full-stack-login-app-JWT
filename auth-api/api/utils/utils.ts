import {User, SQLRefreshToken, xTokenPayload} from "../types/types";
import jwt from "jsonwebtoken";
import sqlite from "sqlite3";
import {config} from "dotenv";
import {Tables} from "../types/enums";
import {Request} from "express";

interface RequestWithUser extends Request {
	user?: object;
}

type AuthJsonResponsePayload = {
	message?: string;
	user?: User;
};

config({
	path: "../../.env",
});

export const log = (label: string, expression = "") => {
	console.log(label + " --- ");
	console.log(expression);
	return expression;
};

export const authJsonResponse = (
	success: boolean,
	payload?: AuthJsonResponsePayload,
	xToken?: string,
	xRefreshToken?: string
) =>
	!payload && !xToken && !xRefreshToken
		? {success}
		: !xToken && !xRefreshToken
		? {success, payload}
		: !xRefreshToken
		? {success, payload, xToken}
		: {success, payload, xToken, xRefreshToken};

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

export const issueAccessToken = (user: User, privKey: string, expiresIn = "15s") => {
	const payload = {
		sub: user.id,
		username: user.username,
		email: user.email,
		admin: user.admin,
	};

	const signedXTokenPromise = new Promise<string>((res, rej) => {
		jwt.sign(payload, privKey, {expiresIn, algorithm: "RS256"}, (err, xToken) =>
			err ? rej(err) : res(xToken)
		);
	});

	return signedXTokenPromise;
};

export const issueRefreshToken = (user: User, privKey: string, expiresIn = "30d") => {
	const payload = {
		sub: user.id,
	};

	const signedXRefreshTokenPromise = new Promise<string>((res, rej) => {
		jwt.sign(payload, privKey, {expiresIn, algorithm: "RS256"}, (err, xRefreshToken) =>
			err ? rej(err) : res(xRefreshToken)
		);
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
		id: user.id,
		username: user.username,
		admin: user.admin,
	};
};

export const checkIfXRefreshTokenExistsInDb = (
	xRefreshToken: string | undefined
): Promise<boolean> => {
	if (xRefreshToken) {
		const dbPath = process.env.DB_REFRESH_TOKEN_PATH || "";

		const db = new sqlite.Database(dbPath, err =>
			err ? console.error(err) : console.log("Connected to the SQLite database")
		);

		const sql = `SELECT 1 FROM ${Tables.refreshTokens} WHERE refresh_token = ?`;

		return new Promise((res, rej) => {
			db.get(sql, xRefreshToken, (err, row) => {
				db.close(err =>
					err ? console.error(err) : console.log("Closed the database connection")
				);
				err ? rej(err) : res(Boolean(row));
			});
		});
	} else {
		throw new Error("Token was undefined and not a string.");
	}
};

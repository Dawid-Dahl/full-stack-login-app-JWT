import path from "path";
import fs from "fs";
import {UserJwt, SQLRefreshToken, Token} from "../types/types";
import jwt from "jsonwebtoken";
import sqlite from "sqlite3";
import {config} from "dotenv";
import {Tables, JWT} from "../types/enums";

config({
	path: "../../.env"
});

const PRIV_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf8");

export const extractPayloadFromJWT = (jwt: string): Token =>
	[jwt]
		.map(x => x.split(".")[1])
		.map(x => Buffer.from(x, "base64"))
		.map(x => x.toString("utf8"))
		.map(x => JSON.parse(x))[0];

export const issueAccessToken = (user: UserJwt, expiresIn = "10m") => {
	const payload = {
		sub: user.id,
		username: user.username
	};

	const signedAccessToken = jwt.sign(payload, PRIV_KEY, {expiresIn, algorithm: "RS256"});

	return `Bearer ${signedAccessToken}`;
};

export const issueRefreshToken = (user: UserJwt, expiresIn = "1y") => {
	const payload = {
		sub: user.id
	};

	const signedRefreshToken = jwt.sign(payload, PRIV_KEY, {expiresIn, algorithm: "RS256"});

	return `Bearer ${signedRefreshToken}`;
};

export const addRefreshTokenToDatabase = (refreshToken: SQLRefreshToken): void => {
	const dbPath = process.env.DB_REFRESH_TOKEN_PATH || "";

	const db = new sqlite.Database(dbPath, err =>
		err ? console.error(err) : console.log("Connected to the SQLite database")
	);

	const sql = `INSERT INTO ${Tables.refreshTokens} (sub, iat, refresh_token) VALUES (?, ?, ?)`;
	const values = [refreshToken.sub, refreshToken.iat, refreshToken.refreshToken];

	db.run(sql, values, err =>
		!err ? console.log("Refresh Token added to database!") : console.error(err)
	);

	db.close(err => (err ? console.error(err) : console.log("Closed the database connection")));
};

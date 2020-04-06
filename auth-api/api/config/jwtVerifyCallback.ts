import path from "path";
import fs from "fs";
import sqlite from "sqlite3";
import jwt from "jsonwebtoken";
import {config} from "dotenv";
import {Tables} from "../types/enums";
import {extractPayloadFromJWT} from "../utils/utils";
import {DoneCallback, JwtVerifyCallback} from "../types/types";

config({path: "../../.env"});

const PRIV_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf8");

const PUB_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf8");

export const jwtVerifyCallback: JwtVerifyCallback = (
	done: DoneCallback,
	xToken = undefined,
	xRefreshToken = undefined
) => {
	//Zero, if both tokens are undefined, GTFOOOOO!

	if (!xToken && !xRefreshToken) {
		done(null, false, "You are unauthorized to access this resource.");
	}

	//First, if there is no refresh-token and only a x-token, check if it is valid and then allow access for as long as it is valid, if it is not valid: GTFO!

	if (xToken && !xRefreshToken) {
		jwt.verify(xToken, PUB_KEY, (err, xToken) => {});
	}

	//Second, if there is no x-token and only a refresh-token, check if the refresh-token is valid, and then issue a new x-token and send it back! If not valid tell them to GTFO.

	//Third, if both the tokens exist, check if the x-token is valid and has not expires. If it has not expired, do the same as in First. If it has expired, do the same as in Second.

	const xTokenPayload = extractPayloadFromJWT(xToken);
	const xRefreshTokenPayload = extractPayloadFromJWT(xRefreshToken);

	/* const db = new sqlite.Database(dbPath, (err) =>
		err ? console.error(err) : console.log("Connected to the SQLite database")
	);

	const sql = `SELECT * FROM ${Tables.users} WHERE id = ?`;

	db.get(sql, jwtPayload.sub, (err, row) =>
		err ? done(err, false) : !row ? done(null, false) : done(null, row)
	);
	db.close((err) => (err ? console.error(err) : console.log("Closed the database connection"))); */
};

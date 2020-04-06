import path from "path";
import fs from "fs";
import {Request, Response, NextFunction} from "express";
import sqlite from "sqlite3";
import {
	removeBearerFromTokenHeader,
	attachUserToRequest,
	authJsonResponse,
	issueAccessToken,
	constructUserFromTokenPayload,
	constructUserFromSqlResult,
} from "../utils/utils";
import {jwtVerifyCallback} from "./jwtVerifyCallback";
import {DoneCallback, MyPassport, JwtVerifyCallback} from "../types/types";
import {config} from "dotenv";
import {Tables} from "../types/enums";

config({path: "../../.env"});

const PRIV_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf8");

const myPassport: MyPassport = (verify: JwtVerifyCallback, options = {}) => (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const done: DoneCallback = (err, user, info, refresh) => {
		if (user && refresh) {
			const dbPath = process.env.DB_PATH || "";

			const db = new sqlite.Database(dbPath, (err) =>
				err ? console.error(err) : console.log("Connected to the SQLite database")
			);

			const sql = `SELECT * FROM ${Tables.users} WHERE id = ?`;

			db.get(sql, user.sub, (err, row) => {
				if (err) {
					console.error(err);
				} else {
					const user = constructUserFromSqlResult(row);

					issueAccessToken(user, PRIV_KEY).then((xToken) => {
						attachUserToRequest(req, user);

						res.status(200).json(
							authJsonResponse(true, "Your x-token was refreshed!", xToken)
						);

						db.close((err) =>
							err ? console.error(err) : console.log("Closed the database connection")
						);

						next();
					});
				}
			});
		}

		if (!err && !user) {
			res.status(401).json(authJsonResponse(false, info));
			return;
		}

		if (!err && user) {
			constructUserFromTokenPayload(user);

			attachUserToRequest(req, constructUserFromTokenPayload(user));

			res.status(200).json({
				success: true,
				msg: "Your x-token is valid!",
			});

			next();
		}
	};

	const xToken = removeBearerFromTokenHeader(req.get("authorization"));
	const xRefreshToken = removeBearerFromTokenHeader(req.get("x-refresh-token"));

	if (!xToken) {
		res.status(401).json(authJsonResponse(false, "No x-token!"));
		next(new Error("No x-token!"));
	}
	if (!xRefreshToken) {
		res.status(401).json(authJsonResponse(false, "No x-refresh-token!"));
		next(new Error("No x-refresh-token!"));
	}

	if (xToken && xRefreshToken) {
		verify(done, xToken, xRefreshToken);
	}

	next(new Error("Something wen't horribly wrong!"));
};

const verifyWithJwtStrategy = myPassport(jwtVerifyCallback);

export default verifyWithJwtStrategy;

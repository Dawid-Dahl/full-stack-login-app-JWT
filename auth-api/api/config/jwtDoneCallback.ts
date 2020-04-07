import path from "path";
import fs from "fs";
import sqlite from "sqlite3";
import {
	attachUserToRequest,
	authJsonResponse,
	issueAccessToken,
	constructUserFromTokenPayload,
	constructUserWithoutPasswordFromSqlResult,
	log,
} from "../utils/utils";
import {JwtDoneCallback, User} from "../types/types";
import {config} from "dotenv";
import {Tables} from "../types/enums";

config({path: "../../.env"});

const PRIV_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf8");

const jwtJwtDoneCallback: JwtDoneCallback = (req, res, next) => (err, user, info, refresh) => {
	if (err) {
		res.status(401).json(authJsonResponse(false, info));
		next(err);
		return;
	}

	if (!user) {
		res.status(401).json(authJsonResponse(false, info));
		return;
	}

	if (user && refresh) {
		const dbPath = process.env.DB_PATH || "";

		const db = new sqlite.Database(dbPath, err =>
			err ? console.error(err) : console.log("Connected to the SQLite database")
		);

		const sql = `SELECT * FROM ${Tables.users} WHERE id = ?`;

		db.get(sql, user.sub, (err, row: User) => {
			if (err) {
				next(err);
			} else {
				const user = constructUserWithoutPasswordFromSqlResult(row);

				issueAccessToken(user, PRIV_KEY)
					.then(xToken => {
						attachUserToRequest(req, user);

						res.status(200).json(authJsonResponse(true, info, xToken));

						db.close(err =>
							err ? console.error(err) : console.log("Closed the database connection")
						);

						next();
					})
					.catch(err => next(err));
			}
		});
	}

	if (user && !refresh) {
		constructUserFromTokenPayload(user);

		attachUserToRequest(req, constructUserFromTokenPayload(user));

		res.status(200).json(authJsonResponse(true, info));

		next();
	}

	return;
};

export default jwtJwtDoneCallback;

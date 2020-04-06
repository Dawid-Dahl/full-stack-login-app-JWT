import path from "path";
import fs from "fs";
import {Request, Response} from "express";
import bcrypt from "bcrypt";
import sqlite from "sqlite3";
import {Tables} from "../types/enums";
import {User, SQLRefreshToken} from "../types/types";
import {
	issueAccessToken,
	issueRefreshToken,
	addRefreshTokenToDatabase,
	extractPayloadFromBase64JWT,
	constructUserFromSqlResult,
	authJsonResponse,
} from "../utils/utils";

const PRIV_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf8");

export const loginController = (req: Request, res: Response) => {
	const dbPath = process.env.DB_PATH || "";

	const db = new sqlite.Database(dbPath, (err) =>
		err ? console.error(err) : console.log("Connected to the SQLite database")
	);

	const sql = `SELECT * FROM ${Tables.users} WHERE email = ?`;

	db.get(sql, req.body.email, async (err, row: User) => {
		if (!err) {
			if (!row) {
				res.status(401).json(authJsonResponse(false, "Could not find user."));
			}

			const isMatch = await bcrypt.compare(req.body.password, row.password!);

			if (isMatch) {
				const user = constructUserFromSqlResult(row);

				const xTokenPromise = issueAccessToken(user, PRIV_KEY);
				const xRefreshTokenPromise = issueRefreshToken(user, PRIV_KEY);

				Promise.all([xTokenPromise, xRefreshTokenPromise]).then((values) => {
					const [xToken, xRefreshToken] = values;

					const refreshTokenPayload = extractPayloadFromBase64JWT(xRefreshToken);

					if (refreshTokenPayload) {
						const sqlRefreshToken: SQLRefreshToken = {
							sub: refreshTokenPayload.sub,
							iat: refreshTokenPayload.iat,
							xRefreshToken: xRefreshToken,
						};

						addRefreshTokenToDatabase(sqlRefreshToken);

						res.status(200).json(
							authJsonResponse(true, "Tokens generated!", xToken, xRefreshToken)
						);
					} else {
						throw new Error(
							"For some reason the x-refresh-token was undefined and therefore couldn't be added to the database."
						);
					}
				});
			} else {
				res.status(401).send({success: false, msg: "Couldn't log in."});
			}
		} else {
			res.status(503).json({
				success: false,
				msg: "Service unavailable at the moment.",
			});
		}
	});
	db.close((err) => (err ? console.error(err) : console.log("Closed the database connection")));
};

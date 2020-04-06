import {Request, Response} from "express";
import bcrypt from "bcrypt";
import sqlite from "sqlite3";
import {Tables} from "../types/enums";
import {User, SQLRefreshToken} from "../types/types";
import {
	issueAccessToken,
	issueRefreshToken,
	addRefreshTokenToDatabase,
	extractPayloadFromJWT,
} from "../utils/utils";

export const loginController = (req: Request, res: Response) => {
	const dbPath = process.env.DB_PATH || "";

	const db = new sqlite.Database(dbPath, (err) =>
		err ? console.error(err) : console.log("Connected to the SQLite database")
	);

	const sql = `SELECT * FROM ${Tables.users} WHERE email = ?`;

	db.get(sql, req.body.email, async (err, row: User) => {
		if (!err) {
			if (!row) {
				res.status(401).json({success: false, msg: "Could not find user."});
			}

			const isMatch = await bcrypt.compare(req.body.password, row.password!);

			if (isMatch) {
				const user: User = {
					id: row.id,
					username: row.username,
					email: row.email,
					admin: row.admin,
				};

				const accessToken = issueAccessToken(user);
				const refreshToken = issueRefreshToken(user);

				const refreshTokenPayload = extractPayloadFromJWT(refreshToken);

				const sqlRefreshToken: SQLRefreshToken = {
					sub: refreshTokenPayload.sub,
					iat: refreshTokenPayload.iat,
					refreshToken: refreshToken,
				};

				addRefreshTokenToDatabase(sqlRefreshToken);

				res.status(200).json({
					success: true,
					accessToken: accessToken,
					refreshToken: refreshToken,
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
};

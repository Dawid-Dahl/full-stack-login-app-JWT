import {Request, Response} from "express";
import bcrypt from "bcrypt";
import sqlite from "sqlite3";
import {Tables} from "../types/enums";
import {User, UserJwt} from "../types/types";
import {issueJwt} from "../utils/utils";

export const loginController = (req: Request, res: Response) => {
	const dbPath = process.env.DB_PATH || "";

	const db = new sqlite.Database(dbPath, err =>
		err ? console.error(err) : console.log("Connected to the SQLite database")
	);

	const sql = `SELECT * FROM ${Tables.users} WHERE email = ?`;

	db.get(sql, req.body.email, async (err, row: User) => {
		if (!err) {
			if (!row) {
				res.status(401).json({success: false, msg: "Could not find user."});
			}

			const isMatch = await bcrypt.compare(req.body.password, row.password);

			if (isMatch) {
				const user: UserJwt = {
					id: row.id,
					username: row.username,
					email: row.email,
					admin: row.admin
				};
				const jwt = issueJwt(user);
				console.log(jwt);

				res.status(200).json({
					success: true,
					user: user,
					token: jwt.token,
					expiresIn: jwt.expires
				});
			} else {
				res.status(401).send("Couldn't log in.");
			}
		} else {
			res.status(503).json({
				success: false,
				msg: "Service unavailable at the moment."
			});
		}
	});
};

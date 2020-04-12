import {Request, Response} from "express";
import {validationResult} from "express-validator";
import sqlite from "sqlite3";
import {Tables} from "../types/enums";
import bcrypt from "bcrypt";
import {User} from "../types/types";
import {authJsonResponse} from "../utils/utils";

export const registerController = (req: Request, res: Response) => {
	const errors = validationResult(req);

	if (errors.isEmpty()) {
		const dbPath = process.env.DB_PATH || "";

		const db = new sqlite.Database(dbPath, err =>
			err ? console.error(err) : console.log("Connected to the SQLite database")
		);

		bcrypt.hash(req.body.password, 10, (err, hash) => {
			if (!err) {
				const sql = `INSERT INTO ${Tables.users} (username, email, password) VALUES (?, ?, ?)`;
				const values = [req.body.username, req.body.email, hash];

				db.run(sql, values, err => {
					if (!err) {
						db.get(
							`SELECT id, username, email, admin FROM ${Tables.users} WHERE email = ?`,
							req.body.email,
							(err, row: User) => {
								if (err) console.error(err);

								res.status(200).json(
									authJsonResponse(true, {
										message: `Registration successful. Welcome, ${row.username}, now you can log in!`,
									})
								);
							}
						);
					} else {
						res.status(403).json(
							authJsonResponse(false, {message: "Couldn't register user"})
						);
					}
				});

				db.close(err =>
					err ? console.error(err) : console.log("Closed the database connection")
				);
			} else {
				console.error(err);
			}
		});
	} else {
		res.status(422).send("Invalid Registration, try again!");
	}
};

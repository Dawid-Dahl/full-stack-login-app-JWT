import {Request, Response} from "express";
import {validationResult} from "express-validator";
import sqlite from "sqlite3";
import {Tables} from "../types/enums";
import bcrypt from "bcrypt";

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
						console.log("User registered successfully!");
					} else {
						console.error(err);
					}
				});

				db.close(err =>
					err ? console.error(err) : console.log("Closed the database connection")
				);
			} else {
				console.log(err);
			}
		});
	} else {
		res.status(422).send("Invalid Registration, try again!");
	}
};

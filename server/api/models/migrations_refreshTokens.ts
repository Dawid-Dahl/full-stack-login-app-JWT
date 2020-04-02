import sqlite from "sqlite3";
import {Tables} from "../types/enums";
import {config} from "dotenv";

config({
	path: "../../.env"
});

const dbPath = process.env.DB_REFRESH_TOKEN_PATH || "";

const db = new sqlite.Database(dbPath, err =>
	err ? console.error(err) : console.log("Connected to the SQLite database")
);

db.serialize(() => {
	db.run(`DROP TABLE IF EXISTS ${Tables.refreshTokens}`, err =>
		err ? console.error(err) : console.log(`Table ${Tables.refreshTokens} dropped successfully`)
	);
	db.run(
		`CREATE TABLE IF NOT EXISTS ${Tables.refreshTokens} (
            "sub" INTEGER NOT NULL,
            "iat" INTEGER NOT NULL,
            "refresh_token" TEXT NOT NULL
        );`,
		err =>
			err
				? console.error(err)
				: console.log(`Table ${Tables.refreshTokens} added successfully`)
	);
});

db.close(err => (err ? console.error(err) : console.log("Closed the database connection")));

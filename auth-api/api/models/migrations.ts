import sqlite from "sqlite3";
import {Tables} from "../types/enums";
import {config} from "dotenv";

config({
	path: "../../.env"
});

const dbPath = process.env.DB_PATH || "";

const db = new sqlite.Database(dbPath, err =>
	err ? console.error(err) : console.log("Connected to the SQLite database")
);

db.serialize(() => {
	db.run(`DROP TABLE IF EXISTS ${Tables.users}`, err =>
		err ? console.error(err) : console.log(`Table ${Tables.users} dropped successfully`)
	);
	db.run(
		`CREATE TABLE IF NOT EXISTS ${Tables.users} (
            "id" INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT,
            "username" TEXT NOT NULL,
            "email" TEXT NOT NULL UNIQUE,
            "password" TEXT NOT NULL,
            "date_added" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "admin" BOOLEAN NOT NULL DEFAULT 0
        );`,
		err => (err ? console.error(err) : console.log(`Table ${Tables.users} added successfully`))
	);
});

db.close(err => (err ? console.error(err) : console.log("Closed the database connection")));

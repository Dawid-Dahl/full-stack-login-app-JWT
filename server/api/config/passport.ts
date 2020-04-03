import fs from "fs";
import path from "path";
import sqlite from "sqlite3";
import passportJwt from "passport-jwt";
import {PassportStatic} from "passport";
import {config} from "dotenv";
import {Tables} from "../types/enums";

config({path: "../../.env"});

const dbPath = process.env.DB_PATH || "";

const pathToKey = path.join(__dirname, "..", "cryptography", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const passportConfig = (passport: PassportStatic) => {
	const JwtStrategy = passportJwt.Strategy;
	const ExtractJwt = passportJwt.ExtractJwt;

	const options: passportJwt.StrategyOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: PUB_KEY,
		algorithms: ["RS256"]
	};

	passport.use(
		new JwtStrategy(options, (jwtPayload, done) => {
			const db = new sqlite.Database(dbPath, err =>
				err ? console.error(err) : console.log("Connected to the SQLite database")
			);

			const sql = `SELECT * FROM ${Tables.users} WHERE id = ?`;

			db.get(sql, jwtPayload.sub, (err, row) =>
				err ? done(err, false) : !row ? done(null, false) : done(null, row)
			);
			db.close(err =>
				err ? console.error(err) : console.log("Closed the database connection")
			);
		})
	);
};

export default passportConfig;

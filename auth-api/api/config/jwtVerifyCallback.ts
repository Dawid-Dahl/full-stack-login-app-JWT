import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import {JwtVerifyCallback} from "../types/types";

const PUB_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf8");

export const jwtVerifyCallback: JwtVerifyCallback = (done, xToken, xRefreshToken) => {
	//Zero, if both tokens are undefined, GTFOOOOO!

	if (!xToken && !xRefreshToken) {
		done(
			new Error("No tokens included in request."),
			false,
			"You are unauthorized to access this resource."
		);
	}

	//First, if there is no refresh-token and only a x-token, check if it is valid and then allow access for as long as it is valid, if it is not valid: GTFO!

	if (xToken && !xRefreshToken) {
		jwt.verify(xToken, PUB_KEY, (err, decodedXToken) => {
			if (err) {
				done(err, false, "x-token has expired or is invalid. Log in to get a new one.");
			} else {
				done(null, decodedXToken);
			}
		});
	}

	//Second, if there is no x-token and only a refresh-token, check if the refresh-token is valid, and then issue a new x-token and send it back! If not valid tell them to GTFO.

	if (!xToken && xRefreshToken) {
		jwt.verify(xRefreshToken, PUB_KEY, (err, decodedXRefreshToken) => {
			if (err) {
				done(
					err,
					false,
					"x-refresh-token has expired, is invalid, or is blacklisted. Log in to get a new one."
				);
			} else {
				done(
					null,
					decodedXRefreshToken,
					"x-refresh-token is valid, issuing a new x-token!",
					true
				);
			}
		});
	}

	//Third, if both the tokens exist, check if the x-token is valid and has not expires. If it has not expired, do the same as in First. If it has expired, do the same as in Second.

	/* const db = new sqlite.Database(dbPath, (err) =>
		err ? console.error(err) : console.log("Connected to the SQLite database")
	);

	const sql = `SELECT * FROM ${Tables.users} WHERE id = ?`;

	db.get(sql, jwtPayload.sub, (err, row) =>
		err ? done(err, false) : !row ? done(null, false) : done(null, row)
	);
	db.close((err) => (err ? console.error(err) : console.log("Closed the database connection"))); */
};

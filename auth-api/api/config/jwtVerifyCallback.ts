import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import {JwtVerifyCallback} from "../types/types";

const PUB_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf8");

const jwtVerifyCallback: JwtVerifyCallback = (done, xRefreshToken, xToken) => {
	if (!xToken && !xRefreshToken) {
		done(
			new Error("No tokens included in request."),
			false,
			"You are unauthorized to access this resource."
		);
	}

	if (xToken && xRefreshToken) {
		jwt.verify(xToken, PUB_KEY, (err, decodedXToken) => {
			if (err) {
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
							"x-refresh-token is valid, refreshing your x-token!",
							true
						);
					}
				});
			} else {
				done(null, decodedXToken, "x-token is valid!");
			}
		});
	}

	if (xToken && !xRefreshToken) {
		jwt.verify(xToken, PUB_KEY, (err, decodedXToken) => {
			if (err) {
				done(err, false, "x-token has expired or is invalid. Log in to get a new one.");
			} else {
				done(null, decodedXToken, "x-token is valid!");
			}
		});
	}

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
					"x-refresh-token is valid, refreshing your x-token!",
					true
				);
			}
		});
	}
};

export default jwtVerifyCallback;

import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import {JwtVerifyCallback} from "../types/types";
import {issueAccessToken} from "../utils/utils";

const PUB_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf8");

const jwtVerifyCallback: JwtVerifyCallback = (done, xRefreshToken, xToken) => {
	//First, if both tokens are undefined, GTFOOOOO!

	console.log(xToken);
	console.log(xRefreshToken);

	if (!xToken && !xRefreshToken) {
		done(
			new Error("No tokens included in request."),
			false,
			"You are unauthorized to access this resource."
		);
	}

	//Second, if both the tokens exist, check if the x-token is valid and has not expires. If it has not expired, do the same as in Third. If it has expired, do the same as in Fourth.

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

	//Third, if there is no refresh-token and only a x-token, check if it is valid and then allow access for as long as it is valid, if it is not valid: GTFO!

	if (xToken && !xRefreshToken) {
		jwt.verify(xToken, PUB_KEY, (err, decodedXToken) => {
			if (err) {
				done(err, false, "x-token has expired or is invalid. Log in to get a new one.");
			} else {
				done(null, decodedXToken, "x-token is valid!");
			}
		});
	}

	//Fourth, if there is no x-token and only a refresh-token, check if the refresh-token is valid, and then issue a new x-token and send it back! If not valid tell them to GTFO.

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
};

export default jwtVerifyCallback;

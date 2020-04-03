import path from "path";
import fs from "fs";
import {Request, Response, NextFunction} from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {extractPayloadFromJWT, removeBearerFromTokenHeader, issueAccessToken} from "../utils/utils";
import {User} from "../types/types";

const PUB_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf8");

export const authenticateWithJwtStrategy = (req: Request, res: Response, next: NextFunction) => {
	const accessTokenFromHeader = req.get("authorization");
	const refreshTokenFromHeader = req.get("x-refresh-token");

	if (!accessTokenFromHeader || accessTokenFromHeader === "null") {
		res.status(401).json("Access-Token couldn't be found in headers.");
		return;
	}

	if (!refreshTokenFromHeader || refreshTokenFromHeader === "null") {
		res.status(401).json("Refresh-Token couldn't be found in headers.");
		return;
	}

	const xToken = removeBearerFromTokenHeader(accessTokenFromHeader);

	const xTokenPayload = extractPayloadFromJWT(xToken);

	jwt.verify(xToken, PUB_KEY, (err, _xToken: any) => {
		if (err) {
			const xRefreshToken = removeBearerFromTokenHeader(refreshTokenFromHeader);

			jwt.verify(xRefreshToken, PUB_KEY, (err, _xRefreshToken: any) => {
				if (err) {
					res.status(401).send("Unauthorized");
				} else {
					const user: User = {
						id: xTokenPayload.sub,
						username: xTokenPayload.username,
						email: xTokenPayload.email,
						admin: xTokenPayload.admin
					};

					const accessToken = issueAccessToken(user);

					req.user = {
						username: xTokenPayload.username,
						admin: xTokenPayload.admin
					};

					res.status(200).json({
						success: true,
						accessToken: accessToken,
						msg: "Your x-token was refreshed!"
					});

					next();
				}
			});
		} else {
			req.user = {
				username: xTokenPayload.username,
				admin: xTokenPayload.admin
			};
			res.status(200).json({
				success: true,
				msg: "Your x-token is valid!"
			});
			next();
		}
	});
};

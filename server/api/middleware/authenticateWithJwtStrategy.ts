import path from "path";
import fs from "fs";
import {Request, Response, NextFunction} from "express";
import {refreshXToken} from "../utils/utils";

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

	const customRefreshXToken = refreshXToken(req, res, next);

	customRefreshXToken(accessTokenFromHeader, refreshTokenFromHeader, PUB_KEY);
};

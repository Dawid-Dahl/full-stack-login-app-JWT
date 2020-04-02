import path from "path";
import fs from "fs";
import express from "express";
import {addRefreshTokenToDatabase} from "../utils/utils";
import jwt, {VerifyErrors} from "jsonwebtoken";
import {RefreshToken, User} from "../types/types";

const PUB_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf8");

const refreshRouter = express.Router();

refreshRouter.post("/", (req, res) => {
	console.log(req.headers);
	const authHeader = req.headers["refresh-token"];

	if (typeof authHeader !== "string") return;

	const refreshTokenFromAuthHeader = authHeader && authHeader.split(" ")[1];

	if (!refreshTokenFromAuthHeader) return res.status(401);

	jwt.verify(refreshTokenFromAuthHeader, PUB_KEY, (err, token: any) => {
		if (err) return res.status(403);

		const refreshToken: RefreshToken = {
			sub: token.sub,
			iat: token.iat,
			refreshToken: refreshTokenFromAuthHeader
		};
		addRefreshTokenToDatabase(refreshToken);
		res.status(200).json({
			success: true,
			msg: "Refresh-Token added!"
		});
	});
});

export default refreshRouter;

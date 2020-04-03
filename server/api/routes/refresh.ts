import path from "path";
import fs from "fs";
import express from "express";
import jwt from "jsonwebtoken";

const PUB_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf8");

const refreshRouter = express.Router();

refreshRouter.post("/", (req, res) => {
	const authHeader = req.headers["refresh-token"];

	if (typeof authHeader !== "string")
		return new Error("Refresh-Token couldn't be found in headers.");

	const refreshTokenFromAuthHeader = authHeader && authHeader.split(" ")[1];

	if (!refreshTokenFromAuthHeader) return res.status(401);

	jwt.verify(refreshTokenFromAuthHeader, PUB_KEY, (err, token: any) => {
		if (err) return res.status(403);

		res.status(200).json({
			success: true,
			msg: "Refresh-Token added!"
		});
	});
});

export default refreshRouter;

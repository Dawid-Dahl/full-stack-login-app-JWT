import path from "path";
import fs from "fs";
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {removeBearerFromTokenHeader} from "../utils/utils";

const PUB_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf8");

const verifyXToken = (req: Request, res: Response, next: NextFunction) => {
	const tokenWithoutBearer = removeBearerFromTokenHeader(req.get("x-token"));

	if (tokenWithoutBearer) {
		jwt.verify(tokenWithoutBearer, PUB_KEY, err => {
			if (err) {
				res.status(401).json({
					success: false,
					payload: {
						message:
							"You are not authorized to access this resource, log in and try again",
					},
				});
			} else {
				next();
			}
		});
	} else {
		res.status(401).json({
			success: false,
			payload: {
				message: "You are not authorized to access this resource, log in and try again",
			},
		});
	}
};

export default verifyXToken;

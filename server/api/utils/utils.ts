import path from "path";
import fs from "fs";
import {User, UserJwt} from "../types/types";
import jwt from "jsonwebtoken";

const PRIV_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf8");

export const issueJwt = (user: UserJwt, expiresIn = "1d") => {
	const payload = {
		sub: user.id,
		iat: Date.now()
	};

	const signedJwt = jwt.sign(payload, PRIV_KEY, {expiresIn, algorithm: "RS256"});

	return {
		token: `Bearer ${signedJwt}`,
		expiresIn
	};
};

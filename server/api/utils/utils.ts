import path from "path";
import fs from "fs";
import {UserJwt} from "../types/types";
import jwt from "jsonwebtoken";

const PRIV_KEY_PATH = path.join(__dirname, "..", "cryptography", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf8");

export const issueJwt = (user: UserJwt, expiresIn = "10m") => {
	const payload = {
		sub: user.id,
		username: user.username
	};

	const signedJwt = jwt.sign(payload, PRIV_KEY, {expiresIn: expiresIn, algorithm: "RS256"});

	return {
		token: `Bearer ${signedJwt}`,
		expires: expiresIn
	};
};

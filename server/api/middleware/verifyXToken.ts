import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {removeBearerFromTokenHeader, validateXToken} from "../utils/utils";

const verifyXToken = (req: Request, res: Response, next: NextFunction) => {
	let token = req.get("x-token");
	if (validateXToken(token)) {
		next();
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

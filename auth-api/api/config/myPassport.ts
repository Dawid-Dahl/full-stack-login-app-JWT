import {Request, Response, NextFunction} from "express";
import {removeBearerFromTokenHeader, attachUserToRequest, authJsonResponse} from "../utils/utils";
import {jwtVerifyCallback} from "./jwtVerifyCallback";
import {DoneCallback, MyPassport} from "../types/types";

const myPassport: MyPassport = (verify, options = {}) => (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const done: DoneCallback = (err, user, info) => {
		if (!err && !user) {
			res.status(401).json(authJsonResponse(false, info));
			return;
		}

		if (user) {
			attachUserToRequest(req, user);

			res.status(200).json({
				success: true,
				msg: "Your x-token is valid!",
			});

			next();
		}
	};

	const xToken = removeBearerFromTokenHeader(req.get("authorization"));
	const xRefreshToken = removeBearerFromTokenHeader(req.get("x-refresh-token"));

	if (!xToken) {
		res.status(401).json(authJsonResponse(false, "No x-token!"));
		next(new Error("No x-token!"));
	}
	if (!xRefreshToken) {
		res.status(401).json(authJsonResponse(false, "No x-refresh-token!"));
		next(new Error("No x-refresh-token!"));
	}

	if (xToken && xRefreshToken) {
		verify(done, xToken, xRefreshToken);
	}

	next(new Error("Something wen't horribly wrong!"));
};

const verifyWithJwtStrategy = myPassport(jwtVerifyCallback);

export default verifyWithJwtStrategy;

import {Request, Response, NextFunction} from "express";
import passport from "passport";

export const authenticateWithJwtStrategy = (req: Request, res: Response, next: NextFunction) => {
	const accessTokenFromHeader = req.get("authorization");
	const refreshTokenFromHeader = req.get("x-refresh-token");

	console.log(`Access-Token: ${accessTokenFromHeader}`);
	console.log(`Refresh-Token: ${refreshTokenFromHeader}`);

	if (accessTokenFromHeader === "null") {
		res.status(401).json("Access-Token couldn't be found in headers.");
		return;
	}

	if (refreshTokenFromHeader === "null") {
		res.status(401).json("Refresh-Token couldn't be found in headers.");
		return;
	}

	console.log("outside");

	/* const refreshTokenFromAuthHeader =
		refreshTokenFromHeader && refreshTokenFromHeader.split(" ")[1]; 

	if (!refreshTokenFromHeader) return res.status(401);*/

	passport.authenticate("jwt", {session: false})(req, res, next);
};

import express, {Request} from "express";
import verifyWithJwtStrategy from "../config/myPassport";
import {authJsonResponse} from "../utils/utils";

const verifyJwtRouter = express.Router();

interface RequestWithUser extends Request {
	user?: object;
}

verifyJwtRouter.post("/", verifyWithJwtStrategy, (req: RequestWithUser, res) => {
	res.status(200).json(authJsonResponse(true, JSON.stringify(req.user)));
});

export default verifyJwtRouter;

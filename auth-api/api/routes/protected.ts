import express from "express";
import verifyWithJwtStrategy from "../config/myPassport";
import {authJsonResponse} from "../utils/utils";

const protectedRouter = express.Router();

protectedRouter.get("/", verifyWithJwtStrategy, (req, res) => {
	res.json(authJsonResponse(true, {message: "This is the secret data! Scchhh....."}));
});

export default protectedRouter;

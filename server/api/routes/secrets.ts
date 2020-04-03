import express from "express";
import {authenticateWithJwtStrategy} from "../middleware/authenticateWithJwtStrategy";

const secretsRouter = express.Router();

const secrets = [{secret: "secret_1"}, {secret: "secret_2"}, {secret: "secret_3"}];

secretsRouter.get("/", authenticateWithJwtStrategy, (req, res) => {
	res.status(200).json({
		success: true,
		msg: "Here are your secrets!",
		payload: secrets,
		user: req.user
	});
});

export default secretsRouter;

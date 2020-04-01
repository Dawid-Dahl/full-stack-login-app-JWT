import express from "express";
import passport from "passport";

const secretsRouter = express.Router();

const secrets = [{secret: "secret_1"}, {secret: "secret_2"}, {secret: "secret_3"}];

secretsRouter.get("/", passport.authenticate("jwt", {session: false}), (req, res) => {
	res.status(200).json({
		success: true,
		msg: "Here are your secrets!",
		payload: secrets
	});
});

export default secretsRouter;

import express from "express";
import {loginController} from "../controllers/loginController";

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
	res.send("This is the login!");
});

loginRouter.post("/", loginController);

export default loginRouter;

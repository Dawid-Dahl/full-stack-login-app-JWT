import express from "express";

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
	res.send("This is the login!");
});

loginRouter.post("/", (req, res) => {
	console.log(req.body);
});

export default loginRouter;

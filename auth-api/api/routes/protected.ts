import express, {Request} from "express";
import verifyWithJwtStrategy from "../config/myPassport";

const protectedRouter = express.Router();

interface RequestWithUser extends Request {
	user?: object;
}

protectedRouter.post("/", verifyWithJwtStrategy, (req: RequestWithUser, res) => {
	console.log("Yo");
	console.log(req.user);
});

export default protectedRouter;

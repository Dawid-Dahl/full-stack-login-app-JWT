import express, {Request} from "express";
import verifyWithJwtStrategy from "../config/myPassport";

const verifyJwtRouter = express.Router();

interface RequestWithUser extends Request {
	user?: object;
}

verifyJwtRouter.post("/", verifyWithJwtStrategy, (req: RequestWithUser, res) => {
	console.log("Yo");
	console.log(req.user);
});

export default verifyJwtRouter;

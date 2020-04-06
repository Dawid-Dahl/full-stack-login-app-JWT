import express, {Request} from "express";
import verifyWithJwtStrategy from "../config/myPassport";

const protectedRouter = express.Router();

interface RequestWithUser extends Request {
	user?: object;
}

protectedRouter.post("/", verifyWithJwtStrategy, (req: RequestWithUser, res) => {
	res.send("Inside the protected GET route. Here is the user: " + req.user);
});

export default protectedRouter;

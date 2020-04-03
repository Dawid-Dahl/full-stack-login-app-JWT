import express from "express";
import {authenticateWithJwtStrategy} from "../middleware/authenticateWithJwtStrategy";

const protectedRouter = express.Router();

protectedRouter.post("/", authenticateWithJwtStrategy);

export default protectedRouter;

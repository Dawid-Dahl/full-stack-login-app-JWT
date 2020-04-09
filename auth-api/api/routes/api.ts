import express from "express";
import registerRouter from "./register";
import loginRouter from "./login";
import verifyJwtRouter from "./protected";

const apiRouter = express.Router();

apiRouter.use("/register", registerRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/verify-jwt", verifyJwtRouter);

export default apiRouter;

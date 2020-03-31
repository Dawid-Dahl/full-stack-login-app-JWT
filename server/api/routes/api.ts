import express from "express";
import registerRouter from "./register";
import loginRouter from "./login";

const apiRouter = express.Router();

apiRouter.use("/register", registerRouter);
apiRouter.use("/login", loginRouter);

export default apiRouter;

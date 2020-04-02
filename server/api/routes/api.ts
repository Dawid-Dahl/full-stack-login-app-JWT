import express from "express";
import registerRouter from "./register";
import loginRouter from "./login";
import secretsRouter from "./secrets";
import refreshRouter from "./refresh";

const apiRouter = express.Router();

apiRouter.use("/register", registerRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/refresh", refreshRouter);
apiRouter.use("/secrets", secretsRouter);

export default apiRouter;

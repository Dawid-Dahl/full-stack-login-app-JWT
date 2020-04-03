import express from "express";
import registerRouter from "./register";
import loginRouter from "./login";
import protectedRouter from "./protected";
import refreshRouter from "./refresh";

const apiRouter = express.Router();

apiRouter.use("/register", registerRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/refresh", refreshRouter);
apiRouter.use("/protected", protectedRouter);

export default apiRouter;

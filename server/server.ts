import express from "express";
import apiRouter from "./api/routes/api";
import "dotenv/config";
import passport from "passport";
import cors from "cors";
import errorhandler from "errorhandler";
import morgan from "morgan";
import passportConfig from "./api/config/passport";

const app = express();
const PORT = process.env.PORT || 5000;

passportConfig(passport);

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:1234"
	})
);
app.use(morgan("dev"));
app.use(passport.initialize());

app.use("/api", apiRouter);

app.use(errorhandler());

app.listen(PORT, () => console.log(`Server now listening at port: ${PORT}`));

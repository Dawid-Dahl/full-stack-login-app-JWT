import express from "express";
import {booksController} from "../controllers/booksController";

const booksRouter = express.Router();

booksRouter.get("/", booksController);

export default booksRouter;

import {Request, Response} from "express";

const fakeDB = [
	{id: 1, name: "book1"},
	{id: 2, name: "book2"},
	{id: 3, name: "THE BOOK OF BOOKS"},
	{id: 4, name: "book3"},
];

export const booksController = (req: Request, res: Response) => {
	res.json(fakeDB);
};

export type Book = {
	id: number;
	name: string;
};

export const addBooks = (books: Array<Book>) =>
	({
		type: "ADD_BOOKS",
		books,
	} as const);

export type BookActionTypes = ReturnType<typeof addBooks>;

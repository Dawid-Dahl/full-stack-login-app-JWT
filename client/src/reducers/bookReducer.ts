import {BookActionTypes} from "../actions/bookActions";
import {Book} from "../actions/bookActions";

export type BookReducerState = {
	books: Array<Book>;
};

const initialState: BookReducerState = {
	books: [],
};

export const bookReducer = (
	state: BookReducerState = initialState,
	payload: BookActionTypes
): BookReducerState => {
	switch (payload.type) {
		case "ADD_BOOKS":
			return {...state, books: [...payload.books]};
		default:
			return state;
	}
};

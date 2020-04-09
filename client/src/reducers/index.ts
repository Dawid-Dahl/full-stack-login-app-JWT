import {ActionTypes} from "../actions/actions";

enum ActionSuffix {
	fulfilled = "FULFILLED",
	pending = "PENDING",
	rejected = "REJECTED",
}

export type ReducerState = {
	isLoggedIn: boolean;
	isFetching: boolean;
	isShowingFlash: boolean;
	flashMessage: string;
	error: Error | null;
};

const initialState: ReducerState = {
	isLoggedIn: false,
	isFetching: false,
	isShowingFlash: false,
	flashMessage: "",
	error: null,
};

const reducer = (state: ReducerState = initialState, payload: ActionTypes): ReducerState => {
	switch (payload.type) {
		case "LOG_IN":
			return {...state, isLoggedIn: true};
		case "LOG_OUT":
			return {...state, isLoggedIn: false};
		case "SHOW_FLASH":
			return {...state, isShowingFlash: true};
		case "HIDE_FLASH":
			return {...state, isShowingFlash: false};
		case "SET_FLASH_MESSAGE":
			return {...state, flashMessage: payload.message};
		default:
			return state;
	}
};
export {reducer};

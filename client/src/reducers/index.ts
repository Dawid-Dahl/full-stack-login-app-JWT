import {ActionTypes} from "../actions/actions";

enum ActionSuffix {
	fulfilled = "FULFILLED",
	pending = "PENDING",
	rejected = "REJECTED"
}

export type ReducerState = {
	isLoggedIn: boolean;
	isFetching: boolean;
	error: Error | null;
};

const initialState: ReducerState = {
	isLoggedIn: false,
	isFetching: false,
	error: null
};

const reducer = (state: ReducerState = initialState, {type}: ActionTypes): ReducerState => {
	switch (type) {
		case "LOG_IN":
			return {...state, isLoggedIn: true};
		case "LOG_OUT":
			return {...state, isLoggedIn: false};
		default:
			return state;
	}
};
export {reducer};

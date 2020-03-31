import {ActionTypes} from "../actions/actions";

enum ActionSuffix {
	fulfilled = "FULFILLED",
	pending = "PENDING",
	rejected = "REJECTED"
}

export type ReducerState = {
	count: number;
	isFetching: boolean;
	error: Error | null;
};

const initialState: ReducerState = {
	count: 0,
	isFetching: false,
	error: null
};

const reducer = (state: ReducerState = initialState, {type}: ActionTypes): ReducerState => {
	switch (type) {
		case "INCREMENT_1":
			return {...state, count: state.count + 1};
		case "INCREMENT_5":
			return {...state, count: state.count + 5};
		case "DECREMENT_1":
			return {...state, count: state.count - 1};
		case "DECREMENT_5":
			return {...state, count: state.count - 5};
		default:
			return state;
	}
};
export {reducer};

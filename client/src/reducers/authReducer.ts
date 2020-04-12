import {AuthActionTypes} from "../actions/authActions";

export type AuthReducerState = {
	isLoggedIn: boolean;
};

const initialState: AuthReducerState = {
	isLoggedIn: false,
};

export const authReducer = (
	state: AuthReducerState = initialState,
	payload: AuthActionTypes
): AuthReducerState => {
	switch (payload.type) {
		case "LOG_IN":
			return {...state, isLoggedIn: true};
		case "LOG_OUT":
			return {...state, isLoggedIn: false};
		default:
			return state;
	}
};

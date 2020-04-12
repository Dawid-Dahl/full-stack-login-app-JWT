import {AuthActionTypes} from "../actions/authActions";

export type AuthReducerState = {
	isLoggedIn: boolean;
	isAdmin: boolean;
};

const initialState: AuthReducerState = {
	isLoggedIn: false,
	isAdmin: false,
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
		case "SET_ADMIN":
			return {...state, isAdmin: true};
		case "REMOVE_ADMIN":
			return {...state, isAdmin: false};
		default:
			return state;
	}
};

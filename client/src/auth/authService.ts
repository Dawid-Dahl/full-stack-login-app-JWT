import store from "../store";
import {logIn} from "../actions/actions";
import {logOut} from "../actions/actions";

export const authService = {
	setTokensInLocalStorage(data: any) {
		localStorage.setItem("x-token", data.accessToken);
		localStorage.setItem("x-refresh-token", data.refreshToken);
	},
	removeTokensFromLocalStorage() {
		localStorage.removeItem("x-token");
		localStorage.removeItem("x-refresh-token");
	},
	login() {
		store.dispatch(logIn());
	},
	logout() {
		store.dispatch(logOut());
	},
	isLoggedIn() {
		return;
	},
	getExpiration() {
		//TODO
		return;
	}
};

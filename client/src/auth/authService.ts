import store from "../store";
import {logIn} from "../actions/actions";
import {logOut} from "../actions/actions";
import {xTokenPayload} from "../types/types";
import {getPayloadFromJwt, flashMessage} from "../utils/utils";

export const authService = {
	setTokensInLocalStorage(data: any) {
		localStorage.setItem("x-token", `Bearer ${data.xToken}`);
		localStorage.setItem("x-refresh-token", `Bearer ${data.xRefreshToken}`);
	},
	refreshXToken(xToken: any) {
		localStorage.setItem("x-token", `Bearer ${xToken}`);
	},
	removeTokensFromLocalStorage() {
		localStorage.removeItem("x-token");
		localStorage.removeItem("x-refresh-token");
	},
	login() {
		if (store.getState().reducer.isLoggedIn) {
			return;
		}
		store.dispatch(logIn());
		flashMessage("You're now logged in!");
	},
	logout(customFlashMessage: string = "You're now logged out!") {
		if (!store.getState().reducer.isLoggedIn) {
			if (location.pathname === "/register" || location.pathname === "/login") {
				return;
			} else {
				flashMessage(customFlashMessage);
			}
		}
		store.dispatch(logOut());
		flashMessage(customFlashMessage);
	},
	isXTokenExpired(payload: xTokenPayload | undefined) {
		if (payload) {
			const {exp} = payload;
			return Date.now() >= exp * 1000 ? true : false;
		}
		return;
	},
	verifyXTokenClientSide(xToken: string | null) {
		if (xToken) {
			if (!this.isXTokenExpired(getPayloadFromJwt(xToken))) {
				this.login();
				console.log("x-token is valid, you remain logged in!");
				return;
			} else {
				if (localStorage.getItem("x-refresh-token")) {
					console.log("Verifying server side!");
					this.verifyXRefreshTokenServerSide(localStorage.getItem("x-refresh-token"));
					return;
				} else {
					this.logout("You're not allowed to access that page. Please log in!");
					return;
				}
			}
		} else {
			if (localStorage.getItem("x-refresh-token")) {
				this.verifyXRefreshTokenServerSide(localStorage.getItem("x-refresh-token"));
			} else {
				this.logout("You're not allowed to access that page. Please log in!");
				return;
			}
		}
	},
	verifyXRefreshTokenServerSide(xRefreshToken: string | null) {
		fetch(`${process.env.FETCH_URL}/api/verify-jwt`, {
			method: "POST",
			headers: {
				"x-refresh-token": xRefreshToken ?? "null",
				"Content-Type": "application/json",
			},
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					if (data.xToken) {
						this.refreshXToken(data.xToken);
					}
					this.login();
				} else {
					this.logout;
				}
			})
			.catch(err => console.error(err));
	},
	/* verifyTokensServerSide(xToken: string | null, xRefreshToken: string | null) {
		console.log("Inside verifyTokensServerSide!");

		fetch(`${process.env.FETCH_URL}/api/verify-jwt`, {
			method: "POST",
			headers: {
				"x-token": xToken ?? "null",
				"x-refresh-token": xRefreshToken ?? "null",
				"Content-Type": "application/json",
			},
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (data.success) {
					if (data.xToken) {
						this.refreshXToken(data.xToken);
					}
					this.login();
				} else {
					this.logout();
				}
			})
			.catch(err => console.error(err));
	}, */
};

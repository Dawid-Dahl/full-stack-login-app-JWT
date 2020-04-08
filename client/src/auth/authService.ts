import store from "../store";
import {logIn} from "../actions/actions";
import {logOut} from "../actions/actions";
import {useEffect} from "react";
import {xTokenPayload} from "../types/types";
import {getPayloadFromJwt} from "../utils/utils";

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
	},
	logout() {
		store.dispatch(logOut());
	},
	isXTokenExpired(payload: xTokenPayload | undefined) {
		if (payload) {
			const {exp} = payload;
			return Date.now() >= exp * 1000 ? true : false;
		}
		return;
	},
	verifyXTokenClientSide() {
		if (localStorage.getItem("x-token")) {
			if (!authService.isXTokenExpired(getPayloadFromJwt(localStorage.getItem("x-token")))) {
				authService.login();
				console.log(
					authService.isXTokenExpired(getPayloadFromJwt(localStorage.getItem("x-token")))
				);
				console.log("Loggin in because x-token is valid");
				return;
			} else {
				if (localStorage.getItem("x-refresh-token")) {
					console.log("Verifying server side!");
					authService.verifyTokensServerSide();
					return;
				} else {
					authService.logout();
					console.log("Logging out 1!");
					return;
				}
			}
		} else {
			authService.logout();
			console.log("Logging out 2!");
			return;
		}
	},
	verifyXRefreshTokenServerSide() {
		//TODO - Same as verifyTokensServerSide but only sending "x-refresh-token"
	},
	verifyTokensServerSide() {
		console.log("Inside verifyTokensServerSide!");

		fetch(`${process.env.FETCH_URL}/api/protected`, {
			method: "POST",
			headers: {
				"x-token": localStorage.getItem("x-token") ?? "null",
				"x-refresh-token": localStorage.getItem("x-refresh-token") ?? "null",
				"Content-Type": "application/json",
			},
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (data.success) {
					if (data.xToken) {
						authService.refreshXToken(data.xToken);
					}
					authService.login();
				} else {
					authService.logout;
				}
			})
			.catch(err => console.error(err));
	},
};

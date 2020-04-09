import {xTokenPayload} from "../types/types";
import store from "../store";
import {showFlash, hideFlash, setFlashMessage} from "../actions/actions";

export const getPayloadFromJwt = (jwt: string | null) =>
	jwt
		?.split(/\s|\./g)
		.filter(x => x !== "Bearer" && x !== "bearer")
		.reduce(
			(acc, cur, i) => (i === 1 ? [...acc, JSON.parse(atob(cur))] : [...acc]),
			[] as Array<xTokenPayload>
		)[0];

export const flashMessage = (message: string) => {
	store.dispatch(setFlashMessage(message));
	store.dispatch(showFlash());
	setTimeout(() => {
		store.dispatch(hideFlash());
	}, 3000);
};

import {xTokenPayload} from "../types/types";

export const getPayloadFromJwt = (jwt: string | null) =>
	jwt
		?.split(/\s|\./g)
		.filter(x => x !== "Bearer" && x !== "bearer")
		.reduce(
			(acc, cur, i) => (i === 1 ? [...acc, JSON.parse(atob(cur))] : [...acc]),
			[] as Array<xTokenPayload>
		)[0];

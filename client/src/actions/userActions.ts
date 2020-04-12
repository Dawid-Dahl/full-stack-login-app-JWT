import {User} from "../types/types";

export const setUser = (user: User) =>
	({
		type: "SET_USER",
		user,
	} as const);

export const removeUser = () =>
	({
		type: "REMOVE_USER",
	} as const);

export type UserActionTypes = ReturnType<typeof setUser> | ReturnType<typeof removeUser>;

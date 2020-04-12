export const logIn = () =>
	({
		type: "LOG_IN",
	} as const);

export const logOut = () =>
	({
		type: "LOG_OUT",
	} as const);

export const setAdmin = () =>
	({
		type: "SET_ADMIN",
	} as const);

export const removeAdmin = () =>
	({
		type: "REMOVE_ADMIN",
	} as const);

export type AuthActionTypes =
	| ReturnType<typeof logIn>
	| ReturnType<typeof logOut>
	| ReturnType<typeof setAdmin>
	| ReturnType<typeof removeAdmin>;

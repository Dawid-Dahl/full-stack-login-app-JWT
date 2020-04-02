export const logIn = () =>
	({
		type: "LOG_IN"
	} as const);
export const logOut = () =>
	({
		type: "LOG_OUT"
	} as const);

export type ActionTypes = ReturnType<typeof logIn> | ReturnType<typeof logOut>;

export const logIn = () =>
	({
		type: "LOG_IN",
	} as const);

export const logOut = () =>
	({
		type: "LOG_OUT",
	} as const);

export const showFlash = () =>
	({
		type: "SHOW_FLASH",
	} as const);

export const hideFlash = () =>
	({
		type: "HIDE_FLASH",
	} as const);

export const setFlashMessage = (message: string) =>
	({
		type: "SET_FLASH_MESSAGE",
		message,
	} as const);

export type ActionTypes =
	| ReturnType<typeof logIn>
	| ReturnType<typeof logOut>
	| ReturnType<typeof showFlash>
	| ReturnType<typeof hideFlash>
	| ReturnType<typeof setFlashMessage>;

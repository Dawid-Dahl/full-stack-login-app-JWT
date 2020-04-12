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

export type FlashActionTypes =
	| ReturnType<typeof showFlash>
	| ReturnType<typeof hideFlash>
	| ReturnType<typeof setFlashMessage>;

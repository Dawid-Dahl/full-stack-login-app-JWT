export const validateXToken = (token?: string) =>
	token ? /Bearer\s\w+\.\w+\.[\w-]+/i.test(token) : false;

export const removeBearerFromTokenHeader = (tokenHeader?: string) => tokenHeader?.split(" ")[1];

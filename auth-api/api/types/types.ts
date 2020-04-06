export type User = {
	id: number;
	username: string;
	email: string;
	password?: string;
	date_added?: string;
	admin: number;
};

export type TokenPayload = {
	sub: number;
	username: string;
	email: string;
	admin: number;
	iat: number;
	exp: number;
};

export type SQLRefreshToken = {
	sub: number;
	iat: number;
	refreshToken: string | undefined;
};

export type User = {
	id: number;
	username: string;
	email: string;
	password: string;
	date_added: string;
	admin: number;
};

export type UserJwt = {
	id: number;
	username: string;
	email: string;
	admin: number;
};

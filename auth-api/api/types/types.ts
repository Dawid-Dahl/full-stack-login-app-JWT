import {Request, Response, NextFunction} from "express";
import {ParamsDictionary} from "express-serve-static-core";

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

export type DoneCallback = (
	err: string | Error | null,
	user: TokenPayload | false,
	info?: string
) => void;

export type JwtVerifyCallback = {
	done: DoneCallback;
	xToken?: string;
	xRefreshToken?: string;
};

export type MyPassport = (
	verify: JwtVerifyCallback,
	options?: {}
) => (req: Request<ParamsDictionary>, res: Response<any>, next: NextFunction) => void;

export type AuthJsonResponse = {
	success: boolean;
	message?: string;
};

import {Request, Response, NextFunction} from "express";
import {ParamsDictionary} from "express-serve-static-core";
import {authJsonResponse} from "../utils/utils";

export type User = {
	id: number;
	username: string;
	email: string;
	password?: string;
	date_added?: string;
	admin: number;
};

export type xTokenPayload = {
	sub: number;
	username: string;
	email: string;
	admin: number;
	iat: number;
	exp: number;
};

export type xRefreshTokenPayload = {
	sub: number;
	iat: number;
	exp: number;
};

export type SQLRefreshToken = {
	sub: number;
	iat: number;
	xRefreshToken: string | undefined;
};

export type JwtDoneCallback = (
	req: Request<ParamsDictionary>,
	res: Response<any>,
	next: NextFunction
) => (
	err: string | Error | null,
	user: xTokenPayload | false,
	info?: string,
	refresh?: boolean
) => void;

export type PartiallyAppliedJwtDoneCallback = (
	err: string | Error | null,
	user: xTokenPayload | false,
	info?: string,
	refresh?: boolean
) => void;

export type JwtVerifyCallback = (
	done: PartiallyAppliedJwtDoneCallback,
	xRefreshToken?: string | false,
	xToken?: string
) => void;

export type MyPassport = (
	verify: JwtVerifyCallback,
	done: JwtDoneCallback,
	options?: {}
) => (req: Request<ParamsDictionary>, res: Response<any>, next: NextFunction) => void;

export type AuthJsonResponse = ReturnType<typeof authJsonResponse>;

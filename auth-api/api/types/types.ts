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

export type DoneCallback = (
	err: string | Error | null,
	user: xTokenPayload | false,
	info?: string,
	refresh?: boolean
) => void;

export type JwtVerifyCallback = (
	done: DoneCallback,
	xToken?: string,
	xRefreshToken?: string
) => void;

export type MyPassport = (
	verify: JwtVerifyCallback,
	options?: {}
) => (req: Request<ParamsDictionary>, res: Response<any>, next: NextFunction) => void;

/* export type AuthJsonResponse = {
	success: boolean;
	message?: string;
	xToken?: xTokenPayload;
	xRefreshToken?: xTokenPayload;
}; */

/* export type AuthJsonResponse = {success: boolean} | {success: boolean, message: string} | {success: boolean, message: string, xToken: xTokenPayload} | {success: boolean, message: string, xToken: xTokenPayload, xRefreshToken: xRefreshTokenPayload} */

export type AuthJsonResponse = ReturnType<typeof authJsonResponse>;

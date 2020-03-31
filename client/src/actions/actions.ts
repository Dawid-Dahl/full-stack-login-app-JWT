export const increment1 = (payload: any = null) => ({
	type: "INCREMENT_1",
	payload
});
export const increment5 = (payload: any = null) => ({
	type: "INCREMENT_5",
	payload
});
export const decrement1 = (payload: any = null) => ({
	type: "DECREMENT_1",
	payload
});
export const decrement5 = (payload: any = null) => ({
	type: "DECREMENT_5",
	payload
});
export type ActionTypes =
	| ReturnType<typeof increment1>
	| ReturnType<typeof increment5>
	| ReturnType<typeof decrement1>
	| ReturnType<typeof decrement5>;

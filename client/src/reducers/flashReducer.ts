import {FlashActionTypes} from "../actions/flashActions";

export type FlashReducerState = {
	isShowingFlash: boolean;
	flashMessage: string;
};

const initialState: FlashReducerState = {
	isShowingFlash: false,
	flashMessage: "",
};

export const flashReducer = (
	state: FlashReducerState = initialState,
	payload: FlashActionTypes
): FlashReducerState => {
	switch (payload.type) {
		case "SHOW_FLASH":
			return {...state, isShowingFlash: true};
		case "HIDE_FLASH":
			return {...state, isShowingFlash: false};
		case "SET_FLASH_MESSAGE":
			return {...state, flashMessage: payload.message};
		default:
			return state;
	}
};

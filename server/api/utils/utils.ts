export const removeBearerFromTokenHeader = (tokenHeader?: string) => tokenHeader?.split(" ")[1];

import React from "react";
import styled from "styled-components";
import {authService} from "../auth/authService";
import {getPayloadFromJwt} from "../utils/utils";

const Main = () => {
	return (
		<Wrapper>
			<h1>This is home.</h1>
		</Wrapper>
	);
};

export default Main;

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;

	h1 {
		padding: 5em;
	}
`;

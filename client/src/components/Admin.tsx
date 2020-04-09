import React from "react";
import styled from "styled-components";
import {Navbar} from "./Navbar";

const Admin = () => {
	return (
		<Wrapper>
			<Navbar />
			<h1>This is the secret Admin page!</h1>
		</Wrapper>
	);
};

export default Admin;

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

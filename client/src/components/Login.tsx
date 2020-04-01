import React from "react";
import LoginForm from "./LoginForm";
import {Link} from "react-router-dom";
import styled from "styled-components";

const Login = () => {
	return (
		<Wrapper>
			<h1 className="registration">LOGIN</h1>
			<LoginForm postUrl={`${process.env.FETCH_URL}/api/login`} redirectUrl="/main" />
			<Link to="/register" className="registrationLink">
				Go To Registration
			</Link>
		</Wrapper>
	);
};

export default Login;

export const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;

	.registrationLink {
		color: black;
		text-decoration: none;
	}

	h1 {
		letter-spacing: 1px;
	}
`;

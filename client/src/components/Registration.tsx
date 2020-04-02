import React from "react";
import RegistrationForm from "./RegistrationForm";
import {Link} from "react-router-dom";
import styled from "styled-components";

const Registration = () => {
	return (
		<Wrapper>
			<h1 className="registration">REGISTRATION</h1>
			<RegistrationForm
				postUrl={`${process.env.FETCH_URL}/api/register`}
				redirectUrl="/login"
			/>
			<Link to="/login" className="loginLink">
				Go To Login
			</Link>
		</Wrapper>
	);
};

export default Registration;

export const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;

	.loginLink {
		color: black;
		text-decoration: none;
	}

	h1 {
		letter-spacing: 1px;
	}
`;

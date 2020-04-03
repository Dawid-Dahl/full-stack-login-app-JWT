import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {authService} from "../auth/authService";

export const Navbar: React.FC = () => {
	return (
		<Wrapper>
			<img className="logo" src="https://jwt.io/img/pic_logo.svg"></img>
			<div>
				<Link to="/main">Home</Link>
				<Link to="/admin">Admin</Link>
				<Link
					to="/login"
					onClick={() => {
						authService.logout();
						authService.removeTokensFromLocalStorage();
					}}
				>
					Logout
				</Link>
			</div>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	width: 100%;
	background-color: black;
	height: 8em;
	display: flex;
	align-items: center;
	justify-content: space-around;

	a {
		padding: 20px 30px;
		color: grey;
		text-decoration: none;
		transition: all 0.2s;

		:hover {
			color: #b3b3b3;
		}
	}
`;

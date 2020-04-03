import styled from "styled-components";

const Button = styled.button`
	margin-top: 10px;
	background-color: var(--main-btn-color);
	padding: 15px;
	font-size: 1em;
	color: white;
	border: none;
	border-radius: var(--border-radius);
	transition: all 0.2s;
	cursor: pointer;

	:hover {
		background-color: var(--hover-btn-color);
	}
`;

export default Button;

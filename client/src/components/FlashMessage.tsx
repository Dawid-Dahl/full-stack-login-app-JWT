import React from "react";
import styled, {css} from "styled-components";
import {useSelector} from "react-redux";
import {RootState} from "../store";

const FlashMessage: React.FC = () => {
	const isShowingFlash = useSelector((state: RootState) => state.flashReducer.isShowingFlash);
	const flashMessage = useSelector((state: RootState) => state.flashReducer.flashMessage);

	return (
		<Wrapper>
			<StyledDiv active={isShowingFlash}>
				<Paragraph>{flashMessage}</Paragraph>
			</StyledDiv>
		</Wrapper>
	);
};

type WrapperProps = {
	active: boolean;
};

const Wrapper = styled.div`
	position: absolute;
	width: 100%;
	height: 0px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const StyledDiv = styled.div<WrapperProps>`
	position: relative;
	top: 150px;
	background-color: var(--main-btn-color);
	border-radius: 10px;
	border: 2px solid rgba(255, 255, 255, 0.327);
	transform: scale(1.3);
	opacity: 100%;
	transition: all 0.5s;
	${props =>
		props.active
			? css`
					transform: scale(1.3);
					opacity: 100%;
			  `
			: css`
					transform: scale(0);
					opacity: 0%;
			  `}
`;

const Paragraph = styled.p`
	color: white;
	padding: 0px 20px;
	font-size: 1em;
`;

export default FlashMessage;

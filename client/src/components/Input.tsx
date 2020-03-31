import React from "react";
import styled from "styled-components";

type Props = {
	name: string;
	type: string;
	onChangleHandle: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	minLength?: number;
	pattern?: string;
	title?: string;
};

const Input: React.FC<Props> = ({
	name,
	type,
	onChangleHandle,
	required,
	pattern,
	title,
	minLength
}) => (
	<StyledInput
		id={name}
		name={name}
		type={type}
		placeholder={[name[0].toUpperCase(), name.slice(1)].join("")}
		onChange={onChangleHandle}
		required={required}
		pattern={pattern}
		title={title}
		minLength={minLength}
	/>
);

export default Input;

const StyledInput = styled.input`
	padding: 15px 50px;
	margin-bottom: 10px;
	border: solid var(--main-grey-color) 1px;
`;

import React, {useState} from "react";
import Input from "./Input";
import {FormState, AuthJsonResponse} from "../types/types";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface Props extends RouteComponentProps {
	postUrl: string;
	redirectUrl: string;
}

const RegistrationForm: React.FC<Props> = ({postUrl, redirectUrl, history}) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setconfirmPassword] = useState("");

	const turnFormStateIntoObj = (): FormState => ({
		username,
		email,
		password,
		confirmPassword,
	});

	return (
		<div>
			<StyledForm
				action="POST"
				className="form"
				onSubmit={e => {
					e.preventDefault();
					fetch(postUrl, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(turnFormStateIntoObj()),
					})
						.then(res => res.json())
						.then((data: AuthJsonResponse) => {
							if (data.success) {
								flashMessage(data.payload?.message ?? "");
								history.push(redirectUrl);
							} else {
								flashMessage(data.payload?.message ?? "");
							}
						})
						.catch(err => console.error(err));
					e.currentTarget.reset();
				}}
			>
				<Input
					name="username"
					type="text"
					onChangleHandle={(e: React.ChangeEvent<HTMLInputElement>) =>
						setUsername(e.target.value)
					}
					required
					minLength={4}
				/>
				<Input
					name="email"
					type="email"
					onChangleHandle={(e: React.ChangeEvent<HTMLInputElement>) =>
						setEmail(e.target.value)
					}
					required
				/>
				<Input
					name="password"
					type="password"
					onChangleHandle={(e: React.ChangeEvent<HTMLInputElement>) =>
						setPassword(e.target.value)
					}
					required
					minLength={4}
				/>
				<Input
					name="confirm-password"
					type="password"
					onChangleHandle={(e: React.ChangeEvent<HTMLInputElement>) =>
						setconfirmPassword(e.target.value)
					}
					required
				/>
				<Button type="submit" id="login-button">
					Register
				</Button>
			</StyledForm>
		</div>
	);
};

export default withRouter(RegistrationForm);

import Button from "../styled-components/Button";
import StyledForm from "../styled-components/StyledForm";
import {flashMessage} from "../utils/utils";

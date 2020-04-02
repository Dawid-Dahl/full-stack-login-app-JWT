import React, {useState} from "react";
import {withRouter, RouteComponentProps} from "react-router-dom";
import Input from "./Input";
import {LoginInformation} from "../types/types";
import {useDispatch} from "react-redux";
import {logIn} from "../actions/actions";

interface Props extends RouteComponentProps {
	postUrl: string;
	redirectUrl: string;
}

const LoginForm: React.FC<Props> = ({postUrl, redirectUrl, history}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const dispatch = useDispatch();

	const turnFormStateIntoObj = (): LoginInformation => ({
		email,
		password
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
							"Content-Type": "application/json"
						},
						body: JSON.stringify(turnFormStateIntoObj())
					})
						.then(res => res.json())
						.then(data => {
							if (data.success) {
								localStorage.setItem("token", data.token);
								dispatch(logIn());
								history.push(redirectUrl);
							} else {
								console.log("FAILURE " + data.msg);
							}
						})
						.catch(err => console.error(err));
					e.currentTarget.reset();
				}}
			>
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
				/>
				<Button type="submit" id="login-button">
					Login
				</Button>
			</StyledForm>
		</div>
	);
};

export default withRouter(LoginForm);

// -------------- CSS -------------- //

import Button from "../styled-components/Button";
import StyledForm from "../styled-components/StyledForm";

import React, {useEffect} from "react";
import {Route, RouteProps, Redirect} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {authService} from "../auth/authService";

interface Props extends RouteProps {
	component: any;
}

export const PrivateRoute: React.FC<Props> = ({component: Component, ...rest}) => {
	const isLoggedIn = useSelector((state: RootState) => state.reducer.isLoggedIn);

	useEffect(() => {
		fetch(`${process.env.FETCH_URL}/api/protected`, {
			method: "POST",
			headers: {
				"x-token": localStorage.getItem("x-token") ?? "null",
				"x-refresh-token": localStorage.getItem("x-refresh-token") ?? "null",
				"Content-Type": "application/json",
			},
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (data.success) {
					if (data.xToken) authService.refreshXToken(data.xToken);
					authService.login();
				} else {
					console.error(data);
					authService.logout;
				}
			})
			.catch(err => console.error(err));
	}, [isLoggedIn]);

	return (
		<Route
			{...rest}
			render={props =>
				isLoggedIn ? <Component {...props} /> : <Redirect to={{pathname: "/login"}} />
			}
		/>
	);
};

import React, {useEffect} from "react";
import {Route, RouteProps, Redirect} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store";

interface Props extends RouteProps {
	component: any;
}

export const PrivateRoute: React.FC<Props> = ({component: Component, ...rest}) => {
	const isLoggedIn = useSelector((state: RootState) => state.reducer.isLoggedIn);

	useEffect(() => {
		fetch(`${process.env.FETCH_URL}/api/protected`, {
			method: "POST",
			headers: {
				Authorization: localStorage.getItem("x-token") ?? "null",
				"x-refresh-token": localStorage.getItem("x-refresh-token") ?? "null",
				"Content-Type": "application/json",
			},
		});
	}, [isLoggedIn]);

	return (
		<Route
			{...rest}
			render={(props) =>
				isLoggedIn ? <Component {...props} /> : <Redirect to={{pathname: "/login"}} />
			}
		/>
	);
};

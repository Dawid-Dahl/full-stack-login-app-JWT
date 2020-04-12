import React from "react";
import {Route, RouteProps, Redirect} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store";

interface Props extends RouteProps {
	component: any;
}

export const PrivateRoute: React.FC<Props> = ({component: Component, ...rest}) => {
	const isLoggedIn = useSelector((state: RootState) => state.authReducer.isLoggedIn);

	return (
		<Route
			{...rest}
			render={props =>
				isLoggedIn ? <Component {...props} /> : <Redirect to={{pathname: "/login"}} />
			}
		/>
	);
};

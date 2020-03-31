import React from "react";
import {Route, RouteProps, Redirect} from "react-router-dom";

interface Props extends RouteProps {
	component: any;
	isLoggedIn: boolean;
}

export const PrivateRoute: React.FC<Props> = ({component: Component, isLoggedIn, ...rest}) => (
	<Route
		{...rest}
		render={props =>
			isLoggedIn ? <Component {...props} /> : <Redirect to={{pathname: "/login"}} />
		}
	/>
);

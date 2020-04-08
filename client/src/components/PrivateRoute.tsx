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

	return (
		<Route
			{...rest}
			render={props =>
				isLoggedIn ? <Component {...props} /> : <Redirect to={{pathname: "/login"}} />
			}
		/>
	);
};

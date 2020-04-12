import React, {useEffect} from "react";
import {Route, RouteProps, Redirect} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {flashMessage} from "../utils/utils";

interface Props extends RouteProps {
	component: any;
}

export const AdminRoute: React.FC<Props> = ({component: Component, ...rest}) => {
	const isLoggedIn = useSelector((state: RootState) => state.authReducer.isLoggedIn);
	const isAdmin = useSelector((state: RootState) => state.authReducer.isAdmin);

	useEffect(() => {
		!isAdmin && flashMessage("You're not an admin!");
	}, [isAdmin]);

	return (
		<Route
			{...rest}
			render={props =>
				isLoggedIn && isAdmin ? (
					<Component {...props} />
				) : (
					<Redirect to={{pathname: "/main"}} />
				)
			}
		/>
	);
};

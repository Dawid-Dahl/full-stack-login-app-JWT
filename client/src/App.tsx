import React, {useEffect} from "react";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Main from "./components/Main";
import Admin from "./components/Admin";
import {Switch, Route} from "react-router-dom";
import {PrivateRoute} from "./components/PrivateRoute";
import {useSelector} from "react-redux";
import {RootState} from "./store";
import {Navbar} from "./components/Navbar";
import {authService} from "./auth/authService";

const App: React.FC = () => {
	const isLoggedIn = useSelector((state: RootState) => state.reducer.isLoggedIn);

	authService.verifyXTokenClientSide();

	return (
		<>
			{isLoggedIn && <Navbar />}
			{isLoggedIn ? (
				<Switch>
					<PrivateRoute path="/main" component={Main} />
					<PrivateRoute path="/admin" component={Admin} />
					<PrivateRoute path="/" component={Main} />
				</Switch>
			) : (
				<Switch>
					<Route path="/register" component={Registration} />
					<Route path="/login" component={Login} />
					<Route path="/" component={Login} />
				</Switch>
			)}
		</>
	);
};

export default App;

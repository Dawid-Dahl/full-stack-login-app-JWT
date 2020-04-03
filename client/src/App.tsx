import React from "react";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Main from "./components/Main";
import Admin from "./components/Admin";
import {Switch, Route} from "react-router-dom";
import {PrivateRoute} from "./components/PrivateRoute";
import {useSelector} from "react-redux";
import {RootState} from "./store";
import {Navbar} from "./components/Navbar";

const App: React.FC = () => {
	const isLoggedIn = useSelector((state: RootState) => state.reducer.isLoggedIn);
	return (
		<>
			{isLoggedIn && <Navbar />}
			<Switch>
				<Route path="/register" component={Registration} />
				<Route path="/login" component={Login} />
				<PrivateRoute path="/main" component={Main} isLoggedIn={isLoggedIn} />
				<PrivateRoute path="/admin" component={Admin} isLoggedIn={isLoggedIn} />
				<PrivateRoute exact path="/" component={Main} isLoggedIn={isLoggedIn} />
			</Switch>
		</>
	);
};
export default App;

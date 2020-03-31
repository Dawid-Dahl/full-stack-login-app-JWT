import React from "react";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Main from "./components/Main";
import Admin from "./components/Admin";
import {Switch, Route} from "react-router-dom";
import {PrivateRoute} from "./components/PrivateRoute";

const App: React.FC = () => {
	return (
		<>
			<Switch>
				<Route path="/register" component={Registration} />
				<Route path="/login" component={Login} />
				<PrivateRoute path="/main" component={Main} isLoggedIn={false} />
				<PrivateRoute path="/admin" component={Admin} isLoggedIn={false} />
				<PrivateRoute exact path="/" component={Main} isLoggedIn={false} />
			</Switch>
		</>
	);
};
export default App;

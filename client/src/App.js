import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import SignIn from './components/SignIn';
import { PrivateRoute } from './components/PrivateRoute';
import Dashboard from './components/Dashboard';

import { history } from './redux/store';

function App() {
	return (
		<div className='App'>
			<Router history={history}>
				<Switch>
					<Route path='/signin' component={SignIn} />
					<PrivateRoute path='/dashboard' component={Dashboard} />
					<Redirect from='*' to='/signin' />
				</Switch>
			</Router>
		</div>
	);
}

export default App;

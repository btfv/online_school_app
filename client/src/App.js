import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import { Auth } from './components/Auth';
import { PrivateRoute } from './components/PrivateRoute';
import Dashboard from './components/Dashboard';

import { history } from './store';

function App() {
	return (
		<div className='App'>
			<Router history={history}>
				<Switch>
					<Route path='/signin' component={Auth} />
					<PrivateRoute path='/dashboard' component={Dashboard} />
					<Redirect from='*' to='/' />
				</Switch>
			</Router>
		</div>
	);
}

export default App;

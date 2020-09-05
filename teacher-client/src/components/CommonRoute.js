import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const CommonRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render = {props =>
			!localStorage.getItem('user') ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{ pathname: '/dashboard', state: { from: props.location } }}
				/>
			)
		}
	/>
);
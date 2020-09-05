import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
	<Provider store={store}>
		<SnackbarProvider maxSnack={3}>
			<App />
		</SnackbarProvider>
	</Provider>,
	document.getElementById('root')
);

import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import SignIn from './components/SignIn';
import { PrivateRoute } from './components/PrivateRoute';
import { CommonRoute } from './components/CommonRoute';
import Dashboard from './components/Dashboard';
import { history } from './redux/store';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { userActions } from './redux/actions/userActions';
import { homeworkListActions } from './redux/actions/homeworkListActions';
import { solutionListActions } from './redux/actions/solutionListActions';
import { solutionActions } from './redux/actions/solutionActions';
import { homeworkActions } from './redux/actions/homeworkActions';
import { receivedStudentsActions } from './redux/actions/receivedStudentsActions';
import { addHomeworkActions } from './redux/actions/addHomeworkActions';
import { studentProfileActions } from './redux/actions/studentProfileActions';
import SignUp from './components/SignUp';
let App = (props) => {
	const {
		enqueueSnackbar,
		homeworkListError,
		clearHomeworkListError,
		clearAuthError,
		authError,
		solutionListError,
		clearSolutionListError,
		solutionError,
		clearSolutionError,
		clearHomeworkError,
		homeworkError,
		clearReceivedStudentsError,
		receivedStudentsError,
		addHomeworkError,
		clearAddHomeworkError,
		studentProfileError,
		clearStudentProfileError
	} = props;
	if (authError) {
		enqueueSnackbar(authError, {
			variant: 'error',
			autoHideDuration: 3000,
		});
		clearAuthError();
	}
	if (homeworkListError) {
		enqueueSnackbar(homeworkListError, {
			variant: 'error',
			autoHideDuration: 5000,
		});
		clearHomeworkListError();
	}
	if (solutionListError) {
		enqueueSnackbar(solutionListError, {
			variant: 'error',
			autoHideDuration: 3000,
		});
		clearSolutionListError();
	}
	if (solutionError) {
		enqueueSnackbar(solutionError, {
			variant: 'error',
			autoHideDuration: 3000,
		});
		clearSolutionError();
	}
	if (homeworkError) {
		enqueueSnackbar(homeworkError, {
			variant: 'error',
			autoHideDuration: 3000,
		});
		clearHomeworkError();
	}
	if (receivedStudentsError) {
		enqueueSnackbar(receivedStudentsError, {
			variant: 'error',
			autoHideDuration: 3000,
		});
		clearReceivedStudentsError();
	}
	if (addHomeworkError) {
		enqueueSnackbar(addHomeworkError, {
			variant: 'error',
			autoHideDuration: 3000,
		});
		clearAddHomeworkError();
	}
	if(studentProfileError){
		enqueueSnackbar(studentProfileError, {
			variant: 'error',
			autoHideDuration: 3000,
		});
		clearStudentProfileError();
	}
	return (
		<div className='App'>
			<Router history={history}>
				<Switch>
					<CommonRoute path='/signin' component={SignIn} />
					<CommonRoute path='/signup' component={SignUp} />
					<PrivateRoute path='/dashboard' component={Dashboard} />
					<Redirect from='*' to='/signin' />
				</Switch>
			</Router>
		</div>
	);
};
const mapStateToProps = (state) => {
	return {
		authError: state.authReducer.error,
		homeworkListError: state.homeworkListReducer.error,
		solutionListError: state.solutionListReducer.error,
		receivedStudentsError: state.receivedStudentsReducer.error,
		homeworkError: state.homeworkReducer.error,
		solutionError: state.solutionReducer.error,
		addHomeworkError: state.addHomeworkReducer.error,
		studentProfileError: state.studentProfileReducer.error,
	};
};
const actionCreators = {
	clearAuthError: userActions.clearError,
	clearHomeworkListError: homeworkListActions.clearError,
	clearSolutionListError: solutionListActions.clearError,
	clearSolutionError: solutionActions.clearError,
	clearHomeworkError: homeworkActions.clearError,
	clearReceivedStudentsError: receivedStudentsActions.clearError,
	clearAddHomeworkError: addHomeworkActions.clearError,
	clearStudentProfileError: studentProfileActions.clearError,
};
App = withSnackbar(App);
App = connect(mapStateToProps, actionCreators)(App);
export default App;

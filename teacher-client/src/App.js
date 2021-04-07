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
import { solutionActions } from './redux/actions/solutionActions';
import { homeworkActions } from './redux/actions/homeworkActions';
import { receivedStudentsActions } from './redux/actions/receivedStudentsActions';
import { addHomeworkActions } from './redux/actions/addHomeworkActions';
import { studentProfileActions } from './redux/actions/studentProfileActions';
import SignUp from './components/SignUp';
import { profileActions } from './redux/actions/profileActions';
import { receivedTeachersActions } from './redux/actions/receivedTeachersActions';
let App = (props) => {
	const {
		enqueueSnackbar,
		homeworkListError,
		clearHomeworkListError,
		clearAuthError,
		authError,
		solutionError,
		clearSolutionError,
		clearHomeworkError,
		homeworkError,
		clearReceivedStudentsError,
		receivedStudentsError,
		addHomeworkError,
		clearAddHomeworkError,
		studentProfileError,
		clearStudentProfileError,
		profileError,
		clearProfileError,
		receivedTeachersError,
		clearReceivedTeachersError,
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
	if (studentProfileError) {
		enqueueSnackbar(studentProfileError, {
			variant: 'error',
			autoHideDuration: 3000,
		});
		clearStudentProfileError();
	}
	if (profileError) {
		enqueueSnackbar(profileError, {
			variant: 'error',
			autoHideDuration: 3000,
		});
		clearProfileError();
	}
	if (receivedTeachersError) {
		enqueueSnackbar(receivedTeachersError, {
			variant: 'error',
			autoHideDuration: 3000,
		});
		clearReceivedTeachersError();
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
		receivedStudentsError: state.receivedStudentsReducer.error,
		homeworkError: state.homeworkReducer.error,
		solutionError: state.solutionReducer.error,
		addHomeworkError: state.addHomeworkReducer.error,
		studentProfileError: state.studentProfileReducer.error,
		profileError: state.profileReducer.error,
		receivedTeachersError: state.receivedTeachersReducer.error,
	};
};
const actionCreators = {
	clearAuthError: userActions.clearError,
	clearHomeworkListError: homeworkListActions.clearError,
	clearSolutionError: solutionActions.clearError,
	clearHomeworkError: homeworkActions.clearError,
	clearReceivedStudentsError: receivedStudentsActions.clearError,
	clearAddHomeworkError: addHomeworkActions.clearError,
	clearStudentProfileError: studentProfileActions.clearError,
	clearProfileError: profileActions.clearError,
	clearReceivedTeachersError: receivedTeachersActions.clearError,
};
App = withSnackbar(App);
App = connect(mapStateToProps, actionCreators)(App);
export default App;

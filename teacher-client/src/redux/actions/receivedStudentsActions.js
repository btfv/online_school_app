import { receivedStudentsConstants } from '../constants';
import { receivedStudentsService } from '../services/receivedStudentsService';
export const receivedStudentsActions = {
	clearError,
	getStudentsByName,
	addStudentToHomework,
	clearStudentList,
	getReceivedStudents,
};

function clearError() {
	return (dispatch) => {
		dispatch({ type: receivedStudentsConstants.CLEAR_ERROR });
	};
}

function getStudentsByName(name) {
	return (dispatch) => {
		dispatch(request());
		receivedStudentsService.getStudentsByName(name).then(
			(students) => {
				dispatch(success(students));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};
	function request() {
		return { type: receivedStudentsConstants.SEARCH_LIST_REQUEST };
	}
	function success(students) {
		return {
			type: receivedStudentsConstants.SEARCH_LIST_SUCCESS,
			students,
		};
	}
	function failure(error) {
		return { type: receivedStudentsConstants.SEARCH_LIST_FAILURE, error };
	}
}

function addStudentToHomework(homeworkPublicId, studentPublicId) {
	return (dispatch) => {
		receivedStudentsService
			.addStudentToHomework(homeworkPublicId, studentPublicId)
			.then(
				() => {
					dispatch(success());
				},
				(error) => {
					dispatch(failure(error.toString()));
				}
			);
	};
	function success() {
		return {
			type: receivedStudentsConstants.ADD_STUDENT_TO_HOMEWORK_SUCCESS,
		};
	}
	function failure(error) {
		return {
			type: receivedStudentsConstants.ADD_STUDENT_TO_HOMEWORK_FAILURE,
			error,
		};
	}
}

function clearStudentList() {
	return (dispatch) => {
		dispatch({ type: receivedStudentsConstants.CLEAR_STUDENT_LIST });
	};
}

function getReceivedStudents(homeworkPublicId, offset) {
	return (dispatch) => {
		dispatch(request());
		receivedStudentsService
			.getReceivedStudents(homeworkPublicId, offset)
			.then(
				(students) => {
					dispatch(success(students));
				},
				(error) => {
					dispatch(failure(error.toString()));
				}
			);
	};
	function request() {
		return {
			type: receivedStudentsConstants.STUDENT_LIST_REQUEST,
		};
	}
	function success(receivedStudents) {
		return {
			type: receivedStudentsConstants.STUDENT_LIST_SUCCESS,
			receivedStudents,
		};
	}
	function failure(error) {
		return {
			type: receivedStudentsConstants.STUDENT_LIST_FAILURE,
			error,
		};
	}
}

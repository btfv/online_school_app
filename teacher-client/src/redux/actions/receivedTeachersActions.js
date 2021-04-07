import { receivedTeachersConstants } from '../constants';
import { receivedTeachersService } from '../services/receivedTeachersService';
export const receivedTeachersActions = {
	clearError,
	getTeachersByName,
	addTeacherToHomework,
	clearTeacherList,
	getReceivedTeachers,
	clearTeacherSearch,
};

function clearError() {
	return (dispatch) => {
		dispatch({ type: receivedTeachersConstants.CLEAR_ERROR });
	};
}

function clearTeacherSearch() {
	return (dispatch) => {
		dispatch({ type: receivedTeachersConstants.CLEAR_TEACHER_SEARCH });
	};
}

function getTeachersByName(name) {
	return (dispatch) => {
		dispatch(request());
		receivedTeachersService.getTeachersByName(name).then(
			(teachers) => {
				dispatch(success(teachers));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};
	function request() {
		return { type: receivedTeachersConstants.SEARCH_TEACHER_LIST_REQUEST };
	}
	function success(teachers) {
		return {
			type: receivedTeachersConstants.SEARCH_TEACHER_LIST_SUCCESS,
			teachers,
		};
	}
	function failure(error) {
		return {
			type: receivedTeachersConstants.SEARCH_TEACHER_LIST_FAILURE,
			error,
		};
	}
}

function addTeacherToHomework(homeworkPublicId, teacherPublicId) {
	return (dispatch) => {
		receivedTeachersService
			.addTeacherToHomework(homeworkPublicId, teacherPublicId)
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
			type: receivedTeachersConstants.ADD_TEACHER_TO_HOMEWORK_SUCCESS,
		};
	}
	function failure(error) {
		return {
			type: receivedTeachersConstants.ADD_TEACHER_TO_HOMEWORK_FAILURE,
			error,
		};
	}
}

function clearTeacherList() {
	return (dispatch) => {
		dispatch({ type: receivedTeachersConstants.CLEAR_TEACHER_LIST });
	};
}

function getReceivedTeachers(homeworkPublicId, offset) {
	return (dispatch) => {
		dispatch(request());
		receivedTeachersService
			.getReceivedTeachers(homeworkPublicId, offset)
			.then(
				(teachers) => {
					dispatch(success(teachers));
				},
				(error) => {
					dispatch(failure(error.toString()));
				}
			);
	};
	function request() {
		return {
			type: receivedTeachersConstants.TEACHER_LIST_REQUEST,
		};
	}
	function success(receivedTeachers) {
		return {
			type: receivedTeachersConstants.TEACHER_LIST_SUCCESS,
			receivedTeachers,
		};
	}
	function failure(error) {
		return {
			type: receivedTeachersConstants.TEACHER_LIST_FAILURE,
			error,
		};
	}
}

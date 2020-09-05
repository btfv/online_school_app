import { studentListConstants } from '../constants';
import { studentListService } from '../services/studentListService';
export const studentListActions = {
	clearError,
	getStudentsByName,
	addStudentToHomework,
	clearStudentList,
};

function clearError() {
	return (dispatch) => {
		dispatch({ type: studentListConstants.CLEAR_ERROR });
	};
}

function getStudentsByName(name) {
	return (dispatch) => {
		dispatch(request());
		studentListService.getStudentsByName(name).then(
			(students) => {
				dispatch(success(students));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};
	function request() {
		return { type: studentListConstants.STUDENT_LIST_REQUEST };
	}
	function success(students) {
		return { type: studentListConstants.STUDENT_LIST_SUCCESS, students };
	}
	function failure(error) {
		return { type: studentListConstants.STUDENT_LIST_FAILURE, error };
	}
}

function addStudentToHomework(homeworkPublicId, studentPublicId, studentName) {
	return (dispatch) => {
		studentListService
			.addStudentToHomework(homeworkPublicId, studentPublicId)
			.then(
				() => {
					let student = {
						studentPublicId,
						studentName,
						hasSolution: false,
					};
					dispatch(success(student));
				},
				(error) => {
					dispatch(failure(error.toString()));
				}
			);
	};
	function success(receivedStudent) {
		return {
			type: studentListConstants.ADD_STUDENT_TO_HOMEWORK_SUCCESS,
			receivedStudent,
		};
	}
	function failure(error) {
		return {
			type: studentListConstants.ADD_STUDENT_TO_HOMEWORK_FAILURE,
			error,
		};
	}
}

function clearStudentList() {
	return (dispatch) => {
		dispatch({ type: studentListConstants.CLEAR_STUDENT_LIST });
	};
}

import { studentProfileConstants } from '../constants';
import { studentProfileService } from '../services/studentProfileService';

export const studentProfileActions = {
	clearError,
	getStudentProfile,
};

function clearError() {
	return (dispatch) => {
		dispatch({ type: studentProfileConstants.CLEAR_ERROR });
	};
}

function getStudentProfile(studentPublicId) {
	return (dispatch) => {
		dispatch(request());
		studentProfileService.getProfile(studentPublicId).then(
			(profile) => {
				dispatch(success(profile));
			},
			(error) => {
				dispatch(failure(error));
			}
		);
	};

	function request() {
		return { type: studentProfileConstants.STUDENT_PROFILE_REQUEST };
	}
	function success(profile) {
		return {
			type: studentProfileConstants.STUDENT_PROFILE_SUCCESS,
			profile,
		};
	}
	function failure(error) {
		return { type: studentProfileConstants.STUDENT_PROFILE_FAILURE, error };
	}
}

import { profileConstants } from '../constants';
import { profileService } from '../services/profileService';

export const profileActions = {
	uploadPicture,
	clearError,
	getProfile,
	clearProfile,
};

function clearProfile() {
	return (dispatch) => {
		dispatch({ type: profileConstants.CLEAR_PROFILE });
	};
}

function clearError() {
	return (dispatch) => {
		dispatch({ type: profileConstants.CLEAR_ERROR });
	};
}

function getProfile() {
	return (dispatch) => {
		dispatch(request());
		profileService.getProfile().then(
			(profile) => {
				dispatch(success(profile));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function request() {
		return { type: profileConstants.GET_PROFILE_REQUEST };
	}
	function success(profile) {
		return { type: profileConstants.GET_PROFILE_SUCCESS, profile };
	}
	function failure(error) {
		return { type: profileConstants.GET_PROFILE_FAILURE, error };
	}
}

function uploadPicture(value) {
	return (dispatch) => {
		dispatch(request());
		profileService.uploadProfilePicture(value).then(
			() => {
				dispatch(success());
				dispatch(profileActions.clearProfile());
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function request() {
		return { type: profileConstants.UPLOAD_PICTURE_REQUEST };
	}
	function success() {
		return { type: profileConstants.UPLOAD_PICTURE_SUCCESS };
	}
	function failure(error) {
		return { type: profileConstants.UPLOAD_PICTURE_FAILURE, error };
	}
}

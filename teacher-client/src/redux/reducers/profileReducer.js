import { profileConstants } from '../constants';
import { initialState } from '../store';

export default function profileReducer(state = initialState, action) {
	switch (action.type) {
		case profileConstants.CLEAR_PROFILE:
			return {
				...initialState,
			};
		case profileConstants.GET_PROFILE_REQUEST:
			return {
				...state,
				loadingProfile: true,
			};
		case profileConstants.GET_PROFILE_SUCCESS:
			return {
				...state,
				loadingProfile: false,
				loadedProfile: true,
				profile: action.profile,
			};
		case profileConstants.GET_PROFILE_FAILURE:
			return {
				...state,
				loadingProfile: false,
				loadedProfile: true,
				error: action.error,
			};
		case profileConstants.CLEAR_ERROR:
			return {
				...state,
				error: null,
			};
		case profileConstants.UPLOAD_PICTURE_REQUEST:
			return {
				...state,
				uploadingPicture: true,
			};
		case profileConstants.UPLOAD_PICTURE_SUCCESS:
			return {
				...state,
				uploadingPicture: false,
				uploadedPicture: true,
			};
		case profileConstants.UPLOAD_PICTURE_FAILURE:
			return {
				...state,
				uploadingPicture: false,
				uploadedPicture: true,
				error: action.error,
			};
		default:
			return state;
	}
}

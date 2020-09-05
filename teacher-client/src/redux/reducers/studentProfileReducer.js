import { studentProfileConstants } from '../constants';
import { initialState } from '../store';

export default function studentProfileReducer(state = initialState, action) {
	switch (action.type) {
		case studentProfileConstants.STUDENT_PROFILE_REQUEST:
			return {
				...state,
				loadingProfile: true,
			};
		case studentProfileConstants.STUDENT_PROFILE_SUCCESS:
			return {
				...state,
				loadingProfile: false,
				loadedProfile: true,
				profile: action.profile,
			};
		case studentProfileConstants.STUDENT_PROFILE_FAILURE:
			return {
				...state,
				loadingProfile: false,
				loadedProfile: true,
				error: action.error,
			};
		case studentProfileConstants.CLEAR_ERROR:
			return {
				...state,
				error: null,
			};
		default:
			return state;
	}
}

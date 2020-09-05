import { studentListConstants } from '../constants';
import { initialState } from '../store';

export default function studentListReducer(state = initialState, action) {
	switch (action.type) {
		case studentListConstants.STUDENT_LIST_REQUEST:
			return {
				...state,
				loadingStudents: true,
			};
		case studentListConstants.STUDENT_LIST_SUCCESS:
			return {
				...state,
				loadingStudents: false,
				loadedStudents: true,
				students: action.students,
			};
		case studentListConstants.STUDENT_LIST_FAILURE:
			return {
				...state,
				loadingStudents: false,
				loadedStudents: true,
				error: action.error,
			};
		case studentListConstants.CLEAR_STUDENT_LIST:
			return {
				...state,
				students: [],
			};
		case studentListConstants.ADD_STUDENT_TO_HOMEWORK_FAILURE:
			return {
				...state,
				error: action.error,
			};
		case studentListConstants.ADD_STUDENT_TO_HOMEWORK_SUCCESS:
			return {
				...state,
				receivedStudentsOnClient: state.receivedStudentsOnClient.concat([action.receivedStudent]),
			};
		case studentListConstants.CLEAR_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
}

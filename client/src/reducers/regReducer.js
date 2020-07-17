import initialState from '../initialState'

const regReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'REGISTER_REQUEST':
			return { registering: true };
		case 'REGISTER_SUCCESS':
			return {};
		case 'REGISTER_FAILURE':
			return {};
		default:
			return state;
	}
};
export default regReducer;

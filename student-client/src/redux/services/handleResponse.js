import { userService } from './userService';
import { userActions } from '../actions/userActions';
export default function handleResponse(response) {
	return response.text().then((text) => {
		const data = text && JSON.parse(text);
		if (!response.ok || data.error) {
			if (response.status === 401) {
				userService.logout();
			}
			const error = (data && data.error) || response.statusText;
			return Promise.reject(error);
		}
		return data;
	});
}
export function handleLoginResponse(response) {
	return response.text().then((text) => {
		const data = text && JSON.parse(text);
		if (!response.ok || data.error) {
			const error = (data && data.error) || response.statusText;
			return Promise.reject(error);
		}
		return data;
	});
}

const StudentService = require('../services/StudentService');
const TeacherService = require('../services/TeacherService');
const UserController = {};

UserController.changePassword = async function (req, res, next) {
	try {
		const userId = req.user._id;
		const oldPassword = req.body.oldPassword;
		const newPassword = req.body.newPassword;
		if (req.user.isTeacher) {
			await TeacherService.changePassword(
				userId,
				oldPassword,
				newPassword
			);
		} else {
			await StudentService.changePassword(
				userId,
				oldPassword,
				newPassword
			);
		}
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error });
	}
};

module.exports = UserController;

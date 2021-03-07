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

UserController.getInfo = async (req, res, next) => {
	try {
		const userPublicId = req.params.publicId;
		const isTeacher = (req.query.isTeacher === 'true');
		if (isTeacher) {
			var profile = await TeacherService.getTeacherInfo({
				teacherPublicId: userPublicId,
				includeId: false,
			});
		} else {
			var profile = await StudentService.getStudentInfo({
				studentPublicId: userPublicId,
				includeId: false,
			});
		}
		return res.status(200).json(profile);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = UserController;

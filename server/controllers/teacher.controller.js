const TeacherService = require('../services/teacher.service');
const teacherController = {};

teacherController.getProfile = async function (req, res, next) {
	try {
		const userId = req.user._id;
		var profile = await TeacherService.getProfile(userId);
		return res.status(200).json(profile).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

teacherController.changePassword = async function (req, res, next) {
	try {
		const teacherId = req.user._id;
		const oldPassword = req.body.oldPassword;
		const newPassword = req.body.newPassword;
		await TeacherService.changePassword(
			teacherId,
			oldPassword,
			newPassword
		);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.toString() });
	}
};

module.exports = teacherController;

const TeacherService = require('../services/teacher.service');
const TeacherController = {};

TeacherController.getProfile = async function (req, res, next) {
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

TeacherController.changePassword = async function (req, res, next) {
	try {
		const userId = req.user._id;
		const currentPassword = req.body.currentPassword;
		const newPassword = req.body.newPassword;	
		await TeacherService.changePassword(userId, currentPassword, newPassword);
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
	return res.status(200).send();
};

module.exports = TeacherController;

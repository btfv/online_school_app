const StudentService = require('../services/student.service');
const StudentController = {};

StudentController.getStudentProfileByTeacher = async function (req, res, next) {
	/**
	 * GET {studentPublicId}
	 */
	try {
		const studentPublicId = req.query.studentPublicId;
		let profile = await StudentService.getStudentProfileByTeacher(studentPublicId);
		return res.status(200).json(profile);
	} catch (error) {
		return res.status(400).json({ error: error.toString() });
	}
};

StudentController.changePassword = async function (req, res, next) {
	try {
		const userId = req.user._id;
		const oldPassword = req.body.oldPassword;
		const newPassword = req.body.newPassword;
		await StudentService.changePassword(
			userId,
			oldPassword,
			newPassword
		);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.toString() });
	}
};

StudentController.getListOfStudents = async function (req, res, next) {
	try {
		const sliceNumber = req.query.sliceNumber;
		const students = await StudentService.getListOfStudents(sliceNumber);
		return res.status(200).json(students);
	} catch (error) {
		return res.status(400).json({ error: error.toString() });
	}
};

StudentController.getStudentsByName = async function (req, res, next) {
	try {
		const name = req.query.name;
		const studentDocuments = await StudentService.getStudentsByName(name);
		return res.status(200).json(studentDocuments);
	} catch (error) {
		return res.status(400).json({ error: error.toString() });
	}
};

module.exports = StudentController;

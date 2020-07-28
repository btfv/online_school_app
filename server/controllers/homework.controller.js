const HomeworkService = require('../services/homework.service');
const HomeworkController = {};

HomeworkController.getByStudent = async function (req, res, next) {
	/**
	 * {studentPublicId, homeworkPublicId}
	 */
	try {
		const studentPublicId = req.user.publicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		const homeworkDocuments = await HomeworkService.getByStudent(
			homeworkPublicId
		);
		return req.status(200).json(homeworkDocuments).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

HomeworkController.getByTeacher = async function (req, res, next) {
	/**
	 * {teacherPublicId, homeworkPublicId}
	 */
	try {
		const teacherPublicId = req.user.publicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		const homeworkDocuments = await HomeworkService.getByTeacher(
			homeworkPublicId
		);
		return req.status(200).json(homeworkDocuments).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

HomeworkController.addTask = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkPublicId, type, text, options[], stringAnswer, detailedAnswer, taskAttachments[]}
		 */
		const homeworkPublicId = req.body.homeworkPublicId;
		const taskAttachments = req.files.taskAttachments;
		const taskType = req.body.taskType;
		const taskText = req.body.taskText;
		const taskOptions = JSON.parse(req.body.taskOptions);
		const taskStringAnswer = req.body.taskStringAnswer;
		const taskDetailedAnswer = req.body.taskDetailedAnswer;
		const taskDocument = {
			type: taskType,
			text: taskText,
			options: taskOptions,
			stringAnswer: taskStringAnswer,
			detailedAnswer: taskDetailedAnswer,
		};

		HomeworkService.addTask(
			homeworkPublicId,
			taskDocument,
			taskAttachments
		);

		return res
			.status(200)
			.json({ status: 200, message: 'Succesfully added' })
			.send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

HomeworkController.addHomework = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {title, description, subject, attachments[]}
		 */
		const creatorPublicId = req.user.publicId;
		const homeworkAttachments = req.files.homeworkAttachments;
		const homeworkTitle = req.body.homeworkTitle;
		const homeworkDescription = req.body.homeworkDescription;
		const homeworkSubject = req.body.homeworkSubject;

		const homeworkPublicId = HomeworkService.addHomework(
			homeworkTitle,
			homeworkDescription,
			homeworkSubject,
			creatorPublicId,
			homeworkAttachments
		);
		return res
			.status(200)
			.json({ homeworkPublicId: homeworkPublicId })
			.send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

HomeworkController.removeHomework = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkPublicId}
		 */
		const creatorPublicId = req.user.publicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		HomeworkService.removeHomework(homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

HomeworkController.removeTask = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkPublicId, taskPublicId}
		 */
		const creatorPublicId = req.user.publicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		const taskPublicId = req.body.taskPublicId;
		HomeworkService.removeTask(homeworkPublicId, taskPublicId);
		return res.status(200).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

HomeworkController.getPreviewsByStudent = async function (req, res, next) {
	try {
		/**
		 * {studentPublicId, startHomeworkNumber}
		 */
		const studentPublicId = req.user.publicId;
		const startHomeworkNumber = req.body.startHomeworkNumber;
		const homeworkPreviews = HomeworkService.getPreviewsByStudent(
			studentPublicId,
			startHomeworkNumber
		);
		return res.status(200).json(homeworkPreviews).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

HomeworkController.getPreviewsByTeacher = async function (req, res, next) {
	try {
		/**
		 * {teacherPublicId, startHomeworkNumber}
		 */
		const teacherPublicId = req.user.publicId;
		const startHomeworkNumber = req.body.startHomeworkNumber;
		const homeworkPreviews = HomeworkService.getPreviewsByTeacher(
			teacherPublicId,
			startHomeworkNumber
		);
		return res.status(200).json(homeworkPreviews).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

HomeworkController.addStudent = async function (req, res, next) {
	try {
		/**
		 * {teacherPublicId, homeworkPublicId, studentPublicId}
		 */
		const teacherPublicId = req.user.publicId;
		const studentPublicId = req.body.studentPublicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		HomeworkService.addStudent(studentPublicId, homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

HomeworkController.addGroup = async function (req, res, next) {
	try {
		/**
		 * {teacherPublicId, homeworkPublicId, groupPublicId}
		 */
		const teacherPublicId = req.user.publicId;
		const groupPublicId = req.body.groupPublicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		HomeworkService.addGroup(groupPublicId, homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

HomeworkController.removeGroup = async function (req, res, next) {
	try {
		/**
		 * {teacherPublicId, homeworkPublicId, groupPublicId}
		 */
		const teacherPublicId = req.user.publicId;
		const groupPublicId = req.body.groupPublicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		HomeworkService.removeGroup(groupPublicId, homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

HomeworkController.removeStudent = async function (req, res, next) {
	try {
		/**
		 * {teacherPublicId, homeworkPublicId, studentPublicId}
		 */
		const teacherPublicId = req.user.publicId;
		const studentPublicId = req.body.studentPublicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		HomeworkService.removeStudent(studentPublicId, homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};
module.exports = HomeworkController;

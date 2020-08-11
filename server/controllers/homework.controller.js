const HomeworkService = require('../services/homework.service');
const HomeworkController = {};

HomeworkController.getByStudent = async function (req, res, next) {
	/**
	 * {studentPublicId, query:homeworkPublicId}
	 */
	try {
		const studentPublicId = req.user.publicId;
		const homeworkPublicId = req.query.homeworkPublicId;
		const homeworkDocuments = await HomeworkService.getByStudent(
			homeworkPublicId
		);
		return res.status(200).json(homeworkDocuments);
	} catch (error) {
		return res.status(400).json({ status: 400, message: error.message });
	}
};

HomeworkController.getByTeacher = async function (req, res, next) {
	/**
	 * {teacherPublicId, query:homeworkPublicId}
	 */
	try {
		const teacherPublicId = req.user.publicId;
		const homeworkPublicId = req.query.homeworkPublicId;
		const homeworkDocuments = await HomeworkService.getByTeacher(
			homeworkPublicId
		);
		return res.status(200).json(homeworkDocuments);
	} catch (error) {
		return res.status(400).json({ status: 400, message: error.message });
	}
};

HomeworkController.addTask = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkPublicId, type, text, options[], stringAnswer, detailedAnswer, taskAttachments[]}
		 */
		const homeworkPublicId = req.body.homeworkPublicId;
		const taskType = req.body.taskType;
		const taskText = req.body.taskText;
		const taskOptions = req.body.taskOptions;
		const taskStringAnswer = req.body.taskStringAnswer;
		const taskDetailedAnswer = req.body.taskDetailedAnswer;
		const taskDocument = {
			type: taskType,
			text: taskText,
			options: taskOptions,
			stringAnswer: taskStringAnswer,
			detailedAnswer: taskDetailedAnswer,
		};
		var taskAttachments = null;
		if(req.files !== undefined){
			taskAttachments = req.files.taskAttachments;
		}
		HomeworkService.addTask(
			homeworkPublicId,
			taskDocument,
			taskAttachments
		);

		return res
			.status(200)
			.json({ status: 200, message: 'Succesfully added' });
	} catch (error) {
		return res.status(400).json({ status: 400, message: error.message });
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
		return res.status(400).json({ status: 400, message: error.message });
	}
};
HomeworkController.addHomework = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkTitle, homeworkDescription, homeworkSubject, homeworkAttachments[]}
		 */
		const creatorPublicId = req.user.publicId;
		const creatorId = req.user._id;
		const creatorName = req.user.name;
		const homeworkAttachments = req.files.homeworkAttachments;
		const homeworkTitle = req.body.homeworkTitle;
		const homeworkDescription = req.body.homeworkDescription;
		const homeworkSubject = req.body.homeworkSubject;

		const homeworkPublicId = HomeworkService.addHomework(
			homeworkTitle,
			homeworkDescription,
			homeworkSubject,
			creatorPublicId,
			creatorId,
			homeworkAttachments,
			creatorName
		);
		return res.status(200).json({ homeworkPublicId: homeworkPublicId });
	} catch (error) {
		return res.status(400).json({ status: 400, message: error.message });
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
		return res.status(200);
	} catch (error) {
		return res.status(400).json({ status: 400, message: error.message });
	}
};

HomeworkController.getPreviewsByStudent = async function (req, res, next) {
	try {
		/**
		 * {studentPublicId, startHomeworkId}
		 */
		const studentPublicId = req.user.publicId;
		const startHomeworkId = req.query.startHomeworkId;
		const homeworkPreviews = await HomeworkService.getPreviewsByStudent(
			studentPublicId,
			startHomeworkId
		);
		return res.status(200).json(homeworkPreviews);
	} catch (error) {
		return res.status(200).json({ message: error.message });
	}
};

HomeworkController.getPreviewsByTeacher = async function (req, res, next) {
	try {
		/**
		 * {teacherPublicId, startHomeworkId}
		 */
		const teacherPublicId = req.user.publicId;
		const startHomeworkId = req.query.startHomeworkId;
		const homeworkPreviews = HomeworkService.getPreviewsByTeacher(
			teacherPublicId,
			startHomeworkId
		);
		return res.status(200).json(homeworkPreviews);
	} catch (error) {
		return res.status(200).json({ message: error });
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
		return res.status(400).json({ status: 400, message: error.message });
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
		return res.status(400).json({ status: 400, message: error.message });
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
		return res.status(400).json({ status: 400, message: error.message });
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
		return res.status(400).json({ status: 400, message: error.message });
	}
};

module.exports = HomeworkController;

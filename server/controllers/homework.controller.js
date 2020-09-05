const HomeworkService = require('../services/homework.service');
const HomeworkController = {};

HomeworkController.getByStudent = async function (req, res, next) {
	/**f
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
		return res.status(400).json({ status: 400, error: error.toString() });
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
		return res.status(400).json({ status: 400, error: error.toString() });
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
		if (req.files !== undefined) {
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
		return res.status(400).json({ status: 400, error: error.toString() });
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
		await HomeworkService.removeTask(homeworkPublicId, taskPublicId);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.toString() });
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
		const homeworkAttachments = req.files ? Object.values(req.files) : [];
		const homeworkTitle = req.body.homeworkTitle;
		const homeworkDescription = req.body.homeworkDescription;
		const homeworkSubject = req.body.homeworkSubject;

		const homeworkPublicId = await HomeworkService.addHomework(
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
		return res.status(400).json({ status: 400, error: error.toString() });
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
		return res.status(400).json({ status: 400, error: error.toString() });
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
		return res.status(400).json({ error: error.toString() });
	}
};

HomeworkController.getPreviewsByTeacher = async function (req, res, next) {
	try {
		/**
		 * {teacherPublicId, startHomeworkId}
		 */
		const teacherPublicId = req.user.publicId;
		const startHomeworkId = req.query.startHomeworkId;
		const homeworkPreviews = await HomeworkService.getPreviewsByTeacher(
			teacherPublicId,
			startHomeworkId
		);
		return res.status(200).json(homeworkPreviews);
	} catch (error) {
		return res.status(400).json({ error: error.toString() });
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
		await HomeworkService.addStudent(studentPublicId, homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.toString() });
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
		await HomeworkService.removeStudent(studentPublicId, homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ status: 400, error: error.toString() });
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
		return res.status(400).json({ status: 400, error: error.toString() });
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
		return res.status(400).json({ status: 400, error: error.toString() });
	}
};

HomeworkController.addSolutionByStudent = async function (req, res, next) {
	try {
		/**
		 * {studentPublicId, studentId, studentName, homeworkPublicId, formValues}
		 */
		const studentPublicId = req.user.publicId;
		const studentId = req.user._id;
		const studentName = req.user.Name;
		const answers = req.body.formValues;
		const homeworkPublicId = req.body.homeworkPublicId;
		await HomeworkService.addSolutionByStudent(
			homeworkPublicId,
			answers,
			studentName,
			studentPublicId,
			studentId
		);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ status: 400, error: error.toString() });
	}
};

HomeworkController.getSolutionPreviewsByStudent = async function (
	req,
	res,
	next
) {
	try {
		/**
		 * {studentPublicId, startSolutionId}
		 */
		const studentPublicId = req.user.publicId;
		const startSolutionId = req.query.startSolutionId;

		const solutionPreviews = await HomeworkService.getSolutionPreviewsByStudent(
			studentPublicId,
			startSolutionId
		);
		return res.status(200).json(solutionPreviews);
	} catch (error) {
		return res.status(400).json({ status: 400, error: error.toString() });
	}
};

HomeworkController.getSolutionByStudent = async function (req, res, next) {
	try {
		/**
		 * {homeworkPublicId, solutionPublicId}
		 */
		const { homeworkPublicId, solutionPublicId } = req.query;
		const solutionDocument = await HomeworkService.getSolutionByStudent(
			homeworkPublicId,
			solutionPublicId
		);
		return res.status(200).json(solutionDocument);
	} catch (error) {
		return res.status(400).json({ status: 400, error: error.toString() });
	}
};

HomeworkController.getSolutionByTeacher = async function (req, res, next) {
	try {
		/**
		 * GET
		 * {homeworkPublicId, solutionPublicId}
		 */
		const { homeworkPublicId, solutionPublicId } = req.query;
		const solutionDocument = await HomeworkService.getSolutionByTeacher(
			homeworkPublicId,
			solutionPublicId
		);
		return res.status(200).json(solutionDocument);
	} catch (error) {
		return res.status(400).json({ status: 400, error: error.toString() });
	}
};

HomeworkController.reviewSolutionByTeacher = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkPublicId, solutionPublicId, comment, answers[{comment, grade}]}
		 */
		const {
			homeworkPublicId,
			solutionPublicId,
			comment,
			answers,
		} = req.body;

		await HomeworkService.reviewSolutionByTeacher(
			homeworkPublicId,
			solutionPublicId,
			comment,
			answers
		);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ status: 400, error: error.toString() });
	}
};

module.exports = HomeworkController;

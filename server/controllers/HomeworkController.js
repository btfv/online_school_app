const HomeworkService = require('../services/HomeworkService');
const HomeworkController = {};

HomeworkController.getListOfHomeworks = async (req, res, next) => {
	try {
		const userPublicId = req.user.publicId;
		const offset = req.query.offset;
		let previews;
		if (req.user.isTeacher) {
			previews = HomeworkService.getPreviewsByTeacher(
				userPublicId,
				offset
			);
		} else {
			previews = HomeworkService.getPreviewsByStudent(
				userPublicId,
				offset
			);
		}
		return res.status(200).json(previews);
	} catch (error) {
		return res.status(400).json({ error });
	}
};

HomeworkController.getHomework = async (req, res, next) => {
	try {
		const homeworkPublicId = req.params.homeworkPublicId;
		let homework;
		if (req.user.isTeacher) {
			homework = HomeworkService.getByTeacher(homeworkPublicId);
		} else {
			homework = HomeworkService.getByStudent(homeworkPublicId);
		}
		return res.status(200).json(homework);
	} catch (error) {
		return res.status(400).json({ error });
	}
};

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
		const {
			homeworkPublicId,
			taskType,
			taskText,
			taskOptions,
			taskStringAnswer,
			taskDetailedAnswer,
			taskPoints,
		} = req.body;
		const taskDocument = {
			type: taskType,
			text: taskText,
			options: taskOptions,
			stringAnswer: taskStringAnswer,
			detailedAnswer: taskDetailedAnswer,
			points: taskPoints,
		};
		var taskAttachments = [];
		if (req.files !== undefined) {
			taskAttachments = req.files.taskAttachments;
		}
		await HomeworkService.addTask(
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
HomeworkController.createHomework = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkTitle, homeworkDescription, homeworkSubject, homeworkAttachments[]}
		 */
		const creatorPublicId = req.user.publicId;
		const creatorId = req.user._id;
		const homeworkAttachments = req.files ? Object.values(req.files) : [];
		const homeworkTitle = req.body.title;
		const homeworkDescription = req.body.description;
		const homeworkSubject = req.body.subject;

		const homeworkPublicId = await HomeworkService.createHomework(
			homeworkTitle,
			homeworkDescription,
			homeworkSubject,
			creatorPublicId,
			creatorId,
			homeworkAttachments,
		);
		return res.status(200).json({ homeworkPublicId });
	} catch (error) {
		return res.status(400).json({ error });
	}
};

HomeworkController.removeHomework = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkPublicId}
		 */
		const homeworkPublicId = req.body.homeworkPublicId;
		await HomeworkService.removeHomework(homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error });
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
		const studentName = req.user.name;
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

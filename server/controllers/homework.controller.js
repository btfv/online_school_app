const HomeworkService = require('../services/homework.service');
const HomeworkController = {};

HomeworkController.getByStudent = async function (req, res, next) {
	try {
		const userId = req.user._id;
		const startHomeworkId = parseInt(req.body.startHomeworkId);
		if (startHomeworkId < 0) {
			return res
				.status(400)
				.json({
					status: 400,
					message: 'startHomeworkId should be > 0',
				})
				.send();
		}
		const homeworkDocuments = await HomeworkService.getByStudent(
			userId,
			startHomeworkId
		);
		return req.status(200).json(homeworkDocuments).send();
	} catch (error) {
		return res
			.status(400)
			.json({ status: 400, message: error.message })
			.send();
	}
};

module.exports = HomeworkController;

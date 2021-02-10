const { nanoid } = require('nanoid');
const HomeworkModel = require('../models/HomeworkModel');
const StudentModel = require('../models/StudentModel');
const TeacherModel = require('../models/TeacherModel');
const GroupModel = require('../models/GroupModel');
const FilesService = require('./FilesService');
const TeacherService = require('./TeacherService');
const HomeworkService = {};

const HOMEWORKS_PER_REQUEST = 6;
/* how much homeworks can server send per one request */
const SOLUTIONS_PER_REQUEST = 6;
/* how much solutions can server send per one request */

HomeworkService.checkTeacherPermission = async function (
	teacherPublicId,
	homeworkPublicId
) {
	const teacherDocument = await TeacherModel.findOne(
		{ publicId: teacherPublicId },
		{ homeworks: { $elemMatch: homeworkPublicId } }
	).select('_id');
	if (teacherDocument) {
		return true;
	} else {
		return false;
	}
};

HomeworkService.checkStudentPermission = async function (
	studentPublicId,
	homeworkPublicId
) {
	const studentDocument = await StudentModel.findOne(
		{ publicId: studentPublicId },
		{ homeworks: { $elemMatch: { homeworkPublicId } } }
	).select('_id');
	if (studentDocument) {
		return true;
	} else {
		return false;
	}
};

HomeworkService.getPreviewsByStudent = async function (
	studentPublicId,
	offset
) {
	const homeworkPreviews = await StudentModel.findOne(
		{ publicId: studentPublicId },
		{
			homeworks: {
				$slice: [offset, offset + HOMEWORKS_PER_REQUEST],
			},
		}
	)
		.select('-_id homeworks')
		.then(async (result) => {
			return Promise.all(
				result.homeworks.map(async (preview) => {
					const homeworkInfo = await HomeworkModel.findById(
						preview.homeworkId,
						'-_id title description creatorId subject publicId'
					);
					const creatorInfo = TeacherService.getTeacherInfo(
						creatorId
					);
					return {
						title: homeworkInfo.title,
						description: homeworkInfo.description,
						subject: homeworkInfo.subject,
						homeworkPublicId: homeworkInfo.publicId,
						solutionPublicId: preview.solutionPublicId,
						hasSolution: preview.hasSolution,
						creatorName:
							creatorInfo.firstname + creatorInfo.lastname,
						creatorPublicId: creatorInfo.publicId,
					};
				})
			);
		});
	return homeworkPreviews;
};

HomeworkService.getByStudent = async function (homeworkPublicId) {
	const homeworkDocument = await HomeworkModel.findOne({
		publicId: homeworkPublicId,
	})
		.select(
			'-_id title subject creatorPublicId creatorName publicId description attachments tasks'
		)
		.then(async (result) => {
			let attachments = await Promise.all(
				result.attachments.map(async (attachment) => {
					return await FilesService.getFileInfo(attachment);
				})
			);
			return {
				...result.toObject(),
				attachments,
			};
		});
	return homeworkDocument;
};

HomeworkService.getPreviewsByTeacher = async function (
	teacherPublicId,
	offset
) {
	const homeworkPreviews = await TeacherModel.findOne(
		{ publicId: teacherPublicId },
		{
			homeworks: {
				$slice: [offset, offset + HOMEWORKS_PER_REQUEST],
			},
		}
	)
		.select('-_id homeworks')
		.then(async (result) => {
			return Promise.all(
				result.homeworks.map(async (homeworkId) => {
					const homeworkInfo = await HomeworkModel.findById(
						homeworkId,
						'-_id title description creatorId subject publicId'
					);
					const creatorInfo = TeacherService.getTeacherInfo(
						creatorId
					);
					return {
						title: homeworkInfo.title,
						description: homeworkInfo.description,
						subject: homeworkInfo.subject,
						homeworkPublicId: homeworkInfo.publicId,
						creatorName:
							creatorInfo.firstname + creatorInfo.lastname,
						creatorPublicId: creatorInfo.publicId,
					};
				})
			);
		});
	return homeworkPreviews;
};

HomeworkService.getByTeacher = async function (homeworkPublicId) {
	const homeworkDocument = await HomeworkModel.findOne({
		publicId: homeworkPublicId,
	})
		.select('-_id')
		.then(async (result) => {
			if (!result) {
				throw Error("Homework doesn't exist");
			}
			const attachments = await Promise.all(
				result.attachments.map(async (attachment) => {
					return await FilesService.getFileInfo(attachment);
				})
			);
			const creatorInfo = TeacherService.getTeacherInfo(creatorId);
			return {
				title: result.title,
				subject: result.subject,
				creatorPublicId: creatorInfo.publicId,
				creatorName: creatorInfo.firstname + creatorInfo.lastname,
				description: result.description,
				attachments,
				tasks: result.tasks,
			};
		});
	return homeworkDocument;
};
HomeworkService.createHomework = async function (
	title,
	description,
	subject,
	creatorPublicId,
	creatorId,
	attachments
) {
	if (attachments && attachments.length > 0) {
		var attachmentIds = Promise.all(
			attachments.map(async (attachment) => {
				return await FilesService.uploadFile(attachment);
			})
		);
	}
	const publicId = nanoid();
	await HomeworkModel.create({
		title,
		subject,
		description,
		creatorPublicId,
		creatorId,
		publicId,
		attachments: attachmentIds,
	}).then(async (result) => {
		await TeacherModel.findByIdAndUpdate(creatorId, {
			$push: { homeworks: result._id },
		});
	});
	return publicId;
};

HomeworkService.sendHomework = async function (
	studentPublicId,
	homeworkPublicId
) {
	let homeworkDocument = await HomeworkModel.findOne(
		{
			publicId: homeworkPublicId,
		},
		{ 'receivedStudents.studentPublicId': studentPublicId }
	)
		.select('title')
		.exec();

	if (homeworkDocument.receivedStudents.length) {
		throw Error('This student already has this homework');
	}
	let studentName = await StudentModel.findOneAndUpdate(
		{ publicId: studentPublicId },
		{
			$push: {
				homeworks: {
					homeworkPublicId,
					homeworkTitle: homeworkDocument.title,
				},
			},
		}
	)
		.select('-_id name')
		.then((result) => {
			return result.firstname + ' ' + result.lastname;
		});
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			$push: { receivedStudents: { studentPublicId, studentName } },
		}
	);
	return true;
};

HomeworkService.addGroup = async function (groupPublicId, homeworkPublicId) {
	await GroupModel.findOneAndUpdate(
		{ publicId: groupPublicId },
		{
			$push: { homeworks: homeworkPublicId },
		}
	);
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			$push: { receivedGroups: groupPublicId },
		}
	);
};

HomeworkService.addTask = async function (homeworkPublicId, task, attachments) {
	/*
		task:{_id, type, text, attachments, options, stringAnswer, detailedAnswer, maxPoints}
	*/

	if (isNaN(task.points) || parseInt(task.points) < 0) {
		throw Error("Points for task can't be negative");
	}
	if (
		task.type === 2 &&
		(!task.stringAnswer || 0 === task.stringAnswer.length)
	) {
		throw Error("String answer can't be empty");
	}

	await HomeworkModel.findOne(
		{ publicId: homeworkPublicId },
		'solutions'
	).then((result) => {
		if (result.solutions.length) {
			throw Error(
				"You can't add task to the homework someone has received"
			);
		}
	});
	if (attachments !== 'undefined' && attachments) {
		var attachmentIds = attachments.map(async (attachment) => {
			return await FilesService.uploadFile(attachment);
		});
		attachmentIds = await Promise.all(attachmentIds);
	}
	const publicId = nanoid();
	let isTaskDetailed = task.type == 3 ? true : false;
	const setHasDetailedTasks = isTaskDetailed
		? { $set: { hasDetailedTasks: isTaskDetailed } }
		: {};
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			...setHasDetailedTasks,
			$push: {
				tasks: {
					publicId: publicId,
					taskType: task.type,
					text: task.text,
					attachments: attachmentIds,
					options: task.options,
					stringAnswer: task.stringAnswer,
					detailedAnswer: task.detailedAnswer,
					maxPoints: parseInt(task.points),
				},
			},
			$inc: {
				homeworkMaxPoints: parseInt(task.points),
			},
		}
	);
};

HomeworkService.removeTask = async function (homeworkPublicId, taskPublicId) {
	await HomeworkModel.findOne(
		{ publicId: homeworkPublicId },
		'solutions'
	).then((result) => {
		if (result.solutions.length) {
			throw Error(
				"You can't remove task from the homework someone has received"
			);
		}
	});

	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{ $pull: { tasks: { publicId: taskPublicId } } }
	).then((document) => {
		if (!document) throw Error('Task not found');
	});
};

HomeworkService.removeStudent = async function (
	studentPublicId,
	homeworkPublicId
) {
	await StudentModel.findOne({ publicId: studentPublicId }).then(
		(document) => {
			if (document.hasSolution) {
				throw Error('This user already has solution');
			}
		}
	);
	await StudentModel.findOneAndUpdate(
		{ publicId: studentPublicId },
		{ $pull: { homeworks: { homeworkPublicId } } }
	);
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{ $pull: { receivedStudents: { studentPublicId } } }
	);
};

HomeworkService.removeGroup = async function (groupPublicId, homeworkPublicId) {
	await GroupModel.findOneAndUpdate(
		{ publicId: groupPublicId },
		{ $pull: { homeworks: homeworkPublicId } }
	);
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{ $pull: { receivedGroups: { groupPublicId } } }
	);
};

HomeworkService.removeHomework = async function (homeworkPublicId) {
	const homeworkDocument = await HomeworkModel.findOne({
		publicId: homeworkPublicId,
	}).select('receivedStudents receivedGroups creatorPublicId attachments');
	const attachments = homeworkDocument.attachments;
	attachments.map(async (attachmentId) => {
		await FilesService.removeFile(attachmentId);
	});
	const students = homeworkDocument.receivedStudents;
	students.map(async (student) => {
		await HomeworkService.removeStudent(
			student.studentPublicId,
			homeworkPublicId
		);
	});
	const groups = homeworkDocument.receivedGroups;
	groups.map(async (group) => {
		await HomeworkService.removeGroup(
			group.groupPublicId,
			homeworkPublicId
		);
	});
	const creatorPublicId = homeworkDocument.creatorPublicId;
	const homeworkId = homeworkDocument._id;
	await TeacherModel.findOneAndUpdate(
		{ publicId: creatorPublicId },
		{
			$pull: { homeworks: homeworkId },
		}
	);
	await HomeworkModel.findByIdAndRemove(homeworkId);
	return true;
};

HomeworkService.checkSolution = async function (
	solutionPublicId,
	homeworkPublicId,
	comments
) {
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId, 'solutions.publicId': solutionPublicId },
		{
			$set: {
				'solutions.$.isChecked': true,
			},
		}
	)
		.select({ solutions: { $elemMatch: { publicId: solutionPublicId } } })
		.then(async (result) => {
			const studentId = result.solutions[0].studentId;
			await StudentModel.findOneAndUpdate(
				{
					_id: studentId,
					'homeworks.homeworkPublicId': homeworkPublicId,
				},
				{
					$set: {
						'homeworks.$.isChecked': true,
						'homeworks.$.solutionPublicId': solutionPublicId,
					},
				}
			);
			comments.map(async (comment) => {
				await HomeworkModel.findOneAndUpdate(
					{
						publicId: homeworkPublicId,
						'solutions.publicId': solutionPublicId,
						'solutions.answers.publicId': comment.answerPublicId,
					},
					{
						$set: {
							'solutions.$.$.comment': comment.comment,
							'solutions.$.$.points': comment.points,
						},
					}
				);
			});
		});

	return true;
};

HomeworkService.addSolutionByStudent = async function (
	homeworkPublicId,
	studentAnswers,
	studentId
) {
	const checkStringAnswer = (answer, rightAnswer, points) => {
		if (
			answer.toLowerCase().replace(/ /g, '') ===
			rightAnswer.toLowerCase().replace(/ /g, '')
		) {
			return points;
		}
		return 0;
	};
	const checkOptionsAnswer = (answers, rightAnswers, points) => {
		let mistakes = 0;
		answers.map((option, index) => {
			option = option || false;
			if (option !== rightAnswers[index].isCorrect) {
				mistakes++;
			}
		});
		if (mistakes) {
			return 0;
		}
		return points;
	};
	/**
	 * answers: {publicId, studentId, studentPublicId, answers: [{detailedAnswer, optionAnswer, stringAnswer, attachments}]}
	 */
	const solutionPublicId = nanoid();
	var solutionDocument = {
		publicId: solutionPublicId,
		studentId,
	};

	await HomeworkModel.findOne({ publicId: homeworkPublicId })
		.select('-_id tasks')
		.then(async (result) => {
			const { tasks } = result;

			if (!tasks.length) {
				throw Error(
					'You cant add solution to the homework without tasks'
				);
			}
			if (tasks.length != studentAnswers.length) {
				throw Error('Count of answers does not match count of tasks');
			}
			var totalPoints = 0;

			solutionDocument.answers = [];
			tasks.map((task, index) => {
				let pointsForAnswer = 0;
				switch (task.taskType) {
					case 1:
						pointsForAnswer = checkOptionsAnswer(
							studentAnswers[index],
							task.options,
							task.maxPoints
						);
						break;
					case 2:
						pointsForAnswer = checkStringAnswer(
							studentAnswers[index],
							task.stringAnswer,
							task.maxPoints
						);
						break;
				}
				totalPoints += pointsForAnswer;
				solutionDocument.answers.push({
					detailedAnswer:
						task.taskType == 3 ? studentAnswers[index] : null,
					stringAnswer:
						task.taskType == 2 ? studentAnswers[index] : null,
					optionAnswers:
						task.taskType == 1 ? studentAnswers[index] : null,
					points: pointsForTask,
				});
			});
			solutionDocument.totalPoints = totalPoints;
			await HomeworkModel.findOneAndUpdate(
				{
					_id: result._id,
					receivedStudents: {
						$elemMatch: {
							studentId,
						},
					},
				},
				{
					$push: { solutions: solutionDocument },
					$set: {
						'receivedStudents.$.hasSolution': true,
						'receivedStudents.$.solutionPublicId': solutionPublicId,
					},
				}
			);
		});
	return true;
};

HomeworkService.getSolutionByStudent = async function (
	homeworkPublicId,
	solutionPublicId
) {
	const solutionDocument = await HomeworkModel.findOne(
		{
			publicId: homeworkPublicId,
		},
		{ solutions: { $elemMatch: { publicId: solutionPublicId } } }
	)
		.select(
			'-_id tasks homeworkmaxPoints attachments creatorId subject description title attachments'
		)
		.exec()
		.then(async (result) => {
			result = result.toObject();
			var solution = result.soltuions[0];
			const teacherInfo = await TeacherService.getTeacherInfo(
				result.creatorId
			);
			if (!result || !solution) {
				throw Error("Can't find homework / solution");
			}
			delete solution._id;
			delete result.solutions;
			solution.answers = solution.answers.map((answer) => {
				delete answer._id;
				return answer;
			});
			result.tasks = result.tasks.map((task) => {
				if (task.options) {
					task.options = task.options.map((option) => {
						delete option._id;
						return option;
					});
				}
				delete task._id;
				return task;
			});
			let attachments = await Promise.all(
				result.attachments.map(async (attachment) => {
					return await FilesService.getFileInfo(attachment);
				})
			);
			result = { ...result, ...solution };
			return {
				homework: {
					title: result.title,
					subject: result.subject,
					creatorName: teacherInfo.name,
					creatorPublicId: teacherInfo.publicId,
					description: result.description,
					attachments,
				},
			};
		});
	if (!solutionDocument) {
		throw Error("Can't find solution");
	}
	return solutionDocument;
};

HomeworkService.getSolutionByTeacher = async function (
	homeworkPublicId,
	solutionPublicId
) {
	const solutionDocument = await HomeworkModel.findOne(
		{
			publicId: homeworkPublicId,
		},
		{ solutions: { $elemMatch: { publicId: solutionPublicId } } }
	)
		.select(
			'-_id tasks homeworkmaxPoints attachments creatorName creatorPublicId subject description title'
		)
		.exec()
		.then(async (result) => {
			result = result.toObject();
			let solution = result.solutions[0];
			delete solution._id;
			delete result.solutions;
			solution.answers = solution.answers.map((answer) => {
				delete answer._id;
				return answer;
			});
			result.tasks = result.tasks.map((task) => {
				if (task.options) {
					task.options = task.options.map((option) => {
						delete option._id;
						return option;
					});
				}
				delete task._id;
				return task;
			});
			let attachments = await Promise.all(
				result.attachments.map(async (attachment) => {
					return await FilesService.getFileInfo(attachment);
				})
			);
			result = { ...result, ...solution };
			return { ...result, attachments };
		});
	if (!solutionDocument) {
		throw Error("Can't find solution");
	}
	return solutionDocument;
};

module.exports = HomeworkService;

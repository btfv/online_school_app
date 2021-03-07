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

HomeworkService.typesOfAnswers = {
	OPTIONS_ANSWER: 1,
	STRING_ANSWER: 2,
	DETAILED_ANSWER: 3,
};

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

HomeworkService.getHomeworkInfo = async (homeworkId) => {
	const homeworkInfo = await HomeworkModel.findById(
		homeworkId,
		'-_id title description creatorId subject publicId'
	).then((result) => {
		if (!result) {
			throw Error("Can't find homework with this homeworkId");
		}
		return result;
	});
	return homeworkInfo;
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
		.exec()
		.then(async (studentDocument) => {
			return await Promise.all(
				studentDocument.homeworks.map(async (homeworkDocument) => {
					const homeworkId = homeworkDocument.homeworkId;
					const homeworkInfo = await HomeworkService.getHomeworkInfo(
						homeworkId
					);
					const creatorId = homeworkInfo.creatorId;
					const creatorInfo = await TeacherService.getTeacherInfo({
						teacherId: creatorId,
					});
					return {
						title: homeworkInfo.title,
						description: homeworkInfo.description,
						subject: homeworkInfo.subject,
						homeworkPublicId: homeworkInfo.publicId,
						solutionPublicId: homeworkDocument.solutionPublicId,
						hasSolution: homeworkDocument.hasSolution,
						isChecked: homeworkDocument.isChecked,
						creatorName: creatorInfo.name,
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
			'-_id title subject creatorPublicId creatorName publicId description attachments tasks deadline'
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
		.select('_id homeworks')
		.exec()
		.then(async (teacherDocument) => {
			if (teacherDocument.homeworks.length == 0) {
				throw Error("You don't have any homeworks");
			}
			const creatorId = teacherDocument._id;
			return await Promise.all(
				teacherDocument.homeworks.map(async (homeworkId) => {
					const homeworkInfo = await HomeworkService.getHomeworkInfo(
						homeworkId
					);
					const creatorInfo = await TeacherService.getTeacherInfo({
						teacherId: creatorId,
					});
					return {
						title: homeworkInfo.title,
						description: homeworkInfo.description,
						subject: homeworkInfo.subject,
						homeworkPublicId: homeworkInfo.publicId,
						creatorName: creatorInfo.name,
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
		.select('-_id -tasks._id')
		.then(async (result) => {
			if (!result) {
				throw Error("Homework doesn't exist");
			}
			result = result.toObject();
			const creatorId = result.creatorId;
			const attachments = await Promise.all(
				result.attachments.map(async (attachment) => {
					return await FilesService.getFileInfo(attachment);
				})
			);
			const creatorInfo = await TeacherService.getTeacherInfo({
				teacherId: creatorId,
			});
			const tasks = result.tasks.map((task) => {
				let answer;
				switch (task.taskType) {
					case 1:
						answer = task.optionAnswers;
						break;
					case 2:
						answer = task.stringAnswer;
						break;
					case 3:
						answer = task.detailedAnswer;
						break;
				}
				return {
					taskType: task.taskType,
					publicId: task.publicId,
					answer,
					condition: task.condition,
					maxPoints: task.maxPoints,
					options:
						task.taskType === 1 ? task.optionLabels : undefined,
				};
			});
			return {
				title: result.title,
				subject: result.subject,
				creatorPublicId: creatorInfo.publicId,
				creatorName: creatorInfo.name,
				description: result.description,
				attachments,
				tasks,
			};
		});
	return homeworkDocument;
};
HomeworkService.createHomework = async function (
	title,
	description,
	subject,
	creatorPublicId,
	attachments
) {
	const creatorInfo = await TeacherService.getTeacherInfo({
		teacherPublicId: creatorPublicId,
	});
	const creatorId = creatorInfo._id;
	if (attachments && attachments.length > 0) {
		var attachmentIds = await Promise.all(
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
	homeworkPublicId,
	deadline
) {
	const homeworkId = await HomeworkModel.findOne(
		{
			publicId: homeworkPublicId,
		},
		{
			receivedStudents: {
				$elemMatch: {
					studentPublicId,
				},
			},
		}
	)
		.exec()
		.then((result) => {
			if (result.receivedStudents.length) {
				throw Error('This student already has this homework');
			}
			return result._id;
		});
	const studentId = await StudentModel.findOne(
		{ publicId: studentPublicId },
		'_id'
	).then((result) => {
		return result._id;
	});
	await StudentModel.findOneAndUpdate(
		{ publicId: studentPublicId },
		{
			$push: {
				homeworks: { homeworkId, deadline },
			},
		}
	);
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			$push: {
				receivedStudents: { studentId, studentPublicId, deadline },
			},
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
	if (task.taskType === 2 && (!task.answer || 0 === task.answer.length)) {
		throw Error("String answer can't be empty");
	}
	await HomeworkModel.findOne(
		{ publicId: homeworkPublicId },
		'receivedStudents'
	).then((result) => {
		if (result.receivedStudents.length) {
			throw Error(
				"You can't add task to the homework someone has received"
			);
		}
	});
	if (attachments !== 'undefined' && attachments) {
		var attachmentIds = await Promise.all(
			attachments.map(async (attachment) => {
				return await FilesService.uploadFile(attachment);
			})
		);
	}
	const publicId = nanoid();
	const taskDocument = {
		publicId,
		taskType: task.taskType,
		condition: task.text,
		attachments: attachmentIds,
		optionLabels:
			task.taskType == this.typesOfAnswers.OPTIONS_ANSWER
				? task.options
				: [],
		optionAnswers:
			task.taskType == this.typesOfAnswers.OPTIONS_ANSWER
				? task.answer
				: [],
		stringAnswer:
			task.taskType == this.typesOfAnswers.STRING_ANSWER
				? task.answer
				: '',
		detailedAnswer:
			task.taskType == this.typesOfAnswers.DETAILED_ANSWER
				? task.answer
				: '',
		maxPoints: parseInt(task.points),
	};
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			$push: {
				tasks: taskDocument,
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
		'receivedStudents'
	).then((result) => {
		if (result.receivedStudents.length) {
			throw Error(
				"You can't remove task from the homework someone has received"
			);
		}
	});

	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{ $pull: { tasks: { publicId: taskPublicId } } }
	)
		.select('tasks')
		.then((document) => {
			if (!document.tasks) throw Error('Task not found');
		});
};

HomeworkService.removeStudent = async function (
	studentPublicId,
	homeworkPublicId
) {
	const homeworkId = await HomeworkModel.findOneAndUpdate(
		{
			publicId: homeworkPublicId,
		},
		{
			$pull: { receivedStudents: { studentPublicId } },
		}
	).then(async (document) => {
		const removedDocument = document.receivedStudents.filter((item) => {
			if (item.studentPublicId == studentPublicId) {
				return item;
			}
		})[0];
		if (!removedDocument) {
			throw Error("This user hasn't received this homework");
		}
		if (removedDocument.hasSolution) {
			const { solutionId } = removedDocument;
			await HomeworkModel.findOneAndUpdate(
				{ publicId: homeworkPublicId },
				{ $pull: { solutions: { _id: solutionId } } }
			);
		}
		return document._id;
	});
	await StudentModel.findOneAndUpdate(
		{ publicId: studentPublicId },
		{ $pull: { homeworks: { homeworkId } } }
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
	await HomeworkModel.findOne({
		publicId: homeworkPublicId,
	})
		.select('receivedStudents receivedGroups creatorId attachments')
		.then(async (homeworkDocument) => {
			const attachments = homeworkDocument.attachments;
			const creatorId = homeworkDocument.creatorId;
			const homeworkId = homeworkDocument._id;
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
			/*
				const groups = homeworkDocument.receivedGroups;
				groups.map(async (group) => {
					await HomeworkService.removeGroup(
						group.groupPublicId,
						homeworkPublicId
					);
				});
			*/
			await TeacherModel.findOneAndUpdate(
				{ _id: creatorId },
				{
					$pull: { homeworks: homeworkId },
				}
			);
			await HomeworkModel.findByIdAndRemove(homeworkId);
		});

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
					case this.typesOfAnswers.OPTIONS_ANSWER:
						pointsForAnswer = checkOptionsAnswer(
							studentAnswers[index],
							task.options,
							task.maxPoints
						);
						break;
					case this.typesOfAnswers.STRING_ANSWER:
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
						task.taskType == this.typesOfAnswers.DETAILED_ANSWER
							? studentAnswers[index]
							: null,
					stringAnswer:
						task.taskType == this.typesOfAnswers.STRING_ANSWER
							? studentAnswers[index]
							: null,
					optionAnswers:
						task.taskType == this.typesOfAnswers.OPTIONS_ANSWER
							? studentAnswers[index]
							: null,
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
			const teacherInfo = await TeacherService.getTeacherInfo({
				teacherId: result.creatorId,
			});
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

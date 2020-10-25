const { nanoid } = require('nanoid');
const HomeworkModel = require('../models/HomeworkModel');
const StudentModel = require('../models/StudentModel');
const TeacherModel = require('../models/TeacherModel');
const GroupModel = require('../models/GroupModel');
const AttachmentService = require('./attachment.service');
const HomeworkService = {};

const HOMEWORKS_PER_REQUEST = 6;
const SOLUTIONS_PER_REQUEST = 6;

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
	startHomeworkId
) {
	const homeworks = await StudentModel.findOne({
		publicId: studentPublicId,
	}).then((result) => {
		let homeworks = [];
		result.homeworks.map((homework) => {
			delete homework._id;
			if (!homework.hasSolution) {
				homeworks.push(homework.toObject());
			}
		});
		return homeworks;
	});
	if (homeworks.length == 0) {
		throw Error("You don't have homeworks");
	}
	const homeworkPreviews = await Promise.all(
		homeworks.map(async (homework) => {
			let homeworkPreview = await HomeworkModel.findOne({
				publicId: homework.homeworkPublicId,
			})
				.select('-_id subject description')
				.then((result) => result.toObject());
			return { ...homework, ...homeworkPreview };
		})
	);
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
					return await AttachmentService.getFile(attachment);
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
	startHomeworkId
) {
	const homeworkPublicIds = await TeacherModel.findOne(
		{ publicId: teacherPublicId },
		{
			homeworks: {
				$slice: [
					startHomeworkId,
					startHomeworkId + HOMEWORKS_PER_REQUEST,
				],
			},
		}
	)
		.select('-_id homeworks')
		.then((result) => {
			return result.homeworks;
		});
	if (
		typeof homeworkPublicIds == 'undefined' ||
		homeworkPublicIds.length == 0
	) {
		throw Error("You don't have homeworks");
	}
	const homeworkPreviewDocuments = await Promise.all(
		homeworkPublicIds.map(async (homeworkPublicId) => {
			let homeworkPreviewDocument = await HomeworkModel.findOne({
				publicId: homeworkPublicId,
			})
				.select('-_id title description publicId')
				.then((result) => {
					return result;
				});
			return homeworkPreviewDocument;
		})
	);
	return homeworkPreviewDocuments;
};

HomeworkService.getByTeacher = async function (homeworkPublicId) {
	const homeworkDocument = await HomeworkModel.findOne({
		publicId: homeworkPublicId,
	})
		.select('-_id')
		.then(async (result) => {
			let attachments = await Promise.all(
				result.attachments.map(async (attachment) => {
					return await AttachmentService.getFile(attachment);
				})
			);
			return {
				...result.toObject(),
				attachments,
			};
		});
	return homeworkDocument;
};
HomeworkService.addHomework = async function (
	title,
	description,
	subject,
	creatorPublicId,
	creatorId,
	attachments,
	creatorName
) {
	if (attachments && attachments.length > 0) {
		var attachmentIds = attachments.map(async (attachment) => {
			return await AttachmentService.uploadFile(attachment);
		});
		attachmentIds = await Promise.all(attachmentIds);
	}
	const homeworkPublicId = nanoid();
	await HomeworkModel.create({
		title: title,
		subject: subject,
		description: description,
		creatorPublicId: creatorPublicId,
		creatorId: creatorId,
		publicId: homeworkPublicId,
		attachments: attachmentIds,
		creatorName: creatorName,
	});
	await TeacherModel.findByIdAndUpdate(creatorId, {
		$push: { homeworks: homeworkPublicId },
	});
	return homeworkPublicId;
};

HomeworkService.addStudent = async function (
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

	console.log(homeworkDocument);
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
			return result.name;
		});
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			$push: { receivedStudents: { studentPublicId, studentName } },
		}
	);
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
		task:{_id, type, text, attachments, options, stringAnswer, detailedAnswer, maxGrade}
	*/
	if (attachments !== 'undefined' && attachments) {
		var attachmentIds = attachments.map(async (attachment) => {
			return await AttachmentService.uploadFile(attachment);
		});
		attachmentIds = await Promise.all(attachmentIds);
	}
	const publicId = nanoid();
	let isTaskDetailed = task.type == 3 ? true : false;
	const setHasDetailedHomeworks = isTaskDetailed
		? { $set: { hasDetailedTasks: isTaskDetailed } }
		: {};
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			...setHasDetailedHomeworks,
			$push: {
				tasks: {
					publicId: publicId,
					taskType: task.type,
					text: task.text,
					attachments: attachmentIds,
					options: task.options,
					stringAnswer: task.stringAnswer,
					detailedAnswer: task.detailedAnswer,
				},
			},
			$inc: {
				homeworkMaxGrade: task.maxGrade || 0,
			},
		}
	);
};

HomeworkService.removeTask = async function (homeworkPublicId, taskPublicId) {
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
	await StudentModel.findOneAndUpdate(
		{ publicId: studentPublicId },
		{ $pull: { homeworks: { homeworkPublicId } } }
	);
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{ $pull: { receivedStudents: studentPublicId } }
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
	}).select('receivedStudents receivedGroups creatorPublicId');
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
	await TeacherModel.findOneAndUpdate(
		{ publicId: creatorPublicId },
		{
			$pull: { homeworks: homeworkPublicId },
		}
	);
	await HomeworkModel.findByIdAndRemove(homeworkDocument._id);
};

HomeworkService.editHomework = async function (userId, homeworkId, tasks) {
	/*
		rewrite only tasks with changes
		task:{_id, newType, newText, newAttachments, newOptions, newStringAnswer, newDetailedAnswer}
	*/
};

HomeworkService.addSolutionByStudent = async function (
	homeworkPublicId,
	answersForm,
	studentName,
	studentPublicId,
	studentId
) {
	const checkStringAnswer = (answer, rightAnswer, points) => {
		if (
			answer.toLowerCase().replace(/ +/g, ' ').trim() ==
			rightAnswer.toLowerCase().replace(/ +/g, ' ').trim()
		) {
			return points;
		} else {
			return 0;
		}
	};
	const checkOptionsAnswer = (options, rightAnswer, points) => {
		let mistakes = 0;
		options.map((option, index) => {
			if (option !== rightAnswer[index].isCorrect) {
				mistakes++;
			}
		});
		let coefficient = mistakes / options.length;
		return Math.floor(coefficient * points);
	};
	const solutionPublicId = nanoid();
	/**
	 * answers: {publicId, studentId, studentPublicId, answers: [{detailedAnswer, optionAnswer, stringAnswer, attachments}]}
	 */
	var solutionDocument = {
		publicId: solutionPublicId,
		studentId: studentId,
		studentName: studentName,
		studentPublicId: studentPublicId,
	};
	await HomeworkModel.findOne({ publicId: homeworkPublicId })
		.select('-_id tasks hasDetailedTasks')
		.then(async (result) => {
			let { tasks, hasDetailedTasks } = result;
			solutionDocument.answers = new Array(tasks.length);
			var taskGradeSumm = 0;
			tasks.map((task, index) => {
				console.log(task);
				let answerGradeCoefficent = 0;
				switch (task.taskType) {
					case 1:
						answerGradeCoefficent = checkOptionsAnswer(
							answersForm[index],
							task.options
						);
						break;
					case 2:
						answerGradeCoefficent = checkStringAnswer(
							answersForm[index],
							task.stringAnswer
						);
						break;
				}
				let grade = Math.floor(answerGradeCoefficent * task.maxGrade);
				taskGradeSumm += grade;
				solutionDocument.answers[index] = {
					detailedAnswer:
						task.taskType == 3 ? answersForm[index] : null,
					stringAnswer:
						task.taskType == 2 ? answersForm[index] : null,
					optionAnswers:
						task.taskType == 1 ? answersForm[index] : null,
					//attachments: answers[index].attachments,
					grade: grade,
				};
			});
			solutionDocument.taskGradeSumm = taskGradeSumm;
			await HomeworkModel.findOneAndUpdate(
				{
					publicId: homeworkPublicId,
					receivedStudents: {
						$elemMatch: {
							studentPublicId: studentPublicId,
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
			).catch((error) => {
				throw Error(error);
			});
			await StudentModel.findOneAndUpdate(
				{
					_id: studentId,
					'homework.homeworkPublicId': homeworkPublicId,
				},
				{
					$set: {
						'homework.$.solutionPublicId': solutionPublicId,
						'homework.$.hasSolution': true,
					},
				}
			);
		});

	return true;
};

HomeworkService.getSolutionPreviewsByStudent = async function (
	studentPublicId,
	startSolutionId
) {
	var solutions = await StudentModel.findOne({
		publicId: studentPublicId,
	}).then((result) => {
		let solutions = [];
		result.homeworks.map((homework) => {
			delete homework._id;
			if (homework.hasSolution) {
				solutions.push(homework.toObject());
			}
		});
		return solutions;
	});
	if (solutions.length == 0) {
		throw Error("You don't have solutions");
	}
	const solutionPreviews = await Promise.all(
		solutions.map(async (solution) => {
			let solutionPreview = await HomeworkModel.findOne({
				publicId: solution.homeworkPublicId,
			})
				.select('-_id subject description')
				.then((result) => result.toObject());
			return { ...solution, ...solutionPreview };
		})
	);

	return solutionPreviews;
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
			'-_id tasks homeworkMaxGrade attachments creatorName creatorPublicId subject description title'
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
					return await AttachmentService.getFile(attachment);
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
			'-_id tasks homeworkMaxGrade attachments creatorName creatorPublicId subject description title'
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
					return await AttachmentService.getFile(attachment);
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

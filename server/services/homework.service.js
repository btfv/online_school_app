const HomeworkModel = require('../models/HomeworkModel');
const StudentModel = require('../models/StudentModel');
const TeacherModel = require('../models/TeacherModel');
const GroupModel = require('../models/GroupModel');
const HomeworkService = {};

const HOMEWORKS_PER_REQUEST = 6;

HomeworkService.getByStudent = async function (userId, startHomeworkId) {
	try {
		const homeworkIds = await StudentModel.find(
			{ _id: userId },
			'homeworks',
			{
				homeworks: {
					$slice: [
						startHomeworkId,
						startHomeworkId + HOMEWORKS_PER_REQUEST,
					],
				},
			}
		);
		if (homeworkIds == []) {
			throw Error("You don't have homeworks");
		}
		var homeworkDocuments = [];
		homeworkIds.map(async (homeworkId) => {
			const homeworkDocument = await HomeworkModel.findById(homeworkId);
			homeworkDocuments.push(homeworkDocument);
		});
		return homeworkDocuments;
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.getByTeacher = async function (userId, startHomeworkId) {
	try {
		const homeworkIds = await TeacherModel.find(
			{ _id: userId },
			'homeworks',
			{
				homeworks: {
					$slice: [
						startHomeworkId,
						startHomeworkId + HOMEWORKS_PER_REQUEST,
					],
				},
			}
		);
		if (homeworkIds == []) {
			throw Error("You don't have homeworks");
		}
		var homeworkDocuments = [];
		homeworkIds.map(async (homeworkId) => {
			const homeworkDocument = await HomeworkModel.findById(homeworkId);
			homeworkDocuments.push(homeworkDocument);
			return 0;
		});
		return homeworkDocuments;
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.addHomework = async function (
	title,
	description,
	subject,
	creator,
	attachments
) {
	try {
		await HomeworkModel.create(
			{
				title: title,
				subject: subject,
				description: description,
				creator: creator,
				attachments: attachments,
			},
			async (error, homeworkDocument) => {
				if (error) {
					throw Error(error);
				}
				await TeacherModel.findByIdAndUpdate(creator, {
					$push: { homeworks: homeworkDocument._id },
				});
			}
		);
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.addStudent = async function (studentId, homeworkId) {
	try {
		await StudentModel.findByIdAndUpdate(studentId, {
			$push: { homeworks: homeworkId },
		});
		await HomeworkModel.findByIdAndUpdate(homeworkId, {
			$push: { receivedStudents: studentId },
		});
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.addGroup = async function (groupId, homeworkId) {
	try {
		await GroupModel.findByIdAndUpdate(groupId, {
			$push: { homeworks: homeworkId },
		});
		await HomeworkModel.findByIdAndUpdate(homeworkId, {
			$push: { receivedGroups: groupId },
		});
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.addTask = async function (homeworkId, task) {
	/*
		task:{_id, newType, newText, newAttachments, newOptions, newStringAnswer, newDetailedAnswer}
	*/
	try {
		if(task.attachments !== []){
			task.attachments.map(async (attachment) => {
				
			})
		}
		await HomeworkModel.findByIdAndUpdate(homeworkId, {
			$push: { tasks: task },
		});
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.removeHomework = async function (homeworkId) {
	try {
		const homeworkDocument = await HomeworkModel.findById(
			homeworkId,
			'students groups creator'
		);
		const students = homeworkDocument.students;
		students.map(async (studentId) => {
			await StudentModel.findByIdAndUpdate(studentId, {
				$pull: { homeworks: { _id: homeworkId } },
			});
		});
		const groups = homeworkDocument.groups;
		groups.map(async (groupId) => {
			await GroupModel.findByIdAndUpdate(groupId, {
				$pull: { homeworks: { _id: homeworkId } },
			});
		});
		const creator = homeworkDocument.creator;
		await TeacherModel.findByIdAndUpdate(creator, {
			$pull: { homeworks: { _id: homeworkId } },
		});
		await HomeworkModel.findByIdAndRemove(homeworkId);
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.editHomework = async function (userId, homeworkId, tasks) {
	/*
		rewrite only tasks with changes
		task:{_id, newType, newText, newAttachments, newOptions, newStringAnswer, newDetailedAnswer}
	*/
	try {
	} catch (error) {
		throw Error(error);
	}
};

module.exports = HomeworkService;

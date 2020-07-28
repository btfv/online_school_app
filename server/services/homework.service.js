const nanoid = require('nanoid');
const HomeworkModel = require('../models/HomeworkModel');
const StudentModel = require('../models/StudentModel');
const TeacherModel = require('../models/TeacherModel');
const GroupModel = require('../models/GroupModel');
const AttachmentService = require('./attachment.service');
const HomeworkService = {};

const HOMEWORKS_PER_REQUEST = 6;

HomeworkService.checkTeacherPermission = async function (
	teacherPublicId,
	homeworkPublicId
) {
	try {
		const teacherDocument = await TeacherModel.findOne(
			{ publicId: teacherPublicId },
			{ homeworks: { $elemMatch: homeworkPublicId } }
		).select('_id');
		if (teacherDocument) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.checkStudentPermission = async function (
	studentPublicId,
	homeworkPublicId
) {
	try {
		const studentDocument = await StudentModel.findOne(
			{ publicId: studentPublicId },
			{ homeworks: { $elemMatch: homeworkPublicId } }
		).select('_id');
		if (studentDocument) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.getPreviewsByStudent = async function (
	studentPublicId,
	startHomeworkNumber
) {
	try {
		const homeworkIds = await StudentModel.findOne(
			{ publicId: studentPublicId },
			{
				homeworks: {
					$slice: [
						startHomeworkNumber,
						startHomeworkNumber + HOMEWORKS_PER_REQUEST,
					],
				},
			}
		).select('-_id homeworks');
		if (homeworkIds == []) {
			throw Error("You don't have homeworks");
		}
		const homeworkPreviewDocuments = homeworkIds.map(async (homeworkId) => {
			const homeworkPreviewDocument = await HomeworkModel.findById(
				homeworkId
			).select('-_id title publicId');
			return homeworkPreviewDocument;
		});
		return homeworkPreviewDocuments;
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.getByStudent = async function (homeworkPublicId) {
	try {
		const homeworkDocument = await HomeworkModel.findOne({
			publicId: homeworkPublicId,
		}).select('-_id');
		return homeworkDocument;
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.getPreviewsByTeacher = async function (
	teacherPublicId,
	startHomeworkNumber
) {
	try {
		const homeworkIds = await TeacherModel.findOne(
			{ publicId: teacherPublicId },
			{
				homeworks: {
					$slice: [
						startHomeworkNumber,
						startHomeworkNumber + HOMEWORKS_PER_REQUEST,
					],
				},
			}
		).select('homeworks');
		if (homeworkIds == []) {
			throw Error("You don't have homeworks");
		}
		const homeworkPreviewDocuments = homeworkIds.map(async (homeworkId) => {
			const homeworkPreviewDocument = await HomeworkModel.findById(
				homeworkId
			);
			return homeworkPreviewDocument;
		});
		return homeworkPreviewDocuments;
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.getByTeacher = async function (homeworkPublicId) {
	try {
		const homeworkDocument = await HomeworkModel.findOne({
			publicId: homeworkPublicId,
		}).select('-_id');
		return homeworkDocument;
	} catch (error) {
		throw Error(error);
	}
};
HomeworkService.addHomework = async function (
	title,
	description,
	subject,
	creatorPublicId,
	attachments
) {
	try {
		if (attachments !== []) {
			var attachmentIds = attachments.map(async (attachment) => {
				return await AttachmentService.uploadFile(attachment);
			});
		}
		const creatorId = (
			await TeacherModel.findOne({ publicId: creatorPublicId })
		).select('_id')._id;
		const publicId = nanoid();
		await HomeworkModel.create({
			title: title,
			subject: subject,
			description: description,
			creator: creator,
			creatorPublicId: creatorPublicId,
			creator: creatorId,
			publicId: publicId,
			attachments: attachmentIds,
		});
		await TeacherModel.findByIdAndUpdate(creatorId, {
			$push: { homeworks: publicId },
		});
		return publicId;
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.addStudent = async function (
	studentPublicId,
	homeworkPublicId
) {
	try {
		await StudentModel.findOneAndUpdate(
			{ publicId: studentPublicId },
			{
				$push: { homeworks: homeworkId },
			}
		);
		await HomeworkModel.findOneAndUpdate(
			{ publicId: homeworkPublicId },
			{
				$push: { receivedStudents: studentId },
			}
		);
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.addGroup = async function (groupPublicId, homeworkPublicId) {
	try {
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
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.addTask = async function (homeworkPublicId, task, attachments) {
	/*
		task:{_id, type, text, attachments, options, stringAnswer, detailedAnswer}
	*/
	try {
		if (attachments !== []) {
			var attachmentIds = attachments.map(async (attachment) => {
				return await AttachmentService.uploadFile(attachment);
			});
		}
		const publicId = nanoid();
		await HomeworkModel.findOneAndUpdate(
			{ publicId: homeworkPublicId },
			{
				$push: {
					tasks: {
						publicId: publicId,
						type: task_type,
						text: task.text,
						attachments: attachmentIds,
						options: task.options,
						stringAnswer: task.stringAnswer,
						detailedAnswer: task.detailedAnswer,
					},
				},
			}
		);
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.removeTask = async function (homeworkPublicId, taskPublicId) {
	try {
		await HomeworkModel.findOneAndUpdate(
			{ publicId: homeworkPublicId },
			{ $pull: { tasks: { publicId: taskPublicId } } }
		);
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.removeStudent = async function (
	studentPublicId,
	homeworkPublicId
) {
	try {
		await StudentModel.findOneAndUpdate(
			{ publicId: studentPublicId },
			{ $pull: { homeworks: homeworkPublicId } }
		);
		await HomeworkModel.findOneAndUpdate(
			{ publicId: homeworkPublicId },
			{ $pull: { receivedStudents: studentPublicId } }
		);
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.removeGroup = async function (groupPublicId, homeworkPublicId) {
	try {
		await GroupModel.findOneAndUpdate(
			{ publicId: groupPublicId },
			{ $pull: { homeworks: homeworkPublicId } }
		);
		await HomeworkModel.findOneAndUpdate(
			{ publicId: homeworkPublicId },
			{ $pull: { receivedGroups: groupPublicId } }
		);
	} catch (error) {
		throw Error(error);
	}
};

HomeworkService.removeHomework = async function (homeworkPublicId) {
	try {
		const homeworkDocument = await HomeworkModel.findOne({
			publicId: homeworkPublicId,
		}).select('students groups creator');
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
		await HomeworkModel.findByIdAndRemove(homeworkDocument._id);
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

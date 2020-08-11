const { nanoid } = require('nanoid');
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
		{ homeworks: { $elemMatch: homeworkPublicId } }
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
	var homeworkPublicIds;
	await StudentModel.findOne(
		{ publicId: studentPublicId },
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
			homeworkPublicIds = result.homeworks;
		});
	if (typeof homeworkPublicIds == undefined) {
		throw Error("You don't have homeworks");
	}
	const homeworkPreviewDocuments = await Promise.all(
		homeworkPublicIds.map(async (homeworkPublicId) => {
			var homeworkPreviewDocument;
			await HomeworkModel.findOne({ publicId: homeworkPublicId })
				.select('-_id title description publicId')
				.then((result) => {
					homeworkPreviewDocument = result;
				});
			return homeworkPreviewDocument;
		})
	);
	return homeworkPreviewDocuments;
};

HomeworkService.getByStudent = async function (homeworkPublicId) {
	var homeworkDocument;
	await HomeworkModel.findOne({
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
			homeworkDocument = {
				...result.toObject(),
				attachments,
			};
			console.log(homeworkDocument);
		})
		.catch((error) => {
			throw Error(error);
		});
	return homeworkDocument;
};

HomeworkService.getPreviewsByTeacher = async function (
	teacherPublicId,
	startHomeworkId
) {
	var homeworkPublicIds;
	await TeacherModel.findOne(
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
		.select('homeworks')
		.then((result) => {
			homeworkPublicIds = result.homeworks;
		});
	if (typeof homeworkPublicIds == undefined) {
		throw Error("You don't have homeworks");
	}
	const homeworkPreviewDocuments = await Promise.all(
		homeworkPublicIds.map(async (homeworkPublicId) => {
			var homeworkPreviewDocument;
			await HomeworkModel.findOne({ publicId: homeworkPublicId })
				.select('-_id title description publicId')
				.then((result) => {
					homeworkPreviewDocument = result;
				});
			return homeworkPreviewDocument;
		})
	);
	return homeworkPreviewDocuments;
};

HomeworkService.getByTeacher = async function (homeworkPublicId) {
	const homeworkDocument = await HomeworkModel.findOne({
		publicId: homeworkPublicId,
	}).select('-_id');
	return homeworkDocument;
};
HomeworkService.addHomework = async function (
	title,
	description,
	subject,
	creatorPublicId,
	creatorId,
	attachments,
	creatorName,
) {
	if (attachments !== undefined) {
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
	await StudentModel.findOneAndUpdate(
		{ publicId: studentPublicId },
		{
			$push: { homeworks: homeworkPublicId },
		}
	);
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			$push: { receivedStudents: studentPublicId },
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
		task:{_id, type, text, attachments, options, stringAnswer, detailedAnswer}
	*/
	if (attachments !== undefined && attachments) {
		var attachmentIds = attachments.map(async (attachment) => {
			return await AttachmentService.uploadFile(attachment);
		});
		attachmentIds = await Promise.all(attachmentIds);
	}
	const publicId = nanoid();
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
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
		}
	);
};

HomeworkService.removeTask = async function (homeworkPublicId, taskPublicId) {
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{ $pull: { tasks: { publicId: taskPublicId } } }
	);
};

HomeworkService.removeStudent = async function (
	studentPublicId,
	homeworkPublicId
) {
	await StudentModel.findOneAndUpdate(
		{ publicId: studentPublicId },
		{ $pull: { homeworks: homeworkPublicId } }
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
		{ $pull: { receivedGroups: groupPublicId } }
	);
};

HomeworkService.removeHomework = async function (homeworkPublicId) {
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
};

HomeworkService.editHomework = async function (userId, homeworkId, tasks) {
	/*
		rewrite only tasks with changes
		task:{_id, newType, newText, newAttachments, newOptions, newStringAnswer, newDetailedAnswer}
	*/
};

module.exports = HomeworkService;

const bcrypt = require('bcrypt');
const { unlink } = require('fs');
const { nanoid } = require('nanoid');
const path = require('path');
const fs = require('fs');

const TeacherModel = require('../models/TeacherModel');
const FilesService = require('./FilesService');
const passwordHashCost = parseInt(process.env.PASSWORD_HASH_COST, 10);

const TeacherService = {};

const COUNT_OF_USERS_IN_QUERY = process.env.COUNT_OF_USERS_IN_QUERY;

TeacherService.getTeacherProfile = async (publicId) => {
	return await TeacherModel.findOne(
		{ publicId },
		'-_id firstname lastname profilePictureRef'
	).then((result) => result.toObject());
};

TeacherService.getTeacherInfo = async (params) => {
	const { teacherId, teacherPublicId, includeId = true } = params;
	if (teacherId) {
		return await TeacherModel.findById(
			teacherId,
			'_id firstname lastname publicId'
		)
			.exec()
			.then((result) => {
				if (!result) {
					throw Error('User not found');
				}
				result = result.toObject();
				if (!includeId) {
					delete result._id;
				}
				return {
					...result,
					name: result.firstname + ' ' + result.lastname,
				};
			});
	} else {
		return await TeacherModel.findOne(
			{ publicId: teacherPublicId },
			'_id firstname lastname publicId'
		)
			.exec()
			.then((result) => {
				if (!result) {
					throw Error('User not found');
				}
				result = result.toObject();
				if (!includeId) {
					delete result._id;
				}
				return {
					...result,
					name: result.firstname + ' ' + result.lastname,
				};
			});
	}
};

TeacherService.changePassword = async function (
	teacherPublicId,
	oldPassword,
	newPassword
) {
	const teacherPasswordHash = await TeacherModel.findOne(
		{ publicId: teacherPublicId },
		'-_id passwordHash'
	)
		.exec()
		.then((result) => {
			return result.passwordHash;
		});
	const passwordsMatch = await bcrypt.compare(
		oldPassword,
		teacherPasswordHash
	);
	if (!passwordsMatch) {
		throw Error('Incorrect password');
	}
	const passwordHash = await bcrypt.hash(newPassword, passwordHashCost);
	await TeacherModel.findOneAndUpdate(
		{ publicId: teacherPublicId },
		{
			passwordHash,
		}
	);
};

TeacherService.uploadProfilePicture = async (teacherPublicId, pictureFile) => {
	const extension = pictureFile.name.split('.').pop();
	if (extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg') {
		throw Error('png, jpg, jpeg formats are available only');
	}
	await TeacherModel.findOne(
		{ publicId: teacherPublicId },
		'profilePictureRef'
	).then(async (result) => {
		if (!result) {
			throw Error('Teacher not found');
		}
		if (result.profilePictureRef) {
			const filePath = path.join(
				__dirname,
				'../upload_files/' + result.profilePictureRef
			);
			fs.unlink(filePath, (err) => {
				if (err) throw Error(err);
			});
		}
	});

	const fileName = nanoid(10) + Date.now().toString() + '.' + extension;
	await pictureFile.mv('./upload_files/' + fileName);
	await TeacherModel.findOneAndUpdate(
		{ publicId: teacherPublicId },
		{ profilePictureRef: fileName }
	);
};

module.exports = TeacherService;

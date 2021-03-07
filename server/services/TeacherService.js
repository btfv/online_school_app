const bcrypt = require('bcrypt');

const TeacherModel = require('../models/TeacherModel');
const passwordHashCost = parseInt(process.env.PASSWORD_HASH_COST, 10);

const TeacherService = {};

const COUNT_OF_USERS_IN_QUERY = process.env.COUNT_OF_USERS_IN_QUERY;

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
	teacherId,
	oldPassword,
	newPassword
) {
	const teacherPasswordHash = await TeacherModel.findById(
		teacherId,
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
	await TeacherModel.findByIdAndUpdate(teacherId, {
		passwordHash: passwordHash,
	});
};

module.exports = TeacherService;

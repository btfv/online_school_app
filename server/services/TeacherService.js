const bcrypt = require('bcrypt');

const TeacherModel = require('../models/TeacherModel');
const passwordHashCost = parseInt(process.env.PASSWORD_HASH_COST, 10);

const TeacherService = {};

const COUNT_OF_USERS_IN_QUERY = 5;

TeacherService.getTeacherInfo = async (teacherId) => {
	return await TeacherModel.findById(
		homeworkInfo.creatorId,
		'-_id firstname lastname publicId'
	).exec();
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

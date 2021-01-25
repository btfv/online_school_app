const bcrypt = require('bcrypt');

const StudentModel = require('../models/StudentModel');
const passwordHashCost = parseInt(process.env.PASSWORD_HASH_COST, 10);

const StudentService = {};

const COUNT_OF_USERS_IN_QUERY = process.env.COUNT_OF_USERS_IN_QUERY;

StudentService.getStudentProfileByTeacher = async function (studentPublicId) {
	var userDocument = await StudentModel.findOne(
		{ publicId: studentPublicId },
		'-_id'
	);
	if (!userDocument) {
		throw Error('Student not found');
	}
	return userDocument;
};

StudentService.changePassword = async function (
	userId,
	oldPassword,
	newPassword
) {
	const studentPasswordHash = await StudentModel.findById(
		userId,
		'-_id passwordHash'
	)
		.exec()
		.then((result) => {
			return result.passwordHash;
		});
	const passwordsMatch = await bcrypt.compare(
		oldPassword,
		studentPasswordHash
	);
	if (!passwordsMatch) {
		throw Error('Incorrect password');
	}
	const passwordHash = await bcrypt.hash(newPassword, passwordHashCost);
	await StudentModel.findByIdAndUpdate(userId, {
		passwordHash: passwordHash,
	});
};

StudentService.getStudentsByName = async function (name) {
	if (name.length < 3) {
		throw Error('Too short name');
	}
	const userDocuments = await StudentModel.find(
		{ name: { $regex: name, $options: 'i' } },
		'-_id name publicId'
	).limit(COUNT_OF_USERS_IN_QUERY);
	return userDocuments;
};

StudentService.getListOfStudents = async function (sliceNumber) {
	const userDocuments = await StudentModel.find(
		{},
		'-_id publicId name'
	).limit(COUNT_OF_USERS_IN_QUERY);
	return userDocuments;
};

module.exports = StudentService;

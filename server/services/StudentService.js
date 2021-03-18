const bcrypt = require('bcrypt');

const StudentModel = require('../models/StudentModel');
const passwordHashCost = Number.parseInt(process.env.PASSWORD_HASH_COST, 10);

const StudentService = {};

const COUNT_OF_USERS_IN_QUERY = Number.parseInt(
	process.env.COUNT_OF_USERS_IN_QUERY
);

StudentService.getStudentInfo = async (params) => {
	const { studentId, studentPublicId, includeId = true } = params;
	if (studentId) {
		return await StudentModel.findById(
			studentId,
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
		return await StudentModel.findOne(
			{ publicId: studentPublicId },
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
	studentPublicId,
	oldPassword,
	newPassword
) {
	const studentPasswordHash = await StudentModel.findOne(
		{ publicId: studentPublicId },
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
	await StudentModel.findOneAndUpdate(
		{ publicId: studentPublicId },
		{
			passwordHash,
		}
	);
};

StudentService.getStudentsByName = async function (name) {
	if (name.length < 3) {
		throw Error('Too short name');
	}
	const userDocuments = await StudentModel.find(
		{ name: new RegExp(name, 'i') },
		'-_id firstname lastname publicId'
	)
		.limit(COUNT_OF_USERS_IN_QUERY)
		.exec();
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

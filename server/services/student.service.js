const bcrypt = require('bcrypt');

const StudentModel = require('../models/StudentModel');
const passwordHashCost = parseInt(process.env.PASSWORD_HASH_COST, 10);

const StudentService = {};

StudentService.getProfile = async function (userId) {
	try {
		var userDocument = await StudentModel.findById(userId, 'firstname lastname -_id');
        return userDocument;
	} catch (error) {
		throw Error(error);
	}
};

StudentService.changePassword = async function (
	userId,
	currentPassword,
	newPassword
) {
	try {
		const userDocument = await StudentModel.findById(userId, 'passwordHash');
		const passwordsMatch = await bcrypt.compare(
			currentPassword,
			userDocument.passwordHash
		);
		if (!passwordsMatch) {
            throw Error('Incorrect password');
        }
		const passwordHash = await bcrypt.hash(newPassword, passwordHashCost);
		await StudentModel.findByIdAndUpdate(
			userId,
			{ passwordHash: passwordHash }
		);
	} catch (error) {
		throw Error(error);
	}
};

StudentService.findStudentsByName = async function(name){
	try{
		const userDocuments = await StudentModel.find({name: {$regex: name, $options: 'i'}}, 'username name').limit(5);
		return userDocuments;
	}
	catch(error){
		throw Error(error);
	}
};


module.exports = StudentService;

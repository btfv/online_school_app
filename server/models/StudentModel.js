const mongoose = require('mongoose');
const subjectSchema = require('./SubjectsSchema');

const studentSchema = new mongoose.Schema({
	publicId: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: false,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: false,
	},
	//firstname + surname
	groups: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	subjects: [subjectSchema],
	solutions: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	homeworks: [
		{
			type: String,
			required: true,
		},
	],
	//homeworks public ids
});

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;

const mongoose = require('mongoose');
const subjectSchema = require('./SubjectsSchema');

const studentSchema = new mongoose.Schema({
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
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
});

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;

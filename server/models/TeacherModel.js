const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	firstname: {
		type: String,
		required: false,
	},
	lastname: {
		type: String,
		required: false,
	},
	allowed: {
		type: Boolean,
		required: true,
		default: false,
	},
	homeworks: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
});

const TeacherModel = mongoose.model('Teacher', teacherSchema);

module.exports = TeacherModel;

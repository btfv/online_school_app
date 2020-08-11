const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
	publicId: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	allowed: {
		type: Boolean,
		required: true,
		default: false,
	},
	homeworks: [
		{
			type: String,
			required: true,
		},
	],
});

const TeacherModel = mongoose.model('Teacher', teacherSchema);

module.exports = TeacherModel;

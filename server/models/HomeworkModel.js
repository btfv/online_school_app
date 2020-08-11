const mongoose = require('mongoose');
const taskSchema = require('./TaskSchema');
const solutionSchema = require('./SolutionSchema');

const homeworkSchema = new mongoose.Schema({
	publicId: {
		type: String,
		required: true,
	},
	//nanoid
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
		default: null,
	},
	subject: {
		type: String,
		required: true,
	},
	creatorName: {
		type: String,
		required: true,
	},
	creatorId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	creatorPublicId: {
		type: String,
		required: true,
	},
	attachments: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	tasks: [taskSchema],
	receivedStudents: [
		{
			type: String,
			required: true,
		},
	],
	//publicids of users who received that homework
	receivedGroups: [
		{
			type: String,
			required: true,
		},
	],
	//publicids of groups who received that homework
	solutions: [solutionSchema],
});

const HomeworkModel = mongoose.model('Homework', homeworkSchema);

module.exports = HomeworkModel;

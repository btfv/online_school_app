const mongoose = require('mongoose');
const taskSchema = require('./TaskSchema');
const solutionSchema = require('./SolutionSchema');
const receivedUsersSchema = require('./ReceivedUsersSchema');
const receivedGroupsSchema = require('./ReceivedGroupsSchema');

const homeworkSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	desciption: {
		type: String,
		required: false,
		default: null,
	},
	subject: {
		type: Number,
		required: true,
	},
	creator: {
		type: mongoose.Types.ObjectId,
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
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	//users who received that homework
	receivedGroups: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	//groups who received that homework
	solutions: [solutionSchema],
});

const HomeworkModel = mongoose.model('Homework', homeworkSchema);

module.exports = HomeworkModel;

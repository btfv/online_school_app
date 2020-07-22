const mongoose = require('mongoose');
const taskSchema = require('./TaskSchema');
const solutionSchema = require('./SolutionSchema');
const receivedUsersSchema = require('./ReceivedUsersSchema');
const receivedGroupsSchema = require('./ReceivedGroupsSchema');

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

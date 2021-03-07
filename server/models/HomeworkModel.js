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
		required: false,
		default: '',
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
			studentPublicId: {
				type: String,
				required: true,
			},
			studentId: {
				type: mongoose.Types.ObjectId,
				required: true,
			},
			hasSolution: {
				type: Boolean,
				required: true,
				default: false,
			},
			solutionPublicId: {
				type: String,
				required: false,
				default: null,
			},
			isChecked: {
				type: Boolean,
				required: true,
				default: false,
			},
			deadline: {
				type: Date,
				required: false,
				default: 0,
			},
		},
	],
	//publicids of users who received that homework
	receivedGroups: [
		{
			groupPublicId: {
				type: String,
				required: true,
			},
			groupName: {
				type: String,
				required: true,
			},
		},
	],
	//publicids of groups who received that homework
	solutions: [solutionSchema],
	hasDetailedTasks: {
		type: Boolean,
		required: true,
		default: false,
	},
	homeworkMaxPoints: {
		type: Number,
		required: true,
		default: 0,
	},
});

const HomeworkModel = mongoose.model('Homework', homeworkSchema);

module.exports = HomeworkModel;

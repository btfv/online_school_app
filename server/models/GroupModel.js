const mongoose = require('mongoose');
const subjectSchema = require('./SubjectsSchema');
const solutionPreviewSchema = require('./SolutionPreviewSchema');
const homeworkPreviewSchema = require('./HomeworkPreviewSchema');
const memberSchema = require('./MemberSchema');

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	students: [
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

const GroupModel = mongoose.model('User', groupSchema);

module.exports = GroupModel;

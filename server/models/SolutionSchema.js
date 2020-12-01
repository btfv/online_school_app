const mongoose = require('mongoose');
const answerSchema = require('./AnswerSchema');
const solutionSchema = new mongoose.Schema({
	isCheckedByTeacher: {
		type: Boolean,
		required: true,
		default: false,
	},
	publicId: {
		type: String,
		required: true,
	},
	studentId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	studentPublicId: {
		type: String,
		required: true,
	},
	studentName: {
		type: String,
		required: true,
	},
	totalPoints: {
		type: Number,
		required: false,
	},
	comment: {
		type: String,
		required: false,
	},
	answers: [answerSchema],
});

module.exports = solutionSchema;

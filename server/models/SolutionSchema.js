const mongoose = require('mongoose');
const answerSchema = require('./AnswerSchema');
const solutionSchema = new mongoose.Schema({
	creatorId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	creatorName: {
		type: String,
		required: true,
	},
	answers: [answerSchema],
});

module.exports = solutionSchema;

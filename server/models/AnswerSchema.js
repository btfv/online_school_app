const mongoose = require('mongoose');
const answerSchema = new mongoose.Schema({
	detailedAnswer: {
		type: String,
		required: false,
	},
	//detailed answer
	optionAnswers: [
		{
			type: Boolean,
			required: false,
		},
	],
	//answer for option
	stringAnswer: {
		type: String,
		required: false,
	},
	//string answer
	attachments: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	comment: {
		type: String,
		required: false,
		default: null,
	},
	grade: {
		type: Number,
		required: false,
		default: null,
	},
	/*
	if option task, then if answer full right, then 100% of maxGrade, if partially right, then 50% of maxGrade, else 0%
	if stringAnswer, then if answer full right, then 100% of maxGrade, else 0%
	if detailedAnswer, then teacherDeceides how much answer costs, but not more than maxGrade
	*/
});

module.exports = answerSchema;

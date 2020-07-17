const mongoose = require('mongoose');
const answerSchema = new mongoose.Schema({
	detailed: {
		type: String,
		required: false,
	},
	//detailed answer
	option: {
		type: Number,
		required: false,
	},
	//answer for option
	text: {
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
});

module.exports = answerSchema;

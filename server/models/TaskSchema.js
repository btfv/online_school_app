const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
	publicId: {
		type: String,
		required: true,
	},
	//nanoid
	number: {
		type: Number,
		required: true,
		default: 0,
	},
	taskType: {
		type: Number,
		required: true,
	},
	//answer is 1 - option from list, 2 - string, 3 - detailed
	text: {
		type: String,
		required: true,
	},
	options: [
		{
			optionText: {
				type: String,
				required: true,
			},
			isCorrect: {
				type: Boolean,
				required: true,
			},
		},
	],
	stringAnswer: {
		type: String,
		required: false,
	},
	detailedAnswer: {
		type: String,
		required: false,
	},
	attachments: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	maxPoints: {
		type: Number,
		required: false,
		default: 0,
	},
	//how much student receives when right solved task
});
module.exports = taskSchema;

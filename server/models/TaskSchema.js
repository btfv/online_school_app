const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema([
	{
		number: {
			type: Number,
			required: true,
			default: 0,
		},
		type: {
			type: Number,
			required: true,
		},
		//answer is 1 - option from list, 2 - string, 3 - detailed
		taskText: {
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
	},
]);
module.exports = taskSchema;

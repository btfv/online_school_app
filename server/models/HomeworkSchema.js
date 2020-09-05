const mongoose = require('mongoose');
const homeworkSchema = new mongoose.Schema({
	homeworkPublicId: {
		type: String,
		required: true,
	},
	homeworkTitle: {
		type: String,
		required: true,
	},
	solutionPublicId: {
		type: String,
		required: false,
		default: null,
	},
	hasSolution: {
		type: Boolean,
		required: true,
		default: false,
	},
});
module.exports = homeworkSchema;

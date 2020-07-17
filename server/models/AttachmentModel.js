const mongoose = require('mongoose');
const attachmentSchema = new mongoose.Schema({
	type: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	reference: {
		type: String,
		required: true,
	},
});

const AttachmentModel = mongoose.model('Attachment', attachmentSchema);

module.exports = AttachmentModel;

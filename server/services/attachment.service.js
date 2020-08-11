const { nanoid } = require('nanoid');
const AttachmentModel = require('../models/AttachmentModel');
const AttachmentService = {};

AttachmentService.uploadFile = async function (file) {
	const fileReference = nanoid() + Date.now();
	const filename = file.name.split('.')[0];
	const extension = file.name.split('.').pop();
	const fileDocument = await AttachmentModel.create({
		name: filename,
		ext: extension,
		reference: fileReference,
	});
	await file.mv('./upload_files/' + fileReference);
	console.log(fileDocument);
	return fileDocument._id;
};

AttachmentService.getFile = async function (id) {
	try {
		const fileDocument = await AttachmentModel.findById(id).select('-_id reference name');
		return fileDocument.toObject();
	} catch (error) {
		throw Error(error);
	}
};

module.exports = AttachmentService;

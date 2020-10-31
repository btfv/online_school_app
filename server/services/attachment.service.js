const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');
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
	return fileDocument._id;
};

AttachmentService.getFileInfo = async function (id) {
	const fileDocument = await AttachmentModel.findById(id).select(
		'-_id reference name'
	);
	return fileDocument.toObject();
};

AttachmentService.removeFile = async function (id) {
	const fileDocument = await AttachmentModel.findByIdAndDelete(id).select(
		'-_id reference'
	);
	const filePath = path.resolve(
		__dirname,
		'../upload_files/' + fileDocument.reference
	);
	fs.unlink(filePath, (err) => {
		if (err) throw Error(err);
	});
};

module.exports = AttachmentService;

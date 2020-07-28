const shortid = require('shortid');
const AttachmentModel = require('../models/AttachmentModel')
const AttachmentService = {};

AttachmentService.uploadFile = async function (file) {
	try {
		const filename = shortid.generate() + Date.now();
		const extension = file.name.split('.').pop();
		const fileDocument = await AttachmentModel.create({ext : extension, reference: filename});
		file.mv('./uploads_files/' + filename);
		return fileDocument._id;
	} catch (error) {
		throw Error(error);
	}
};

AttachmentService.getFile = async function (id) {
	try {
		const fileDocument = await AttachmentModel.findById(id);
		return fileDocument;
	} catch (error) {
		throw Error(error);
	}
};


module.exports = AttachmentService;

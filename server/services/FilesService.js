const { nanoid } = require('nanoid');
const AttachmentModel = require('../models/AttachmentModel');
const FilesService = {};

FilesService.getFile = async function (fileReference) {
	return await AttachmentModel.findOne({ reference: fileReference })
		.select('-_id ext name')
		.then((value) => {
			if (!value) throw Error('File is not found');
			return value;
		});
};

module.exports = FilesService;

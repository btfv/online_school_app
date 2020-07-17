const shortid = require('shortid');

const AttachmentService = {};

AttachmentService.uploadFile = async function (file) {
	try {
		const filename = shortid.generate() + Date.now();
		file.mv('./uploads_files/' + filename);
		return filename;
	} catch (error) {
		throw Error(error);
	}
};

module.exports = AttachmentService;

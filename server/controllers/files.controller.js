const FilesController = {};
const path = require("path");
FilesController.getFile = async function (req, res, next) {
	/**
	 * GET
	 */
	try {
        const fileId = req.params.fileId;
        let upload_filesPath = path.join(__dirname, '../upload_files/');
		return res.status(200).sendFile(upload_filesPath + fileId);
	} catch (error) {
		return res.status(400).json({ error: error.toString() });
	}
};

module.exports = FilesController;
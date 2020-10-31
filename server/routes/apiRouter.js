const express = require('express');
const apiRouter = express.Router();
const authController = require('../controllers/auth.controller');
const homeworkController = require('../controllers/homework.controller');
const studentController = require('../controllers/student.controller');
const { body, check, validationResult } = require('express-validator');
const teacherController = require('../controllers/teacher.controller');
const FilesController = require('../controllers/files.controller');

const validationRules = (req, res, next) => {
	body('email')
		.isEmail()
		.isLength({ min: 10, max: 30 })
		.withMessage('Email length should be 10 to 30 characters');
	body('username', 'Username length should be 8 to 20 characters').isLength({
		min: 8,
		max: 20,
	});
	body('password')
		.isLength({
			min: 8,
			max: 16,
		})
		.withMessage('Password length should be 8 to 16 characters')
		.matches(/(?=.*\d)/)
		.withMessage('Password should contain numbers')
		.matches(/([a-zA-z0-9_-]*)/)
		.withMessage('Password should contain only letters, numbers, - and _');
	body('name')
		.isLength({
			min: 6,
			max: 30,
		})
		.withMessage('Name length should be 6 to 30 characters')
		.isAlpha()
		.withMessage('Name must be alphabetic');
	check('homeworkPublicId')
		.isLength(21)
		.withMessage('PublicId should be 21 character long')
		.matches(/([a-zA-z0-9_-]*)/)
		.withMessage('PublicId should contain only letters, numbers, - and _');
	check('taskPublicId')
		.isLength(21)
		.withMessage('PublicId should be 21 character long')
		.matches(/([a-zA-z0-9_-]*)/)
		.withMessage('PublicId should contain only letters, numbers, - and _');
	check('startHomeworkId', 'startHomeworkId should be number > 0').isInt({
		min: 0,
	});
	var errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({ status: 400, message: errors.array() }).send();
		return 0;
	}
	next();
	return 1;
};

//open routes
apiRouter.post('/login', validationRules, authController.student.login);
apiRouter.post(
	'/registration',
	validationRules,
	authController.student.register
);

apiRouter.post('/teacher/login', validationRules, authController.teacher.login);
apiRouter.post(
	'/teacher/registration',
	validationRules,
	authController.teacher.register
);

//protected routes

apiRouter.get(
	'/homeworks/getByStudent',
	authController.checkCookie,
	authController.student.checkToken,
	homeworkController.getByStudent
);
apiRouter.post(
	'/student/changePassword',
	authController.checkCookie,
	authController.student.checkToken,
	studentController.changePassword
);
apiRouter.get(
	'/homeworks/getByTeacher',
	authController.checkCookie,
	authController.teacher.checkToken,
	homeworkController.getByTeacher
);
apiRouter.post(
	'/teacher/changePassword',
	authController.checkCookie,
	authController.teacher.checkToken,
	teacherController.changePassword
);
apiRouter.get(
	'/homeworks/getPreviewsByTeacher',
	authController.checkCookie,
	authController.teacher.checkToken,
	homeworkController.getPreviewsByTeacher
);
apiRouter.get(
	'/homeworks/getPreviewsByStudent',
	authController.checkCookie,
	authController.student.checkToken,
	homeworkController.getPreviewsByStudent
);
apiRouter.post(
	'/homeworks/addHomework',
	authController.checkCookie,
	authController.teacher.checkToken,
	homeworkController.addHomework
);
apiRouter.post(
	'/homeworks/removeHomework',
	authController.checkCookie,
	authController.teacher.checkToken,
	homeworkController.removeHomework
);
apiRouter.post(
	'/homeworks/addTask',
	authController.checkCookie,
	authController.teacher.checkToken,
	homeworkController.addTask
);
apiRouter.post(
	'/homeworks/removeTask',
	authController.checkCookie,
	authController.teacher.checkToken,
	homeworkController.removeTask
);
apiRouter.post(
	'/homeworks/addStudent',
	authController.checkCookie,
	authController.teacher.checkToken,
	homeworkController.addStudent
);
apiRouter.post(
	'/homeworks/removeGroup',
	authController.checkCookie,
	authController.teacher.checkToken,
	homeworkController.removeGroup
);
apiRouter.post(
	'/homeworks/addGroup',
	authController.checkCookie,
	authController.teacher.checkToken,
	homeworkController.addGroup
);
apiRouter.post(
	'/homeworks/removeStudent',
	authController.checkCookie,
	authController.teacher.checkToken,
	homeworkController.removeStudent
);
apiRouter.post(
	'/homeworks/addSolutionByStudent',
	authController.checkCookie,
	authController.student.checkToken,
	homeworkController.addSolutionByStudent
);
apiRouter.get(
	'/homeworks/getSolutionPreviewsByStudent',
	authController.checkCookie,
	authController.student.checkToken,
	homeworkController.getSolutionPreviewsByStudent
);
apiRouter.get(
	'/homeworks/getSolutionByStudent',
	authController.checkCookie,
	authController.student.checkToken,
	homeworkController.getSolutionByStudent
);
apiRouter.get(
	'/homeworks/getSolutionByTeacher',
	authController.checkCookie,
	authController.teacher.checkToken,
	homeworkController.getSolutionByTeacher
);

apiRouter.get(
	'/students/getStudentList',
	authController.checkCookie,
	authController.teacher.checkToken,
	studentController.getListOfStudents
);

apiRouter.get(
	'/students/getStudentsByName',
	authController.checkCookie,
	authController.teacher.checkToken,
	studentController.getStudentsByName
);
apiRouter.get(
	'/students/getStudentProfileByTeacher',
	authController.checkCookie,
	authController.teacher.checkToken,
	studentController.getStudentProfileByTeacher
);
apiRouter.get(
	'/upload_files/:fileReference',
	FilesController.getFile
)
module.exports = apiRouter;

const express = require('express');
const ApiRouter = express.Router();
const AuthController = require('../controllers/AuthController');
const HomeworkController = require('../controllers/HomeworkController');
const StudentController = require('../controllers/StudentController');
const { body, check, validationResult } = require('express-validator');
const TeacherController = require('../controllers/TeacherController');
const FilesController = require('../controllers/FilesController');

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
ApiRouter.post('/login', validationRules, AuthController.student.login);
ApiRouter.post('/register', validationRules, AuthController.student.register);

ApiRouter.post('/teacher/login', validationRules, AuthController.teacher.login);
ApiRouter.post(
	'/teacher/register',
	validationRules,
	AuthController.teacher.register
);

ApiRouter.get('/logout', AuthController.logout);

//protected routes

ApiRouter.get(
	'/homeworks/getByStudent',
	AuthController.checkCookie,
	AuthController.student.checkToken,
	HomeworkController.getByStudent
);
ApiRouter.post(
	'/student/changePassword',
	AuthController.checkCookie,
	AuthController.student.checkToken,
	StudentController.changePassword
);
ApiRouter.get(
	'/homeworks/getByTeacher',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	HomeworkController.getByTeacher
);
ApiRouter.post(
	'/teacher/changePassword',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	TeacherController.changePassword
);
ApiRouter.get(
	'/homeworks/getPreviewsByTeacher',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	HomeworkController.getPreviewsByTeacher
);
ApiRouter.get(
	'/homeworks/getPreviewsByStudent',
	AuthController.checkCookie,
	AuthController.student.checkToken,
	HomeworkController.getPreviewsByStudent
);
ApiRouter.post(
	'/homeworks/addHomework',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	HomeworkController.addHomework
);
ApiRouter.post(
	'/homeworks/removeHomework',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	HomeworkController.removeHomework
);
ApiRouter.post(
	'/homeworks/addTask',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	HomeworkController.addTask
);
ApiRouter.post(
	'/homeworks/removeTask',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	HomeworkController.removeTask
);
ApiRouter.post(
	'/homeworks/addStudent',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	HomeworkController.addStudent
);
ApiRouter.post(
	'/homeworks/removeGroup',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	HomeworkController.removeGroup
);
ApiRouter.post(
	'/homeworks/addGroup',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	HomeworkController.addGroup
);
ApiRouter.post(
	'/homeworks/removeStudent',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	HomeworkController.removeStudent
);
ApiRouter.post(
	'/homeworks/addSolutionByStudent',
	AuthController.checkCookie,
	AuthController.student.checkToken,
	HomeworkController.addSolutionByStudent
);
ApiRouter.get(
	'/homeworks/getSolutionPreviewsByStudent',
	AuthController.checkCookie,
	AuthController.student.checkToken,
	HomeworkController.getSolutionPreviewsByStudent
);
ApiRouter.get(
	'/homeworks/getSolutionByStudent',
	AuthController.checkCookie,
	AuthController.student.checkToken,
	HomeworkController.getSolutionByStudent
);
ApiRouter.get(
	'/homeworks/getSolutionByTeacher',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	HomeworkController.getSolutionByTeacher
);

ApiRouter.get(
	'/students/getStudentList',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	StudentController.getListOfStudents
);

ApiRouter.get(
	'/students/getStudentsByName',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	StudentController.getStudentsByName
);
ApiRouter.get(
	'/students/getStudentProfileByTeacher',
	AuthController.checkCookie,
	AuthController.teacher.checkToken,
	AuthController.teacher.checkPermission,
	StudentController.getStudentProfileByTeacher
);
ApiRouter.get('/upload_files/:fileReference', FilesController.getFile);
module.exports = ApiRouter;

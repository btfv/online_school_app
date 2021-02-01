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
	AuthController.isStudent,
	HomeworkController.getByStudent
);
ApiRouter.post(
	'/student/changePassword',
	AuthController.isStudent,
	StudentController.changePassword
);
ApiRouter.get(
	'/homeworks/getByTeacher',
	AuthController.isTeacher,
	HomeworkController.getByTeacher
);
ApiRouter.post(
	'/teacher/changePassword',
	AuthController.isTeacher,
	TeacherController.changePassword
);
ApiRouter.get(
	'/homeworks/getPreviewsByTeacher',
	AuthController.isTeacher,
	HomeworkController.getPreviewsByTeacher
);
ApiRouter.get(
	'/homeworks/getPreviewsByStudent',
	AuthController.isStudent,
	HomeworkController.getPreviewsByStudent
);
ApiRouter.post(
	'/homeworks/addHomework',
	AuthController.isTeacher,
	HomeworkController.addHomework
);
ApiRouter.post(
	'/homeworks/removeHomework',
	AuthController.isTeacher,
	HomeworkController.removeHomework
);
ApiRouter.post(
	'/homeworks/addTask',
	AuthController.isTeacher,
	HomeworkController.addTask
);
ApiRouter.post(
	'/homeworks/removeTask',
	AuthController.isTeacher,
	HomeworkController.removeTask
);
ApiRouter.post(
	'/homeworks/addStudent',
	AuthController.isTeacher,
	HomeworkController.addStudent
);
ApiRouter.post(
	'/homeworks/removeGroup',
	AuthController.isTeacher,
	HomeworkController.removeGroup
);
ApiRouter.post(
	'/homeworks/addGroup',
	AuthController.isTeacher,
	HomeworkController.addGroup
);
ApiRouter.post(
	'/homeworks/removeStudent',
	AuthController.isTeacher,
	HomeworkController.removeStudent
);
ApiRouter.post(
	'/homeworks/addSolutionByStudent',
	AuthController.isStudent,
	HomeworkController.addSolutionByStudent
);
ApiRouter.get(
	'/homeworks/getSolutionPreviewsByStudent',
	AuthController.isStudent,
	HomeworkController.getSolutionPreviewsByStudent
);
ApiRouter.get(
	'/homeworks/getSolutionByStudent',
	AuthController.isStudent,
	HomeworkController.getSolutionByStudent
);
ApiRouter.get(
	'/homeworks/getSolutionByTeacher',
	AuthController.isTeacher,
	HomeworkController.getSolutionByTeacher
);

ApiRouter.get(
	'/students/getStudentList',
	AuthController.isTeacher,
	StudentController.getListOfStudents
);

ApiRouter.get(
	'/students/getStudentsByName',
	AuthController.isTeacher,
	StudentController.getStudentsByName
);
ApiRouter.get(
	'/students/getStudentProfileByTeacher',
	AuthController.isTeacher,
	StudentController.getStudentProfileByTeacher
);
ApiRouter.get('/upload_files/:fileReference', FilesController.getFile);
module.exports = ApiRouter;
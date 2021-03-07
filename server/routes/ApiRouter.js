const express = require('express');
const ApiRouter = express.Router();
const AuthController = require('../controllers/AuthController');
const HomeworkController = require('../controllers/HomeworkController');
const StudentController = require('../controllers/StudentController');
const FilesController = require('../controllers/FilesController');
const UserController = require('../controllers/UserController');

//protected routes

ApiRouter.get(
	'/getListOfHomeworks',
	AuthController.isStudent,
	HomeworkController.getListOfHomeworks
);
ApiRouter.get(
	'/getHomework/:homeworkPublicId',
	AuthController.isStudent,
	HomeworkController.getHomework
);

ApiRouter.post(
	'/user/changePassword',
	AuthController.isStudent,
	UserController.changePassword
);

ApiRouter.post(
	'/createHomework',
	AuthController.isTeacher,
	HomeworkController.createHomework
);

ApiRouter.post(
	'/homeworks/removeHomework',
	AuthController.isTeacher,
	HomeworkController.removeHomework
);

ApiRouter.post(
	'/addTask',
	AuthController.isTeacher,
	HomeworkController.addTask
);
ApiRouter.post(
	'/removeTask',
	AuthController.isTeacher,
	HomeworkController.removeTask
);
ApiRouter.post(
	'/sendHomework',
	AuthController.isTeacher,
	HomeworkController.sendHomework
);
ApiRouter.post(
	'/homeworks/removeGroup',
	AuthController.isTeacher,
	HomeworkController.removeGroup
);
ApiRouter.post(
	'/addGroup',
	AuthController.isTeacher,
	HomeworkController.addGroup
);
ApiRouter.post(
	'/removeStudent',
	AuthController.isTeacher,
	HomeworkController.removeStudent
);
ApiRouter.post(
	'/sendAnswers',
	AuthController.isStudent,
	HomeworkController.sendAnswers
);
ApiRouter.get(
	'/homeworks/getSolution/:homeworkPublicId.:solutionPublicId',
	AuthController.isStudent,
	HomeworkController.getSolution
);
ApiRouter.get(
	'/getStudentList',
	AuthController.isTeacher,
	StudentController.getStudentsByName
);
ApiRouter.get(
	'/getUserInfo/:publicId',
	AuthController.isStudent,
	UserController.getInfo
);
ApiRouter.get('/upload_files/:fileReference', FilesController.getFile);
ApiRouter.post('/checkSolution', AuthController.isTeacher, HomeworkController.checkSolution);
module.exports = ApiRouter;

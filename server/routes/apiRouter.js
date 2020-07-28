const express = require('express');
const apiRouter = express.Router();
const authController = require('../controllers/auth.controller');
const homeworkController = require('../controllers/homework.controller');
const userController = require('../controllers/user.controller');
const { body, validationResult } = require('express-validator');

const validationRules = () => {
	return [
		body('email')
			.isEmail()
			.isLength({ min: 10, max: 30 })
			.withMessage('Email length should be 10 to 30 characters'),
		body(
			'username',
			'Username length should be 8 to 20 characters'
		).isLength({
			min: 8,
			max: 20,
		}),
		body('password')
			.isLength({
				min: 8,
				max: 16,
			})
			.withMessage('Password length should be 8 to 16 characters')
			.has()
			.uppercase()
			.has()
			.lowercase()
			.withMessage('Password should contain uppercase and lowercase')
			.matches(/(?=.*\d)/)
			.withMessage('Password should contain numbers')
			.matches(/([a-zA-z0-9_-]*)/)
			.withMessage(
				'Password should contain only letters, numbers, - and _'
			),
		body('name')
			.isLength({
				min: 6,
				max: 30,
			})
			.withMessage('Name length should be 6 to 30 characters')
			.isAlpha()
			.withMessage('Name must be alphabetic'),
		check('homeworkPublicId')
			.isLength(21)
			.withMessage('PublicId should be 21 character long')
			.matches(/([a-zA-z0-9_-]*)/)
			.withMessage(
				'PublicId should contain only letters, numbers, - and _'
			),
		check('taskPublicId')
			.isLength(21)
			.withMessage('PublicId should be 21 character long')
			.matches(/([a-zA-z0-9_-]*)/)
			.withMessage(
				'PublicId should contain only letters, numbers, - and _'
			),
		check('startHomeworkId', 'startHomeworkId should be number > 0').isInt({
			min: 0,
		}),
	];
};

//open routes
apiRouter.post('/login', validationRules, authController.student.login);
apiRouter.post(
	'/registration',
	validationRules,
	authController.student.register
);

apiRouter.post('/teacher/login', validationRules, teacherController.login);
apiRouter.post(
	'/teacher/registration',
	validationRules,
	teacherController.register
);

//protected routes

apiRouter.get(
	'/homeworks/getByStudent',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.getByStudent
);
apiRouter.get(
	'/homeworks/getByTeacher',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.getByTeacher
);
/*apiRouter.post(
	'/changePassword',
	authController.checkHeader,
	authController.checkToken,
	userController.changePassword
);*/
apiRouter.get(
	'/homeworks/getPreviewsByTeacher',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.getPreviewsByTeacher
);
apiRouter.get(
	'/homeworks/getPreviewsByStudent',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.getPreviewsByStudent
);
apiRouter.post(
	'/homeworks/addHomework',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.addHomework
);
apiRouter.post(
	'/homeworks/removeHomework',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.removeHomework
);
apiRouter.post(
	'/homeworks/addTask',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.addTask
);
apiRouter.post(
	'/homeworks/removeTask',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.removeTask
);
apiRouter.post(
	'/homeworks/addStudent',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.addStudent
);
apiRouter.post(
	'/homeworks/removeGroup',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.removeGroup
);
apiRouter.post(
	'/homeworks/addGroup',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.addGroup
);
apiRouter.post(
	'/homeworks/removeStudent',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.removeStudent
);

module.exports = apiRouter;

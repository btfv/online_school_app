const express = require('express');
const apiRouter = express.Router();
const authController = require('../controllers/auth.controller');
const homeworkController = require('../controllers/homework.controller')
const userController = require('../controllers/user.controller');
//open routes
apiRouter.post('/login', authController.login);
apiRouter.post('/registration', authController.register);

apiRouter.post('/teacher/login', teacherController.login);
apiRouter.post('/teacher/registration', teacherController.register);

//protected routes
apiRouter.get(
	'/getProfile',
	authController.checkHeader,
	authController.checkToken,
	userController.getProfile
);
apiRouter.get(
	'/homeworks/getByUser',
	authController.checkHeader,
	authController.checkToken,
	homeworkController.getByUser
);
apiRouter.post(
	'/changePassword',
	authController.checkHeader,
	authController.checkToken,
	userController.changePassword
);
module.exports = apiRouter;

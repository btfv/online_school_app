const StudentModel = require('../models/StudentModel');
const bcrypt = require('bcrypt');
const secret = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
var passport = require('passport');
const { nanoid } = require('nanoid');
const TeacherModel = require('../models/TeacherModel');

const passwordHashCost = parseInt(process.env.PASSWORD_HASH_COST, 10);

var AuthController = {};
AuthController.student = {};
AuthController.teacher = {};

const checkCookie = (cookie) => {
	return typeof cookie !== 'undefined';
};
AuthController.isStudent = async (req, res, next) => {
	const cookie = req.cookies.Authorization;
	if (!checkCookie(cookie)) {
		return res.status(401).send();
	}
	await passport.authenticate(
		'jwt',
		{ session: false },
		async (error, user) => {
			if (!user) {
				return res.status(401).send();
			}
			if (error) {
				return res.status(400);
			}
			req.user = user;
			next();
		}
	)(req, res, next);
};
AuthController.isTeacher = async (req, res, next) => {
	const cookie = req.cookies.Authorization;
	if (!checkCookie(cookie)) {
		return res.status(401).send();
	}
	await passport.authenticate('jwt', { session: false }, (error, user) => {
		if (!user) {
			return res.status(401).send();
		}
		if (error) {
			return res.status(400);
		}
		if (!user.isTeacher) {
			return res.status(400).json({ error: "You aren't teacher" });
		}
		if (!user.hasAccess) {
			return res
				.status(400)
				.json({ error: 'You have to wait for admin approval' });
		}
		req.user = user;
		next();
	})(req, res, next);
};

AuthController.student.login = async (req, res, next) => {
	await passport.authenticate(
		'student-local',
		{ session: false },
		(error, studentDocument) => {
			if (error || !studentDocument) {
				return res.status(401);
			}
			const payload = {
				publicId: studentDocument.publicId,
				isTeacher: false,
			};
			req.login(payload, { session: false }, (error) => {
				if (error) {
					res.status(401).send({
						error,
					});
				}

				const token = jwt.sign(payload, secret, {
					expiresIn: '48h',
				});

				res.cookie('Authorization', 'Bearer ' + token, {
					//httpOnly: true,
					//secure: true,
					//sameSite: 'none'
				})
					.status(200)
					.json({
						name: studentDocument.name,
						publicId: studentDocument.publicId,
					});
			});
		}
	)(req, res);
};

AuthController.student.register = async (req, res, next) => {
	const { username, password, name, age } = req.body;

	try {
		if (!username || !password || !name || !age) {
			throw Error(
				'Req body should take the form { username, password, name, age }'
			);
		}
		const existingStudent = await StudentModel.findOne({
			username: username,
		}).exec();
		if (existingStudent) {
			throw Error('Student with this username already exists');
		}
		const publicId = nanoid();
		const passwordHash = await bcrypt.hash(password, passwordHashCost);
		const studentDocument = new StudentModel({
			username: username,
			passwordHash: passwordHash,
			name: name,
			publicId: publicId,
			age: age,
		});
		await studentDocument.save();

		res.status(201).send();
	} catch (error) {
		res.status(400).send({ error });
	}
};

AuthController.teacher.login = async (req, res, next) => {
	await passport.authenticate(
		'teacher-local',
		{ session: false },
		(error, teacherDocument) => {
			if (error || !teacherDocument) {
				return res.status(401);
			}
			const payload = {
				publicId: teacherDocument.publicId,
				isTeacher: true,
				hasAccess: teacherDocument.hasAccess,
			};

			req.login(payload, { session: false }, (error) => {
				if (error) {
					res.status(401).send();
				}

				const token = jwt.sign(payload, secret, {
					expiresIn: '48h',
				});
				res.cookie('Authorization', 'Bearer ' + token, {
					//httpOnly: true,
					//secure: true,
				})
					.status(200)
					.json({
						firstname: teacherDocument.firstname,
						lastname: teacherDocument.lastname,
						publicId: teacherDocument.publicId,
					});
			});
		}
	)(req, res, next);
};

AuthController.teacher.register = async (req, res, next) => {
	const { username, password, firstname, lastname, email } = req.body;

	try {
		if (!username || !password || !firstname || !lastname || !email) {
			throw Error(
				'Req body should take the form { username, password, firstname, lastname, email }'
			);
		}
		const existingTeacher = await TeacherModel.findOne({
			$or: [{ username }, { email }],
		});
		if (existingTeacher) {
			throw Error('Teacher with this username or email already exists');
		}
		const publicId = nanoid();
		const passwordHash = await bcrypt.hash(password, passwordHashCost);
		const teacherDocument = new TeacherModel({
			username,
			passwordHash,
			firstname,
			lastname,
			publicId,
			email,
		});
		await teacherDocument.save();

		res.status(201).send();
	} catch (error) {
		res.status(400);
	}
};
AuthController.logout = async (req, res, next) => {
	try {
		res.clearCookie('Authorization').status(200).send();
	} catch (error) {
		res.status(400);
	}
};

module.exports = AuthController;

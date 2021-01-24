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

AuthController.checkCookie = (req, res, next) => {
	const cookie = req.cookies.Authorization;
	if (typeof cookie !== 'undefined') {
		req.authorizationCookie = cookie;
		next();
	} else {
		res.status(403)
			.json({ status: 403, error: 'Cannot find Authorization cookie' })
			.send();
	}
};
AuthController.student.checkToken = async (req, res, next) => {
	await passport.authenticate(
		'jwt',
		{ session: false },
		async (error, token) => {
			if (error) {
				return res.status(400).json(error);
			}
			if (!token) {
				return res.status(401).json({ error: 'Incorrect token' });
			}
			try {
				const studentDocument = await StudentModel.findOne({
					publicId: token.publicId,
				})
					.select('_id publicId username passwordHash name')
					.exec()
					.then((result) => {
						if (!result) {
							throw Error(
								"Can't find student with this publicId"
							);
						}
						return result.toObject();
					});

				req.user = studentDocument;
				next();
			} catch (error) {
				return res
					.status(401)
					.send({ status: 401, error: error.toString() });
			}
		}
	)(req, res, next);
};

AuthController.teacher.checkToken = async (req, res, next) => {
	await passport.authenticate(
		'jwt',
		{ session: false },
		async (error, token) => {
			if (error) {
				return res.status(400).json({ error: error.toString() });
			}
			if (!token) {
				return res.status(401).json({ error: 'Incorrect token' });
			}
			try {
				const teacherDocument = await TeacherModel.findOne({
					publicId: token.publicId,
				})
					.select(
						'_id publicId username firstname lastname passwordHash hasAccess'
					)
					.exec()
					.then((result) => {
						if (!result) {
							throw Error(
								"Can't find teacher with this publicId"
							);
						}
						return result.toObject();
					});
				req.user = teacherDocument;
				next();
			} catch (error) {
				return res
					.status(401)
					.json({ status: 401, error: error.toString() });
			}
		}
	)(req, res, next);
};

AuthController.student.login = async (req, res, next) => {
	await passport.authenticate(
		'student-local',
		{ session: false },
		(error, studentDocument) => {
			if (error || !studentDocument) {
				return res.status(401).json({ error: error.toString() });
			}
			const payload = {
				publicId: studentDocument.publicId,
				isTeacher: false,
			};
			req.login(payload, { session: false }, (error) => {
				if (error) {
					res.status(401).send({
						status: 401,
						error: error.message,
					});
				}

				const token = jwt.sign(payload, secret, {
					expiresIn: '24h',
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
		res.status(400).send({ status: 400, error: error.message });
	}
};

AuthController.teacher.login = async (req, res, next) => {
	await passport.authenticate(
		'teacher-local',
		{ session: false },
		async (error, teacherDocument) => {
			if (error || !teacherDocument) {
				return res
					.status(401)
					.json({ status: 401, error: error.toString() });
			}
			const payload = {
				publicId: teacherDocument.publicId,
			};

			req.login(payload, { session: false }, (error) => {
				if (error) {
					res.status(401).json({
						status: 401,
						error: error.toString(),
					});
				}

				const token = jwt.sign(payload, secret, {
					expiresIn: '24h',
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
		res.status(400).json({ status: 400, error: error.toString() });
	}
};

AuthController.teacher.checkPermission = async (req, res, next) => {
	if (!req.user.hasAccess) {
		res.status(400).json({
			status: 400,
			error: 'You have to wait for admin approval',
		});
	} else {
		next();
	}
};

AuthController.logout = async (req, res, next) => {
	try {
		res.clearCookie('Authorization').status(200).send();
	} catch (error) {
		res.status(400).json({ status: 400, error: error.toString() });
	}
};

module.exports = AuthController;

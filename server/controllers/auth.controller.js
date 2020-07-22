const express = require('express');
const StudentModel = require('../models/StudentModel');
const bcrypt = require('bcrypt');
const secret = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
var passport = require('passport');
const { nanoid } = require('nanoid');
const TeacherModel = require('../models/TeacherModel');

const passwordHashCost = parseInt(process.env.PASSWORD_HASH_COST, 10);

const authController = {};

authController.checkHeader = (req, res, next) => {
	const header = req.headers.authorization;
	if (typeof header !== 'undefined') {
		next();
	} else {
		res.status(403).send();
	}
};

authController.student.checkToken = async (req, res, next) => {
	await passport.authenticate(
		'jwt',
		{ session: false },
		async (error, token) => {
			if (error) {
				return res.status(400).json(error).send();
			}
			if (!token) {
				return res
					.status(400)
					.json({ status: 400, message: 'Incorrect token' })
					.send();
			}
			try {
				const studentDocument = await StudentModel.findOne({
					publicId: token.publicId,
				})
					.select('_id publicId username passwordHash')
					.exec();

				req.user = studentDocument;
				next();
			} catch (error) {
				return res
					.status(400)
					.send({ status: 400, message: error.message });
			}
		}
	)(req, res, next);
};

authController.teacher.checkToken = async (req, res, next) => {
	await passport.authenticate(
		'jwt',
		{ session: false },
		async (error, token) => {
			if (error) {
				return res.status(400).json(error).send();
			}
			if (!token) {
				return res
					.status(400)
					.json({ status: 400, message: 'Incorrect token' })
					.send();
			}
			try {
				const teacherDocument = await TeacherModel.findOne({
					publicId: token.publicId,
				})
					.select('_id publicId username passwordHash')
					.exec();

				req.user = teacherDocument;
				next();
			} catch (error) {
				return res
					.status(400)
					.send({ status: 400, message: error.message });
			}
		}
	)(req, res, next);
};

authController.student.login = async (req, res, next) => {
	await passport.authenticate(
		'student-local',
		{ session: false },
		(error, studentDocument) => {
			if (error || !studentDocument) {
				return res
					.status(401)
					.send({ status: 401, message: error.message });
			}
			const payload = {
				publicId: studentDocument.publicId,
				isTeacher: false,
			};

			req.login(payload, { session: false }, (error) => {
				if (error) {
					res.status(401).send({
						status: 401,
						message: error.message,
					});
				}

				const token = jwt.sign(payload, secret, {
					expiresIn: '24h',
				});

				res.status(200)
					.cookie('Authorization', 'Bearer ' + token, {
						httpOnly: true,
						secure: true,
					})
					.send();
			});
		}
	)(req, res);
};

authController.student.register = async (req, res, next) => {
	const { username, password, name, age } = req.body;

	try {
		if (!username || !password || !name || !age) {
			throw Error(
				'Req body should take the form { username, password, firstname, lastname }'
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

		res.status(201).send({
			status: 201,
			message: 'Successfull registered',
		});
	} catch (error) {
		res.status(400).send({ status: 400, message: error.message });
	}
};

authController.teacher.login = async (req, res, next) => {
	await passport.authenticate(
		'teacher-local',
		{ session: false },
		async (error, teacherDocument) => {
			if (error || !teacherDocument) {
				return res
					.status(401)
					.send({ status: 401, message: error.message });
			}
			const payload = {
				publicId: teacherDocument.publicId,
				isTeacher: true,
			};

			req.login(payload, { session: false }, (error) => {
				if (error) {
					res.status(401).send({
						status: 401,
						message: error.message,
					});
				}

				const token = jwt.sign(payload, secret, {
					expiresIn: '24h',
				});

				res.status(200)
					.cookie('Authorization', 'Bearer ' + token, {
						httpOnly: true,
						secure: true,
					})
					.send();
			});
		}
	)(req, res, next);
};

authController.teacher.register = async (req, res, next) => {
	const { username, password, name } = req.body;

	try {
		if (!username || !password || !name) {
			throw Error(
				'Req body should take the form { username, password, name }'
			);
		}
		const existingTeacher = await TeacherModel.findOne({
			username: username,
		});
		if (existingTeacher) {
			throw Error('Teacher with this username already exists');
		}
		const publicId = nanoid();
		const passwordHash = await bcrypt.hash(password, passwordHashCost);
		const teacherDocument = new TeacherModel({
			username: username,
			passwordHash: passwordHash,
			name: name,
			publicId: publicId,
		});
		await teacherDocument.save();

		res.status(201).send({
			status: 201,
			message: 'Successfull registered',
		});
	} catch (error) {
		res.status(400).send({ status: 400, message: error.message });
	}
};

authController.teacher.checkPermission = async (req, res, next) => {
	try {
		if (!req.user.isTeacher) {
			throw Error("You aren't teacher");
		}
	} catch (error) {
		res.status(400).send({ status: 400, message: error.message });
	}
};

module.exports = authController;

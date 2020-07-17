const express = require('express');
const UserModel = require('../models/StudentModel');
const bcrypt = require('bcrypt');
const secret = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
var passport = require('passport');

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

authController.checkToken = async (req, res, next) => {
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
				const userDocument = await UserModel.findById(token._id)
					.select('_id username passwordHash')
					.exec();

				req.user = userDocument;
				next();
			} catch (error) {
				return res
					.status(400)
					.send({ status: 400, message: error.message });
			}
		}
	)(req, res, next);
};

authController.login = async (req, res, next) => {
	await passport.authenticate(
		'user-local',
		{ session: false },
		(error, userDocument) => {
			if (error || !userDocument) {
				return res
					.status(401)
					.send({ status: 401, message: error.message });
			}
			/** This is what ends up in our JWT */
			const payload = {
				_id: userDocument._id,
				isTeacher: false,
			};

			/** assigns payload to req.user */
			req.login(payload, { session: false }, (error) => {
				if (error) {
					res.status(401).send({
						status: 401,
						message: error.message,
					});
				}

				/** generate a signed json web token and return it in the response */
				const token = jwt.sign(payload, secret, {
					expiresIn: '24h',
				});

				/** assign our jwt to the cookie */
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

authController.register = async (req, res, next) => {
	const { username, password, firstname, lastname } = req.body;

	try {
		if (!username || !password || !firstname || !lastname) {
			throw Error(
				'Req body should take the form { username, password, firstname, lastname }'
			);
		}
		const existingUser = await UserModel.findOne({
			username: username,
		}).exec();
		if (existingUser) {
			throw Error('Student with this username already exists');
		}

		const passwordHash = await bcrypt.hash(password, passwordHashCost);
		const userDocument = new UserModel({
			username,
			passwordHash,
			firstname,
			lastname,
		});
		await userDocument.save();

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
		async (error, userDocument) => {
			if (error || !userDocument) {
				return res
					.status(401)
					.send({ status: 401, message: error.message });
			}
			/** This is what ends up in our JWT */
			const payload = {
				_id: userDocument._id,
				isTeacher: true,
			};

			/** assigns payload to req.user */
			req.login(payload, { session: false }, (error) => {
				if (error) {
					res.status(401).send({
						status: 401,
						message: error.message,
					});
				}

				/** generate a signed json web token and return it in the response */
				const token = jwt.sign(payload, secret, {
					expiresIn: '24h',
				});

				/** assign our jwt to the cookie */
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
	const { username, password, firstname, lastname } = req.body;

	try {
		if (!username || !password || !firstname || !lastname) {
			throw Error(
				'Req body should take the form { username, password, firstname, lastname }'
			);
		}
		const existingUser = await TeacherModel.findOne({
			username: username,
		}).exec();
		if (existingUser) {
			throw Error('Teacher with this username already exists');
		}

		const passwordHash = await bcrypt.hash(password, passwordHashCost);
		const userDocument = new TeacherModel({
			username,
			passwordHash,
			firstname,
			lastname,
		});
		await userDocument.save();

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
			throw Error('You aren\'t teacher');
		}
		
	} catch (error) {
		res.status(400).send({ status: 400, message: error.message });
	}
};

module.exports = authController;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt');
const secret = process.env.SECRET_KEY;

const StudentModel = require('../models/StudentModel');
const TeacherModel = require('../models/TeacherModel');

passport.use(
	'student-local',
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
		},
		async (username, password, done) => {
			try {
				const studentDocument = await StudentModel.findOne({
					username: username,
				})
					.select('_id publicId username name passwordHash')
					.exec();
				const passwordsMatch = await bcrypt.compare(
					password,
					studentDocument.passwordHash
				);
				if (passwordsMatch) {
					return done(null, studentDocument);
				} else {
					return done(Error('Incorrect Username / Password'), null);
				}
			} catch (error) {
				return res.status(400).json(Error(error)).send();
			}
		}
	)
);
passport.use(
	'teacher-local',
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
		},
		async (username, password, done) => {
			try {
				const teacherDocument = await TeacherModel.findOne({
					username: username,
				})
					.select('_id publicId username name passwordHash')
					.exec();
				const passwordsMatch = await bcrypt.compare(
					password,
					teacherDocument.passwordHash
				);
				if (passwordsMatch) {
					return done(null, teacherDocument);
				} else {
					return done(Error('Incorrect Username / Password'), null);
				}
			} catch (error) {
				return done(Error(error.message), null);
			}
		}
	)
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
				let jwt = req.authorizationCookie.split(' ')[1];
				return jwt;
			}]),
			secretOrKey: secret,
		},
		async (token, done) => {
			try {
				done(null, token);
			} catch (error) {
				done(error, null);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((_id, done) => {
	User.findById(_id, (err, user) => {
		if (err) {
			done(null, false, { error: err });
		} else {
			done(null, user);
		}
	});
});

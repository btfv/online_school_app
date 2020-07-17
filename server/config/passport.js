const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt');
const secret = process.env.SECRET_KEY;

const UserModel = require('../models/StudentModel');

passport.use(
	'user-local',
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
		},
		async (username, password, done) => {
			try {
				const userDocument = await UserModel.findOne({
					username: username,
				})
					.select('_id passwordHash')
					.exec();
				const passwordsMatch = await bcrypt.compare(
					password,
					userDocument.passwordHash
				);
				if (passwordsMatch) {
					return done(null, userDocument);
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
				const userDocument = await TeacherModel.findOne({
					username: username,
				})
					.select('_id passwordHash')
					.exec();
				const passwordsMatch = await bcrypt.compare(
					password,
					userDocument.passwordHash
				);
				if (passwordsMatch) {
					return done(null, userDocument);
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
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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

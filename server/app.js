var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.SECRET_KEY;

var mongoose = require('mongoose');
var mongoDBaddress = process.env.DATABASE_ADDRESS;
mongoose.connect(mongoDBaddress, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(
	fileUpload({
		createParentPath: true,
	})
);
app.use(cookieParser(secret));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: secret, resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const studentFrontendAddress = process.env.STUDENT_FRONTEND_ADDRESS;
const teacherFrontendAddress = process.env.TEACHER_FRONTEND_ADDRESS;
var allowlist = [studentFrontendAddress, teacherFrontendAddress]
var corsOptions = {
	origin: allowlist,
	credentials:  true
  }  
app.use(cors(corsOptions));

app.use(logger('dev'));

require('./config/passport');
var apiRouter = require('./routes/apiRouter');
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500).send(err.message);
});

module.exports = app;

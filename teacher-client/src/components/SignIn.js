import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { TextField } from 'redux-form-material-ui/src';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from './Copyright';
import { Field, reduxForm } from 'redux-form';
import { userActions } from '../redux/actions/userActions';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

let SignIn = (props) => {
	const { handleSubmit, loggingIn, login } = props;
	const classes = useStyles();

	return (
		<React.Fragment>
			<Backdrop className={classes.backdrop} open={loggingIn}>
				<CircularProgress color='inherit' />
			</Backdrop>
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
					<form
						className={classes.form}
						noValidate
						onSubmit={handleSubmit(login)}
					>
						<Field
							variant='outlined'
							margin='normal'
							required
							fullWidth
							id='username'
							label='Username'
							name='username'
							autoComplete='username'
							autoFocus
							component={TextField}
						/>
						<Field
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							autoComplete='current-password'
							component={TextField}
						/>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
							className={classes.submit}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href='#' variant='body2'>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link
									variant='body2'
									component={RouterLink}
									to='/signup'
								>
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
				<Box mt={8}>
					<Copyright />
				</Box>
			</Container>
		</React.Fragment>
	);
};
const mapStateToProps = (state) => {
	return {
		loggingIn: state.authReducer.loggingIn,
	};
};
const actionCreators = {
	login: userActions.login,
};

SignIn = reduxForm({
	form: 'signInForm',
})(SignIn);
SignIn = connect(mapStateToProps, actionCreators)(SignIn);
export default SignIn;

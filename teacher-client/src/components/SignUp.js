import React from 'react';
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
import { connect } from 'react-redux';
import { userActions } from '../redux/actions/userActions';

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
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

let SignUp = (props) => {
	const classes = useStyles();
	const { handleSubmit, register } = props;
	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign up
				</Typography>
				<form
					className={classes.form}
					noValidate
					onSubmit={handleSubmit(register)}
				>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<Field
								autoComplete='fname'
								name='firstname'
								variant='outlined'
								required
								fullWidth
								id='firstname'
								label='First Name'
								autoFocus
								component={TextField}
							></Field>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Field
								variant='outlined'
								required
								fullWidth
								id='lastname'
								label='Last Name'
								name='lastname'
								autoComplete='lname'
								component={TextField}
							/>
						</Grid>
						<Grid item xs={12}>
							<Field
								variant='outlined'
								required
								fullWidth
								id='email'
								label='Email Address'
								name='email'
								autoComplete='email'
								component={TextField}
							/>
						</Grid>
						<Grid item xs={12}>
							<Field
								variant='outlined'
								required
								fullWidth
								id='username'
								label='Username'
								name='username'
								autoComplete='username'
								component={TextField}
							/>
						</Grid>
						<Grid item xs={12}>
							<Field
								variant='outlined'
								required
								fullWidth
								name='password'
								label='Password'
								type='password'
								id='password'
								autoComplete='current-password'
								component={TextField}
							/>
						</Grid>
					</Grid>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}
					>
						Sign Up
					</Button>
					<Grid container justify='flex-end'>
						<Grid item>
							<Link
								variant='body2'
								component={RouterLink}
								to='/signin'
							>
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
			<Box mt={5}>
				<Copyright />
			</Box>
		</Container>
	);
};
const actionCreators = {
	register: userActions.register,
};

const mapStateToProps = (state) => {
	return {
		registering: state.authReducer.registering,
	};
};
SignUp = reduxForm({
	form: 'signUpForm',
})(SignUp);
SignUp = connect(mapStateToProps, actionCreators)(SignUp);
export default SignUp;

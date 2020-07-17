import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import Copyright from './Copyright';
import { connect } from 'react-redux';
import { userActions } from '../actions/userActions';
import { CircularProgress } from '@material-ui/core';
import { Backdrop } from '@material-ui/core';

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
		'z-index': 999,
	},
}));

function Auth(props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(false);

	function handleSubmit(e) {
		e.preventDefault();
		if (username && password) {
			props.login(username, password, remember);
		}
	}

	function handleChange(e) {
		const { name, value, checked } = e.target;
		switch (name) {
			case 'username': {
				setUsername(value);
				break;
			}
			case 'password': {
				setPassword(value);
				break;
			}
			case 'remember': {
				setRemember(checked);
				break;
			}
			default: {
				break;
			}
		}
	}
	const classes = useStyles();

	const backdropElements = (
		<Backdrop
			className={classes.backdrop}
			open={true}
		>
			<CircularProgress />
		</Backdrop>
	);

	return (
		<>
			{props.isLoggingIn ? backdropElements : ''}
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component='h1' variant='h5'>
						Вход
					</Typography>
					<form
						className={classes.form}
						noValidate
						onSubmit={handleSubmit}
					>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							id='username'
							label='Имя пользователя'
							name='username'
							autoComplete='username'
							autoFocus
							value={username}
							onChange={handleChange}
						/>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='password'
							label='Пароль'
							type='password'
							id='password'
							autoComplete='current-password'
							value={password}
							onChange={handleChange}
						/>
						<FormControlLabel
							control={
								<Checkbox
									value='remember'
									name='remember'
									color='primary'
									checked={remember}
									onChange={handleChange}
								/>
							}
							label='Запомнить меня'
						/>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
							className={classes.submit}
						>
							Войти
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href='#' variant='body2'>
									Забыли пароль?
								</Link>
							</Grid>
							<Grid item>
								<Link href='/signup' variant='body2'>
									{'У Вас нет аккаунта? Зарегистрируйтесь'}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
				<Box mt={8}>
					<Copyright />
				</Box>
			</Container>
		</>
	);
}

function mapStateToProps(state) {
	const { loggingIn } = state;
	return { loggingIn };
}

const actionCreatorsToProps = {
	login: userActions.login,
	logout: userActions.logout,
};

const connectedAuthPage = connect(mapStateToProps, actionCreatorsToProps)(Auth);
export { connectedAuthPage as Auth };

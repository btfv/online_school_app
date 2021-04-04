import React, { useState } from 'react';
import {
	makeStyles,
	CssBaseline,
	Typography,
	Container,
	Button,
	CircularProgress,
	Avatar,
} from '@material-ui/core';
import BackLink from './BackLink';
import { reduxForm, Field } from 'redux-form';
import { TextField as TextFieldReduxForm } from 'redux-form-material-ui/src';
import { connect } from 'react-redux';
import { userActions } from '../redux/actions/userActions';
import FileInput from './AddHomeworkComponents/FileInput';
import { profileActions } from '../redux/actions/profileActions';
import config from '../config';

const useStyles = makeStyles((theme) => ({
	root: {
		'flex-wrap': 'wrap',
		display: 'flex',
		'justify-content': 'center',
		padding: '0 10px',
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(2, 0, 6),
	},
	formFields: {
		margin: theme.spacing(2),
	},
	formSymbitButton: {
		minWidth: 200,
	},
	invisibleTextField: {
		display: 'none',
	},
	avatarSize: {
		width: '10em',
		height: '10em',
		display: 'inline-block',
		margin: 'auto',
	},
	centerCircle: {
		position: 'fixed',
		'align-items': 'center',
		display: 'flex',
		padding: 0,
		height: '90%',
	},
}));

const validate = (values) => {
	const errors = {};
	if (values.newPassword !== values.newPasswordRepeat) {
		errors.newPasswordRepeat = 'Values are different!';
	}
	return errors;
};

var TeacherProfile = (props) => {
	const {
		history,
		handleSubmit,
		changePassword,
		uploadPicture,
		uploadingPicture,
		loadingProfile,
		loadedProfile,
		profile,
		getProfile,
	} = props;
	const classes = useStyles();

	if (loadingProfile) {
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}
	if (!loadedProfile && !loadingProfile) {
		getProfile();
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}
	if (profile)
		return (
			<React.Fragment>
				<CssBaseline />
				<main>
					<div className={classes.heroContent}>
						<BackLink history={history} />
						<Container maxWidth='sm'>
							<Typography
								component='h2'
								variant='h3'
								align='center'
								color='textPrimary'
								gutterBottom
							>
								Teacher Profile
							</Typography>
							<div>
								<Typography
									variant='h6'
									align='center'
									color='textPrimary'
									gutterBottom
								>
									Your name
								</Typography>
								<Typography
									variant='body1'
									align='center'
									color='textPrimary'
									gutterBottom
								>
									{profile.firstname + ' ' + profile.lastname}
								</Typography>
							</div>
							<div>
								<Typography
									variant='h6'
									align='center'
									color='textPrimary'
									gutterBottom
								>
									Your profile picture
								</Typography>
								{profile.profilePictureRef ? (
									<div>
										<Avatar
											className={classes.avatarSize}
											src={
												config.API_URL +
												'/api/get_avatar/' +
												profile.profilePictureRef
											}
										/>
									</div>
								) : (
									''
								)}
								{!uploadingPicture ? (
									<form
										onChange={() =>
											setTimeout(
												handleSubmit((params) =>
													uploadPicture(params)
												)
											)
										}
									>
										<label htmlFor='picture-input'>
											<Button
												variant='contained'
												color='primary'
												component='span'
											>
												{profile.profilePictureRef
													? 'Change'
													: 'Upload'}{' '}
												Profile picture
											</Button>
										</label>
										<Field
											className={
												classes.invisibleTextField
											}
											name='picture'
											id='picture-input'
											multiple={true}
											component={FileInput}
											fullWidth={true}
											multiple={false}
											value={null}
										/>
									</form>
								) : (
									<CircularProgress />
								)}
							</div>
							<div>
								<Typography
									variant='h6'
									align='center'
									color='textPrimary'
									gutterBottom
								>
									Change Password
								</Typography>
								<form onSubmit={handleSubmit(changePassword)}>
									<div className={classes.formFields}>
										<Field
											required
											type='password'
											name='oldPassword'
											component={TextFieldReduxForm}
											label='Current Password'
											variant='outlined'
										/>
									</div>
									<div className={classes.formFields}>
										<Field
											required
											type='password'
											name='newPassword'
											component={TextFieldReduxForm}
											label='New Password'
											variant='outlined'
										/>
									</div>
									<div className={classes.formFields}>
										<Field
											required
											type='password'
											name='newPasswordRepeat'
											component={TextFieldReduxForm}
											label='New Password Again'
											variant='outlined'
										/>
									</div>
									<div className={classes.formFields}>
										<Button
											type='submit'
											variant='contained'
											color='primary'
											className={classes.formSymbitButton}
										>
											Change Password
										</Button>
									</div>
								</form>
							</div>
						</Container>
					</div>
				</main>
			</React.Fragment>
		);
	return '';
};
TeacherProfile = reduxForm({
	form: 'profileForm',
	validate,
})(TeacherProfile);

const mapStateToProps = (state) => {
	const {
		uploadingPicture,
		uploadedPicture,
		loadingProfile,
		loadedProfile,
		profile,
	} = state.profileReducer;
	const { changingPassword } = state.authReducer;
	return {
		uploadingPicture,
		uploadedPicture,
		changingPassword,
		loadingProfile,
		loadedProfile,
		profile,
	};
};

const actionCreators = {
	uploadPicture: profileActions.uploadPicture,
	changePassword: userActions.changePassword,
	getProfile: profileActions.getProfile,
};

export default connect(mapStateToProps, actionCreators)(TeacherProfile);

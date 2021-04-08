import { Avatar, Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import config from '../config';

const useStyles = makeStyles((theme) => ({
	teacherInfoBox: {
		padding: '10px',
		display: 'flex',
		'align-items': 'center',
		width: '300px',
		margin: 'auto',
	},
	teacherInfoAvatar: {
		float: 'left',
	},
	teacherInfoText: {
		float: 'right',
		width: '100%',
	},
	avatarSize: {
		width: '5em',
		height: '5em',
		display: 'inline-block',
		margin: 'auto',
	},
}));

const TeacherInfoBox = function (props) {
	const { profile, text } = props;
	const classes = useStyles();
	return (
		<Box
			className={classes.teacherInfoBox}
			border={2}
			borderColor='text.secondary'
			borderRadius={16}
		>
			<div className={classes.teacherInfoAvatar}>
				<Avatar
					className={classes.avatarSize}
					src={
						config.API_URL +
						'/api/get_avatar/' +
						profile.profilePictureRef
					}
				/>
			</div>
			<div className={classes.teacherInfoText}>
				<Typography className={classes.taskText} variant='subtitle1'>
					{text}
				</Typography>
				<Typography
					variant='h5'
					align='center'
					color='textSecondary'
					paragraph
				>
					{profile.firstname + ' ' + profile.lastname}
				</Typography>
			</div>
		</Box>
	);
};

export default TeacherInfoBox;

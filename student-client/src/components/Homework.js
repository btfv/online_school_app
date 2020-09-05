import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { homeworkActions } from '../redux/actions/homeworkActions';
import { CircularProgress } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Copyright from './Copyright';
import AttachmentPanel from './AttachmentPanel';
import Task from './Task';
import { reduxForm, FieldArray, Field } from 'redux-form';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
	icon: {
		marginRight: theme.spacing(2),
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(6, 0, 6),
	},
	heroButtons: {
		marginTop: theme.spacing(4),
	},
	cardGrid: {
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
	},
	card: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	cardMedia: {
		paddingTop: '56.25%', // 16:9
	},
	cardContent: {
		flexGrow: 1,
	},
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(6),
	},
	tasks: {},
	backLink: { display: 'flex', position: 'absolute', 'margin-left': 30 },
	sendHomework: {
		'min-width': 200,
		'max-width': 300,
	},
	arrowIcon: {
		'padding-left': 6,
	},
}));

let Homework = (props) => {
	const {
		handleSubmit,
		homework,
		gettingHomework,
		sendSolution,
		getHomework,
		firstAttempt,
	} = props;
	const { publicId } = props.match.params;
	const classes = useStyles();
	var content = ' ';
	if (
		Object.keys(homework).length == 0 &&
		!gettingHomework &&
		!firstAttempt
	) {
		getHomework(publicId);
	}
	if (Object.keys(homework).length != 0 && !gettingHomework) {
		let attachments = '';
		if (homework.attachments) {
			attachments = homework.attachments.map((attachment) => {
				return (
					<AttachmentPanel
						name={attachment.name}
						reference={attachment.reference}
					/>
				);
			});
		}
		content = (
			<React.Fragment>
				<CssBaseline />
				<main>
					{/* Hero unit */}
					<div className={classes.heroContent}>
						<div className={classes.backLink}>
							<IconButton
								component={Link}
								to='/dashboard/homeworks'
							>
								<ArrowBackIosIcon
									fontSize='large'
									className={classes.arrowIcon}
								/>
							</IconButton>
						</div>
						<Container maxWidth='sm'>
							<Typography
								component='h2'
								variant='h3'
								align='center'
								color='textPrimary'
								gutterBottom
							>
								{homework.title}
							</Typography>
							<Typography
								variant='h5'
								align='center'
								color='textSecondary'
								paragraph
							>
								{homework.description}
							</Typography>
							<div className={classes.heroButtons}>
								{attachments}
							</div>
							<div className={classes.tasks}>
								<Typography
									variant='h4'
									align='center'
									paragraph
								>
									Tasks
								</Typography>
								{(!homework.tasks || homework.tasks.length == 0) ? (
									<Typography
										variant='body1'
										color='error'
										align='center'
										paragraph
									>
										There is no tasks
									</Typography>
								) : (
									''
								)}
								<form
									noValidate
									onSubmit={handleSubmit(sendSolution)}
								>
									{homework.tasks.map((task, index) => {
										return (
											<Task
												taskIndex={index}
												task={task}
											/>
										);
									})}
									<Button
										type='submit'
										fullWidth
										variant='contained'
										color='primary'
										className={classes.sendHomework}
									>
										Send Homework
									</Button>
								</form>
							</div>
						</Container>
					</div>
				</main>
				{/* Footer */}
				<footer className={classes.footer}>
					<Copyright />
				</footer>
				{/* End footer */}
			</React.Fragment>
		);
	}
	return (
		<div>
			{props.gettingHomework ? <CircularProgress /> : ''}
			{content}
		</div>
	);
};
Homework = reduxForm({ form: 'homeworkForm' })(Homework);

const mapStateToProps = (state) => {
	const { homework, gettingHomework, firstAttempt } = state.homeworkReducer;
	return {
		homework,
		gettingHomework,
		firstAttempt,
	};
};

const actionCreators = {
	getHomework: homeworkActions.getHomework,
	sendSolution: homeworkActions.sendSolution,
};

export default connect(mapStateToProps, actionCreators)(Homework);

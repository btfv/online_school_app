import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { homeworkActions } from '../redux/actions/homeworkActions';
import {
	CircularProgress,
	MenuItem,
	FormControlLabel,
	Table,
} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Copyright from './Copyright';
import AttachmentPanel from './AttachmentPanel';
import { reduxForm, FieldArray, Field } from 'redux-form';
import { TextField, Select, Checkbox } from 'redux-form-material-ui/src';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ReceivedStudentsTable from './HomeworkComponents/ReceivedStudentsTable';
import BackLink from './BackLink';
import { homeworkListActions } from '../redux/actions/homeworkListActions';
import { receivedStudentsActions } from '../redux/actions/receivedStudentsActions';
import TaskCarousel from './HomeworkComponents/TaskCarousel';
import ReceivedTeachersTable from './HomeworkComponents/ReceivedTeachersTable';

const useStyles = makeStyles((theme) => ({
	root: {
		'flex-wrap': 'wrap',
		width: '100%',
		display: 'flex',
		'justify-content': 'center',
	},
	icon: {
		marginRight: theme.spacing(2),
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(2, 0, 6),
	},
	heroButtons: {
		//marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
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
	sendHomework: {
		'min-width': 200,
		'max-width': 300,
	},
	removeHomeworkButton: {
		'min-width': 240,
		'max-width': 300,
		margin: theme.spacing(4),
	},
	arrowIcon: {
		'padding-left': 6,
	},
	textField: {
		marginBottom: theme.spacing(2),
		minWidth: 125,
		maxWidth: 400,
		display: 'flex',
		'margin-left': 'auto',
		'margin-right': 'auto',
	},
	multilineTextField: {
		minWidth: 125,
		maxWidth: 400,
		'margin-bottom': theme.spacing(2),
	},
	addTaskForm: {
		//'margin-top': theme.spacing(2),
		'margin-bottom': theme.spacing(2),
	},
	centerCircle: {
		position: 'fixed',
		'align-items': 'center',
		display: 'flex',
		padding: 0,
		height: '90%',
	},
}));

var Homework = (props) => {
	const {
		handleSubmit,
		homework,
		gettingHomework,
		getHomework,
		addTask,
		addedTask,
		history,
		removeHomework,
		clearHomeworkList,
		clearHomework,
		clearReceivedStudentsList,
	} = props;
	const { publicId } = props.match.params;
	const classes = useStyles();

	const [openAddTaskForm, setOpenAddTaskForm] = useState(false);
	const [addTaskType, setAddTaskType] = useState();

	if (homework && publicId !== homework.publicId) {
		clearHomework();
		clearReceivedStudentsList();
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}

	if (!gettingHomework && !homework) {
		getHomework(publicId);
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}

	if (gettingHomework) {
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}

	if (addedTask) {
		getHomework(publicId);
		openAddTaskForm ? setOpenAddTaskForm(false) : null;
	}

	if (homework) {
		const attachments = homework.attachments.map((attachment) => {
			return (
				<AttachmentPanel
					name={attachment.name}
					reference={attachment.reference}
				/>
			);
		});
		const renderOptions = ({ fields }) => (
			<div className={classes.options}>
				<IconButton onClick={() => fields.push({})}>
					<AddIcon fontSize='small' />
				</IconButton>
				{fields.map((field, index) => (
					<React.Fragment>
						<Typography variant='body1'>
							Option #{index + 1}
						</Typography>
						<IconButton onClick={() => fields.remove(index)}>
							<DeleteOutlineIcon fontSize='small' />
						</IconButton>
						<Field
							name={field + '.optionText'}
							id='outlined-basic'
							label='Option Text'
							variant='outlined'
							className={classes.textField}
							component={TextField}
						/>
						<FormControlLabel
							control={
								<Field
									component={Checkbox}
									name={field + '.optionIsCorrect'}
									type='checkbox'
								/>
							}
							label='Is option correct?'
						/>
					</React.Fragment>
				))}
			</div>
		);
		const renderStringAnswer = () => (
			<Field
				name='taskStringAnswer'
				id='outlined-basic'
				label='Answer'
				variant='outlined'
				className={classes.textField}
				component={TextField}
			/>
		);
		const addTaskForm = (
			<form onSubmit={handleSubmit(addTask)}>
				<Field
					name='taskText'
					id='outlined-basic'
					label='Task Text'
					variant='outlined'
					className={classes.textField}
					component={TextField}
				/>
				<Field
					name='taskPoints'
					id='outlined-basic'
					label='Points For Task'
					variant='outlined'
					type='number'
					className={classes.textField}
					component={TextField}
				/>
				<Field
					name='taskType'
					id='outlined-basic'
					variant='outlined'
					component={Select}
					className={classes.textField}
					onChange={(event, newValue, oldValue) =>
						setAddTaskType(newValue)
					}
				>
					<MenuItem value='options'>Options</MenuItem>
					<MenuItem value='stringAnswer'>String Answer</MenuItem>
					<MenuItem value='detailedAnswer'>Detailed Answer</MenuItem>
				</Field>
				{(() => {
					switch (addTaskType) {
						case 'options':
							return (
								<FieldArray
									name='optionList'
									component={renderOptions}
								/>
							);
						case 'stringAnswer':
							return renderStringAnswer();
						default:
							return '';
					}
				})()}
				<Button
					type='submit'
					fullWidth
					variant='contained'
					color='primary'
					className={classes.sendHomework}
				>
					Add Task
				</Button>
			</form>
		);
		return (
			<React.Fragment>
				<CssBaseline />
				<main>
					{/* Hero unit */}
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
							{attachments ? (
								<div className={classes.heroButtons}>
									{attachments}
								</div>
							) : (
								''
							)}
							<div className={classes.tasks}>
								<div className={classes.heroButtons}>
									<Typography
										variant='h4'
										align='center'
										paragraph
									>
										Tasks
									</Typography>
									{homework.tasks.length ? (
										<TaskCarousel
											tasks={homework.tasks}
											homeworkPublicId={publicId}
										/>
									) : (
										<Typography
											variant='body1'
											align='center'
											paragraph
										>
											No tasks
										</Typography>
									)}
								</div>
								<div className={classes.heroButtons}>
									<Typography
										variant='h4'
										align='center'
										paragraph
									>
										Add Task
									</Typography>
									<div className={classes.addTaskForm}>
										<IconButton
											onClick={() => {
												setOpenAddTaskForm(
													!openAddTaskForm
												);
											}}
										>
											<AddIcon fontSize='large' />
										</IconButton>
										{openAddTaskForm ? addTaskForm : ''}
									</div>
								</div>
								<div className={classes.heroButtons}>
									<Typography
										variant='h4'
										align='center'
										paragraph
									>
										Received Students
									</Typography>
									<ReceivedStudentsTable
										homeworkPublicId={publicId}
									/>
								</div>
								<div className={classes.heroButtons}>
									<Typography
										variant='h4'
										align='center'
										paragraph
									>
										Received Teachers
									</Typography>
									<ReceivedTeachersTable
										homeworkPublicId={publicId}
									/>
								</div>
								<Button
									variant='outlined'
									color='secondary'
									align='center'
									paragraph
									className={classes.removeHomeworkButton}
									onClick={() => {
										removeHomework(publicId);
									}}
								>
									Remove Homework
								</Button>
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
	return <div></div>;
};
Homework = reduxForm({ form: 'addTaskForm' })(Homework);

const mapStateToProps = (state) => {
	const {
		homework,
		gettingHomework,
		firstAttempt,
		addedTask,
	} = state.homeworkReducer;
	return {
		homework,
		gettingHomework,
		firstAttempt,
		addedTask,
	};
};

const actionCreators = {
	getHomework: homeworkActions.getHomework,
	addTask: homeworkActions.addTask,
	removeHomework: homeworkActions.removeHomework,
	clearHomeworkList: homeworkListActions.clearList,
	clearHomework: homeworkActions.clearHomework,
	clearReceivedStudentsList: receivedStudentsActions.clearStudentList,
};

export default connect(mapStateToProps, actionCreators)(Homework);

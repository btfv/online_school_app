import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { homeworkActions } from '../redux/actions/homeworkActions';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
	root: {
		margin: '20px auto',
	},
	attachmentName: {
		'margin-left': 5,
		display: 'inline-block',
		top: '50%',
		transform: 'translateY(-50%)',
	},
	formControl: {
		minWidth: 125,
		maxWidth: 400,
		display: 'flex',
		'margin-left': 'auto',
		'margin-right': 'auto',
	},
	textField: {
		margin: theme.spacing(2),
		minWidth: 200,
		maxWidth: 600,
		display: 'flex',
		'margin-left': 'auto',
		'margin-right': 'auto',
	},
	taskHeader: {
		'margin-bottom': theme.spacing(1),
		padding: 0,
		display: 'inline-flex',
	},
	taskHeaderText: {
		margin: 'auto',
	},
	grade: {
		'margin-top': theme.spacing(2),
	},
	condition: {
		'margin-bottom': theme.spacing(1),
	},
	optionsForm: {
		margin: 'auto',
	},
}));

var Task = (props) => {
	const classes = useStyles();
	const { task, taskIndex, removeTask, homeworkPublicId } = props;

	const optionsForm = (labels, answers) => {
		return (
			<div className={classes.optionsForm}>
				<Typography variant='subtitle2'>Answer options:</Typography>
				{labels.map((label, index) => {
					return (
						<FormControlLabel
							control={
								<Checkbox
									checked={Boolean(answers[index])}
									color='primary'
								/>
							}
							label={label}
							className={classes.formControl}
						/>
					);
				})}
			</div>
		);
	};

	const stringAnswerForm = (taskAnswer) => {
		return (
			<TextField
				label='Answer'
				color='primary'
				value={taskAnswer}
				variant='outlined'
				className={classes.textField}
			/>
		);
	};
	const content = (task) => {
		switch (task.taskType) {
			case 1:
				return optionsForm(task.options, task.answer);
			case 2:
				return stringAnswerForm(task.answer);
		}
	};
	return (
		<div className={classes.root}>
			<div class={classes.taskHeader}>
				<Typography className={classes.taskHeaderText} variant='h6'>
					Task #{taskIndex + 1}
				</Typography>
				<IconButton
					onClick={() => {
						removeTask(homeworkPublicId, task.publicId);
					}}
				>
					<DeleteIcon />
				</IconButton>
			</div>
			<Typography variant='body1' className={classes.condition}>
				{task.condition}
			</Typography>
			<FormGroup className={classes.formControl}>
				{content(task)}
			</FormGroup>
			<Typography variant='body1'>
				Student receives <b>{task.maxPoints} </b> points for this task
			</Typography>
		</div>
	);
};

const actionCreators = {
	removeTask: homeworkActions.removeTask,
};

export default connect((state) => {
	return {};
}, actionCreators)(Task);

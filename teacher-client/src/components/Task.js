import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
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
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
	icon: {
		margin: 0,
		display: 'inline-block',
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
	taskText: {
		margin: theme.spacing(2),
	},
	grade: {
		'margin-top': theme.spacing(2),
	},
}));

let Task = (props) => {
	const classes = useStyles();
	const { task, taskIndex, removeTask, homeworkPublicId } = props;

	var optionsForm = (options) => {
		return (
			<React.Fragment>
				<Typography variant='subtitle2'>Answer options:</Typography>
				{options.map((option) => {
					return (
						<FormControlLabel
							control={
								<Checkbox
									checked={option.isCorrect}
									color='primary'
								/>
							}
							label={option.optionText}
							className={classes.formControl}
						/>
					);
				})}
			</React.Fragment>
		);
	};

	let stringAnswerForm = (taskAnswer) => {
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
	let content = (task) => {
		switch (task.taskType) {
			case 1:
				return optionsForm(task.options);
			case 2:
				return stringAnswerForm(task.stringAnswer);
		}
	};
	return (
		<div className={classes.root}>
			<Typography variant='h6'>Task #{taskIndex + 1}</Typography>
			<Typography className={classes.taskText} variant='body1'>
				{task.text}
			</Typography>
			<div>
				<IconButton
					onClick={() => {
						removeTask(homeworkPublicId, task.publicId);
					}}
				>
					<DeleteIcon />
				</IconButton>
			</div>
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
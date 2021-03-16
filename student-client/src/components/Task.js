import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TextField, Checkbox } from 'redux-form-material-ui/src';
import { Field } from 'redux-form';

const useStyles = makeStyles((theme) => ({
	root: {
		flex: '1 1 20%',
		margin: '10px auto',
		minWidth: 200,
		maxWidth: 300,
		height: 50,
		padding: 5,
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
		margin: 0,
	},
	textField: {
		margin: theme.spacing(2),
		minWidth: 125,
		maxWidth: 400,
		display: 'flex',
		'margin-left': 'auto',
		'margin-right': 'auto',
	},
	taskText: {
		margin: theme.spacing(2),
	},
}));

const Task = (props) => {
	const classes = useStyles();
	const { task, taskIndex } = props;

	const optionsForm = (options) => {
		return (
			<FormControl
				required
				component='fieldset'
				className={classes.formControl}
			>
				<FormGroup>
					{options.map((option, index) => {
						const checkboxName = task.publicId + '.' + index;
						return (
							<FormControlLabel
								control={
									<Field
										component={Checkbox}
										name={checkboxName}
										type='checkbox'
									/>
								}
								label={option}
							/>
						);
					})}
				</FormGroup>
			</FormControl>
		);
	};

	const stringAnswerForm = () => {
		return (
			<Field
				name={task.publicId}
				id='outlined-basic'
				label='Answer'
				variant='outlined'
				className={classes.textField}
				component={TextField}
			/>
		);
	};

	const bigAnswerForm = () => {
		return (
			<Field
				name={task.publicId}
				id='outlined-basic'
				label='Answer'
				variant='outlined'
				className={classes.textField}
				multiline
				component={TextField}
			/>
		);
	};

	return (
		<React.Fragment>
			<Typography variant='h6'>Task #{taskIndex + 1}</Typography>
			<Typography className={classes.taskText} variant='body1'>
				{task.condition}
			</Typography>
			{(function () {
				switch (task.taskType) {
					case 1:
						return optionsForm(task.optionLabels);
					case 2:
						return stringAnswerForm();
					case 3:
						return bigAnswerForm();
					default:
						return ' ';
				}
			})()}
		</React.Fragment>
	);
};

export default Task;

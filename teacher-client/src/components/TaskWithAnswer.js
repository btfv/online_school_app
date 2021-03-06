import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
	root: {
		margin: '20px auto',
	},
	bulconst: {
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

const WrongAnswerCheckbox = withStyles({
	root: {
		color: '#ff1744',
		'&$checked': {
			color: '#ff1744',
		},
	},
	checked: {},
})((props) => <Checkbox color='default' {...props} />);

const TaskWithAnswer = (props) => {
	const classes = useStyles();
	const { task, taskIndex, answer } = props;

	

	const optionsForm = (labels, rightAnswers, studentAnswers) => {
		return labels.map((label, index) => {
			return (
				<FormControlLabel
					control={(() => {
						const errorCheckbox = (
							<WrongAnswerCheckbox
								checked={rightAnswers[index]}
							/>
						);
						const normalCheckbox = (
							<Checkbox
								checked={rightAnswers[index]}
								color='primary'
							/>
						);
						if (Boolean(rightAnswers[index]) !== Boolean(studentAnswers[index])) {
							return errorCheckbox;
						} else {
							return normalCheckbox;
						}
					})()}
					label={label}
					className={classes.formControl}
				/>
			);
		});
	};

	const stringAnswerForm = (rightAnswer, userAnswer) => {
		return (
			<React.Fragment>
				<TextField
					label='Right answer'
					color='primary'
					value={rightAnswer}
					variant='outlined'
					className={classes.textField}
				/>
				<TextField
					label='Student answer'
					color='primary'
					value={userAnswer}
					variant='outlined'
					className={classes.textField}
				/>
			</React.Fragment>
		);
	};

	const detailedAnswerForm = (userAnswer) => {
		return (
			<TextField
				label='Your answer'
				color='primary'
				value={userAnswer}
				variant='outlined'
				className={classes.textField}
				multiline
			/>
		);
	};
	const content = (task, answer) => {
		if (!answer) {
			return <Typography variant='body1'>No answer</Typography>;
		}
		switch (task.taskType) {
			case 1:
				return optionsForm(
					task.optionLabels,
					task.optionAnswers,
					answer.optionAnswers
				);
			case 2:
				return stringAnswerForm(task.stringAnswer, answer.stringAnswer);
			case 3:
				return detailedAnswerForm(answer.detailedAnswer);
		}
	};
	return (
		<div className={classes.root}>
			<Typography variant='h6'>Task #{taskIndex + 1}</Typography>
			<Typography className={classes.taskText} variant='body1'>
				{task.condition}
			</Typography>
			<FormGroup className={classes.formControl}>
				{content(task, answer)}
			</FormGroup>
			<div className={classes.grade}>
				{typeof answer !== 'undefined' ? (
					<Typography variant='body1'>
						Student gets{' '}
						<b>{answer.points + '/' + task.maxPoints} </b>
						points
					</Typography>
				) : (
					''
				)}
			</div>
		</div>
	);
};

export default TaskWithAnswer;

import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { solutionActions } from '../redux/actions/solutionActions';
import { CircularProgress } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Copyright from './Copyright';
import AttachmentPanel from './AttachmentPanel';
import TaskWithAnswer from './TaskWithAnswer';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import TeacherInfoBox from './TeacherInfoBox';

const useStyles = makeStyles((theme) => ({
	icon: {
		marginRight: theme.spacing(2),
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(6, 0, 6),
	},
	heroButtons: {
		marginBottom: theme.spacing(2),
	},
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(6),
	},
	tasks: {},
	backLink: { position: 'absolute', 'margin-left': 30 },
	sendHomework: {
		'min-width': 200,
		'max-width': 300,
	},
	arrowIcon: {
		'padding-left': 6,
	},
}));

let Solution = (props) => {
	const { solutionData, gettingSolution, getSolution } = props;
	const { homeworkPublicId, solutionPublicId } = props.match.params;
	const classes = useStyles();

	if (!solutionData && !gettingSolution) {
		getSolution(homeworkPublicId, solutionPublicId);
	}
	if (solutionData) {
		const { solution, homework } = solutionData;
		return (
			<React.Fragment>
				<CssBaseline />
				<main>
					{/* Hero unit */}
					<div className={classes.heroContent}>
						<div className={classes.backLink}>
							<IconButton
								component={Link}
								to='/dashboard/solutions'
							>
								<ArrowBackIosIcon
									fontSize='large'
									className={classes.arrowIcon}
								/>
							</IconButton>
						</div>
						<Container maxWidth='sm'>
							<div className={classes.heroButtons}>
								<Typography
									variant='h6'
									align='center'
									color='textSecondary'
									paragraph
								>
									{homework.subject}
								</Typography>
							</div>
							<div className={classes.heroButtons}>
								<Typography
									component='h2'
									variant='h3'
									align='center'
									color='textPrimary'
									gutterBottom
								>
									{homework.title}
								</Typography>
							</div>
							<div className={classes.heroButtons}>
								<Typography
									variant='h5'
									align='center'
									color='textSecondary'
									paragraph
								>
									{homework.description}
								</Typography>
							</div>
							<div className={classes.heroButtons}>
								<TeacherInfoBox
									profile={homework.creatorInfo}
									text='Homework created by'
								/>
							</div>
							<div className={classes.heroButtons}>
								<TeacherInfoBox
									profile={solution.checkedByInfo}
									text='Solution reviewed by'
								/>
							</div>
							<div className={classes.heroButtons}>
								{homework.attachments.map((attachment) => {
									return (
										<AttachmentPanel
											name={attachment.name}
											reference={attachment.reference}
										/>
									);
								})}
							</div>
							<div className={classes.tasks}>
								<Typography
									variant='h4'
									align='center'
									paragraph
								>
									Tasks
								</Typography>
								{homework.tasks.map((task, index) => {
									const answer = solution.answers.filter(
										(answer) => {
											return (
												task.publicId ==
												answer.taskPublicId
											);
										}
									)[0];
									return (
										<TaskWithAnswer
											taskIndex={index}
											task={task}
											answer={answer}
										/>
									);
								})}
							</div>
							<Typography variant='h6' align='center' paragraph>
								Totally you get {solution.totalPoints}/
								{homework.homeworkMaxPoints} points for this
								homework
							</Typography>
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
	return <CircularProgress />;
};

const mapStateToProps = (state) => {
	const { solutionData, gettingSolution } = state.solutionReducer;
	return {
		solutionData,
		gettingSolution,
	};
};

const actionCreators = {
	getSolution: solutionActions.getSolution,
};

export default connect(mapStateToProps, actionCreators)(Solution);

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
	root: {
		'flex-wrap': 'wrap',
		width: '100%',
		display: 'flex',
		'justify-content': 'center',
	},
	centerCircle: {
		position: 'fixed',
		'align-items': 'center',
		display: 'flex',
		padding: 0,
		height: '90%',
	},
	icon: {
		marginRight: theme.spacing(2),
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(2, 0, 6),
	},
	heroButtons: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(6),
	},
	backLink: { position: 'absolute', 'margin-left': 30 },
	sendHomework: {
		'min-width': 200,
		'max-width': 300,
	},
	arrowIcon: {
		'padding-left': 6,
	},
}));

const Solution = (props) => {
	const {
		solution,
		loadingSolution,
		getSolution,
		loadedSolution,
		clearSolution,
	} = props;
	const { homeworkPublicId, solutionPublicId } = props.match.params;
	const classes = useStyles();

	if (solution && solutionPublicId != solution.publicId) {
		clearSolution();
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}

	if (!loadingSolution && !loadedSolution) {
		getSolution(homeworkPublicId, solutionPublicId);
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}
	if (loadingSolution) {
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}
	if (solution) {
		const attachments = solution.attachments.map((attachment) => {
			return (
				<AttachmentPanel
					name={attachment.name}
					reference={attachment.reference}
				/>
			);
		});
		return (
			<React.Fragment>
				<CssBaseline />
				<main>
					{/* Hero unit */}
					<div className={classes.heroContent}>
						<div className={classes.backLink}>
							<IconButton
								component={Link}
								to={'/dashboard/homework/' + homeworkPublicId}
							>
								<ArrowBackIosIcon
									fontSize='large'
									className={classes.arrowIcon}
								/>
							</IconButton>
						</div>
						<Container maxWidth='sm'>
							<Typography
								variant='h6'
								align='center'
								color='textSecondary'
								paragraph
							>
								{solution.subject}
							</Typography>
							<Typography
								component='h2'
								variant='h3'
								align='center'
								color='textPrimary'
								gutterBottom
							>
								{solution.title}
							</Typography>
							<Typography
								variant='h5'
								align='center'
								color='textSecondary'
								paragraph
							>
								{solution.description}
							</Typography>
							{attachments && attachments.length ? (
								<div className={classes.heroButtons}>
									{attachments}
								</div>
							) : (
								''
							)}
							<div className={classes.heroButtons}>
								<TeacherInfoBox
									profile={solution.checkedByInfo}
								/>
							</div>
							<div className={classes.tasks}>
								<Typography
									variant='h4'
									align='center'
									paragraph
								>
									Tasks
								</Typography>
								{solution.tasks.map((task, index) => {
									return (
										<TaskWithAnswer
											taskIndex={index}
											task={task}
											answer={solution.answers[index]}
										/>
									);
								})}
							</div>
							<Typography variant='h6' align='center' paragraph>
								Totally student gets {solution.totalPoints}/
								{solution.homeworkMaxPoints} points for this
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
	return <div></div>;
};

const mapStateToProps = (state) => {
	const { solution, loadingSolution, loadedSolution } = state.solutionReducer;
	return {
		solution,
		loadingSolution,
		loadedSolution,
	};
};

const actionCreators = {
	getSolution: solutionActions.getSolution,
	clearSolution: solutionActions.clearSolution,
};

export default connect(mapStateToProps, actionCreators)(Solution);

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

const useStyles = makeStyles((theme) => ({
	icon: {
		marginRight: theme.spacing(2),
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(2, 0, 6),
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
	const {
		solution,
		gettingSolution,
		getSolution,

		firstAttempt,
	} = props;
	const { homeworkPublicId, solutionPublicId } = props.match.params;
	const classes = useStyles();
	var content = ' ';
	if (
		Object.keys(solution).length == 0 &&
		!gettingSolution &&
		!firstAttempt
	) {
		getSolution(homeworkPublicId, solutionPublicId);
	}
	if (Object.keys(solution).length != 0 && !gettingSolution) {
		let attachments = solution.attachments.map((attachment) => {
			return (
				<AttachmentPanel
					name={attachment.name}
					reference={attachment.reference}
				/>
			);
		});
		content = (
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
								{solution.homeworkMaxGrade} points for this
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
	return (
		<div>
			{props.gettingSolution ? <CircularProgress /> : ''}
			{content}
		</div>
	);
};

const mapStateToProps = (state) => {
	const { solution, gettingSolution, firstAttempt } = state.solutionReducer;
	return {
		solution,
		gettingSolution,
		firstAttempt,
	};
};

const actionCreators = {
	getSolution: solutionActions.getSolution,
};

export default connect(mapStateToProps, actionCreators)(Solution);

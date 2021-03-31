import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HomeworkCard from './HomeworkCard';
import { connect } from 'react-redux';
import { homeworkListActions } from '../redux/actions/homeworkListActions';
import { CircularProgress, Typography } from '@material-ui/core';

const useStyles = makeStyles({
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
});

const HomeworksList = (props) => {
	const classes = useStyles();
	const {
		homeworkPreviews,
		loadingHomeworkPreviews,
		loadedHomeworkPreviews,
		getListOfHomeworks,
	} = props;
	if (!loadingHomeworkPreviews && !loadedHomeworkPreviews) {
		getListOfHomeworks(0);
	}
	if (loadingHomeworkPreviews) {
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}
	if (loadedHomeworkPreviews) {
		const homeworks = homeworkPreviews.map((preview) => {
			return (
				<HomeworkCard
					title={preview.title}
					description={preview.description}
					homeworkPublicId={preview.homeworkPublicId}
					subject={preview.subject}
					creatorName={preview.creatorName}
					creatorPublicId={preview.creatorPublicId}
				/>
			);
		});
		return <div className={classes.root}>{homeworks}</div>;
	}
	return <div className={classes.root}></div>;};

const mapStateToProps = (state) => {
	const {
		homeworkPreviews,
		loadedHomeworkPreviews,
		loadingHomeworkPreviews,
	} = state.homeworkListReducer;
	return {
		homeworkPreviews,
		loadedHomeworkPreviews,
		loadingHomeworkPreviews,
	};
};

const actionCreators = {
	getListOfHomeworks: homeworkListActions.getListOfHomeworks,
};

export default connect(mapStateToProps, actionCreators)(HomeworksList);

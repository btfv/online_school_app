import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CustomCard from './CustomCard';
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

let HomeworksList = (props) => {
	const classes = useStyles();
	const {
		homeworkPreviews,
		loadingHomeworkPreviews,
		loadedHomeworkPreviews,
	} = props;
	if (homeworkPreviews.length == 0) {
		if (!loadingHomeworkPreviews && !loadedHomeworkPreviews)
			props.getListOfHomeworks(0);
	} else {
		var homeworks = homeworkPreviews.map((preview) => {
			return (
				<CustomCard
					title={preview.title}
					description={preview.description}
					homeworkPublicId={preview.publicId}
					subject={preview.subject}
				/>
			);
		});
	}
	return (
		<div className={classes.root}>
			{loadingHomeworkPreviews ? (
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			) : (
				''
			)}
			{homeworks}
		</div>
	);
};

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

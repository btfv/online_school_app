import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CustomCard from './CustomCard';
import { connect } from 'react-redux';
import { homeworkListActions } from '../redux/actions/homeworkListActions';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
	root: {
		'flex-wrap': 'wrap',
		width: '100%',
		display: 'flex',
		'justify-content': 'center',
	},
});

let HomeworksList = (props) => {
	const classes = useStyles();
	const {
		homeworkPreviews,
		loadingHomeworkPreviews,
		loadedHomeworkPreviews,
	} = props;
	console.log(homeworkPreviews);
	if (props.homeworkPreviews.length == 0) {
		if (!loadingHomeworkPreviews && !loadedHomeworkPreviews)
			props.getListOfHomeworks(0);
	} else {
		var homeworks = homeworkPreviews.map((preview) => {
			return (
				<CustomCard
					title={preview.homeworkTitle}
					description={preview.description}
					homeworkPublicId={preview.homeworkPublicId}
					subject={preview.subject}
				/>
			);
		});
	}
	return (
		<div className={classes.root}>
			{loadingHomeworkPreviews ? <CircularProgress /> : ''}
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
	//console.log(state.homeworkListReducer);
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

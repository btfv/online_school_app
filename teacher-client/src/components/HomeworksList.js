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
		'max-width': '1000px',
		'margin-left': 'auto',
		'margin-right': 'auto',
		display: 'flex',
		'justify-content': 'center',
	},
});

let HomeworksList = (props) => {
	const classes = useStyles();
	if (props.homeworkPreviews.length == 0) {
		if (!props.loadingHomeworkPreviews && !props.loadedHomeworkPreviews)
			props.getListOfHomeworks(0);
	} else {
		var homeworks = props.homeworkPreviews.map((preview) => {
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
			{props.loadingHomeworkPreviews ? <CircularProgress /> : ''}
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

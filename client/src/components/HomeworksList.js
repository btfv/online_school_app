import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HomeworkCard from './HomeworkCard';
import { connect } from 'react-redux';
import { homeworkListActions } from '../redux/actions/homeworkListActions';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
	root: {
		'flex-wrap': 'wrap',
		width: '100%',
		margin: '10px',
		display: 'flex',
		'justify-content': 'center',
	},
});

let HomeworksList = (props) => {
	const classes = useStyles();
	if (props.homeworkPreviews.length == 0) {
		if(!props.loadingHomeworkPreviews)
			props.getListOfHomeworks(0);
	}
	else{
		var homeworks = props.homeworkPreviews.map((preview) => {
			return <HomeworkCard title={preview.title} publicId={preview.publicId}/>;
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

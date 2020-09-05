import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CustomCard from './CustomCard';
import { connect } from 'react-redux';
import { solutionListActions } from '../redux/actions/solutionListActions';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
	root: {
		'flex-wrap': 'wrap',
		width: '100%',
		display: 'flex',
		'justify-content': 'center',
	},
});

let SolutionList = (props) => {
	const classes = useStyles();
	const {
		solutionPreviews,
		loadingSolutionPreviews,
		loadedSolutionPreviews,
		getListOfSolutions,
	} = props;
	if (solutionPreviews.length == 0) {
		if (!loadingSolutionPreviews && !loadedSolutionPreviews)
			getListOfSolutions(0);
	} else {
		var homeworks = solutionPreviews.map((preview) => {
			return (
				<CustomCard
					title={preview.homeworkTitle}
					description={preview.description}
					homeworkPublicId={preview.homeworkPublicId}
					solutionPublicId={preview.solutionPublicId}
					subject={preview.subject}
				/>
			);
		});
	}
	return (
		<div className={classes.root}>
			{loadingSolutionPreviews ? <CircularProgress /> : ''}
			{homeworks}
		</div>
	);
};

const mapStateToProps = (state) => {
	const {
		solutionPreviews,
		loadedSolutionPreviews,
		loadingSolutionPreviews,
	} = state.solutionListReducer;
	return {
		solutionPreviews,
		loadedSolutionPreviews,
		loadingSolutionPreviews,
	};
};

const actionCreators = {
	getListOfSolutions: solutionListActions.getListOfSolutions,
};

export default connect(mapStateToProps, actionCreators)(SolutionList);

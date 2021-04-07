import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { receivedTeachersActions } from '../../redux/actions/receivedTeachersActions';
import { MenuItem, TextField, List, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		'margin-top': theme.spacing(4),
	},
	table: {
		minWidth: 300,
	},
	addTeacherFields: {
		minWidth: 250,
	},
	invisibleField: {
		display: 'none',
	},
	form: {
		'margin-top': theme.spacing(2),
	},
}));

const AddTeacherForm = (props) => {
	const classes = useStyles();
	const {
        homeworkPublicId,
		searchedTeachers,
		searchingTeachers,
		getTeachersByName,
		clearTeacherSearch,
		addTeacherToHomework,
		searchedTeachersList,
	} = props;
	return (
		<form className={classes.form}>
			<div>
				<TextField
					variant='outlined'
					label='Teacher Name'
					onChange={(event) => {
						let inputValue = event.target.value;
						if (inputValue.length > 2) {
							getTeachersByName(inputValue);
						} else {
							clearTeacherSearch();
						}
					}}
					className={classes.addTeacherFields}
				/>
			</div>
			<div>
				{searchingTeachers ? (
					<CircularProgress />
				) : (
					<List>
						{searchedTeachers
							? searchedTeachersList.map((teacher) => (
									<MenuItem
										onClick={() => {
											addTeacherToHomework(
												homeworkPublicId,
												teacher.publicId
											);
										}}
									>
										{teacher.firstname +
											' ' +
											teacher.lastname}
									</MenuItem>
							  ))
							: ''}
					</List>
				)}
			</div>
		</form>
	);
};

const mapStateToProps = (state) => {
	const {
		searchingTeachers,
		searchedTeachers,
		searchedTeachersList,
	} = state.receivedTeachersReducer;
	return {
		searchingTeachers,
		searchedTeachers,
		searchedTeachersList,
	};
};

const actionCreators = {
	getTeachersByName: receivedTeachersActions.getTeachersByName,
	addTeacherToHomework: receivedTeachersActions.addTeacherToHomework,
	clearTeacherSearch: receivedTeachersActions.clearTeacherSearch,
};

export default connect(mapStateToProps, actionCreators)(AddTeacherForm);

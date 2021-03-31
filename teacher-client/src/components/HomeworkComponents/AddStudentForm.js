import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { receivedStudentsActions } from '../../redux/actions/receivedStudentsActions';
import { MenuItem, TextField, List, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		'margin-top': theme.spacing(4),
	},
	table: {
		minWidth: 300,
	},
	addStudentFields: {
		minWidth: 250,
	},
	invisibleField: {
		display: 'none',
	},
	form: {
		'margin-top': theme.spacing(2),
	},
}));

const AddStudentForm = (props) => {
	const classes = useStyles();
	const {
        homeworkPublicId,
		searchedStudents,
		searchingStudents,
		getStudentsByName,
		clearStudentList,
		addStudentToHomework,
		searchedStudentsList,
	} = props;
	return (
		<form className={classes.form}>
			<div>
				<TextField
					variant='outlined'
					label='Student Name'
					onChange={(event) => {
						let inputValue = event.target.value;
						if (inputValue.length > 2) {
							getStudentsByName(inputValue);
						} else {
							clearStudentList();
						}
					}}
					className={classes.addStudentFields}
				/>
			</div>
			<div>
				{searchingStudents ? (
					<CircularProgress />
				) : (
					<List>
						{searchedStudents
							? searchedStudentsList.map((student) => (
									<MenuItem
										onClick={() => {
											addStudentToHomework(
												homeworkPublicId,
												student.publicId
											);
										}}
									>
										{student.firstname +
											' ' +
											student.lastname}
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
		searchingStudents,
		searchedStudents,
		searchedStudentsList,
	} = state.receivedStudentsReducer;
	return {
		searchingStudents,
		searchedStudents,
		searchedStudentsList,
	};
};

const actionCreators = {
	getStudentsByName: receivedStudentsActions.getStudentsByName,
	addStudentToHomework: receivedStudentsActions.addStudentToHomework,
	clearStudentList: receivedStudentsActions.clearStudentList,
};

export default connect(mapStateToProps, actionCreators)(AddStudentForm);

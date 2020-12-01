import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { studentListActions } from '../../redux/actions/studentListActions';
import {
	MenuItem,
	TextField,
	ListItemText,
	ListItem,
	List,
} from '@material-ui/core';
import ReactSelectMaterialUi from 'react-select-material-ui';

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

let ReceivedStudentsTable = (props) => {
	const classes = useStyles();
	const [addStudentFormState, openAddStudentForm] = useState(false);
	const {
		handleSubmit,
		receivedStudents,
		homeworkPublicId,
		getStudentsList,
		getStudentsByName,
		loadingStudents,
		loadedStudents,
		students,
		addStudentToHomework,
		clearStudentList,
		receivedStudentsOnClient,
	} = props;

	let addStudentForm = (studentList) => (
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
				<div>
					<List>
						{studentList.map((student) => (
							<MenuItem
								onClick={() => {
									addStudentToHomework(
										homeworkPublicId,
										student.publicId,
										student.name
									);
								}}
							>
								{student.name}
							</MenuItem>
						))}
					</List>
				</div>
			</div>
		</form>
	);
	return (
		<TableContainer component={Paper} className={classes.root}>
			<Table className={classes.table} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell>Student Name</TableCell>
						<TableCell align='right'>Has Solution</TableCell>
						<TableCell align='right'>Solution</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(() => {
						return receivedStudents.concat(receivedStudentsOnClient).map((student, index) => {
							if (Object.keys(student).length > 0)
								return (
									<TableRow key={'student.' + index}>
										<TableCell component='th' scope='row'>
											<Link
												to={
													'/dashboard/student/' +
													student.studentPublicId
												}
											>
												{student.studentName}
											</Link>
										</TableCell>
										<TableCell align='right'>
											{student.hasSolution ? '+' : '-'}
										</TableCell>
										<TableCell align='right'>
											{student.hasSolution ? (
												<Link
													to={
														'/dashboard/homework/' +
														homeworkPublicId +
														'/solution/' +
														student.solutionPublicId
													}
												>
													Solution
												</Link>
											) : (
												''
											)}
										</TableCell>
									</TableRow>
								);
						});
					})()}
					<TableRow>
						<TableCell colspan='3' align='center'>
							<IconButton
								onClick={() => {
									//if (!loadedStudents) getStudentsByName(' ');
									openAddStudentForm(!addStudentFormState);
								}}
							>
								<AddIcon fontSize='large' />
							</IconButton>
							<div className={classes.addTaskForm}>
								{addStudentFormState
									? addStudentForm(students)
									: ''}
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

const mapStateToProps = (state) => {
	const {
		students,
		loadingStudents,
		loadedStudents,
		receivedStudentsOnClient,
	} = state.studentListReducer;
	return {
		students,
		loadingStudents,
		loadedStudents,
		receivedStudentsOnClient,
	};
};

const actionCreators = {
	getStudentsByName: studentListActions.getStudentsByName,
	addStudentToHomework: studentListActions.addStudentToHomework,
	clearStudentList: studentListActions.clearStudentList,
};

export default connect(mapStateToProps, actionCreators)(ReceivedStudentsTable);

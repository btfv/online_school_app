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
import { receivedStudentsActions } from '../../redux/actions/receivedStudentsActions';
import {
	MenuItem,
	TextField,
	ListItemText,
	ListItem,
	List,
	CircularProgress,
} from '@material-ui/core';
import ReactSelectMaterialUi from 'react-select-material-ui';
import AddStudentForm from './AddStudentForm';

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
		homeworkPublicId,
		receivedStudents,
		loadingStudents,
		loadedStudents,
		getReceivedStudents,
	} = props;

	if (!loadingStudents && !loadedStudents) {
		const offset = receivedStudents.length;
		getReceivedStudents(homeworkPublicId, offset);
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}
	if (loadingStudents) {
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}

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
						return receivedStudents.map((student, index) => {
							return (
								<TableRow key={'student.' + index}>
									<TableCell component='th' scope='row'>
										<Link
											to={
												'/dashboard/student/' +
												student.studentPublicId
											}
										>
											{student.firstname +
												' ' +
												student.lastname}
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
									openAddStudentForm(!addStudentFormState);
								}}
							>
								<AddIcon fontSize='large' />
							</IconButton>
							<div className={classes.addTaskForm}>
								{addStudentFormState ? (
									<AddStudentForm
										homeworkPublicId={homeworkPublicId}
									/>
								) : (
									''
								)}
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
		receivedStudents,
		loadingStudents,
		loadedStudents,
	} = state.receivedStudentsReducer;
	return {
		receivedStudents,
		loadingStudents,
		loadedStudents,
	};
};

const actionCreators = {
	getReceivedStudents: receivedStudentsActions.getReceivedStudents,
};

export default connect(mapStateToProps, actionCreators)(ReceivedStudentsTable);

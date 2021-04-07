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
import { receivedTeachersActions } from '../../redux/actions/receivedTeachersActions';
import { CircularProgress } from '@material-ui/core';
import AddTeacherForm from './AddTeacherForm';

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

let ReceivedTeachersTable = (props) => {
	const classes = useStyles();
	const [addTeacherFormState, openAddTeacherForm] = useState(false);
	const {
		homeworkPublicId,
		receivedTeachers,
		loadingTeachers,
		loadedTeachers,
		getReceivedTeachers,
	} = props;
	if (!loadingTeachers && !loadedTeachers) {
		const offset = receivedTeachers.length;
		getReceivedTeachers(homeworkPublicId, offset);
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}
	if (loadingTeachers) {
		return (
			<div className={classes.root}>
				<div className={classes.centerCircle}>
					<CircularProgress />
				</div>
			</div>
		);
	}
	if (receivedTeachers)
		return (
			<TableContainer component={Paper} className={classes.root}>
				<Table className={classes.table} aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell>Teacher Name</TableCell>
							<TableCell align='right'>Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{(() => {
							return receivedTeachers.map((teacher, index) => {
								return (
									<TableRow key={'teacher.' + index}>
										<TableCell component='th' scope='row'>
											<Link
												to={
													'/dashboard/teacher/' +
													teacher.teacherPublicId
												}
											>
												{teacher.firstname +
													' ' +
													teacher.lastname}
											</Link>
										</TableCell>
										<TableCell align='right'>
											{teacher.status}
										</TableCell>
									</TableRow>
								);
							});
						})()}
						<TableRow>
							<TableCell colspan='3' align='center'>
								<IconButton
									onClick={() => {
										openAddTeacherForm(
											!addTeacherFormState
										);
									}}
								>
									<AddIcon fontSize='large' />
								</IconButton>
								<div className={classes.addTaskForm}>
									{addTeacherFormState ? (
										<AddTeacherForm
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
	return '';
};

const mapStateToProps = (state) => {
	const {
		receivedTeachers,
		loadingTeachers,
		loadedTeachers,
	} = state.receivedTeachersReducer;
	return {
		receivedTeachers,
		loadingTeachers,
		loadedTeachers,
	};
};

const actionCreators = {
	getReceivedTeachers: receivedTeachersActions.getReceivedTeachers,
};

export default connect(mapStateToProps, actionCreators)(ReceivedTeachersTable);

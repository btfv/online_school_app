import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
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

let HomeworkTable = (props) => {
	const classes = useStyles();
	const {
		homeworks
	} = props;
	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell>Homework Name</TableCell>
						<TableCell align='right'>Has Solution</TableCell>
						<TableCell align='right'>Is checked</TableCell>
						<TableCell align='right'>Solution</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(() => {
						return homeworks.map((homework, index) => {
								return (
									<TableRow key={'homework.' + index}>
										<TableCell component='th' scope='row'>
											<Link
												to={
													'/dashboard/homeworks/' +
													homework.homeworkPublicId
												}
											>
												{homework.title}
											</Link>
										</TableCell>
										<TableCell align='right'>
											{homework.hasSolution ? '+' : '-'}
										</TableCell>
										<TableCell align='right'>
											{homework.isChecked ? '+' : '-'}
										</TableCell>
										<TableCell align='right'>
											{homework.isChecked ? (
												<Link
													to={
														'/dashboard/homework/' +
														homework.publicId +
														'/solution/' +
														homework.solutionPublicId
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
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default HomeworkTable;

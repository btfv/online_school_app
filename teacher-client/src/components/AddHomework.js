import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Container } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui/src';
import { connect } from 'react-redux';
import { addHomeworkActions } from '../redux/actions/addHomeworkActions';
import FileInput from './AddHomeworkComponents/FileInput';

const useStyles = makeStyles((theme) => ({
	root: {
		flex: '1 1 20%',
		margin: '10px',
		minWidth: 275,
		maxWidth: 350,
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(2, 0, 6),
	},
	textField: {
		margin: theme.spacing(2),
		minWidth: 125,
		maxWidth: 400,
		display: 'flex',
		'margin-left': 'auto',
		'margin-right': 'auto',
	},
	invisibleTextField: {
		display: 'none',
	},
	sendHomework: {
		margin: theme.spacing(2),
		'min-width': 200,
		'max-width': 300,
	},
}));

var AddHomework = (props) => {
	const classes = useStyles();
	const { handleSubmit, addHomework } = props;

	return (
		<React.Fragment>
			<CssBaseline />
			<main>
				<div className={classes.heroContent}>
					<Container maxWidth='sm'>
						<Typography
							component='h2'
							variant='h3'
							align='center'
							color='textPrimary'
							gutterBottom
						>
							Add Homework
						</Typography>
						<div className={classes.inputFields}>
							<form onSubmit={handleSubmit(addHomework)}>
								<Field
									name='homeworkTitle'
									id='outlined-basic'
									label='Homework Title'
									variant='outlined'
									className={classes.textField}
									component={TextField}
								/>
								<Field
									name='homeworkDescription'
									multiline
									id='outlined-basic'
									label='Homework Description'
									variant='outlined'
									className={classes.textField}
									component={TextField}
								/>
								<Field
									name='homeworkSubject'
									id='outlined-basic'
									label='Homework Subject'
									variant='outlined'
									className={classes.textField}
									component={TextField}
								/>
								<label htmlFor='attachments-input'>
									<Button
										variant='contained'
										color='primary'
										component='span'
									>
										Upload Attachments
									</Button>
								</label>
								<Field
									className={classes.invisibleTextField}
									name='homeworkAttachments'
									id='attachments-input'
									multiple={true}
									component={FileInput}
									fullWidth={true}
									value={null}
									multiple={true}
								/>
								<div>
									<Button
										type='submit'
										fullWidth
										variant='contained'
										color='primary'
										className={classes.sendHomework}
									>
										Add
									</Button>
								</div>
							</form>
						</div>
					</Container>
				</div>
			</main>
		</React.Fragment>
	);
};

AddHomework = reduxForm({ form: 'addHomeworkForm' })(AddHomework);

const mapStateToProps = (state) => {
	return {};
};

const actionCreators = {
	addHomework: addHomeworkActions.addHomework,
};

export default connect(mapStateToProps, actionCreators)(AddHomework);

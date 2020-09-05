import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { studentProfileActions } from '../redux/actions/studentProfileActions';
import { CssBaseline, Container, Typography } from '@material-ui/core';
import HomeworkTable from './StudentProfileComponents/HomeworkTable';
import BackLink from './BackLink';

const useStyles = makeStyles((theme) => ({
	root: {
		'flex-wrap': 'wrap',
		width: '100%',
		display: 'flex',
		'justify-content': 'center',
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(2, 0, 6),
	},
}));

let StudentProfile = (props) => {
	const classes = useStyles();
	const {
		profile,
		loadingProfile,
		loadedProfile,
		getStudentProfile,
		history,
	} = props;
	const { studentPublicId } = props.match.params;
	if (
		(!Object.keys(profile).length && !loadedProfile && !loadingProfile) ||
		(Object.keys(profile).length && profile.publicId != studentPublicId)
	) {
		getStudentProfile(studentPublicId);
	}
	return (
		<React.Fragment>
			<CssBaseline />
			<main>
				<div className={classes.heroContent}>
					<BackLink history={history} />
					<Container maxWidth='sm'>
						<Typography
							component='h2'
							variant='h3'
							align='center'
							color='textPrimary'
							gutterBottom
						>
							Student Profile
						</Typography>
						<div>
							<Typography
								variant='h6'
								align='center'
								color='textPrimary'
								gutterBottom
							>
								Student name
							</Typography>
							<Typography
								variant='body1'
								align='center'
								color='textPrimary'
								gutterBottom
							>
								{Object.keys(profile).length
									? profile.name
									: ''}
							</Typography>
						</div>

						<div>
							<Typography
								variant='h6'
								align='center'
								color='textPrimary'
								gutterBottom
							>
								Groups
							</Typography>
							<Typography
								variant='body1'
								align='center'
								color='error'
								gutterBottom
							>
								Student does not consist in any groups
							</Typography>
						</div>
						<div>
							<Typography
								variant='h6'
								align='center'
								color='textPrimary'
								gutterBottom
							>
								Age
							</Typography>
							<Typography
								variant='body1'
								align='center'
								color='textPrimary'
								gutterBottom
							>
								{Object.keys(profile).length ? profile.age : ''}
							</Typography>
						</div>
						<div>
							<Typography
								variant='h6'
								align='center'
								color='textPrimary'
								gutterBottom
							>
								Homeworks
							</Typography>
							{Object.keys(profile).length ? (
								<HomeworkTable homeworks={profile.homeworks} />
							) : (
								''
							)}
						</div>
					</Container>
				</div>
			</main>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	const {
		profile,
		loadingProfile,
		loadedProfile,
	} = state.studentProfileReducer;
	return {
		profile,
		loadingProfile,
		loadedProfile,
	};
};

const actionCreators = {
	getStudentProfile: studentProfileActions.getStudentProfile,
};

export default connect(mapStateToProps, actionCreators)(StudentProfile);

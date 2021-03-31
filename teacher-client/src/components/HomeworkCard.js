import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
	root: {
		flex: '1 1 20%',
		margin: '10px',
		minWidth: 275,
		maxWidth: 350,
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});

export default function HomeworkCard(props) {
	const classes = useStyles();
	const {
		title,
		description,
		homeworkPublicId,
		subject,
		creatorName,
		creatorPublicId,
	} = props;
	const homeworkHref = '/dashboard/homework/' + homeworkPublicId;

	return (
		<Card className={classes.root} variant='outlined'>
			<CardContent>
				<Typography
					className={classes.title}
					color='textSecondary'
					gutterBottom
				>
					{subject}
				</Typography>
				<Typography variant='h5' component='h2'>
					{title}
				</Typography>
				<Typography className={classes.pos} color='textSecondary'>
					by {creatorName}
				</Typography>
				<Typography variant='body2' component='p'>
					{description}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size='small' component={Link} to={homeworkHref}>
					Open homework
				</Button>
			</CardActions>
		</Card>
	);
}

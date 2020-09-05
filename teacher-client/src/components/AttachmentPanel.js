import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AttachmentIcon from '@material-ui/icons/Attachment';
import config from '../config';
import Link from '@material-ui/core/Link'

const useStyles = makeStyles({
	root: {
		flex: '1 1 20%',
		margin: '10px auto',
		minWidth: 200,
		maxWidth: 300,
		height: 50,
		padding: 5,
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
	icon: {
		margin: 0,
		display: 'inline-block',
	},
	attachmentName: {
		'margin-left': 5,
		display: 'inline-block',
		top: '50%',
		transform: 'translateY(-50%)',
	},
});

export default function AttachmentPanel(props) {
	const classes = useStyles();
	let attachmentHref =
		config.API_URL + '/api/upload_files/' + props.reference;
	return (
		<Card className={classes.root} variant='outlined'>
			<div className={classes.icon}>
				<AttachmentIcon fontSize='large' />
			</div>
			<div className={classes.attachmentName}>
				<Link href={attachmentHref}>
					<Typography
						variant='body1'
						align='center'
						color='textSecondary'
					>
						{props.name}
					</Typography>
				</Link>
			</div>
		</Card>
	);
}

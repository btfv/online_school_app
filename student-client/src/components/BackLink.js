import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme) => ({
	backLink: { display: 'flex', position: 'absolute', 'margin-left': 30 },
}));

export default function BackLink(props) {
	const { history } = props;
	const classes = useStyles();
	return (
		<div className={classes.backLink}>
			<IconButton
				onClick={() => {
					history.goBack();
				}}
			>
				<ArrowBackIosIcon
					fontSize='large'
					className={classes.arrowIcon}
				/>
			</IconButton>
		</div>
	);
}

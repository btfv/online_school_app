import React, { useState } from 'react';
import { Button, ButtonGroup, makeStyles } from '@material-ui/core';
import Task from '../Task';

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(2),
	},
}));

const TaskCarousel = (props) => {
	const classes = useStyles();

	const { tasks, homeworkPublicId } = props;

	const [taskIndex, setTaskIndex] = useState(null);
	return (
		<div class={classes.root}>
			<ButtonGroup>
				{tasks.map((task, index) => {
					return (
						<Button
							color='primary'
							onClick={() => {
								index != taskIndex
									? setTaskIndex(index)
									: setTaskIndex(null);
							}}
						>
							{index + 1}
						</Button>
					);
				})}
			</ButtonGroup>

			{taskIndex != null ? (
				<Task
					homeworkPublicId={homeworkPublicId}
					taskIndex={taskIndex}
					task={tasks[taskIndex]}
				/>
			) : (
				''
			)}
		</div>
	);
};

export default TaskCarousel;

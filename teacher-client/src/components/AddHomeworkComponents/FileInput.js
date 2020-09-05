import React from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { TextField } from '@material-ui/core';

const styles = {
	button: {
		margin: 12,
	},
	exampleImageInput: {
		cursor: 'pointer',
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		width: '100%',
		opacity: 0,
	},
	FFS: {
		position: 'absolute',
		lineHeight: '1.5',
		top: '38',
		transition: 'none',
		zIndex: '1',
		transform: 'none',
		transformOrigin: 'none',
		pointerEvents: 'none',
		userSelect: 'none',
		fontSize: '16',
		color: 'rgba(0, 0, 0, 0.8)',
	},
};

export const FileInput = ({
	floatingLabelText,
	fullWidth,
	input,
	label,
	meta: { touched, error },
	...custom
}) => {
	delete input.value;
	return (
		<TextField
			hintText={label}
			fullWidth={fullWidth}
			floatingLabelShrinkStyle={styles.FFS}
			inputStyle={styles.exampleImageInput}
			multiple={true}
			type='file'
			errorText={error}
			{...input}
			{...custom}
			inputProps={{ multiple: true }}
		/>
	);
};

export default FileInput;

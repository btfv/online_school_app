import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import HomeworksList from './HomeworksList';
import Homework from './Homework';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {
	NavLink,
	Link,
	Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import Solution from './Solution';
import { history } from '../redux/store';
import AddHomework from './AddHomework';
import StudentProfile from './StudentProfile';
import TeacherProfile from './TeacherProfile';
import { userService } from '../redux/services/userService';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
}));

export default function DashboardComponent(props) {
	const classes = useStyles();
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<AppBar position='static'>
				<Toolbar>
					<IconButton
						edge='start'
						className={classes.menuButton}
						color='inherit'
						aria-label='open-drawer'
						onClick={handleDrawerOpen}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant='h6' className={classes.title}>
						Teacher Client
					</Typography>

					<IconButton
						aria-label='account of current user'
						aria-controls='menu-appbar'
						aria-haspopup='true'
						onClick={handleMenuClick}
						color='inherit'
					>
						<AccountCircle />
					</IconButton>
					<Menu
						id='menu-appbar'
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
					>
						<MenuItem
							onClick={handleMenuClose}
							onClick={() => {
								history.push('/dashboard/profile');
							}}
						>
							Profile
						</MenuItem>
						<MenuItem
							onClick={handleMenuClose}
							onClick={() => {
								userService.logout();
							}}
						>
							Log Out
						</MenuItem>
					</Menu>
				</Toolbar>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant='persistent'
				anchor='left'
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? (
							<ChevronLeftIcon />
						) : (
							<ChevronRightIcon />
						)}
					</IconButton>
				</div>
				<Divider />
				<List>
					<ListItem
						component={NavLink}
						to={'/dashboard/homeworks'}
						button
						key='homeworks'
					>
						<ListItemText primary='Homeworks' />
					</ListItem>
					<ListItem
						component={NavLink}
						to={'/dashboard/addHomework'}
						button
						key='addHomework'
					>
						<ListItemText primary='Add Homework' />
					</ListItem>
				</List>
			</Drawer>
			<Router history={history}>
				<Switch>
					<Route
						path='/dashboard/homeworks'
						component={HomeworksList}
					/>
					<Route
						exact
						path='/dashboard/homework/:publicId'
						component={Homework}
					/>
					<Route
						path='/dashboard/homework/:homeworkPublicId/solution/:solutionPublicId'
						component={Solution}
					/>
					<Route
						path='/dashboard/addHomework'
						component={AddHomework}
					/>
					<Route
						path='/dashboard/student/:studentPublicId'
						component={StudentProfile}
					/>
					<Route
						path='/dashboard/profile/'
						component={TeacherProfile}
					/>
					<Redirect from='*' to='/dashboard/homeworks' />
				</Switch>
			</Router>
		</div>
	);
}

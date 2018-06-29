import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';
import { Provider } from 'react-redux';
import store from './store';
import Loadable from 'react-loadable';

import PrivateRoute from './components/common/PrivateRoute';

import Spinner from './components/common/Spinner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import './App.css';

const Landing = Loadable({
	loader: () => import('./components/layout/Landing'),
	loading: Spinner,
	delay: 500
});

const Login = Loadable({
	loader: () => import('./components/auth/Login'),
	loading: Spinner,
	delay: 500
});

const Register = Loadable({
	loader: () => import('./components/auth/Register'),
	loading: Spinner,
	delay: 500
});

const Dashboard = Loadable({
	loader: () => import('./components/dashboard/Dashboard'),
	loading: Spinner,
	delay: 500
});

const CreateProfile = Loadable({
	loader: () => import('./components/create-profile/CreateProfile'),
	loading: Spinner,
	delay: 500
});

const EditProfile = Loadable({
	loader: () => import('./components/edit-profile/EditProfile'),
	loading: Spinner,
	delay: 500
});

const AddExperience = Loadable({
	loader: () => import('./components/add-credentials/AddExperience'),
	loading: Spinner,
	delay: 500
});

const AddEducation = Loadable({
	loader: () => import('./components/add-credentials/AddEducation'),
	loading: Spinner,
	delay: 500
});

const Profiles = Loadable({
	loader: () => import('./components/profiles/Profiles'),
	loading: Spinner,
	delay: 500
});

const Profile = Loadable({
	loader: () => import('./components/Profile/Profile'),
	loading: Spinner,
	delay: 500
});

const Posts = Loadable({
	loader: () => import('./components/posts/Posts'),
	loading: Spinner,
	delay: 500
});

const Post = Loadable({
	loader: () => import('./components/post/Post'),
	loading: Spinner,
	delay: 500
});

const NotFound = Loadable({
	loader: () => import('./components/not-found/NotFound'),
	loading: Spinner,
	delay: 500
});

// Check for token
if (localStorage.jwtToken) {
	// Set auth token header auth
	setAuthToken(localStorage.jwtToken);
	// Decode token and get user info and exp
	const decoded = jwt_decode(localStorage.jwtToken);
	// Set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));

	// Check for expired token
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		// Logout user
		store.dispatch(logoutUser());
		// Clear current Profile
		store.dispatch(clearCurrentProfile());
		// Redirect to login
		window.location.href = '/login';
	}
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<div className="App">
						<Navbar />
				
						<Route 
							path="/" 
							exact={true} 
							component={Landing} 
						/>
						
						<div className="container">
							<Switch>
								<Route exact={true} path="/register" component={Register} />
								<Route exact={true} path="/login" component={Login} />
								<Route exact={true} path="/profiles" component={Profiles} />
								<Route exact={true} path="/profile/:handle" component={Profile} />
								<Route exact={true} path="/not-found" component={NotFound} />
								<PrivateRoute 
									exact={true} 
									path="/dashboard" 
									component={Dashboard} 
								/>
								<PrivateRoute 
									exact={true} 
									path="/create-profile" 
									component={CreateProfile} 
								/>
								<PrivateRoute 
									exact={true} 
									path="/edit-profile" 
									component={EditProfile} 
								/>
								<PrivateRoute 
									exact={true} 
									path="/add-experience" 
									component={AddExperience} 
								/>
								<PrivateRoute 
									exact={true} 
									path="/add-education" 
									component={AddEducation} 
								/>
								<PrivateRoute 
									exact={true} 
									path="/feed" 
									component={Posts} 
								/>
								<PrivateRoute 
									exact={true} 
									path="/feed" 
									component={Posts} 
								/>
								<PrivateRoute 
									exact={true} 
									path="/post/:id" 
									component={Post} 
								/>
							</Switch>
						</div>
						
						<Footer />
					</div>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default App;

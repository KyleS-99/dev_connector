import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ProfileHeader from './ProfileHeader';
import ProfileGithub from './ProfileGithub';
import ProfileCreds from './ProfileCreds';
import ProfileAbout from './ProfileAbout';
import Spinner from '../common/Spinner';
import { getProfileByHandle } from '../../actions/profileActions';

class Profile extends Component {
    componentDidMount() {
        if (this.props.match.params.handle) {
            this.props.getProfileByHandle(this.props.match.params.handle);
        }
    }
    componentDidUpdate(prevProps) {
        // If user logs out while on route redirect them
        if (this.props.profile.profile === null && prevProps.profile.profile !== null) {
            return this.props.history.push('/login');
        }

        if (this.props.profile.profile === null && this.props.profile.loading === false) {
            this.props.history.push('/not-found');
        }
    }
    render() {
        const { profile, loading } = this.props.profile;
        let profileContent;

        if (profile === null || loading) {
            profileContent = <Spinner />
        } else {
            profileContent = (
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <Link to="/profiles" className="btn btn-light mb-3 float-left">
                                Back To Profiles
                            </Link>
                        </div>
                        <div className="col-md-6" />
                    </div>
                    <ProfileHeader profile={profile} />
                    <ProfileAbout profile={profile} />
                    <ProfileCreds 
                        education={profile.education} 
                        experience={profile.experience} 
                    />
                    {profile.githubusername && <ProfileGithub username={profile.githubusername} />}
                </div>
            );
        }

        return (
            <div className="profile">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {profileContent}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    profile: PropTypes.object.isRequired,
    getProfileByHandle: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfileByHandle })(Profile);
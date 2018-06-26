import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getProfiles } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import ProfileItem from './ProfileItem';

class Profiles extends Component {
    componentDidMount() {
        this.props.getProfiles();
    }
    render() {
        const { profiles, loading } = this.props.profile;
        let profileItems;

        // Display spinner while profiles are being fetched
        if (profiles === null || loading) {
            profileItems = <Spinner />
        } else if (profiles.length > 0) {
            // Display individual profiles
            profileItems = profiles.map((profile) => <ProfileItem key={profile._id} profile={profile} /> );
        } else {
            // No one has created a profile yet
            profileItems = <h4>No profiles found...</h4>
        }

        return (
            <div className="profiles">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="display-4 text-center">
                                Developer Profiles
                            </h1>
                            <p className="lead text-center">
                                Browse and connect with other developers
                            </p>
                            {profileItems}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Profiles.propTypes = {
    profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
import React from 'react';
import PropTypes from 'prop-types';

import isEmpty from '../../validation/is-empty';

const ProfileHeader = (props) => {
    const { profile } = props;
    
    // Display social media links - Staying "DRY"
    const renderSocialMediaLinks = (socObj) => {
        // Make sure object isn't empty
        if (!isEmpty(socObj)) {
            // Get the individaul keys twitter, facebook, etc...
            return Object.keys(socObj).map((key) => {
                // Make sure they're not empty
                if (!isEmpty(socObj[key])) {
                    // Initialize link variable
                    let link;

                    // If url contains www. replace with https:// and set it to the link else leave as is
                    if (socObj[key].includes('www.')) {
                        let convertedUrl = socObj[key].replace(/www\./i, 'https://');
                        link = convertedUrl;
                    } else {
                        link = socObj[key];
                    }

                    // JSX to display for each one icon changes based on the key variable
                    return (
                        <a key={key} className="text-white p-2" href={link} rel="noopener noreferrer" target="_blank">
                            <i className={`fab fa-${key} fa-2x`}></i>
                        </a>
                    );
                }
            });
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card card-body bg-info text-white mb-3">
                    <div className="row">
                        <div className="col-4 col-md-3 m-auto">
                            <img className="rounded-circle" src={profile.user.avatar} alt="" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="display-4 text-center">{profile.user.name}</h1>
                        <p className="lead text-center">
                            {profile.status} {isEmpty(profile.company) ? null : (<span>at {profile.company}</span>)}
                        </p>
                        {isEmpty(profile.location) ? null : (<p>{profile.location}</p>)}
                        <p>
                            {isEmpty(profile.website) ? null : (
                                <a className="text-white p-2" href={profile.website.replace(/www\./i, 'http://')} rel="noopener noreferrer" target="_blank">
                                    <i className="fas fa-globe fa-2x"></i>
                                </a>
                            )}

                            {renderSocialMediaLinks(profile.social)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProfileHeader.propTypes = {
    profile: PropTypes.object.isRequired
};

export default ProfileHeader;
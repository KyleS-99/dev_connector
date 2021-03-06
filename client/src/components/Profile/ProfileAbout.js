import React from 'react';
import PropTypes from 'prop-types';

import isEmpty from '../../validation/is-empty';

const ProfileAbout = (props) => {
    const { profile } = props;
    
    // Get first name
    const firstName = profile.user.name.trim().split(' ')[0];

    // correct the grammar
    const apostrophe = firstName.slice(-1).toLowerCase() === 's' ? '\'' : '\'s'; 

    // combine firstName and apostrophe
    const name = firstName + apostrophe;

    // Skill list
    const skills = profile.skills.map((skill, index) => (
        <div key={index} className="p-3">
            <i className="fa fa-check" /> {skill}
        </div>
    ));

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card card-body bg-light mb-3">
                    <h3 className="text-center text-info">{name} Bio</h3>
                    {isEmpty(profile.bio) ? (<span>{firstName} doesn't have a bio</span>) : (<p className="lead">{profile.bio}</p>)}
                    <hr />
                    <h3 className="text-center text-info">Skill Set</h3>
                    <div className="row">
                        <div className="d-flex flex-wrap justify-content-center align-items-center">
                            {skills}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired
};

export default ProfileAbout;
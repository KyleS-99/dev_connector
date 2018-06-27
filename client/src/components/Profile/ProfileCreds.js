import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileCreds = (props) => {
    const { experience, education } = props;

    const expItems = experience.map((exp) => 
        <li key={exp._id} className="list-group-item">
            <h4>{exp.company}</h4>
            <p>
                <Moment format="MM/DD/YYYY">{exp.from}</Moment> - {' '}
                {exp.to === null ? (' Now') : (<Moment format="MM/DD/YYYY">{exp.to}</Moment>)}
            </p>
            <p><strong>Position:</strong> {exp.title}</p>
            {exp.location === '' ? null : (<p><strong>Location:</strong> {exp.location}</p>)}
            {exp.description === '' ? null : (<p><strong>Description:</strong> {exp.description}</p>)}
        </li>
    );

    const eduItems = education.map((edu) => 
        <li key={edu._id} className="list-group-item">
            <h4>{edu.school}</h4>
            <p>
                <Moment format="MM/DD/YYYY">{edu.from}</Moment> - {' '}
                {edu.to === null ? (' Now') : (<Moment format="MM/DD/YYYY">{edu.to}</Moment>)}
            </p>
            <p><strong>Degree:</strong> {edu.degree ? edu.degree : 'No degree listed'}</p>
            <p><strong>Field of Study:</strong> {edu.fieldofstudy ? edu.fieldofstudy : 'No field of study listed'}</p>
            {edu.description === '' ? null : (<p><strong>Description:</strong> {edu.description}</p>)}
        </li>
    );

    return (
        <div className="row">
            <div className="col-md-6">
                <h3 className="text-center text-info">Experience</h3>
                {expItems.length > 0 ? (
                    <ul className="list-group">
                        {expItems}
                    </ul>
                ) : (
                    <p className="text-center">No Experience Listed</p>
                )}
            </div>

            <div className="col-md-6">
                <h3 className="text-center text-info">Education</h3>
                {eduItems.length > 0 ? (
                    <ul className="list-group">
                        {eduItems}
                    </ul>
                ) : (
                    <p className="text-center">No Education Listed</p>
                )}
            </div>
        </div>
    );
}

ProfileCreds.propTypes = {
    experience: PropTypes.array,
    education: PropTypes.array
};

export default ProfileCreds;
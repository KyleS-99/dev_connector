import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addEducation } from '../../actions/profileActions';

class AddEducation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            school: '',
            degree: '',
            fieldofstudy: '',
            from: '',
            to: '',
            current: false,
            description: '',
            errors: {},
            disabled: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onCheck = this.onCheck.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.errors !== this.props.errors) {
            this.setState({
                errors: this.props.errors
            });
        }
    }
    onSubmit(e) {
        e.preventDefault();

        let {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = this.state;

        // Check to see if user set to even though they still work there currently
        if (current) {
            to = '';
        }
        
        const eduData = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        };

        this.props.addEducation(eduData, this.props.history);
    }
    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onCheck() {
        this.setState({
            current: !this.state.current,
            disabled: !this.state.disabled
        });
    }
    render() {
        const { errors } = this.state;

        return (
            <div className="add-education">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <Link to="/dashboard" className="btn btn-light">
                                Go back
                            </Link>
                            <h1 className="display-4 text-center">Add Education</h1>
                            <p className="lead text-center">Add any school, bootcamp, etc. That you've attended</p>
                            <small className="d-block pb-3">* = required fields</small>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup 
                                    placeholder="* School"
                                    name="school"
                                    value={this.state.school}
                                    onChange={this.onInputChange}
                                    error={errors.school}
                                />
                                <TextFieldGroup 
                                    placeholder="* Degree or Certification"
                                    name="degree"
                                    value={this.state.degree}
                                    onChange={this.onInputChange}
                                    error={errors.degree}
                                />
                                <TextFieldGroup 
                                    placeholder="* Field of Study"
                                    name="fieldofstudy"
                                    value={this.state.fieldofstudy}
                                    onChange={this.onInputChange}
                                    error={errors.fieldofstudy}
                                />
                                <h6>* From Date</h6>
                                <TextFieldGroup 
                                    name="from"
                                    type="date"
                                    value={this.state.from}
                                    onChange={this.onInputChange}
                                    error={errors.from}
                                />
                                <h6>To Date</h6>
                                <TextFieldGroup 
                                    name="to"
                                    type="date"
                                    value={this.state.to}
                                    onChange={this.onInputChange}
                                    error={errors.to}
                                    disabled={this.state.disabled ? 'disabled' : ''}
                                />
                                <div className="form-check mb-4">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input"
                                        name="current"
                                        value={this.state.current}
                                        checked={this.state.current}
                                        onChange={this.onCheck}
                                        id="current"
                                    />
                                    <label htmlFor="current" className="form-check-label">
                                        Currently Attending
                                    </label>
                                </div>
                                <TextAreaFieldGroup 
                                    placeholder="Program Description"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.onInputChange}
                                    error={errors.description}
                                    info="Tell us about the program that you were/are in"
                                />
                                <input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AddEducation.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    addEducation: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    errors: state.errors
});

export default connect(mapStateToProps, { addEducation })(AddEducation);
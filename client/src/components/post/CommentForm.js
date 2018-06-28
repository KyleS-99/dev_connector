import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addComment } from '../../actions/postActions';
import { getCurrentProfile } from "../../actions/profileActions";
import isEmpty from '../../validation/is-empty';

class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            errors: {}
        };
        this.props.getCurrentProfile();
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onSubmit(e) {
        e.preventDefault();

        const { postId } = this.props;
        const { user } = this.props.auth;
        const { profile } = this.props.profile;

        const newComment = {
            text: this.state.text,
            name: !isEmpty(profile.handle) ? profile.handle : user.name,
            avatar: user.avatar
        };

        this.props.addComment(postId, newComment);
        
        if (this.state.text.length > 10) {
            this.setState({ text: '' });
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.errors !== this.props.errors) {
            this.setState({ errors: this.props.errors });
        }
    }
    render() {
        const { errors } = this.state;

        return (
            <div className="post-form mb-3">
                <div className="card card-info">
                    <div className="card-header bg-info text-white">
                        Make a comment...
                    </div>
                    <div className="card-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <TextAreaFieldGroup 
                                    placeholder="Reply to post"
                                    name="text"
                                    value={this.state.text}
                                    onChange={this.onInputChange}
                                    error={errors.text}
                                />
                            </div>
                            <button type="submit" className="btn btn-dark">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

CommentForm.propTypes = {
    errors: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    addComment: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    errors: state.errors,
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { addComment, getCurrentProfile })(CommentForm);
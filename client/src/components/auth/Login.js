import React, { Component } from 'react';
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import { loginUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            errors: {}
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }

        if (prevProps.errors !== this.props.errors) {
            this.setState({errors: this.props.errors});
        }
    }
    componentWillMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }
    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onSubmit(e) {
        e.preventDefault();
        const { email, password } = this.state;

        const userData = {
            email,
            password
        };
        
        this.props.loginUser(userData);
    }
    render() {
        const { errors } = this.state;

        return (
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Log In</h1>
                            <p className="lead text-center">Sign in to your DevConnector account</p>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup 
                                    placeholder="Email Address"
                                    name="email"
                                    type="text" 
                                    value={this.state.email}
                                    onChange={this.onInputChange}
                                    error={errors.email}
                                />
                                
                                <TextFieldGroup 
                                    placeholder="Password"
                                    name="password"
                                    type="password" 
                                    value={this.state.password}
                                    onChange={this.onInputChange}
                                    error={errors.password}
                                />
                                
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: propTypes.func.isRequired,
    auth: propTypes.object.isRequired,
    errors: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(withRouter(Login));
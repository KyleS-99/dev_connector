import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class ProfileGithub extends Component {
    constructor() {
        super();

        this.state = {
            repos: [],
            error: false
        };
    }
    componentDidMount() {
        const { username } = this.props;

        // Make a request to our api, then if repos found set them 
        // If user doesn't exist then set the error in state
        axios.get(`/api/profile/githubusername/${username}`)
            .then((res) => {
                if (this.refs.myRef) {
                    this.setState({ repos: res.data.repos })
                }
            })
            .catch((err) => this.setState({ error: err.response.data.notfound }));
    }
    render() {
        const { repos } = this.state;

        const repoItems = repos.map((repo) => (
            <div key={repo.id} className="card card-body mb-2">
                <div className="row">
                    <div className="col-md-6">
                        <h4>
                            <a href={repo.html_url} className="text-info" target="_blank">
                                {repo.name}
                            </a>
                        </h4>
                        <p>
                            {repo.description}
                        </p>
                    </div>
                    
                    <div className="col-md-6">
                        <span className="badge badge-info mr-1">
                            Stars: {repo.stargazers_count}
                        </span>
                        <span className="badge badge-secondary mr-1">
                            Watchers: {repo.watchers_count}
                        </span>
                        <span className="badge badge-success">
                            Forks: {repo.forks_count}
                        </span>
                    </div>
                </div>
            </div>
        ));

        return (
            <div ref="myRef">
                <hr />
                <h3 className="mb-4">Latest Github Repos</h3>
                {repoItems}
                {this.state.error && <p>{this.state.error}</p>}
            </div>
        );
    }
}

ProfileGithub.propTypes = {
    username: PropTypes.string.isRequired
};

export default ProfileGithub;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load profile model
const Profile = require('../../models/Profile');

// Load User Profile
const User = require('../../models/User');

// Load Profile data validator
const validateProfileInput = require('../../validation/profile');

// @route   GET /api/profile/
// @desc    Get current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then((profile) => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors)
            }

            res.json(profile);
        })
        .catch((e) => res.status(404).json(err));
});

// @route   GET /api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
    const errors = {};

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then((profiles) => {
            if (!profiles || profiles.length === 0) {
                errors.noprofile = 'There are no profiles';
                return res.status(404).json(errors);
            }

            res.json(profiles);
        })
        .catch((e) => {
            errors.profile = 'There are no profiles';
            res.status(404).json(errors);
        });
});

// @route   GET /api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then((profile) => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch((e) => res.status(404).json(e));
});

// @route   GET /api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then((profile) => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch((e) => {
            errors.profile = 'There is no profile for this user';
            res.status(404).json(errors);
        });
});

// @route   POST /api/profile/
// @desc    Create or edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.social = {};

    const whiteList = ['handle', 'company', 'website', 'bio', 'status', 'githubusername', 'skills', 'youtube', 'twitter', 'instagram', 'facebook', 'linkedin'];
    const inputData = Object.keys(req.body); 

    for (key of inputData) {
        if (whiteList.includes(key)) {
            if (key === 'skills' && typeof req.body.skills !== 'undefined') {
                profileFields[key] = req.body.skills.split(',');
            } else if (['youtube', 'twitter', 'instagram', 'facebook'].includes(key) && req.body[key]) {
                profileFields.social[key] = req.body[key];
            } else if (req.body[key]) {
                profileFields[key] = req.body[key];
            }
        }
    }

    Profile.findOne({ user: req.user.id })
        .then((profile) => {
            // Update
            if (profile) {
                // User updating handle
                if (profileFields.handle !== undefined) {
                    Profile
                    .findOne({ handle: profileFields.handle })
                    .then((profile) => {
                        // no one has that handle go ahead and update database
                        if (!profile) {
                            Profile.findOneAndUpdate(
                                { user: req.user.id }, 
                                { $set: profileFields }, 
                                { new: true })
                                .then((profile) => res.json(profile));

                        // If profile.user === req.user.id we know that
                        // it's the same user with the same handle so we allow
                        // them to update their profile using that same handle
                        } else if (profile.user.toString() === req.user.id) {
                            Profile.findOneAndUpdate(
                                { user: req.user.id }, 
                                { $set: profileFields }, 
                                { new: true })
                                .then((profile) => res.json(profile));
                        } else {
                            // user already has this handle
                            errors.handle = 'That handle already exists';
                            return res.status(400).json(errors);
                        }
                    })
                // profileFields.handle is undefined go ahead and update their profile
                } else {
                    Profile.findOneAndUpdate(
                        { user: req.user.id }, 
                        { $set: profileFields }, 
                        { new: true })
                        .then((profile) => res.json(profile));
                }
            } else {
                // Create

                // Check if handle exists
                Profile.findOne({ handle: profileFields.handle }).then((profile) => {
                    if (profile) {
                        errors.handle = 'That handle already exists';
                        return res.status(400).json(errors);
                    }

                    // Save profile
                    new Profile(profileFields).save().then((profile) => res.json(profile));
                });
            }
        });
});

module.exports = router;
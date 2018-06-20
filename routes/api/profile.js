const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load profile model
const Profile = require('../../models/Profile');

// Load User model
const User = require('../../models/User');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

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
        .catch((e) => res.status(404).json(e));
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

// @route   POST /api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
        .then((profile) => {
            const { title, company, location, from, to, current, description } = req.body;
            const newExp = {
                title,
                company,
                location,
                from,
                to,
                current,
                description
            };

            // Add to exp array
            profile.experience.unshift(newExp);

            profile.save().then((profile) => res.json(profile));
        });
});

// @route   POST /api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
        .then((profile) => {
            const { school, degree, fieldofstudy, from, to, current, description } = req.body;
            const newEdu = {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
            };

            // Add to exp array
            profile.education.unshift(newEdu);

            profile.save().then((profile) => res.json(profile));
        });
});

// @route   DELETE /api/profile/experience
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then((profile) => {
            // Initialize errors object
            const errors = {};

            // remove experience with the id that user is requesting
            const updatedExperience = profile.experience
                .filter((experience) => !(experience.id === req.params.exp_id));
            
            // Only make a request to the database if data was actually changed
            if (updatedExperience.length !== profile.experience.length) {
                // Update the array of experiences with the new
                profile.experience = updatedExperience;

                // update database with new experience array
                profile.save().then((profile) => res.json(profile));
            } else {
                res.status(400).send();
            }
        })
        .catch((e) => res.status(404).json(err));
});

// @route   DELETE /api/profile/education
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then((profile) => {
            // Initialize errors object
            const errors = {};

            // remove education object with the id that user is requesting
            const updatedEducation = profile.education
                .filter((education) => !(education.id === req.params.edu_id));
            
            // Only make a request to the database if data was actually changed
            if (updatedEducation.length !== profile.education.length) {
                // Update the array education with the updated one
                profile.education = updatedEducation;

                // update database with new education array
                profile.save().then((profile) => res.json(profile));
            } else {
                res.status(400).send();
            }
        })
        .catch((e) => res.status(404).json(err));
});

// @route   DELETE /api/profile/
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id })
                .then(() => res.json({ success: true }));
        });
});

module.exports = router;
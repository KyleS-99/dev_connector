const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load post model
const Post = require('../../models/Post');

// Post validation
const validatePostInput = require('../../validation/post');

// @route   POST /api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    const { text, name, avatar } = req.body;
    const newPost = new Post({
        text,
        name,
        avatar,
        user: req.user.id
    });

    newPost.save().then((post) => res.json(post));
});

module.exports = router;
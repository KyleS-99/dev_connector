const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Post validation
const validatePostInput = require('../../validation/post');

// @route   GET /api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then((posts) => res.json(posts))
        .catch((e) => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET /api/posts/:id
// @desc    Get posts
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then((post) => res.json(post))
        .catch((e) => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

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

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then((profile) => {
            Post.findById(req.params.id)
                .then((post) => {
                    // Check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notauthorized: 'User not authorized' });
                    }

                    post.remove().then(() => res.json({ success: true }));
                })
                .catch((e) => res.status(404).json({ postnotfound: 'No post found' }));
        })
});

module.exports = router;
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
        });
});

// @route   POST /api/posts/like/:id
// @desc    Like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({ alreadyliked: 'User already liked this post' })
            }

            // Add user id to likes array
            post.likes.unshift({ user: req.user.id });

            // Save to database
            post.save().then((post) => res.json(post));
        })
        .catch((e) => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   POST /api/posts/like/:id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json({ noliked: 'You\'ve not yet liked this post' });
            }

            // remove user that liked the post from the post.likes array
            post.likes = post.likes.filter((like) => like.user.toString() !== req.user.id);

            // Save to database
            post.save().then((post) => res.json(post));
        })
        .catch((e) => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   POST /api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then((post) => {
            const { text, name, avatar } = req.body;
            const newComment = {
                text,
                name,
                avatar,
                user: req.user.id
            };

            // Add to comments array
            post.comments.unshift(newComment);

            // Save to database
            post.save().then((post) => res.json(post));
        })
        .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   DELETE /api/posts/comment/:id/:comment_id
// @desc    Delete a comment to post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            // Check to see if comment exists
            if (post.comments.filter((comment) => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({ commentnotexists: 'Comment doesn\'t exist' });
            }

            // Filter the comment to be deleted
            const updatedComments = post.comments.filter((comment) => !(comment.user.toString() === req.user.id && comment._id.toString() === req.params.comment_id));

            // Check to see if the user is authorized to delete that comment
            // They will only be able to delete that comment if they're the creator of it
            if (updatedComments.length === post.comments.length) {
                return res.status(401).json({ notauthorized: 'If you\'re seeing this that means either of three things \n 1. You used postman or some other tool to send this request to delete someone else\'s comment \n 2. You changed the JavaScript on the front-end to send this request \n 3. You made your own script to make the requst.'});
            }

            // Update comments
            post.comments = updatedComments;

            // Save to database
            post.save().then((post) => res.json(post));
        })
        .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
});

module.exports = router;
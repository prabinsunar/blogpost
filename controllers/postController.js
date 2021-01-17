const User = require('../models/users');
const Post = require('../models/posts');
const { body, validationResult } = require('express-validator');

exports.create_post_get = (req, res) => {
	res.render('create-post', {
		title: 'Create a post',
		errors: false,
	});
};

exports.create_post_post = [
	body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
	body('post', 'Post must not be empty').trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		let post = new Post({
			title: req.body.title,
			post: req.body.post,
			user: req.params.id,
		});

		if (!errors.isEmpty()) {
			res.render('create-post', {
				title: 'Create a post',
				post,
				errors: errors.array(),
			});
		} else {
			post.save(err => {
				if (err) {
					return next(err);
				}

				res.redirect('/');
			});
		}
	},
];

exports.delete_post_get = (req, res) => {
	res.render('delete-post', {
		title: 'Delete post',
		id: req.params.id,
		errors: false,
	});
};

exports.delete_post_post = [
	body('postid', 'Post Id cannot be empty').isLength({ min: 1 }).escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render('delete-post', {
				title: 'Delete the post',
				id: req.params.id,
				errors: errors.array(),
			});
		} else {
			Post.findByIdAndRemove(req.body.postid, err => {
				if (err) {
					return next(err);
				}

				res.redirect('/');
			});
		}
	},
];

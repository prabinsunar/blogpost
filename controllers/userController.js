const User = require('../models/users');
const Post = require('../models/posts');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// const { passport } = require('../app');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ username: username }).exec((err, user) => {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, { msg: 'User not found' });
			}

			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					return done(null, user);
				} else {
					return done(null, false, { msg: 'Incorrect password' });
				}
			});
		});
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).exec((err, user) => {
		done(err, user);
	});
});

exports.index = (req, res, next) => {
	Post.find()
		.populate('user')
		.exec((err, posts) => {
			if (err) {
				return next(err);
			}

			res.render('index', {
				title: 'This is from home',
				user: req.user,
				posts,
			});
		});
};

exports.create_user_get = (req, res) => {
	res.render('create-user', {
		title: 'Sign Up',
		errors: false,
		user: false,
	});
};

exports.create_user_post = [
	body('firstname', 'Firstname must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('lastname').trim().isLength({ min: 1 }).escape(),
	body('username')
		.trim()
		.isLength({ min: 1 })
		.isEmail()
		.withMessage('Should be an email'),
	body('password').trim().isLength({ min: 1 }).escape(),
	body('confirm_password', 'Passwords must be matching')
		.isLength({ min: 1 })
		.custom((value, { req }) => value === req.body.password),
	body('status').escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		let user = new User({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			username: req.body.username,
			password: '',
			membershipt_status: req.body.status,
		});

		if (!errors.isEmpty()) {
			res.render('create-user', {
				title: 'Sign Up',
				user,
				errors: errors.array(),
			});
		} else {
			bcrypt.hash(req.body.password, 10, (err, hashedpassword) => {
				if (err) {
					return next(err);
				}

				user.password = hashedpassword;
				user.save(err => {
					if (err) {
						return next(err);
					}

					res.redirect('/');
				});
			});
		}
	},
];

exports.join_club_get = (req, res) => {
	res.render('join-club', {
		title: 'Join the club',
		info: false,
		errors: false,
	});
};

exports.join_club_post = [
	body('code', 'Field must not be empty').trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render('join-club', {
				title: 'Join the club',
				info: 'Please fill the field',
				errors: errors.array(),
			});
		} else {
			if (req.body.code === process.env.CODE) {
				User.findByIdAndUpdate(
					req.params.id,
					{ membership_status: 'Member' },
					(err, user) => {
						if (err) {
							return next(err);
						}

						res.redirect(user.url);
					}
				);
			} else {
				res.render('join-club', {
					title: 'Join the club',
					info: "Sorry, the code didn't match.",
					errors: false,
				});
			}
		}
	},
];

exports.login_get = (req, res) => {
	res.render('login', {
		title: 'Login here',
		errors: false,
	});
};

exports.logout_get = (req, res) => {
	req.logout();
	res.redirect('/');
};

exports.login_post = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/',
});

exports.user_get = (req, res, next) => {
	User.findById(req.params.id).exec((err, user) => {
		if (err) {
			return next(err);
		}

		res.render('user', { title: 'User info', user });
	});
};

exports.admin_get = (req, res) => {
	res.render('admin', {
		title: 'Admin access',
		errors: false,
		info: false,
	});
};

exports.admin_post = [
	body('admin', 'Code must not be empty').trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render('admin', {
				title: 'Admin access',
				info: false,
				errors: errors.array(),
			});
		} else {
			if (req.body.admin === process.env.ADMIN_CODE) {
				User.findByIdAndUpdate(req.params.id, { admin: true }, (err, user) => {
					if (err) {
						return next(err);
					}

					res.redirect(user.url);
				});
			} else {
				res.render('admin', {
					title: 'Admin access',
					info: "Sorry couldn't match the code",
				});
			}
		}
	},
];

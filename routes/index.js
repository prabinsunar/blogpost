const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

router.get('/', userController.index);

router.get('/sign-up', userController.create_user_get);

router.post('/sign-up', userController.create_user_post);

router.get('/log-in', userController.login_get);

router.post('/log-in', userController.login_post);

router.get('/logout', userController.logout_get);

router.get('/:id', userController.user_get);

router.get('/:id/create-post', postController.create_post_get);

router.post('/:id/create-post', postController.create_post_post);

router.get('/:id/join-club', userController.join_club_get);

router.post('/:id/join-club', userController.join_club_post);

router.get('/:id/admin', userController.admin_get);

router.post('/:id/admin', userController.admin_post);

router.get('/posts/:id/delete', postController.delete_post_get);

router.post('/posts/:id/delete', postController.delete_post_post);

module.exports = router;

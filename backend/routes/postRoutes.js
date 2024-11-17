const router = require('express').Router();
const postController = require('../controllers/postController');

router.post('/', postController.createPost);
router.get('/:id', postController.getPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.put('/:id/like_dislike', postController.likeDislikePost);
router.get('/:id/timeline', postController.timeline);

module.exports = router;

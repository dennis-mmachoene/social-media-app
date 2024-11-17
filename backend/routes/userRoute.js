const router = require('express').Router();
const userController = require('../controllers/userController');
const { auth }= require('../middleware/auth');

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUser);
router.put('/:id', auth, userController.updateUser)
router.delete('/:id', auth, userController.deleteUser);
router.put('/:id/follow', auth, userController.followUser)
router.put('/:id/unfollow', auth, userController.unfollowUser);

module.exports = router;
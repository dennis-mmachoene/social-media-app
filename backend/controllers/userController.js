const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Common error handler
const handleError = (res, err, message = 'An error occurred') => {
    console.error(err);
    return res.status(500).json({ message });
};

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }, // Exclude password from response
        });
        res.status(200).json(users);
    } catch (err) {
        handleError(res, err, 'Error fetching users');
    }
};

// Get User by ID
exports.getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            where: { id },
            attributes: { exclude: ['password'] },
        });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        handleError(res, err, 'Error fetching user');
    }
};

// Update User Profile
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const authenticatedUserID = req.user.id; // Assuming req.user is populated via authentication middleware

    if (parseInt(id, 10) !== parseInt(authenticatedUserID, 10)) {
        return res.status(403).json({ message: 'You can only update your own profile.' });
    }

    try {
        const { password, ...otherUpdates } = req.body;
        if (password) {
            otherUpdates.password = await bcrypt.hash(password, 10); // Hash new password if provided
        }

        const [updatedCount, updatedUsers] = await User.update(otherUpdates, {
            where: { id },
            returning: true, // Ensure updated user data is returned
        });

        if (updatedCount === 0) {
            return res.status(404).json({ message: 'User not found or no changes made.' });
        }

        const updatedUser = updatedUsers[0];

        // Generate a new token (if needed)
        const token = jwt.sign(
            { id: updatedUser.id, email: updatedUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'User updated successfully.',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
            },
            token,
        });
    } catch (error) {
        handleError(res, error, 'Error updating user');
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const authenticatedUserID = req.user.id;
    const isAdmin = req.user.isAdmin;

    if (parseInt(id, 10) !== parseInt(authenticatedUserID, 10) && !isAdmin) {
        return res.status(403).json({ message: 'You do not have permission to delete this account.' });
    }

    try {
        const deletedCount = await User.destroy({ where: { id } });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        handleError(res, error, 'Error deleting user');
    }
};

// Follow User
exports.followUser = async (req, res) => {
    const { id: followUserID } = req.params;
    const { id: followerUserID } = req.body;

    if (followUserID === followerUserID) {
        return res.status(403).json({ message: 'Action forbidden: You cannot follow yourself.' });
    }

    try {
        const [followUser, followingUser] = await Promise.all([
            User.findOne({ where: { id: followUserID } }),
            User.findOne({ where: { id: followerUserID } }),
        ]);

        if (!followUser || !followingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!followUser.followers.includes(followerUserID)) {
            followUser.followers.push(followerUserID);
            followingUser.following.push(followUserID);

            await Promise.all([followUser.save(), followingUser.save()]);
            res.status(200).json({ message: 'User followed successfully' });
        } else {
            res.status(403).json({ message: 'User is already followed by you' });
        }
    } catch (err) {
        handleError(res, err, 'Error following user');
    }
};

// Unfollow User
exports.unfollowUser = async (req, res) => {
    const { id: followUserID } = req.params;
    const { id: unfollowerUserID } = req.body;

    if (followUserID === unfollowerUserID) {
        return res.status(403).json({ message: 'Action forbidden: You cannot unfollow yourself.' });
    }

    try {
        const [followUser, followingUser] = await Promise.all([
            User.findOne({ where: { id: followUserID } }),
            User.findOne({ where: { id: unfollowerUserID } }),
        ]);

        if (!followUser || !followingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (followUser.followers.includes(unfollowerUserID)) {
            followUser.followers = followUser.followers.filter(follower => follower !== unfollowerUserID);
            followingUser.following = followingUser.following.filter(following => following !== followUserID);

            await Promise.all([followUser.save(), followingUser.save()]);
            res.status(200).json({ message: 'User unfollowed successfully' });
        } else {
            res.status(403).json({ message: 'User is not followed by you' });
        }
    } catch (err) {
        handleError(res, err, 'Error unfollowing user');
    }
};

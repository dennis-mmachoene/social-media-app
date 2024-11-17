const { Op } = require('sequelize');
const Post = require('../models/Post');
const User = require('../models/User');

// Helper function to check if a post exists and belongs to the correct user
const getPostAndCheckOwnership = async (postId, userId) => {
    const post = await Post.findByPk(postId);
    if (!post) {
        throw new Error("Post not found");
    }
    if (post.userId !== userId) {
        throw new Error("Action forbidden");
    }
    return post;
};

// Create new post
exports.createPost = async (req, res) => {
    const { userId, desc, image } = req.body;

    if (!userId || !desc) {
        return res.status(400).json({ message: "userId and desc are required" });
    }

    try {
        const newPost = await Post.create({ userId, desc, image });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a post
exports.getPost = async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    const postId = req.params.id;
    const { userId, desc, image } = req.body;

    if (!userId || !desc) {
        return res.status(400).json({ message: "userId and desc are required" });
    }

    try {
        const post = await getPostAndCheckOwnership(postId, userId);
        await post.update({ desc, image });
        res.status(200).json({ message: "Post updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        const post = await getPostAndCheckOwnership(postId, userId);
        await post.destroy();
        res.status(200).json({ message: "Post deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Like/Dislike a post
exports.likeDislikePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const likes = post.likes || [];
        const isLiked = likes.includes(userId);

        const updatedLikes = isLiked
            ? likes.filter(id => id !== userId)
            : [...likes, userId];

        await post.update({ likes: updatedLikes });
        res.status(200).json({ message: isLiked ? "Post unliked." : "Post liked." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get timeline posts
exports.timeline = async (req, res) => {
    const userId = req.params.id;

    try {
        // Fetch the current user and their following users' posts
        const user = await User.findByPk(userId, {
            include: {
                model: User,
                as: "following",
                attributes: ["id"],
                through: { attributes: [] },
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const followingUserIds = user.following.map(follow => follow.id);
        const posts = await Post.findAll({
            where: {
                userId: { [Op.in]: [userId, ...followingUserIds] },
            },
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

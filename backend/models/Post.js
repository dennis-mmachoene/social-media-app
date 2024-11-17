const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING,
    },
    likes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    image: {
        type: DataTypes.STRING,
    },
},{

timestamps: true,
})

module.exports = Post;
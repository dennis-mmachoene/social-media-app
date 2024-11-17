const { DataTypes, DATE } = require('sequelize');
const sequelize = require('../config/database');
const { RelationshipType } = require('sequelize/lib/errors/database/foreign-key-constraint-error');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstname: {
        type: DataTypes.STRING,
    },
    lastname: {
        type: DataTypes.STRING,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    profilePicture: {
        type: DataTypes.STRING,
    },
    coverPicture: {
        type: DataTypes.STRING,
    },
    about: {
        type: DataTypes.STRING,
    },
    livesin: {
        type: DataTypes.STRING,
    },
    worksAt: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    relationship: {
        type: DataTypes.STRING,
    },
    followers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    following: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
},
    {
        timestamps: true,
    })

module.exports = User;
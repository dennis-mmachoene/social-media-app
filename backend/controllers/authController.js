const User = require('../models/User'); // Adjust path as necessary
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not set in environment variables.');
        }

        // Find user by email
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password.' });
        }

        // Validate password
        const validPwd = await bcrypt.compare(password, user.password);
        if (!validPwd) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Exclude password before generating the token
        const { password: _, ...userDetails } = user.dataValues;

        // Generate JWT token with user details
        const token = jwt.sign(
            { user: userDetails },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response
        res.status(200).json({
            message: 'Login successful.',
            token,
            user: userDetails,
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
};

exports.registerUser = async (req, res) => {
    const { email, password, firstname, lastname, isAdmin } = req.body;

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not set in environment variables.');
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'This user already exists.' });
        }

        // Hash the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            email,
            password: hashedPwd,
            firstname,
            lastname,
            isAdmin: isAdmin || false, // Default to false if not provided
        });

        // Exclude password before generating the token
        const { password: _, ...userDetails } = newUser.dataValues;

        // Generate JWT token with user details
        const token = jwt.sign(
            { user: userDetails },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response
        res.status(201).json({
            message: 'User registered successfully!',
            user: userDetails,
            token,
        });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
};

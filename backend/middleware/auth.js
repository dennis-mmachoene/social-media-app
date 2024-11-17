const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.auth = async (req, res) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);

        if(token) {
            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = decoded.user;
        }
        next();
    }catch(err) {
        console.log(err);
    }
}
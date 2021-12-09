const jwt = require('jsonwebtoken')

//You should be putting this in a .env file
const secret = 'mysecretshh';
const expiration = '2h';

module.exports = {
    //the signToken() expects a user object and will add that user's username, email, and _id properties to the token. The expiration is optional
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id }

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration })
    }
}
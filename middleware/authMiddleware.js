const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Retrieve the token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If no token, return unauthorized
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // If token is not valid, return forbidden
        if (err) return res.sendStatus(403);
        req.user = user;
        next(); // Proceed to the next middleware
    });
}

module.exports = { 
    authenticateToken 
};
const jwt = require("jsonwebtoken");

exports.cookieJwtAuth = (role) => {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect("/login-options");
        }

        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            if (user.role !== role) {
                return res.status(403).send('Access Denied: You do not have the correct privilege');
            }
            req.user = user;
            next();
        } catch (err) {
            res.clearCookie("token");
            return res.redirect("/login-options");
        }
    };
};

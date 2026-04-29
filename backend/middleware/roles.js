const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ Message: "Access denied", Success: false });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ Message: "Access denied", Success: false });
        }

        next();
    };
};

module.exports = allowRoles;
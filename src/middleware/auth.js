const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const header = req.headers.authorization; // "Bearer <token>"

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ Message: "Access denied", Success: false });
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        req.user = decoded; // { userId, role, email }
        next();
    } catch (err) {
        return res.status(401).json({ Message: "Invalid token", Success: false });
    }
};

module.exports = auth;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateTokens = (userId, role) => ({
    accessToken: jwt.sign({ id: userId, role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "24h" }),
    refreshToken: jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })
});

exports.register = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ message: "User already exists" });
        const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role });
        res.status(201).json({ message: "User registered successfully", userId: user._id });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid credentials" });
        const { accessToken, refreshToken } = generateTokens(user._id, user.role);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" })
           .json({ accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.logout = async(req, res) => {
    try {
        if (req.cookies.refreshToken) await User.findOneAndUpdate({ refreshToken: req.cookies.refreshToken }, { refreshToken: null });
        res.clearCookie("refreshToken").json({ message: "Logged out successfully" });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.refreshToken = async(req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token" });
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: "Invalid refresh token" });
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) => {
            if (err) return res.status(403).json({ message: "Token expired" });
            res.json({ accessToken: generateTokens(user._id).accessToken });
        });
    } catch (e) { res.status(500).json({ message: e.message }); }
};
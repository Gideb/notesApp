const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) return reject(error);
      return resolve(`scrypt:${salt}:${derivedKey.toString("hex")}`);
    });
  });

const passwordsMatch = (password, storedPassword) => {
  const [algorithm, salt, key] = storedPassword.split(":");
  if (algorithm !== "scrypt" || !salt || !key) {
    return Promise.resolve({
      matches: password === storedPassword,
      isLegacy: true,
    });
  }

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) return reject(error);
      const storedKey = Buffer.from(key, "hex");
      if (storedKey.length !== derivedKey.length)
        return resolve({ matches: false, isLegacy: false });
      return resolve({
        matches: crypto.timingSafeEqual(storedKey, derivedKey),
        isLegacy: false,
      });
    });
  });
};

const createAccessToken = (userId) =>
  jwt.sign({ user: { _id: userId } }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

//signup
const signUp = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "Full name, email, and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: true, message: "User already exists." });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: await hashPassword(password),
    });
    return res.status(201).json({
      error: false,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdOn: user.createdAt,
      },
      accessToken: createAccessToken(user._id),
      message: "Registration successful.",
    });
  } catch (error) {
    return next(error);
  }
};

//login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }
    const { matches, isLegacy } = await passwordsMatch(password, user.password);
    if (!matches)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });

    // Existing plaintext passwords are upgraded after the first successful login.
    if (isLegacy) {
      user.password = await hashPassword(password);
      await user.save();
    }

    return res.json({
      error: false,
      message: "Login successful.",
      email: user.email,
      accessToken: createAccessToken(user._id),
    });
  } catch (error) {
    return next(error);
  }
};

//get user
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user._id);
    if (!user)
      return res.status(401).json({ error: true, message: "User not found." });

    return res.json({
      error: false,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdOn: user.createdAt,
      },
      message: "",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { signUp, login, getUser };

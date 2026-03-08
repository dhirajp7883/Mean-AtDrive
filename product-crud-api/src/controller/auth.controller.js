const db = require("../../config/mysql");
const bcrypt = require("bcrypt");
const User = require('../../models/user.model')
const jwt = require('jsonwebtoken')

exports.sqlRegister = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (username,password) VALUES (?,?)";

    await db.query(query, [username, hashedPassword]);

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};


exports.sqlLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const query = "SELECT * FROM users WHERE username = ?";
    const [results] = await db.query(query, [username]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRETEKEY, { expiresIn: '1d' });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// mongodb based auth controller

exports.mongoRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const error = new Error('Username and password are required');
      error.statusCode = 400;
      return next(error);
    }

    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters');
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      const error = new Error('User already exists, please login');
      error.statusCode = 409;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    next(error);
  }
}

exports.mongoLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const error = new Error('Username and password are required');
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      return next(error);
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      { id: existingUser._id, username: existingUser.username },
      process.env.SECRETEKEY,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: existingUser._id,
        username: existingUser.username
      }
    });

  } catch (error) {
    next(error);
  }
}
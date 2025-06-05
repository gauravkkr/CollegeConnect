const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Return user object with id, name, email, and role
    res.status(201).json({
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role || 'user',
      },
      token
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Return user object with id, name, email, and role
    res.json({
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role || 'user',
      },
      token
    });
  } catch (err) {
    next(err);
  }
};

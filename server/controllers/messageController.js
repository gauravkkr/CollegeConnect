const Message = require('../models/Message');

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ listingId: req.params.listingId });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const message = await Message.create({ ...req.body, senderId: req.user.id });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

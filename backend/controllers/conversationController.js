const Conversation = require('../models/Conversation');
const User = require('../models/User');

const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email profilePicture headline')
      .populate('messages.from', 'name email profilePicture')
      .sort('-updatedAt');
    res.json(conversations);
  } catch (e) { next(e); }
};

const getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) { res.status(400); throw new Error('recipientId required'); }
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
    })
      .populate('participants', 'name email profilePicture headline')
      .populate('messages.from', 'name email profilePicture');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        messages: [],
      });
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email profilePicture headline')
        .populate('messages.from', 'name email profilePicture');
    }
    res.json(conversation);
  } catch (e) { next(e); }
};

const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) { res.status(400); throw new Error('Message text required'); }
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) { res.status(404); throw new Error('Conversation not found'); }
    if (!conversation.participants.map(p => p.toString()).includes(req.user._id.toString())) {
      res.status(403); throw new Error('Not authorized');
    }
    conversation.messages.push({ from: req.user._id, text, read: false });
    conversation.updatedAt = Date.now();
    await conversation.save();

    // Notify the recipient if they are not the sender
    const recipientId = conversation.participants.find(
      p => p.toString() !== req.user._id.toString()
    );
    if (recipientId) {
      const recipient = await User.findById(recipientId);
      if (recipient) {
        // Only add a new notification if the last one from this sender isn't already unread
        // This avoids spamming the bell on every single message in a burst
        const lastNotif = recipient.notifications[0];
        const alreadyPending =
          lastNotif &&
          !lastNotif.read &&
          lastNotif.type === 'message' &&
          lastNotif.link === '/inbox';

        if (!alreadyPending) {
          recipient.notifications.unshift({
            message: `${req.user.name} sent you a message`,
            type: 'message',
            link: '/inbox',
          });
          // Keep notifications array from growing unbounded
          if (recipient.notifications.length > 50) {
            recipient.notifications = recipient.notifications.slice(0, 50);
          }
          await recipient.save();
        }
      }
    }

    const updatedConv = await Conversation.findById(conversation._id)
      .populate('participants', 'name email profilePicture headline')
      .populate('messages.from', 'name email profilePicture');
    res.json(updatedConv);
  } catch (e) { next(e); }
};

const markMessagesRead = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) { res.status(404); throw new Error('Conversation not found'); }
    conversation.messages.forEach(msg => {
      if (msg.from.toString() !== req.user._id.toString()) {
        msg.read = true;
      }
    });
    await conversation.save();
    res.json({ message: 'Messages marked as read' });
  } catch (e) { next(e); }
};

module.exports = { getConversations, getOrCreateConversation, sendMessage, markMessagesRead };
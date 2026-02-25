const Message = require('../models/Message');
const Group = require('../models/Group');

// Get messages for a group
exports.getGroupMessages = async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Create a message
exports.createMessage = async (req, res) => {
  try {
    const { groupId, content } = req.body;

    console.log('Creating message:', { groupId, content, userId: req.user._id });

    const group = await Group.findById(groupId);
    if (!group) {
      console.log('Group not found:', groupId);
      return res.status(404).json({ message: 'Group not found' });
    }

    console.log('Group members:', group.members);

    // Check membership with better logic
    let isMember = false;
    for (let member of group.members) {
      const memberId = member.userId?._id?.toString() || member.userId?.toString();
      const userId = req.user._id.toString();
      console.log('Comparing:', memberId, 'with', userId);
      
      if (memberId === userId) {
        isMember = true;
        break;
      }
    }

    console.log('Is member?', isMember);

    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    const message = await Message.create({
      groupId,
      userId: req.user._id,
      content
    });

    await message.populate('userId', 'name email');
    console.log('Message created:', message);
    res.status(201).json(message);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Failed to create message', error: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};

import Message from '../models/Message.js';
import Gig from '../models/Gig.js';
import Bid from '../models/Bid.js';

export const getGigMessages = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    const isOwner = gig.ownerId.toString() === req.user._id.toString();
    const isHiredFreelancer = gig.hiredFreelancerId && gig.hiredFreelancerId.toString() === req.user._id.toString();
    
    const userBid = await Bid.findOne({ gigId, freelancerId: req.user._id });
    
    if (!isOwner && !isHiredFreelancer && !userBid) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view messages for this gig'
      });
    }

    const messages = await Message.find({ gigId })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { gigId, receiverId, text } = req.body;

    if (!gigId || !receiverId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide gigId, receiverId, and text'
      });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    const message = await Message.create({
      gigId,
      senderId: req.user._id,
      receiverId,
      text
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');

    const io = req.app.get('io');
    if (io) {
      io.to(`gig_${gigId}`).emit('new_message', populatedMessage);
      io.to(`user_${receiverId}`).emit('message_notification', {
        gigId,
        senderName: req.user.name,
        text
      });
    }

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

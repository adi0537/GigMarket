import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Message text cannot be empty'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  }
}, {
  timestamps: true
});

messageSchema.index({ gigId: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;

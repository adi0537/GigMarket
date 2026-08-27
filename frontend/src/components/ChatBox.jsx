import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, MessageSquare, Loader2, User, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchGigMessages, sendMessage, addIncomingMessage } from '../store/slices/messageSlice';
import { initSocket, joinGigChat, leaveGigChat } from '../utils/socket';
import LoadingSpinner from './LoadingSpinner';

const ChatBox = ({ gigId, receiverId, receiverName, gigTitle }) => {
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { messages, isLoading, sendLoading } = useSelector((state) => state.messages);

  useEffect(() => {
    if (gigId) {
      dispatch(fetchGigMessages(gigId));

      const socket = initSocket();
      joinGigChat(gigId);

      const handleNewMessage = (msg) => {
        if (msg.gigId === gigId) {
          dispatch(addIncomingMessage(msg));
        }
      };

      const handleReconnect = () => {
        joinGigChat(gigId);
      };

      socket.on('new_message', handleNewMessage);
      socket.on('connect', handleReconnect);

      return () => {
        socket.off('new_message', handleNewMessage);
        socket.off('connect', handleReconnect);
        leaveGigChat(gigId);
      };
    }
  }, [gigId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sendLoading || !receiverId) return;

    const messageText = text.trim();
    setText('');

    try {
      await dispatch(sendMessage({
        gigId,
        receiverId,
        text: messageText
      })).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to send message');
      setText(messageText);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl shadow-lg shadow-dark-200/10 flex flex-col h-[520px] overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-dark-200 bg-dark-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 text-white shadow-md shadow-primary-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-dark-900 flex items-center gap-2">
              <span>Order Chat & Negotiation</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse" />
                Live
              </span>
            </h3>
            <p className="text-xs text-dark-500">
              Direct communication with <span className="font-semibold text-dark-700">{receiverName || 'User'}</span> for "{gigTitle}"
            </p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-transparent to-dark-50/30">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-dark-400">
            <Sparkles className="w-10 h-10 text-primary-400 mb-2 animate-bounce" />
            <p className="font-medium text-dark-700">No messages yet</p>
            <p className="text-xs text-dark-500 max-w-xs mt-1">
              Start the negotiation or discuss project requirements directly here. Persistent chat history will be saved in MongoDB.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId?._id === user?._id || msg.senderId === user?._id;
            const senderName = isMe ? 'You' : (msg.senderId?.name || receiverName);

            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <span className="text-[11px] font-medium text-dark-400 px-1">
                  {senderName} • {formatTime(msg.createdAt)}
                </span>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    isMe
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-none font-medium'
                      : 'bg-white border border-dark-200 text-dark-900 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-dark-200 bg-white/90">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message ${receiverName || 'user'}...`}
            className="flex-1 bg-dark-50 border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 transition-all"
            disabled={sendLoading || !receiverId}
          />
          <button
            type="submit"
            disabled={!text.trim() || sendLoading || !receiverId}
            className="btn-primary p-2.5 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary-500/20"
          >
            {sendLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;

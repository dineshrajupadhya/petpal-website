import Chat from '../models/Chat.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const setupSocketHandlers = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected`);

    // Join user to their personal room
    socket.join(`user_${socket.user._id}`);

    // Join admin users to admin room
    if (socket.user.isAdmin) {
      socket.join('admin_room');
    }

    // Handle joining chat session
    socket.on('join_chat', async (sessionId) => {
      try {
        socket.join(`chat_${sessionId}`);
        
        // Load existing chat messages
        const chat = await Chat.findOne({
          userId: socket.user._id,
          sessionId
        });

        if (chat) {
          socket.emit('chat_history', chat.messages);
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to join chat session' });
      }
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { sessionId, message, sender = 'user' } = data;

        if (!message || message.trim().length === 0) {
          return socket.emit('error', { message: 'Message cannot be empty' });
        }

        let chat = await Chat.findOne({
          userId: socket.user._id,
          sessionId
        });

        if (!chat) {
          chat = new Chat({
            userId: socket.user._id,
            sessionId,
            messages: []
          });
        }

        const newMessage = {
          sender,
          message: message.trim(),
          timestamp: new Date()
        };

        // Add metadata for admin messages
        if (sender === 'admin' && socket.user.isAdmin) {
          newMessage.metadata = { adminId: socket.user._id };
        }

        chat.messages.push(newMessage);
        chat.lastActivity = new Date();
        await chat.save();

        // Emit message to chat room
        io.to(`chat_${sessionId}`).emit('new_message', {
          ...newMessage,
          senderName: socket.user.name
        });

        // Generate bot response for user messages
        if (sender === 'user') {
          setTimeout(async () => {
            const botResponse = generateBotResponse(message);
            
            const botMessage = {
              sender: 'bot',
              message: botResponse,
              timestamp: new Date(),
              metadata: {
                botConfidence: 0.8,
                intent: detectIntent(message)
              }
            };

            chat.messages.push(botMessage);
            await chat.save();

            io.to(`chat_${sessionId}`).emit('new_message', {
              ...botMessage,
              senderName: 'PetPal Assistant'
            });
          }, 1000 + Math.random() * 2000);
        }

        // Notify admins of new user messages
        if (sender === 'user') {
          io.to('admin_room').emit('new_user_message', {
            sessionId,
            userId: socket.user._id,
            userName: socket.user.name,
            message,
            timestamp: new Date()
          });
        }

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (sessionId) => {
      socket.to(`chat_${sessionId}`).emit('user_typing', {
        userId: socket.user._id,
        userName: socket.user.name
      });
    });

    socket.on('typing_stop', (sessionId) => {
      socket.to(`chat_${sessionId}`).emit('user_stopped_typing', {
        userId: socket.user._id
      });
    });

    // Admin-specific handlers
    if (socket.user.isAdmin) {
      // Handle admin joining user chat
      socket.on('admin_join_chat', async (chatId) => {
        try {
          const chat = await Chat.findById(chatId).populate('userId', 'name');
          if (chat) {
            socket.join(`chat_${chat.sessionId}`);
            socket.emit('chat_history', chat.messages);
            
            // Notify user that admin joined
            io.to(`user_${chat.userId._id}`).emit('admin_joined', {
              adminName: socket.user.name
            });
          }
        } catch (error) {
          socket.emit('error', { message: 'Failed to join chat' });
        }
      });

      // Handle chat assignment
      socket.on('assign_chat', async (data) => {
        try {
          const { chatId, adminId } = data;
          
          await Chat.findByIdAndUpdate(chatId, {
            assignedTo: adminId,
            status: 'active'
          });

          io.to('admin_room').emit('chat_assigned', {
            chatId,
            adminId,
            assignedBy: socket.user.name
          });
        } catch (error) {
          socket.emit('error', { message: 'Failed to assign chat' });
        }
      });
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.name} disconnected`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};

// Helper functions
function generateBotResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('adoption') || lowerMessage.includes('adopt')) {
    return "I'd be happy to help you with pet adoption! We have many wonderful pets looking for homes. You can browse our available pets on the adoption page, or I can help you find specific breeds or types of pets. What kind of pet are you interested in adopting?";
  }
  
  if (lowerMessage.includes('sick') || lowerMessage.includes('symptoms') || lowerMessage.includes('health')) {
    return "I'm concerned about your pet's health. While I can provide general information, it's always best to consult with a veterinarian for proper diagnosis and treatment. You can check our Pet Health Guide for common conditions, but please don't hesitate to contact your vet if you're worried about your pet's symptoms.";
  }
  
  if (lowerMessage.includes('food') || lowerMessage.includes('diet') || lowerMessage.includes('eating')) {
    return "Proper nutrition is essential for your pet's health! We have a wide selection of high-quality pet foods in our store. The best diet depends on your pet's age, size, activity level, and any health conditions. I recommend consulting with your vet for personalized dietary advice.";
  }
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
    return "If this is a pet emergency, please contact your nearest emergency veterinary clinic immediately! For immediate assistance, call: (555) EMERGENCY. I'm here to help with general questions, but emergencies require professional veterinary care right away.";
  }
  
  if (lowerMessage.includes('store') || lowerMessage.includes('buy') || lowerMessage.includes('product')) {
    return "Our pet store has everything you need for your furry friends! From premium food and toys to beds and accessories, we stock high-quality products from trusted brands. You can browse our store online or visit us in person. Is there something specific you're looking for?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return "Hello! I'm PetPal's AI assistant, and I'm here to help you with all your pet-related questions. I can assist with information about pet adoption, health concerns, products in our store, and general pet care advice. How can I help you today?";
  }
  
  return "Thank you for your question! I'm here to help with pet adoption, health information, product recommendations, and general pet care advice. Could you please provide more details about what you'd like to know? For complex issues, I can also connect you with our human support team.";
}

function detectIntent(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('adoption') || lowerMessage.includes('adopt')) return 'adoption';
  if (lowerMessage.includes('sick') || lowerMessage.includes('health')) return 'health';
  if (lowerMessage.includes('product') || lowerMessage.includes('buy')) return 'products';
  if (lowerMessage.includes('order')) return 'orders';
  if (lowerMessage.includes('emergency')) return 'emergency';
  
  return 'general';
}
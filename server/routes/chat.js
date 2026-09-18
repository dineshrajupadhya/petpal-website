import express from 'express';
import Chat from '../models/Chat.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get user's chat sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Chat.find({ userId: req.user._id })
      .sort({ lastActivity: -1 })
      .select('sessionId status category lastActivity messages')
      .lean();

    // Add last message preview
    const sessionsWithPreview = sessions.map(session => ({
      ...session,
      lastMessage: session.messages[session.messages.length - 1]?.message || '',
      messageCount: session.messages.length
    }));

    res.json({ sessions: sessionsWithPreview });
  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch chat sessions', 
      error: error.message 
    });
  }
});

// Get or create chat session
router.get('/session/:sessionId', async (req, res) => {
  try {
    let chat = await Chat.findOne({
      userId: req.user._id,
      sessionId: req.params.sessionId
    });

    if (!chat) {
      chat = new Chat({
        userId: req.user._id,
        sessionId: req.params.sessionId,
        messages: []
      });
      await chat.save();
    }

    res.json({ chat });
  } catch (error) {
    console.error('Get chat session error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch chat session', 
      error: error.message 
    });
  }
});

// Send message
router.post('/session/:sessionId/message', async (req, res) => {
  try {
    const { message, sender = 'user' } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    let chat = await Chat.findOne({
      userId: req.user._id,
      sessionId: req.params.sessionId
    });

    if (!chat) {
      chat = new Chat({
        userId: req.user._id,
        sessionId: req.params.sessionId,
        messages: []
      });
    }

    const newMessage = {
      sender,
      message: message.trim(),
      timestamp: new Date()
    };

    if (sender === 'admin') {
      newMessage.metadata = { adminId: req.user._id };
    }

    chat.messages.push(newMessage);
    chat.lastActivity = new Date();

    await chat.save();

    // Generate AI response if user message
    if (sender === 'user') {
      const aiResponse = await generateAIResponse(chat.messages);
      
      chat.messages.push({
        sender: 'bot',
        message: aiResponse,
        timestamp: new Date(),
        metadata: {
          botConfidence: 0.9,
          intent: detectIntent(message)
        }
      });

      await chat.save();
    }

    res.json({ 
      message: 'Message sent successfully',
      chat: await Chat.findById(chat._id)
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      message: 'Failed to send message', 
      error: error.message 
    });
  }
});

// Rate chat session
router.post('/session/:sessionId/rate', async (req, res) => {
  try {
    const { score, feedback } = req.body;

    const chat = await Chat.findOneAndUpdate(
      {
        userId: req.user._id,
        sessionId: req.params.sessionId
      },
      {
        rating: {
          score,
          feedback,
          ratedAt: new Date()
        }
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rate chat error:', error);
    res.status(500).json({ 
      message: 'Failed to submit rating', 
      error: error.message 
    });
  }
});

// Admin: Get all chat sessions
router.get('/admin/sessions', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, category } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const sessions = await Chat.find(filter)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name')
      .sort({ priority: -1, lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Chat.countDocuments(filter);

    res.json({
      sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin chat sessions error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch chat sessions', 
      error: error.message 
    });
  }
});

// Admin: Update chat session
router.put('/admin/session/:id', requireAdmin, async (req, res) => {
  try {
    const { status, priority, category, assignedTo, tags } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (category) updateData.category = category;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (tags) updateData.tags = tags;

    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('userId', 'name email').populate('assignedTo', 'name');

    if (!chat) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    res.json({ 
      message: 'Chat session updated successfully',
      chat 
    });
  } catch (error) {
    console.error('Update chat session error:', error);
    res.status(500).json({ 
      message: 'Failed to update chat session', 
      error: error.message 
    });
  }
});

// Helper functions
const PETPAL_SYSTEM_PROMPT = `You are PetPal's AI pet care assistant. You are friendly, knowledgeable, and genuinely helpful about all things pets.

Your expertise covers:
- Pet adoption guidance (helping users find the right pet, explaining the adoption process)
- Pet health advice (symptoms, when to see a vet, general care tips — but always recommend professional vet care for serious concerns)
- Pet nutrition (food recommendations, dietary needs by species/breed/age)
- Product recommendations from the PetPal store
- Pet behavior and training tips
- Emergency guidance (always direct to emergency vet services for real emergencies)

Rules:
- Keep responses concise but warm and helpful (2-4 sentences typically)
- Use a friendly, conversational tone
- Always recommend consulting a veterinarian for health concerns
- For emergencies, strongly urge immediate vet care
- If you don't know something specific, say so honestly
- Never make up medical diagnoses
- You can reference PetPal's features: pet adoption, pet store, health guides`;

async function generateAIResponse(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return generateBotResponse(messages[messages.length - 1]?.message || '');
  }

  try {
    const conversationHistory = messages.slice(-10).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.message
    }));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://petpal-platform.netlify.app',
        'X-Title': 'PetPal Pet Care Assistant'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324',
        messages: [
          { role: 'system', content: PETPAL_SYSTEM_PROMPT },
          ...conversationHistory
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status);
      return generateBotResponse(messages[messages.length - 1]?.message || '');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || generateBotResponse(messages[messages.length - 1]?.message || '');
  } catch (error) {
    console.error('AI response error:', error.message);
    return generateBotResponse(messages[messages.length - 1]?.message || '');
  }
}

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

export default router;
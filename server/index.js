console.log('Starting server...');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB, { connection } from './config/database.js';
import authRoutes from './routes/auth.js';
import petRoutes from './routes/pets.js';
import productRoutes from './routes/products.js';
import diseaseRoutes from './routes/diseases.js';
import orderRoutes from './routes/orders.js';
import chatRoutes from './routes/chat.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import { authenticateToken } from './middleware/auth.js';
import { setupSocketHandlers } from './socket/socketHandlers.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB().then(() => {
  console.log('✅ Database connection established (mock mode for WebContainer)');
}).catch(err => {
  console.log('⚠️ Database connection failed, continuing with mock data');
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/products', productRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PetPal API is running' });
});

// Socket.IO setup
setupSocketHandlers(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
  console.log(`🗄️  Database: ${process.env.NODE_ENV === 'development' ? 'Development' : 'Production'}`);
});

export { io };
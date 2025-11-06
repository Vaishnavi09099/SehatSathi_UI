const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');
const consultationRoutes = require('./routes/consultations');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sehatsathi')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO for real-time features
const activeUsers = new Map();
const consultationRooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their ID
  socket.on('join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Join consultation room
  socket.on('join-consultation', (consultationId) => {
    socket.join(consultationId);
    
    if (!consultationRooms.has(consultationId)) {
      consultationRooms.set(consultationId, new Set());
    }
    consultationRooms.get(consultationId).add(socket.userId);
    
    // Notify others in the room
    socket.to(consultationId).emit('user-joined', {
      userId: socket.userId,
      socketId: socket.id
    });
    
    console.log(`User ${socket.userId} joined consultation ${consultationId}`);
  });

  // WebRTC signaling
  socket.on('offer', (data) => {
    socket.to(data.consultationId).emit('offer', {
      offer: data.offer,
      from: socket.userId
    });
  });

  socket.on('answer', (data) => {
    socket.to(data.consultationId).emit('answer', {
      answer: data.answer,
      from: socket.userId
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.consultationId).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.userId
    });
  });

  // Chat messages
  socket.on('chat-message', (data) => {
    io.to(data.consultationId).emit('chat-message', {
      message: data.message,
      from: socket.userId,
      timestamp: new Date().toISOString()
    });
  });

  // Leave consultation
  socket.on('leave-consultation', (consultationId) => {
    socket.leave(consultationId);
    
    if (consultationRooms.has(consultationId)) {
      consultationRooms.get(consultationId).delete(socket.userId);
      if (consultationRooms.get(consultationId).size === 0) {
        consultationRooms.delete(consultationId);
      }
    }
    
    socket.to(consultationId).emit('user-left', {
      userId: socket.userId
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
      
      // Remove from all consultation rooms
      for (const [consultationId, users] of consultationRooms.entries()) {
        if (users.has(socket.userId)) {
          users.delete(socket.userId);
          socket.to(consultationId).emit('user-left', {
            userId: socket.userId
          });
          
          if (users.size === 0) {
            consultationRooms.delete(consultationId);
          }
        }
      }
    }
    
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
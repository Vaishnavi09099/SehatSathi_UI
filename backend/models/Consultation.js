const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'asha']
    },
    joinedAt: Date,
    leftAt: Date
  }],
  startTime: Date,
  endTime: Date,
  duration: Number, // in minutes
  status: {
    type: String,
    enum: ['waiting', 'active', 'ended', 'cancelled'],
    default: 'waiting'
  },
  chatMessages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['text', 'file', 'system'],
      default: 'text'
    }
  }],
  recordings: [{
    url: String,
    type: {
      type: String,
      enum: ['video', 'audio']
    },
    duration: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  vitals: [{
    type: {
      type: String,
      enum: ['blood_pressure', 'heart_rate', 'temperature', 'oxygen_saturation', 'weight', 'height']
    },
    value: String,
    unit: String,
    recordedAt: {
      type: Date,
      default: Date.now
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  aiAnalysis: {
    symptoms: [String],
    suggestedDiagnosis: [String],
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    recommendations: [String],
    confidence: Number
  },
  technicalIssues: [{
    type: {
      type: String,
      enum: ['audio', 'video', 'connection', 'other']
    },
    description: String,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique room ID
consultationSchema.pre('save', function(next) {
  if (!this.roomId) {
    this.roomId = `consultation_${this._id}_${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Consultation', consultationSchema);
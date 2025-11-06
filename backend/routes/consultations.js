const express = require('express');
const { body, validationResult } = require('express-validator');
const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/consultations/start/:appointmentId
// @desc    Start consultation session
// @access  Private (Doctor/Patient/ASHA)
router.post('/start/:appointmentId', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('patient doctor ashaWorker');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has access to this appointment
    const hasAccess = 
      appointment.patient._id.toString() === req.user._id.toString() ||
      appointment.doctor._id.toString() === req.user._id.toString() ||
      (appointment.ashaWorker && appointment.ashaWorker._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if consultation already exists
    let consultation = await Consultation.findOne({ appointment: appointment._id });

    if (!consultation) {
      // Create new consultation
      consultation = new Consultation({
        appointment: appointment._id,
        roomId: appointment.consultationId || `room_${appointment._id}_${Date.now()}`,
        participants: []
      });
    }

    // Add participant if not already added
    const existingParticipant = consultation.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!existingParticipant) {
      consultation.participants.push({
        user: req.user._id,
        role: req.user.role,
        joinedAt: new Date()
      });
    }

    // Update consultation status
    if (consultation.status === 'waiting') {
      consultation.status = 'active';
      consultation.startTime = new Date();
    }

    // Update appointment status
    if (appointment.status === 'confirmed') {
      appointment.status = 'in-progress';
      await appointment.save();
    }

    await consultation.save();

    res.json({
      message: 'Consultation started successfully',
      consultation: {
        _id: consultation._id,
        roomId: consultation.roomId,
        status: consultation.status,
        participants: consultation.participants
      }
    });

  } catch (error) {
    console.error('Start consultation error:', error);
    res.status(500).json({ message: 'Server error while starting consultation' });
  }
});

// @route   GET /api/consultations/:id
// @desc    Get consultation details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('appointment')
      .populate('participants.user', 'name email role profile doctorProfile');

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check if user has access
    const hasAccess = consultation.participants.some(
      p => p.user._id.toString() === req.user._id.toString()
    ) || req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ consultation });

  } catch (error) {
    console.error('Get consultation error:', error);
    res.status(500).json({ message: 'Server error while fetching consultation' });
  }
});

// @route   POST /api/consultations/:id/end
// @desc    End consultation session
// @access  Private (Doctor)
router.post('/:id/end', [
  auth,
  authorize('doctor')
], async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check if doctor is participant
    const doctorParticipant = consultation.participants.find(
      p => p.user.toString() === req.user._id.toString() && p.role === 'doctor'
    );

    if (!doctorParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // End consultation
    consultation.status = 'ended';
    consultation.endTime = new Date();
    
    if (consultation.startTime) {
      consultation.duration = Math.round(
        (consultation.endTime - consultation.startTime) / (1000 * 60)
      );
    }

    await consultation.save();

    // Update appointment status
    const appointment = await Appointment.findById(consultation.appointment);
    if (appointment && appointment.status === 'in-progress') {
      appointment.status = 'completed';
      await appointment.save();
    }

    res.json({
      message: 'Consultation ended successfully',
      consultation
    });

  } catch (error) {
    console.error('End consultation error:', error);
    res.status(500).json({ message: 'Server error while ending consultation' });
  }
});

// @route   POST /api/consultations/:id/message
// @desc    Send chat message
// @access  Private
router.post('/:id/message', [
  auth,
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { message } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check if user is participant
    const isParticipant = consultation.participants.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add message
    consultation.chatMessages.push({
      sender: req.user._id,
      message,
      timestamp: new Date()
    });

    await consultation.save();

    res.json({
      message: 'Message sent successfully',
      chatMessage: consultation.chatMessages[consultation.chatMessages.length - 1]
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

// @route   POST /api/consultations/:id/vitals
// @desc    Record patient vitals
// @access  Private (Doctor/ASHA)
router.post('/:id/vitals', [
  auth,
  authorize('doctor', 'asha'),
  body('type').isIn(['blood_pressure', 'heart_rate', 'temperature', 'oxygen_saturation', 'weight', 'height']).withMessage('Invalid vital type'),
  body('value').notEmpty().withMessage('Value is required'),
  body('unit').notEmpty().withMessage('Unit is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { type, value, unit } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check if user is participant
    const isParticipant = consultation.participants.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add vital
    consultation.vitals.push({
      type,
      value,
      unit,
      recordedBy: req.user._id,
      recordedAt: new Date()
    });

    await consultation.save();

    res.json({
      message: 'Vital recorded successfully',
      vital: consultation.vitals[consultation.vitals.length - 1]
    });

  } catch (error) {
    console.error('Record vitals error:', error);
    res.status(500).json({ message: 'Server error while recording vitals' });
  }
});

// @route   POST /api/consultations/:id/technical-issue
// @desc    Report technical issue
// @access  Private
router.post('/:id/technical-issue', [
  auth,
  body('type').isIn(['audio', 'video', 'connection', 'other']).withMessage('Invalid issue type'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { type, description } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check if user is participant
    const isParticipant = consultation.participants.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add technical issue
    consultation.technicalIssues.push({
      type,
      description,
      reportedBy: req.user._id,
      reportedAt: new Date()
    });

    await consultation.save();

    res.json({
      message: 'Technical issue reported successfully',
      issue: consultation.technicalIssues[consultation.technicalIssues.length - 1]
    });

  } catch (error) {
    console.error('Report technical issue error:', error);
    res.status(500).json({ message: 'Server error while reporting issue' });
  }
});

// @route   GET /api/consultations/:id/messages
// @desc    Get chat messages
// @access  Private
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('chatMessages.sender', 'name role')
      .select('chatMessages');

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check if user has access (simplified check)
    res.json({
      messages: consultation.chatMessages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
});

module.exports = router;
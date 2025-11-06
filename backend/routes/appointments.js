const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private (Patient)
router.post('/', [
  auth,
  authorize('patient'),
  body('doctorId').isMongoId().withMessage('Valid doctor ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
  body('paymentMethod').isIn(['upi', 'card', 'wallet', 'netbanking']).withMessage('Valid payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      doctorId,
      appointmentDate,
      timeSlot,
      symptoms,
      preConsultationMessage,
      needAshaWorker,
      paymentMethod,
      documents
    } = req.body;

    // Verify doctor exists and is active
    const doctor = await User.findOne({ 
      _id: doctorId, 
      role: 'doctor', 
      isActive: true
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found or not available' });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    // Find ASHA worker if needed
    let ashaWorker = null;
    if (needAshaWorker) {
      ashaWorker = await User.findOne({ 
        role: 'asha', 
        isActive: true
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      ashaWorker: ashaWorker?._id,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      symptoms,
      preConsultationMessage,
      documents: documents || [],
      payment: {
        amount: doctor.doctorProfile.consultationFee || 299,
        method: paymentMethod,
        status: 'paid', // Simulate successful payment
        transactionId: `TXN_${Date.now()}`,
        paidAt: new Date()
      },
      consultationId: `consultation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    await appointment.save();

    // Populate appointment data
    await appointment.populate([
      { path: 'patient', select: 'name email phone profile' },
      { path: 'doctor', select: 'name email doctorProfile' },
      { path: 'ashaWorker', select: 'name email phone' }
    ]);

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error while booking appointment' });
  }
});

// @route   GET /api/appointments
// @desc    Get user appointments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by user role
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    } else if (req.user.role === 'asha') {
      query.ashaWorker = req.user._id;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone profile')
      .populate('doctor', 'name email doctorProfile')
      .populate('ashaWorker', 'name email phone')
      .sort({ appointmentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone profile')
      .populate('doctor', 'name email doctorProfile')
      .populate('ashaWorker', 'name email phone');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has access to this appointment
    const hasAccess = 
      appointment.patient._id.toString() === req.user._id.toString() ||
      appointment.doctor._id.toString() === req.user._id.toString() ||
      (appointment.ashaWorker && appointment.ashaWorker._id.toString() === req.user._id.toString()) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ appointment });

  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error while fetching appointment' });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private (Doctor/Admin)
router.put('/:id/status', [
  auth,
  authorize('doctor', 'admin'),
  body('status').isIn(['confirmed', 'cancelled', 'in-progress', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if doctor owns this appointment (unless admin)
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Server error while updating appointment' });
  }
});

// @route   POST /api/appointments/:id/prescription
// @desc    Add prescription to appointment
// @access  Private (Doctor)
router.post('/:id/prescription', [
  auth,
  authorize('doctor'),
  body('prescription').isArray().withMessage('Prescription must be an array'),
  body('diagnosis').optional().isString().withMessage('Diagnosis must be a string'),
  body('consultationNotes').optional().isString().withMessage('Notes must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { prescription, diagnosis, consultationNotes, followUpRequired, followUpDate } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if doctor owns this appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update appointment with prescription
    appointment.prescription = prescription;
    appointment.diagnosis = diagnosis;
    appointment.consultationNotes = consultationNotes;
    appointment.followUpRequired = followUpRequired;
    appointment.followUpDate = followUpDate;
    appointment.status = 'completed';

    await appointment.save();

    res.json({
      message: 'Prescription added successfully',
      appointment
    });

  } catch (error) {
    console.error('Add prescription error:', error);
    res.status(500).json({ message: 'Server error while adding prescription' });
  }
});

// @route   POST /api/appointments/:id/rating
// @desc    Rate appointment
// @access  Private (Patient)
router.post('/:id/rating', [
  auth,
  authorize('patient'),
  body('score').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isString().withMessage('Review must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { score, review } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if patient owns this appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if appointment is completed
    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed appointments' });
    }

    // Add rating
    appointment.rating = {
      score,
      review,
      ratedAt: new Date()
    };

    await appointment.save();

    // Update doctor's rating
    const doctor = await User.findById(appointment.doctor);
    if (doctor) {
      const totalRating = (doctor.doctorProfile.rating * doctor.doctorProfile.reviewCount) + score;
      doctor.doctorProfile.reviewCount += 1;
      doctor.doctorProfile.rating = totalRating / doctor.doctorProfile.reviewCount;
      await doctor.save();
    }

    res.json({
      message: 'Rating submitted successfully',
      appointment
    });

  } catch (error) {
    console.error('Rate appointment error:', error);
    res.status(500).json({ message: 'Server error while rating appointment' });
  }
});

module.exports = router;
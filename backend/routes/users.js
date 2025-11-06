const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/doctors
// @desc    Get all verified doctors
// @access  Public
router.get('/doctors', async (req, res) => {
  try {
    const { specialty, page = 1, limit = 10, search } = req.query;
    
    let query = { 
      role: 'doctor', 
      isActive: true
    };

    // Filter by specialty
    if (specialty && specialty !== 'all') {
      query['doctorProfile.specialty'] = specialty;
    }

    // Search by name or specialty
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'doctorProfile.specialty': { $regex: search, $options: 'i' } },
        { 'doctorProfile.languages': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const doctors = await User.find(query)
      .select('name email doctorProfile profile createdAt')
      .sort({ 'doctorProfile.rating': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      doctors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error while fetching doctors' });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields
    if (updates.name) user.name = updates.name;
    if (updates.phone) user.phone = updates.phone;

    // Update profile fields
    if (updates.profile) {
      user.profile = { ...user.profile, ...updates.profile };
    }

    // Update role-specific fields
    if (user.role === 'doctor' && updates.doctorProfile) {
      user.doctorProfile = { ...user.doctorProfile, ...updates.doctorProfile };
    }

    if (user.role === 'asha' && updates.ashaProfile) {
      user.ashaProfile = { ...user.ashaProfile, ...updates.ashaProfile };
    }

    if (updates.healthData) {
      user.healthData = { ...user.healthData, ...updates.healthData };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// @route   GET /api/users/doctor/:id
// @desc    Get doctor details
// @access  Public
router.get('/doctor/:id', async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: 'doctor',
      isActive: true
    }).select('name email doctorProfile profile createdAt');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ doctor });

  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error while fetching doctor' });
  }
});

// @route   PUT /api/users/doctor/availability
// @desc    Update doctor availability
// @access  Private (Doctor)
router.put('/doctor/availability', [
  auth,
  authorize('doctor'),
  body('availability').isArray().withMessage('Availability must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { availability } = req.body;
    const doctor = await User.findById(req.user._id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.doctorProfile.availability = availability;
    await doctor.save();

    res.json({
      message: 'Availability updated successfully',
      availability: doctor.doctorProfile.availability
    });

  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error while updating availability' });
  }
});

// @route   GET /api/users/asha-workers
// @desc    Get available ASHA workers
// @access  Private (Admin/Doctor)
router.get('/asha-workers', [
  auth,
  authorize('admin', 'doctor')
], async (req, res) => {
  try {
    const { area, page = 1, limit = 10 } = req.query;
    
    let query = { 
      role: 'asha', 
      isActive: true, 
      isVerified: true 
    };

    if (area) {
      query['ashaProfile.area'] = { $regex: area, $options: 'i' };
    }

    const ashaWorkers = await User.find(query)
      .select('name email phone ashaProfile profile')
      .sort({ 'ashaProfile.patientsAssisted': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      ashaWorkers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get ASHA workers error:', error);
    res.status(500).json({ message: 'Server error while fetching ASHA workers' });
  }
});

// @route   POST /api/users/verify/:id
// @desc    Verify user account
// @access  Private (Admin)
router.post('/verify/:id', [
  auth,
  authorize('admin')
], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      message: 'User verified successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ message: 'Server error while verifying user' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private (Admin)
router.get('/stats', [
  auth,
  authorize('admin')
], async (req, res) => {
  try {
    const stats = await Promise.all([
      User.countDocuments({ role: 'patient', isActive: true }),
      User.countDocuments({ role: 'doctor', isActive: true, isVerified: true }),
      User.countDocuments({ role: 'asha', isActive: true, isVerified: true }),
      User.countDocuments({ role: 'admin', isActive: true })
    ]);

    res.json({
      patients: stats[0],
      doctors: stats[1],
      ashaWorkers: stats[2],
      admins: stats[3],
      total: stats.reduce((sum, count) => sum + count, 0)
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

module.exports = router;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sehatsathi');
    console.log('Connected to MongoDB');

    // Clear existing users (optional)
    // await User.deleteMany({});
    // console.log('Cleared existing users');

    // Create demo users
    const demoUsers = [
      {
        name: 'Dr. Priya Sharma',
        email: 'doctor@sehatsathi.in',
        password: 'demo123',
        phone: '+919876543210',
        role: 'doctor',
        isVerified: true,
        doctorProfile: {
          medicalId: 'MED123456',
          specialty: 'General Physician',
          experience: 12,
          qualifications: ['MBBS', 'MD'],
          languages: ['Hindi', 'English', 'Punjabi'],
          consultationFee: 299,
          availability: [
            { day: 'Monday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
            { day: 'Tuesday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
            { day: 'Wednesday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
            { day: 'Thursday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
            { day: 'Friday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] }
          ],
          rating: 4.8,
          reviewCount: 523,
          verified: true
        }
      },
      {
        name: 'Dr. Rajesh Kumar',
        email: 'pediatrician@sehatsathi.in',
        password: 'demo123',
        phone: '+919876543211',
        role: 'doctor',
        isVerified: true,
        doctorProfile: {
          medicalId: 'MED123457',
          specialty: 'Pediatrician',
          experience: 15,
          qualifications: ['MBBS', 'MD Pediatrics'],
          languages: ['Hindi', 'English', 'Bengali'],
          consultationFee: 349,
          availability: [
            { day: 'Monday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
            { day: 'Tuesday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
            { day: 'Wednesday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
            { day: 'Thursday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
            { day: 'Friday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] }
          ],
          rating: 4.9,
          reviewCount: 678,
          verified: true
        }
      },
      {
        name: 'Sunita Devi',
        email: 'asha@sehatsathi.in',
        password: 'demo123',
        phone: '+919876543212',
        role: 'asha',
        isVerified: true,
        profile: {
          address: {
            village: 'Rampur',
            district: 'Sitapur',
            state: 'Uttar Pradesh',
            pincode: '261001'
          }
        },
        ashaProfile: {
          workerId: 'ASHA001',
          area: 'Rampur Block',
          certifications: ['Basic Health Training', 'Maternal Health'],
          patientsAssisted: 150
        }
      },
      {
        name: 'Priya Sharma',
        email: 'patient@sehatsathi.in',
        password: 'demo123',
        phone: '+919876543213',
        role: 'patient',
        isVerified: true,
        profile: {
          dateOfBirth: new Date('1990-05-15'),
          gender: 'female',
          address: {
            village: 'Bharatpur',
            district: 'Sitapur',
            state: 'Uttar Pradesh',
            pincode: '261001'
          },
          emergencyContact: {
            name: 'Rajesh Sharma',
            phone: '+919876543214',
            relation: 'Husband'
          }
        },
        healthData: {
          bloodGroup: 'B+',
          allergies: ['Peanuts'],
          chronicConditions: [],
          medications: []
        }
      },
      {
        name: 'Admin User',
        email: 'admin@sehatsathi.in',
        password: 'demo123',
        phone: '+919876543215',
        role: 'admin',
        isVerified: true
      }
    ];

    // Hash passwords and create users
    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const salt = await bcrypt.genSalt(12);
        userData.password = await bcrypt.hash(userData.password, salt);
        
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${userData.name} (${userData.role})`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('Patient: patient@sehatsathi.in / demo123');
    console.log('Doctor: doctor@sehatsathi.in / demo123');
    console.log('ASHA Worker: asha@sehatsathi.in / demo123');
    console.log('Admin: admin@sehatsathi.in / demo123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
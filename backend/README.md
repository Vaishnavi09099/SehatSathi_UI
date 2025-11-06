# SehatSathi Backend

Node.js + Express + MongoDB backend for the SehatSathi telemedicine platform.

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sehatsathi
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## 🚀 Development

```bash
npm run dev
```

Or for production:

```bash
npm start
```

Backend will be available at http://localhost:5000

## 🌱 Seed Database

Create demo accounts:

```bash
npm run seed
```

This creates:
- Patient: patient@sehatsathi.in / demo123
- Doctor: doctor@sehatsathi.in / demo123
- ASHA Worker: asha@sehatsathi.in / demo123
- Admin: admin@sehatsathi.in / demo123

## 📁 Project Structure

```
backend/
├── models/           # Mongoose models
│   ├── User.js
│   ├── Appointment.js
│   └── Consultation.js
├── routes/           # API routes
│   ├── auth.js
│   ├── users.js
│   ├── appointments.js
│   └── consultations.js
├── middleware/       # Custom middleware
│   └── auth.js
├── controllers/      # Route controllers
├── utils/            # Utility functions
├── uploads/          # File uploads directory
├── server.js         # Main server file
└── seed.js           # Database seeder
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/doctors` - Get all doctors
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/doctor/:id` - Get doctor details

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get user appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id/status` - Update status
- `POST /api/appointments/:id/prescription` - Add prescription
- `POST /api/appointments/:id/rating` - Rate appointment

### Consultations
- `POST /api/consultations/start/:appointmentId` - Start consultation
- `GET /api/consultations/:id` - Get consultation
- `POST /api/consultations/:id/end` - End consultation
- `POST /api/consultations/:id/message` - Send message

## 🔒 Security

- JWT authentication
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Input validation with express-validator
- Helmet.js for security headers

## 🗄️ Database Models

### User
- Supports 4 roles: patient, doctor, asha, admin
- Role-specific profiles (doctorProfile, ashaProfile)
- Health data for patients

### Appointment
- Links patient, doctor, and optional ASHA worker
- Payment tracking
- Document attachments
- Prescription management

### Consultation
- Video call room management
- Real-time messaging
- Vitals recording

## 🔌 WebSocket Events

Socket.IO events for real-time features:
- `join` - User joins with ID
- `join-consultation` - Join video room
- `offer`, `answer`, `ice-candidate` - WebRTC signaling
- `chat-message` - Send/receive messages
- `leave-consultation` - Leave video room

## 📊 Scripts

```bash
npm start          # Start server
npm run dev        # Start with nodemon
npm run seed       # Seed database
```

## 🚀 Deployment

1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy to Heroku, Railway, or DigitalOcean
4. Update CORS settings for production domain

## 🐛 Debugging

Enable debug logs:

```bash
NODE_ENV=development npm run dev
```

Check MongoDB connection:

```bash
mongosh mongodb://localhost:27017/sehatsathi
```

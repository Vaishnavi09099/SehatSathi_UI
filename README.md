# SehatSathi - Rural Telemedicine & Health Monitoring Platform

A comprehensive telemedicine platform designed for rural India, enabling patients to consult with doctors via video calls, with ASHA worker assistance and AI-powered health insights.

## 🚀 Features

- **Video Consultations**: Real-time video calls between patients and doctors
- **ASHA Worker Support**: Local health workers can assist during consultations
- **AI Health Assistant**: 24/7 multilingual health chatbot
- **Appointment Booking**: Easy scheduling with payment integration
- **Medical Records**: Digital health dashboard with prescription management
- **Multi-language Support**: Hindi, English, and regional languages
- **Emergency SOS**: Quick access to emergency services
- **Rewards System**: Gamified health engagement

## 📁 Project Structure

```
SehatSathi_UI/
├── frontend/          # React + TypeScript + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Node.js + Express + MongoDB backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── README.md
└── start.sh          # Script to start both servers
```

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SehatSathi_UI
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file (if not exists)
# Edit .env with your configuration
# Required variables:
# - MONGODB_URI
# - JWT_SECRET
# - PORT (default: 5000)

# Seed demo accounts
npm run seed

# Start the backend server
npm start
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🚀 Quick Start (Both Servers)

From the project root, you can use the start script:

```bash
chmod +x start.sh
./start.sh
```

Or manually start both:

```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 🔧 Environment Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sehatsathi
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## 👥 Demo Accounts

After running `npm run seed` in the backend directory:

- **Patient**: patient@sehatsathi.in / demo123
- **Doctor**: doctor@sehatsathi.in / demo123
- **ASHA Worker**: asha@sehatsathi.in / demo123
- **Admin**: admin@sehatsathi.in / demo123

## 🎯 Quick Testing Flow

1. **Start both servers** (backend on :5000, frontend on :5173)
2. **Register/Login** with any role or use demo accounts
3. **For Patients**: 
   - Book a consultation with available doctors
   - Use the AI chatbot for health queries
4. **For Doctors**: 
   - View and manage patient appointments
   - Accept appointments and start video consultations
5. **Video Consultation**: 
   - Join scheduled appointments
   - Use real-time video/audio
   - Chat during consultation

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/doctors` - Get all doctors
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get user appointments
- `PUT /api/appointments/:id/status` - Update status

### Consultations
- `POST /api/consultations/start/:appointmentId` - Start consultation
- `GET /api/consultations/:id` - Get consultation details
- `POST /api/consultations/:id/end` - End consultation

## 🌐 WebRTC Video Calling

The platform uses WebRTC for peer-to-peer video communication:
- **Signaling**: Socket.IO handles offer/answer exchange
- **STUN Servers**: Google's public STUN servers for NAT traversal
- **Media Streams**: Camera and microphone access
- **Real-time Chat**: Integrated text messaging during calls

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation
- Secure file uploads

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or cloud MongoDB
2. Configure environment variables
3. Deploy to services like Heroku, Railway, or DigitalOcean
4. Update CORS settings for production domain

### Frontend Deployment
1. Build the project: `cd frontend && npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API base URL in `src/services/api.ts` for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@sehatsathi.in
- Phone: 1800-123-4567 (Toll Free)

## 🎯 Future Enhancements

- AI-powered diagnosis assistance
- Integration with wearable devices
- Prescription delivery system
- Health insurance integration
- Advanced analytics dashboard
- Mobile app (React Native)

---

**Made with ❤️ for Rural India by Team 4Bits**

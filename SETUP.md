# 🚀 Quick Setup Guide

## Project Structure

```
SehatSathi_UI/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── README.md          # Main documentation
├── SETUP.md          # This file
└── start.sh          # Quick start script
```

## ⚡ Quick Start (Recommended)

```bash
# 1. Install dependencies for both
cd backend && npm install && cd ../frontend && npm install && cd ..

# 2. Seed database with demo accounts
cd backend && npm run seed && cd ..

# 3. Start both servers
./start.sh
```

## 📝 Manual Setup

### Backend Setup

```bash
cd backend
npm install
npm run seed    # Create demo accounts
npm start       # Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Runs on http://localhost:5173
```

## 🔑 Demo Accounts

After seeding:
- **Patient**: patient@sehatsathi.in / demo123
- **Doctor**: doctor@sehatsathi.in / demo123
- **ASHA**: asha@sehatsathi.in / demo123
- **Admin**: admin@sehatsathi.in / demo123

## ✅ Verification

1. Backend: http://localhost:5000/api/health
2. Frontend: http://localhost:5173
3. MongoDB: Should be running on port 27017

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### MongoDB Not Running
```bash
# Start MongoDB
mongod

# Or with Homebrew
brew services start mongodb-community
```

### Dependencies Issues
```bash
# Clean install backend
cd backend && rm -rf node_modules package-lock.json && npm install

# Clean install frontend
cd frontend && rm -rf node_modules package-lock.json && npm install
```

## 📦 What's Installed

### Backend Dependencies
- express, mongoose, socket.io
- jsonwebtoken, bcryptjs
- cors, helmet, compression
- express-validator, morgan

### Frontend Dependencies
- react, react-dom
- typescript, vite
- tailwindcss, radix-ui
- socket.io-client
- sonner (toast notifications)

## 🎯 Next Steps

1. ✅ Start both servers
2. ✅ Login with demo account
3. ✅ Test appointment booking (Patient → Doctor)
4. ✅ Accept appointment (Doctor)
5. ✅ Start video consultation

## 📚 More Info

- Main README: [README.md](./README.md)
- Frontend README: [frontend/README.md](./frontend/README.md)
- Backend README: [backend/README.md](./backend/README.md)
- Video Guide: [VIDEO_CONSULTATION_GUIDE.md](./VIDEO_CONSULTATION_GUIDE.md)

# 🎥 Video Consultation Setup & Testing Guide

## 📋 Prerequisites

1. **Backend running** on port 5000
2. **Frontend running** on port 5173
3. **MongoDB running** locally
4. **Camera and microphone** permissions enabled in browser

## 🚀 Step-by-Step Testing Process

### Step 1: Start the Platform
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev

# Terminal 3 - Seed database (optional)
cd backend
npm run seed
```

### Step 2: Create Doctor Account
1. Go to `http://localhost:5173`
2. Click **Register**
3. Select **Doctor** role
4. Fill details:
   - Name: `Dr. John Smith`
   - Email: `doctor@test.com`
   - Password: `demo123`
   - Phone: `+919876543210`
   - Medical ID: `MED12345`
5. Click **Create Account**

### Step 3: Setup Doctor Profile
1. After login, click **Edit Profile** button
2. Fill in:
   - Specialty: `General Physician`
   - Experience: `10`
   - Consultation Fee: `299`
   - Languages: `Hindi, English`
   - Qualifications: `MBBS, MD`
3. Click **Update Profile**

### Step 4: Create Patient Account
1. Open **new incognito/private window**
2. Go to `http://localhost:5173`
3. Click **Register**
4. Select **Patient** role
5. Fill details:
   - Name: `Priya Sharma`
   - Email: `patient@test.com`
   - Password: `demo123`
   - Phone: `+919876543211`
   - Village: `Rampur`
6. Click **Create Account**

### Step 5: Book Consultation (Patient)
1. Click **Book Consultation** tab
2. Find the doctor you created
3. Click **Book Now**
4. Select:
   - Date: Today's date
   - Time: Any available slot
   - Payment Method: `UPI`
5. Click **Proceed to Payment**
6. Click **Pay ₹299**

### Step 6: Confirm Appointment (Doctor)
1. Switch to doctor window
2. Refresh page or wait for auto-refresh
3. You'll see the new appointment in **Pending** status
4. Click **Accept** button
5. Status changes to **Confirmed**

### Step 7: Start Video Consultation
1. **Doctor side**: Click **Start Consultation** button
2. **Patient side**: Go to **Appointments** tab, click **Join Call**
3. Both users will be prompted for camera/microphone permissions
4. Click **Allow** for both camera and microphone

### Step 8: Test Video Features
- **Video toggle**: Click video button to turn camera on/off
- **Audio toggle**: Click microphone button to mute/unmute
- **Chat**: Click chat button to open side panel and send messages
- **End call**: Click red phone button to end consultation

## 🔧 Troubleshooting

### Camera/Microphone Issues
```javascript
// Check browser permissions
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => console.log('Permissions granted'))
  .catch(err => console.error('Permission denied:', err));
```

### Connection Issues
1. Check if both backend and frontend are running
2. Verify MongoDB is connected
3. Check browser console for errors
4. Ensure ports 5000 and 5173 are not blocked

### WebRTC Issues
1. **STUN servers**: The app uses Google's public STUN servers
2. **Firewall**: Ensure WebRTC traffic is allowed
3. **Network**: Test on same local network first

## 📱 Testing on Mobile

1. Find your computer's IP address:
   ```bash
   # On Mac/Linux
   ifconfig | grep inet
   
   # On Windows
   ipconfig
   ```

2. Update frontend to accept external connections:
   ```bash
   # In package.json, update dev script:
   "dev": "vite --host 0.0.0.0"
   ```

3. Access from mobile:
   - Frontend: `http://YOUR_IP:5173`
   - Ensure mobile and computer are on same WiFi

## 🎯 Demo Flow

### Quick Demo (5 minutes)
1. **Doctor login** → Edit profile → Set availability
2. **Patient login** → Book consultation → Make payment
3. **Doctor** → Accept appointment
4. **Both** → Start video call → Test features → End call

### Full Demo (15 minutes)
1. Create accounts for both roles
2. Complete profile setup
3. Book multiple appointments
4. Test different scenarios:
   - With ASHA worker
   - With document upload
   - With pre-consultation messages
5. Test video call features
6. Add prescription (doctor side)
7. Rate consultation (patient side)

## 🔍 Key Features to Demonstrate

### Patient Features
- ✅ Easy registration and login
- ✅ Browse verified doctors
- ✅ Book appointments with payment
- ✅ Upload medical documents
- ✅ Video consultation with chat
- ✅ View appointment history
- ✅ Rate and review doctors

### Doctor Features
- ✅ Professional profile management
- ✅ Real-time appointment notifications
- ✅ Accept/reject appointments
- ✅ Video consultation with patients
- ✅ View patient documents
- ✅ Add prescriptions and notes
- ✅ Manage availability

### Technical Features
- ✅ Real-time WebRTC video calling
- ✅ Socket.IO for live updates
- ✅ JWT authentication
- ✅ MongoDB data persistence
- ✅ File upload system
- ✅ Responsive design
- ✅ Multi-language support

## 📊 Performance Tips

1. **Optimize video quality** based on network:
   ```javascript
   const constraints = {
     video: { width: 640, height: 480, frameRate: 15 },
     audio: { echoCancellation: true, noiseSuppression: true }
   };
   ```

2. **Monitor connection quality**:
   ```javascript
   peerConnection.getStats().then(stats => {
     // Check bandwidth, packet loss, etc.
   });
   ```

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| White screen on booking | Check API URL in services/api.ts |
| Video not working | Allow camera/microphone permissions |
| Appointments not showing | Verify backend is running on port 5000 |
| Socket connection failed | Check CORS settings in backend |
| Payment not processing | Check appointment creation API |

## 🎉 Success Indicators

- ✅ Both users can see and hear each other
- ✅ Chat messages appear in real-time
- ✅ Appointments sync between doctor and patient
- ✅ Profile updates save successfully
- ✅ Video controls work properly
- ✅ Call ends gracefully for both users

---

**🏥 Your SehatSathi telemedicine platform is now ready for rural healthcare delivery!**
# SehatSathi Frontend

React + TypeScript + Vite frontend for the SehatSathi telemedicine platform.

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Socket.IO Client** - Real-time communication
- **WebRTC** - Video calling

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Frontend will be available at http://localhost:5173

## 🏗️ Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

## 📁 Project Structure

```
src/
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   ├── Auth.tsx      # Authentication
│   ├── DoctorDashboard.tsx
│   ├── BookConsultation.tsx
│   └── VideoConsultation.tsx
├── services/         # API and Socket services
│   ├── api.ts
│   └── socket.ts
├── styles/           # Global styles
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## 🔧 Configuration

Update API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

For production, change to your backend URL.

## 🎨 Features

- Role-based dashboards (Patient, Doctor, ASHA, Admin)
- Real-time video consultations
- Appointment booking and management
- Document upload
- Multi-language support (Hindi/English)
- Responsive design
- PWA ready

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

WebRTC features require HTTPS in production.

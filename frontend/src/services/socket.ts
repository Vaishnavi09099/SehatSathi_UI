import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.userId = userId;
    this.socket = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      if (this.userId) {
        this.socket?.emit('join', this.userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  // Consultation methods
  joinConsultation(consultationId: string) {
    this.socket?.emit('join-consultation', consultationId);
  }

  leaveConsultation(consultationId: string) {
    this.socket?.emit('leave-consultation', consultationId);
  }

  // WebRTC signaling
  sendOffer(consultationId: string, offer: RTCSessionDescriptionInit) {
    this.socket?.emit('offer', { consultationId, offer });
  }

  sendAnswer(consultationId: string, answer: RTCSessionDescriptionInit) {
    this.socket?.emit('answer', { consultationId, answer });
  }

  sendIceCandidate(consultationId: string, candidate: RTCIceCandidate) {
    this.socket?.emit('ice-candidate', { consultationId, candidate });
  }

  // Chat
  sendChatMessage(consultationId: string, message: string) {
    this.socket?.emit('chat-message', { consultationId, message });
  }

  // Event listeners
  onUserJoined(callback: (data: any) => void) {
    this.socket?.on('user-joined', callback);
  }

  onUserLeft(callback: (data: any) => void) {
    this.socket?.on('user-left', callback);
  }

  onOffer(callback: (data: any) => void) {
    this.socket?.on('offer', callback);
  }

  onAnswer(callback: (data: any) => void) {
    this.socket?.on('answer', callback);
  }

  onIceCandidate(callback: (data: any) => void) {
    this.socket?.on('ice-candidate', callback);
  }

  onChatMessage(callback: (data: any) => void) {
    this.socket?.on('chat-message', callback);
  }

  // Remove listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;
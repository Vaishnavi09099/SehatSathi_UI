import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, MessageSquare, Settings, Users, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import socketService from '../services/socket';
import { consultationsAPI } from '../services/api';

interface VideoConsultationProps {
  consultationId: string;
  appointmentId: string;
  userRole: 'patient' | 'doctor' | 'asha';
  onEnd: () => void;
}

export function VideoConsultation({ consultationId, appointmentId, userRole, onEnd }: VideoConsultationProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    initializeConsultation();
    setupSocketListeners();

    return () => {
      cleanup();
    };
  }, []);

  const initializeConsultation = async () => {
    try {
      // Start consultation session
      await consultationsAPI.start(appointmentId);
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Join consultation room
      socketService.joinConsultation(consultationId);
      
      // Initialize peer connection
      initializePeerConnection();
      
      setConnectionStatus('connected');
      toast.success('Consultation started successfully');

    } catch (error) {
      console.error('Failed to initialize consultation:', error);
      setConnectionStatus('failed');
      toast.error('Failed to start consultation. Please check your camera and microphone permissions.');
    }
  };

  const initializePeerConnection = () => {
    const peerConnection = new RTCPeerConnection(rtcConfig);
    peerConnectionRef.current = peerConnection;

    // Add local stream to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      setIsConnected(true);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.sendIceCandidate(consultationId, event.candidate);
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        setIsConnected(true);
      } else if (peerConnection.connectionState === 'failed') {
        setConnectionStatus('failed');
        toast.error('Connection failed. Please try again.');
      }
    };
  };

  const setupSocketListeners = () => {
    socketService.onUserJoined((data) => {
      console.log('User joined:', data);
      setParticipants(prev => [...prev, data]);
      
      // If we're the caller, create and send offer
      if (userRole === 'doctor') {
        createOffer();
      }
    });

    socketService.onUserLeft((data) => {
      console.log('User left:', data);
      setParticipants(prev => prev.filter(p => p.userId !== data.userId));
    });

    socketService.onOffer(async (data) => {
      console.log('Received offer:', data);
      await handleOffer(data.offer);
    });

    socketService.onAnswer(async (data) => {
      console.log('Received answer:', data);
      await handleAnswer(data.answer);
    });

    socketService.onIceCandidate((data) => {
      console.log('Received ICE candidate:', data);
      handleIceCandidate(data.candidate);
    });

    socketService.onChatMessage((data) => {
      setChatMessages(prev => [...prev, data]);
    });
  };

  const createOffer = async () => {
    if (!peerConnectionRef.current) return;

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketService.sendOffer(consultationId, offer);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketService.sendAnswer(consultationId, answer);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      socketService.sendChatMessage(consultationId, newMessage);
      setNewMessage('');
    }
  };

  const endConsultation = async () => {
    try {
      if (userRole === 'doctor') {
        await consultationsAPI.end(consultationId);
      }
      cleanup();
      onEnd();
      toast.success('Consultation ended');
    } catch (error) {
      console.error('Error ending consultation:', error);
      toast.error('Error ending consultation');
    }
  };

  const cleanup = () => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    // Leave consultation room
    socketService.leaveConsultation(consultationId);
    socketService.removeAllListeners();
  };

  const reportTechnicalIssue = async (type: string, description: string) => {
    try {
      await consultationsAPI.reportIssue(consultationId, { type, description });
      toast.success('Technical issue reported');
    } catch (error) {
      console.error('Error reporting issue:', error);
      toast.error('Failed to report issue');
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-xl font-semibold">Video Consultation</h1>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? 'Connected' : 'Connecting...'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="text-white hover:bg-gray-700"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="text-white hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-gray-800"
        />

        {/* Local Video */}
        <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Connection Status */}
        {connectionStatus === 'connecting' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="p-6 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-semibold">Connecting to consultation...</p>
            </Card>
          </div>
        )}

        {connectionStatus === 'failed' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="p-6 text-center max-w-md">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Connection Failed</h3>
              <p className="text-gray-600 mb-4">
                Unable to establish video connection. Please check your internet connection and try again.
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry Connection
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleVideo}
          className="rounded-full w-12 h-12"
        >
          {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </Button>

        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleAudio}
          className="rounded-full w-12 h-12"
        >
          {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={endConsultation}
          className="rounded-full w-12 h-12"
        >
          <Phone className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2 ml-4">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm">
            {participants.length + 1} participant{participants.length !== 0 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Chat</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm font-medium">{msg.from}</p>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consultation Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Report Technical Issue</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => reportTechnicalIssue('audio', 'Audio quality issues')}
                >
                  Audio Issues
                </Button>
                <Button
                  variant="outline"
                  onClick={() => reportTechnicalIssue('video', 'Video quality issues')}
                >
                  Video Issues
                </Button>
                <Button
                  variant="outline"
                  onClick={() => reportTechnicalIssue('connection', 'Connection problems')}
                >
                  Connection Issues
                </Button>
                <Button
                  variant="outline"
                  onClick={() => reportTechnicalIssue('other', 'Other technical problems')}
                >
                  Other Issues
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
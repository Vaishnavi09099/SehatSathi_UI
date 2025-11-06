import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Mic, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([
    {
      text: "Namaste! 🙏 I'm your 24/7 AI health assistant. I can help you with:\n\n✓ General health information\n✓ Book doctor appointments\n✓ Understand symptoms\n✓ Health tips & guidance\n\nHow can I assist you today?",
      sender: "ai"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = message.toLowerCase();

    // Add user message
    setMessages(prev => [...prev, { text: message, sender: "user" }]);
    
    // Simulate AI response based on keywords
    setTimeout(() => {
      let response = "";
      
      if (userMessage.includes("book") || userMessage.includes("appointment") || userMessage.includes("doctor")) {
        response = "I can help you book a consultation! 📅\n\nWould you like to:\n• Book a video consultation\n• Book a chat consultation\n• See available doctors\n\nPlease visit the 'Book Consultation' section to schedule your appointment.";
      } else if (userMessage.includes("fever") || userMessage.includes("cold") || userMessage.includes("cough")) {
        response = "I understand you're not feeling well. Common symptoms like fever and cold can be concerning. 🌡️\n\nFor proper diagnosis and treatment, I recommend booking a consultation with our doctors. They can provide personalized medical advice.\n\nIn the meantime:\n• Stay hydrated\n• Get adequate rest\n• Monitor your temperature\n\nFor emergencies, use the Emergency SOS feature.";
      } else if (userMessage.includes("emergency") || userMessage.includes("urgent")) {
        response = "⚠️ For medical emergencies:\n\n1. Use the Emergency SOS button on any page\n2. Call emergency services: 102/108\n3. Contact nearest hospital\n\nStay calm and seek immediate help!";
      } else if (userMessage.includes("price") || userMessage.includes("cost") || userMessage.includes("payment")) {
        response = "💰 Our consultation pricing:\n\n• Video Call: ₹200-500\n• Chat: ₹100-300\n\nWe accept:\n• UPI\n• Credit/Debit Cards\n• Net Banking\n• Digital Wallets\n\nExact prices vary by doctor specialization.";
      } else {
        response = "Thank you for your message! 🙏\n\nI can help you with:\n• Booking consultations\n• General health information\n• Understanding our services\n• Emergency assistance\n\nFor personalized medical advice, please book a consultation with our doctors. What would you like to know more about?";
      }
      
      setMessages(prev => [...prev, {
        text: response,
        sender: "ai"
      }]);
    }, 800);

    setMessage("");
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 group">
          {/* Pulse animation ring */}
          <div className="absolute inset-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-[#2C7DA0] to-[#52B788] rounded-full opacity-75 animate-ping" />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <div className="bg-[#212529] text-white px-3 py-2 rounded-lg shadow-xl" style={{ fontSize: '13px' }}>
              Need help? Chat with AI Assistant
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-[#212529]" />
            </div>
          </div>
          
          {/* Main button */}
          <Button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-[#2C7DA0] to-[#52B788] hover:from-[#236180] hover:to-[#3d8a66] shadow-2xl hover:shadow-3xl transition-all hover:scale-110"
            aria-label="Open AI Assistant"
            title="AI Health Assistant - Available 24/7"
          >
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-96 h-[calc(100vh-2rem)] md:h-[500px] max-h-[600px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2C7DA0] to-[#52B788] text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>AI Health Assistant</h3>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                    24/7
                  </Badge>
                </div>
                <p style={{ fontSize: '12px' }} className="opacity-90">स्वास्थ्य सहायक</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F9FA]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-[#2C7DA0] text-white"
                      : "bg-white text-[#212529] shadow-sm"
                  }`}
                  style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="flex-shrink-0 border-2 border-[#52B788] text-[#52B788] hover:bg-[#52B788] hover:text-white"
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                className="flex-shrink-0 bg-[#2C7DA0] hover:bg-[#236180]"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p style={{ fontSize: '11px' }} className="text-[#6c757d] mt-2 text-center">
              For medical emergencies, please call 102 or use Emergency SOS
            </p>
          </div>
        </Card>
      )}
    </>
  );
}

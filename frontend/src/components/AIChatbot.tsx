import { useState } from "react";
import { Bot, Languages, ExternalLink, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export function AIChatbot() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-[#F8F9FA] to-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2C7DA0] to-[#52B788] rounded-full mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 700 }} className="text-[#212529] mb-2">
            AI Health Assistant
          </h2>
          <p style={{ fontSize: '16px' }} className="text-[#6c757d] mb-1">
            24/7 AI-powered health guidance in your language
          </p>
          <p style={{ fontSize: '15px' }} className="text-[#6c757d]">
            आपकी भाषा में 24/7 AI-संचालित स्वास्थ्य मार्गदर्शन
          </p>
          <Badge className="mt-3 bg-[#E8F4F8] text-[#2C7DA0] border-0">
            <Languages className="w-3 h-3 mr-2" />
            Supports 10+ Indian Languages
          </Badge>
        </div>

        {/* Chatbot Container */}
        <Card className="shadow-2xl border-2 border-gray-200 overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-[#2C7DA0] to-[#52B788] px-6 py-4 text-white flex items-center justify-between">
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Rural Health Chatbot</h3>
              <p style={{ fontSize: '14px' }} className="opacity-90">Ask any health-related questions</p>
            </div>
            <a
              href="https://ruralchatbot.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              style={{ fontSize: '14px' }}
            >
              <ExternalLink className="w-4 h-4" />
              Open in New Tab
            </a>
          </div>
          
          <div className="relative w-full" style={{ height: 'calc(100vh - 320px)', minHeight: '600px' }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#E8F4F8] to-[#E8F9F0]">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-[#2C7DA0] animate-spin mx-auto mb-4" />
                  <p style={{ fontSize: '16px', fontWeight: 600 }} className="text-[#2C7DA0]">
                    Loading AI Assistant...
                  </p>
                  <p style={{ fontSize: '14px' }} className="text-[#6c757d] mt-2">
                    AI सहायक लोड हो रहा है...
                  </p>
                </div>
              </div>
            )}
            <iframe
              src="https://ruralchatbot.netlify.app/"
              className="w-full h-full border-0"
              title="SehatSathi AI Health Assistant"
              allow="microphone"
              onLoad={() => setIsLoading(false)}
            />
          </div>

          <div className="px-6 py-4 bg-[#F8F9FA] border-t-2 border-gray-200">
            <p style={{ fontSize: '12px' }} className="text-[#6c757d] text-center">
              ⚠️ AI द्वारा संचालित - चिकित्सा निर्णयों के लिए हमेशा डॉक्टर से सत्यापित करें
              <br />
              Powered by AI - Always verify with a doctor for medical decisions
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
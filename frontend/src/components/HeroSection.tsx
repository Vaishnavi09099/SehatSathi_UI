import { Video, MessageCircle, Phone, CheckCircle, Globe, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroSectionProps {
  onBookConsultation: () => void;
  onOpenAIChat: () => void;
}

export function HeroSection({ onBookConsultation, onOpenAIChat }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-[#E8F4F8] via-white to-[#E8F9F0] px-4 py-12 md:py-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-[#52B788] rounded-full opacity-5 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#2C7DA0] rounded-full opacity-5 blur-3xl" />
      
      <div className="mx-auto max-w-7xl relative">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge 
                variant="secondary" 
                className="bg-white/90 backdrop-blur border-2 border-[#52B788] text-[#52B788] px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow text-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                500+ Verified Doctors
              </Badge>
              <Badge 
                variant="secondary" 
                className="bg-white/90 backdrop-blur border-2 border-[#2C7DA0] text-[#2C7DA0] px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow text-sm"
              >
                <Globe className="w-4 h-4 mr-2" />
                Available in 10+ Languages
              </Badge>
              <Badge 
                variant="secondary" 
                className="bg-white/90 backdrop-blur border-2 border-[#F77F00] text-[#F77F00] px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow text-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered
              </Badge>
            </div>

            {/* Headlines */}
            <div className="space-y-3">
              <h1 className="text-[#212529] leading-tight text-[clamp(32px,5vw,48px)] font-bold">
                Quality Healthcare,<br />
                <span className="bg-gradient-to-r from-[#2C7DA0] to-[#52B788] bg-clip-text text-transparent">
                  Right in Your Village
                </span>
              </h1>
              <h2 className="text-[#495057] text-[clamp(20px,3vw,28px)] font-semibold">
                गुणवत्तापूर्ण स्वास्थ्य सेवा, आपके गांव में
              </h2>
            </div>

            {/* Subheading */}
            <div className="space-y-2">
              <p className="text-[#495057] text-lg leading-relaxed">
                Connect with certified doctors through video calls and get instant help from our AI health assistant. 
                Healthcare made simple, affordable, and accessible.
              </p>
              <p className="text-[#495057] text-base leading-relaxed">
                वीडियो कॉल के माध्यम से प्रमाणित डॉक्टरों से जुड़ें और हमारे AI स्वास्थ्य सहायक से तुरंत सहायता प्राप्त करें।
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={onBookConsultation}
                className="bg-gradient-to-r from-[#2C7DA0] to-[#236180] hover:from-[#236180] hover:to-[#1a4d66] text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all min-h-[56px] group text-lg"
              >
                <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Book Consultation
              </Button>
              <Button 
                onClick={onOpenAIChat}
                variant="outline" 
                className="border-2 border-[#2C7DA0] text-[#2C7DA0] hover:bg-[#2C7DA0] hover:text-white px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[56px] group text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Talk to AI Assistant
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-4">
              <div>
                <div className="text-[#2C7DA0] text-[28px] font-bold">100K+</div>
                <div className="text-[#6c757d] text-sm">Families Served</div>
              </div>
              <div className="w-px bg-gray-300" />
              <div>
                <div className="text-[#52B788] text-[28px] font-bold">24/7</div>
                <div className="text-[#6c757d] text-sm">AI Assistant</div>
              </div>
              <div className="w-px bg-gray-300" />
              <div>
                <div className="text-[#F77F00] text-[28px] font-bold">500+</div>
                <div className="text-[#6c757d] text-sm">Verified Doctors</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
            <div className="rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1623741860335-2701bd6c991a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB2aWxsYWdlJTIwZmFtaWx5JTIwbW9iaWxlJTIwcGhvbmUlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc2MTE0NDc3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Village family using telemedicine on mobile device"
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating connection illustration */}
            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-2xl p-6 hidden md:block animate-in fade-in slide-in-from-bottom duration-700 delay-500">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#52B788] to-[#3d8a66] rounded-full flex items-center justify-center shadow-lg">
                    <Video className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#28A745] rounded-full border-2 border-white animate-pulse" />
                </div>
                
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className="w-2 h-2 bg-[#2C7DA0] rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
                
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#2C7DA0] to-[#236180] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">👨‍⚕️</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#28A745] rounded-full border-2 border-white animate-pulse" />
                </div>
              </div>
              <p className="text-center mt-3 text-[#52B788] text-[13px] font-semibold">
                Live Consultation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

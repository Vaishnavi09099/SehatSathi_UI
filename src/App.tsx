import { useState } from "react";
import { Auth } from "./components/Auth";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorks } from "./components/HowItWorks";
import { BookConsultation } from "./components/BookConsultation";
import { AIChatbot } from "./components/AIChatbot";
import { HealthDashboard } from "./components/HealthDashboard";
import { RewardsSection } from "./components/RewardsSection";
import { EmergencySOS } from "./components/EmergencySOS";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { AshaWorkerDashboard } from "./components/AshaWorkerDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { FloatingAIAssistant } from "./components/FloatingAIAssistant";
import { Toaster } from "./components/ui/sonner";
import { Heart, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, LogOut } from "lucide-react";
import { Button } from "./components/ui/button";

interface User {
  name: string;
  role: string;
  email: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [showEmergency, setShowEmergency] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab("home");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return '👨‍⚕️';
      case 'patient': return '👤';
      case 'asha': return '🤝';
      case 'admin': return '🛡️';
      default: return '👤';
    }
  };

  // reference to avoid unused-local errors while function may be used later
  void getRoleIcon;

  // Show auth screen if user is not logged in
  if (!user) {
    return (
      <>
        <Auth onAuthSuccess={setUser} />
        <FloatingAIAssistant />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // Role-based dashboard routing
  // Doctors, ASHA workers, and Admins go directly to their dashboards
  if (user.role === 'doctor') {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2C7DA0] to-[#52B788] rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">S+</span>
                </div>
                <div>
                  <h1 className="text-[#212529] text-lg font-bold">
                    SehatSathi
                  </h1>
                  <p className="text-[#6c757d] text-xs">
                    सेहत साथी
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[#212529] text-sm font-semibold">{user.name}</p>
                  <p className="text-[#6c757d] capitalize text-xs">{user.role}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-2 border-[#DC3545] text-[#DC3545] hover:bg-[#DC3545] hover:text-white min-h-[44px]"
                >
                  <LogOut className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DoctorDashboard />
        
        <FloatingAIAssistant />
        
        <EmergencySOS 
          isOpen={showEmergency} 
          onClose={() => setShowEmergency(false)} 
        />
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  if (user.role === 'asha') {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2C7DA0] to-[#52B788] rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">S+</span>
                </div>
                <div>
                  <h1 className="text-[#212529] text-lg font-bold">
                    SehatSathi
                  </h1>
                  <p className="text-[#6c757d] text-xs">
                    सेहत साथी
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[#212529] text-sm font-semibold">{user.name}</p>
                  <p className="text-[#6c757d] capitalize text-xs">{user.role}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-2 border-[#DC3545] text-[#DC3545] hover:bg-[#DC3545] hover:text-white min-h-[44px]"
                >
                  <LogOut className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <AshaWorkerDashboard />
        
        <FloatingAIAssistant />
        
        <EmergencySOS 
          isOpen={showEmergency} 
          onClose={() => setShowEmergency(false)} 
        />
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2C7DA0] to-[#52B788] rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">S+</span>
                </div>
                <div>
                  <h1 className="text-[#212529] text-lg font-bold">
                    SehatSathi
                  </h1>
                  <p className="text-[#6c757d] text-xs">
                    सेहत साथी
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[#212529] text-sm font-semibold">{user.name}</p>
                  <p className="text-[#6c757d] capitalize text-xs">{user.role}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-2 border-[#DC3545] text-[#DC3545] hover:bg-[#DC3545] hover:text-white min-h-[44px]"
                >
                  <LogOut className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <AdminDashboard />
        
        <FloatingAIAssistant />
        
        <EmergencySOS 
          isOpen={showEmergency} 
          onClose={() => setShowEmergency(false)} 
        />
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <>
            <HeroSection 
              onBookConsultation={() => handleTabChange("book")} 
              onOpenAIChat={() => handleTabChange("ai-chat")} 
            />
            <FeaturesSection />
            <HowItWorks onGetStarted={() => handleTabChange("book")} />
            
            {/* Trust Section */}
            <section className="py-12 px-4 bg-gradient-to-r from-[#2C7DA0] to-[#52B788] text-white">
              <div className="mx-auto max-w-7xl">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="animate-in fade-in slide-in-from-bottom duration-500">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                      <Heart className="w-8 h-8" />
                    </div>
                    <h3 className="text-[32px] font-bold">100K+</h3>
                    <p className="opacity-90 text-base">
                      Trusted by families across rural India
                    </p>
                    <p className="opacity-75 mt-1 text-sm">
                      भारत के ग्रामीण परिवारों द्वारा विश्वसनीय
                    </p>
                  </div>
                  <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-100">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                      <span className="text-[32px]">🏥</span>
                    </div>
                    <h3 className="text-[32px] font-bold">500+</h3>
                    <p className="opacity-90 text-base">
                      Certified medical professionals
                    </p>
                    <p className="opacity-75 mt-1 text-sm">
                      प्रमाणित चिकित्सा पेशेवर
                    </p>
                  </div>
                  <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                      <span className="text-[32px]">⭐</span>
                    </div>
                    <h3 className="text-[32px] font-bold">4.8/5</h3>
                    <p className="opacity-90 text-base">
                      Average patient rating
                    </p>
                    <p className="opacity-75 mt-1 text-sm">
                      औसत रोगी रेटिंग
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 px-4 bg-gradient-to-b from-white to-[#F8F9FA]">
              <div className="mx-auto max-w-7xl">
                <div className="text-center mb-12">
                  <h2 className="text-[#212529] mb-3 text-4xl font-bold">
                    What Our Patients Say
                  </h2>
                  <p className="text-[#6c757d] text-base">
                    हमारे रोगी क्या कहते हैं
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      name: "Priya Sharma",
                      nameHi: "प्रिया शर्मा",
                      village: "Rampur Village",
                      text: "SehatSathi made healthcare so easy! I can now consult doctors from my home.",
                      textHi: "सेहत साथी ने स्वास्थ्य सेवा को बहुत आसान बना दिया!",
                      rating: 5,
                      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
                    },
                    {
                      name: "Rajesh Kumar",
                      nameHi: "राजेश कुमार",
                      village: "Sitapur Village",
                      text: "The AI assistant helped me understand my symptoms before consulting the doctor.",
                      textHi: "AI सहायक ने मुझे डॉक्टर से परामर्श से पहले मेरे लक्षणों को समझने में मदद की।",
                      rating: 5,
                      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                    },
                    {
                      name: "Sunita Devi",
                      nameHi: "सुनीता देवी",
                      village: "Bharatpur Village",
                      text: "Finally, quality healthcare in my own language. The rewards program is great too!",
                      textHi: "आखिरकार, मेरी अपनी भाषा में गुणवत्तापूर्ण स्वास्थ्य सेवा।",
                      rating: 5,
                      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200"
                    },
                  ].map((testimonial, index) => (
                    <div 
                      key={index}
                      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-[#2C7DA0] animate-in fade-in slide-in-from-bottom"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-[#FFC107] text-xl">⭐</span>
                        ))}
                      </div>
                      <p className="text-[#495057] mb-4 text-[15px] leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      <p className="text-[#6c757d] mb-4 text-sm leading-relaxed">
                        "{testimonial.textHi}"
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#52B788]"
                        />
                        <div>
                          <h4 className="text-base font-semibold">{testimonial.name}</h4>
                          <p className="text-[#6c757d] text-[13px]">{testimonial.village}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
      
      case "book":
        return <BookConsultation />;
      
      case "ai-chat":
        return <AIChatbot />;
      
      case "dashboard":
        return <HealthDashboard />;
      
      case "rewards":
        return <RewardsSection />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Section */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleTabChange("home")}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#2C7DA0] to-[#52B788] rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">S+</span>
              </div>
              <div>
                <h1 className="text-[#212529] text-lg font-bold">
                  SehatSathi
                </h1>
                <p className="text-[#6c757d] text-xs">
                  सेहत साथी
                </p>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-[#212529] text-sm font-semibold">{user.name}</p>
                <p className="text-[#6c757d] capitalize text-xs">{user.role}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-2 border-[#DC3545] text-[#DC3545] hover:bg-[#DC3545] hover:text-white min-h-[44px]"
              >
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        onEmergencyClick={() => setShowEmergency(true)}
        notificationCount={3}
      />
      
      <main className="animate-in fade-in duration-300">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#212529] to-[#343a40] text-white py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2C7DA0] to-[#52B788] rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">S+</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">SehatSathi</h3>
                  <p className="opacity-75 text-sm">सेहत साथी</p>
                </div>
              </div>
              <p className="opacity-75 mb-4 text-sm">
                Making quality healthcare accessible to every village in India.
              </p>
              <p className="opacity-75 text-[13px]">
                भारत के हर गांव में गुणवत्तापूर्ण स्वास्थ्य सेवा सुलभ बनाना।
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 text-base font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => handleTabChange("home")} className="opacity-75 hover:opacity-100 transition-opacity hover:text-[#52B788]">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange("book")} className="opacity-75 hover:opacity-100 transition-opacity hover:text-[#52B788]">
                    Book Consultation
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange("ai-chat")} className="opacity-75 hover:opacity-100 transition-opacity hover:text-[#52B788]">
                    AI Assistant
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange("dashboard")} className="opacity-75 hover:opacity-100 transition-opacity hover:text-[#52B788]">
                    My Health
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange("rewards")} className="opacity-75 hover:opacity-100 transition-opacity hover:text-[#52B788]">
                    Rewards
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-4 text-base font-semibold">Support</h4>
              <ul className="space-y-2 text-sm">
                <li className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer hover:text-[#52B788]">Help Center</li>
                <li className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer hover:text-[#52B788]">Privacy Policy</li>
                <li className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer hover:text-[#52B788]">Terms of Service</li>
                <li className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer hover:text-[#52B788]">FAQs</li>
                <li className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer hover:text-[#52B788]">Contact Us</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-base font-semibold">Contact</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 opacity-75 hover:opacity-100 transition-opacity">
                  <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                  <div>
                    <div>1800-123-4567</div>
                    <div>(Toll Free)</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 opacity-75 hover:opacity-100 transition-opacity">
                  <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>support@sehatsathi.in</span>
                </div>
                <div className="flex items-start gap-2 opacity-75 hover:opacity-100 transition-opacity">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social & Copyright */}
          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="opacity-75 text-sm">
                © 2025 SehatSathi. All rights reserved. | Made with ❤️ for Rural India
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#2C7DA0] rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#2C7DA0] rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#2C7DA0] rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#2C7DA0] rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Emergency SOS Dialog */}
      <EmergencySOS 
        isOpen={showEmergency} 
        onClose={() => setShowEmergency(false)} 
      />

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />

      <Toaster position="top-right" richColors />
    </div>
  );
}

import { useState } from "react";
import { Menu, X, Globe, Phone, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onEmergencyClick: () => void;
  notificationCount?: number;
  userRole?: string;
}

export function Header({ activeTab, onTabChange, onEmergencyClick, notificationCount = 3, userRole }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  const tabs = [
    { id: "home", label: "Home", labelHi: "होम" },
    { id: "book", label: "Book Consultation", labelHi: "परामर्श बुक करें" },
    { id: "ai-chat", label: "AI Assistant", labelHi: "AI सहायक" },
    { id: "dashboard", label: "My Health", labelHi: "मेरा स्वास्थ्य" },
    { id: "appointments", label: "Appointments", labelHi: "अपॉइंटमेंट" },
    { id: "rewards", label: "Rewards", labelHi: "पुरस्कार" },
  ];

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={
                  activeTab === tab.id
                    ? "bg-[#2C7DA0] text-white hover:bg-[#236180] text-[15px]"
                    : "text-[#495057] hover:bg-[#E8F4F8] text-[15px]"
                }
              >
                {language === "hi" ? tab.labelHi : tab.label}
              </Button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon"
              className="relative hidden md:flex hover:bg-[#E8F4F8]"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#DC3545] text-white border-0 text-xs">
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* Language Selector */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[130px] hidden md:flex">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
                <SelectItem value="mr">मराठी</SelectItem>
              </SelectContent>
            </Select>

            {/* Emergency Button */}
            <Button 
              onClick={onEmergencyClick}
              className="bg-[#DC3545] hover:bg-[#c82333] text-white hidden md:flex min-h-[44px] shadow-lg hover:shadow-xl transition-all animate-pulse"
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 flex flex-col gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={
                  activeTab === tab.id
                    ? "bg-[#2C7DA0] text-white hover:bg-[#236180] justify-start text-base min-h-[48px]"
                    : "text-[#495057] hover:bg-[#E8F4F8] justify-start text-base min-h-[48px]"
                }
              >
                {language === "hi" ? tab.labelHi : tab.label}
              </Button>
            ))}
            <Button 
              onClick={() => {
                onEmergencyClick();
                setMobileMenuOpen(false);
              }}
              className="bg-[#DC3545] hover:bg-[#c82333] text-white justify-start min-h-[48px] mt-2 animate-pulse"
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency / आपातकालीन
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
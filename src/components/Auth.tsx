import { useState } from "react";
import { UserCircle, Stethoscope, Users, Shield, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

interface AuthProps {
  onAuthSuccess: (user: { name: string; role: string; email: string }) => void;
}

type UserRole = "patient" | "doctor" | "asha" | "admin";

const userRoles = [
  {
    id: "patient" as UserRole,
    title: "Patient",
    titleHi: "रोगी",
    icon: UserCircle,
  },
  {
    id: "doctor" as UserRole,
    title: "Doctor",
    titleHi: "डॉक्टर",
    icon: Stethoscope,
  },
  {
    id: "asha" as UserRole,
    title: "ASHA Worker",
    titleHi: "आशा कार्यकर्ता",
    icon: Users,
  },
  {
    id: "admin" as UserRole,
    title: "Admin",
    titleHi: "प्रशासक",
    icon: Shield,
  },
];

export function Auth({ onAuthSuccess }: AuthProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    village: "",
    medicalId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in production, this would call an API
    const user = {
      name: formData.name || "Demo User",
      role: selectedRole,
      email: formData.email || `${selectedRole}@sehatsathi.in`,
    };

    toast.success(`Welcome to SehatSathi!`, {
        description: `${authMode === "register" ? "Account created" : "Logged in"} as ${selectedRoleData?.title}`,
        duration: 3000,
      });

    onAuthSuccess(user);
  };

  const selectedRoleData = userRoles.find((r) => r.id === selectedRole);
  const isRegister = authMode === "register";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F4F8] via-white to-[#E8F9F0] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#52B788] rounded-full opacity-5 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#2C7DA0] rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <Card className="w-full max-w-md p-8 shadow-2xl animate-in fade-in slide-in-from-bottom duration-500 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2C7DA0] to-[#52B788] rounded-2xl mb-6 shadow-2xl">
            <span className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>S+</span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#212529] mb-2">
            SehatSathi
          </h1>
          <p style={{ fontSize: '18px' }} className="text-[#6c757d] mb-1">
            सेहत साथी
          </p>
          <p style={{ fontSize: '16px' }} className="text-[#6c757d]">
            Making Healthcare Accessible
          </p>
        </div>

        {/* Login/Register Tabs */}
        <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "register")} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="login" className="text-base">
              Login | लॉगिन
            </TabsTrigger>
            <TabsTrigger value="register" className="text-base">
              Register | पंजीकरण
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection - Always visible */}
          <div>
            <Label htmlFor="role">
              Select Role | भूमिका चुनें
            </Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger className="h-14 mt-2 border-2" style={{ fontSize: '16px' }}>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{role.title} - {role.titleHi}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Name field - Always visible but only required for register */}
          <div>
            <Label htmlFor="name">
              Full Name | पूरा नाम {!isRegister && <span className="text-[#6c757d] text-xs">(optional)</span>}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required={isRegister}
              className="h-12 mt-2 border-2"
              style={{ fontSize: '15px' }}
            />
          </div>

          {/* Role-specific fields for register */}
          {isRegister && selectedRole === "patient" && (
            <div>
              <Label htmlFor="village">Village | गाँव</Label>
              <Input
                id="village"
                type="text"
                placeholder="Your village name"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="h-12 mt-2 border-2"
                style={{ fontSize: '15px' }}
              />
            </div>
          )}

          {isRegister && selectedRole === "doctor" && (
            <div>
              <Label htmlFor="medicalId">Medical Registration ID</Label>
              <Input
                id="medicalId"
                type="text"
                placeholder="Your medical license number"
                value={formData.medicalId}
                onChange={(e) => setFormData({ ...formData, medicalId: e.target.value })}
                className="h-12 mt-2 border-2"
                style={{ fontSize: '15px' }}
              />
            </div>
          )}

          {/* Email - Always visible */}
          <div>
            <Label htmlFor="email">
              Email | ईमेल {!isRegister && <span className="text-[#6c757d] text-xs">(optional for demo)</span>}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required={isRegister}
              className="h-12 mt-2 border-2"
              style={{ fontSize: '15px' }}
            />
          </div>

          {/* Phone - Only for register */}
          {isRegister && (
            <div>
              <Label htmlFor="phone">Phone Number | फ़ोन नंबर</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="h-12 mt-2 border-2"
                style={{ fontSize: '15px' }}
              />
            </div>
          )}

          {/* Password - Always visible */}
          <div>
            <Label htmlFor="password">
              Password | पासवर्ड {!isRegister && <span className="text-[#6c757d] text-xs">(optional for demo)</span>}
            </Label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={isRegister ? "Create a password" : "Enter password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={isRegister}
                className="h-12 pr-12 border-2"
                style={{ fontSize: '15px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c757d] hover:text-[#212529]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Login Note */}
          {!isRegister && (
            <div className="bg-[#E8F4F8] border-l-4 border-[#2C7DA0] p-3 rounded">
              <p style={{ fontSize: '13px' }} className="text-[#212529]">
                💡 <strong>Quick Demo:</strong> Just select a role and click Login for instant access!
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-[#2C7DA0] to-[#52B788] hover:from-[#236180] hover:to-[#3d8a66] text-white"
            style={{ fontSize: '18px' }}
          >
            {isRegister ? "Create Account" : "Login"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>

        {/* Help */}
        <div className="mt-8 pt-6 border-t text-center">
          <p style={{ fontSize: '13px' }} className="text-[#6c757d]">
            Need help? Call 1800-123-4567 (Toll Free)
          </p>
          <p style={{ fontSize: '12px' }} className="text-[#6c757d] mt-1">
            सहायता चाहिए? 1800-123-4567 पर कॉल करें (टोल फ्री)
          </p>
        </div>
      </Card>
    </div>
  );
}

import { Phone, X, AlertTriangle, Navigation, Heart, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";
import { toast } from "sonner";
import { useState } from "react";

interface EmergencySOSProps {
  isOpen: boolean;
  onClose: () => void;
}

const emergencyContacts = [
  { name: "Ambulance", number: "108", icon: "🚑", color: "from-[#DC3545] to-[#c82333]" },
  { name: "Fire", number: "101", icon: "🚒", color: "from-[#F77F00] to-[#d66d00]" },
  { name: "Police", number: "100", icon: "🚓", color: "from-[#2C7DA0] to-[#236180]" },
  { name: "Women Helpline", number: "1091", icon: "👮‍♀️", color: "from-[#52B788] to-[#3d8a66]" },
];

const nearbyHospitals = [
  { name: "District Hospital", distance: "2.3 km", phone: "+91-XXXX-XXXXXX" },
  { name: "Primary Health Center", distance: "5.1 km", phone: "+91-XXXX-XXXXXX" },
  { name: "Community Hospital", distance: "8.7 km", phone: "+91-XXXX-XXXXXX" },
];

export function EmergencySOS({ isOpen, onClose }: EmergencySOSProps) {
  const [calling, setCalling] = useState<string | null>(null);

  const handleEmergencyCall = (name: string, number: string) => {
    setCalling(number);
    toast.error(`Calling ${name} - ${number}`, {
      description: "Emergency services will be contacted immediately",
      duration: 3000,
    });
    
    setTimeout(() => {
      setCalling(null);
      toast.success("Location shared with emergency services", {
        description: "Help is on the way!",
      });
    }, 3000);
  };

  const handleHospitalCall = (hospital: string, phone: string) => {
    toast.info(`Calling ${hospital}`, {
      description: phone,
      duration: 3000,
    });
  };

  const shareLocation = () => {
    toast.success("Location Shared", {
      description: "Your location has been shared with emergency contacts",
      duration: 3000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#DC3545] to-[#c82333] text-white p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Emergency SOS</h2>
                <p style={{ fontSize: '14px' }} className="opacity-90">आपातकालीन सहायता</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          <Button 
            onClick={shareLocation}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Share My Location
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Emergency Numbers */}
          <div>
            <h3 className="mb-4 flex items-center gap-2" style={{ fontSize: '18px', fontWeight: 600 }}>
              <Phone className="w-5 h-5 text-[#DC3545]" />
              Emergency Helplines
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {emergencyContacts.map((contact) => (
                <Card 
                  key={contact.number}
                  className={`p-5 bg-gradient-to-br ${contact.color} text-white border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group ${
                    calling === contact.number ? 'animate-pulse' : ''
                  }`}
                  onClick={() => handleEmergencyCall(contact.name, contact.number)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ fontSize: '40px' }}>{contact.icon}</span>
                    <Phone className={`w-6 h-6 ${calling === contact.number ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`} />
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-1">
                    {contact.name}
                  </h4>
                  <p style={{ fontSize: '24px', fontWeight: 700 }} className="tracking-wider">
                    {contact.number}
                  </p>
                  {calling === contact.number && (
                    <div className="mt-3 flex items-center gap-2">
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span style={{ fontSize: '14px' }}>Calling...</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Nearby Hospitals */}
          <div>
            <h3 className="mb-4 flex items-center gap-2" style={{ fontSize: '18px', fontWeight: 600 }}>
              <Heart className="w-5 h-5 text-[#DC3545]" />
              Nearby Hospitals
            </h3>
            <div className="space-y-3">
              {nearbyHospitals.map((hospital, index) => (
                <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#E8F4F8] rounded-full flex items-center justify-center">
                        <span style={{ fontSize: '24px' }}>🏥</span>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{hospital.name}</h4>
                        <p style={{ fontSize: '14px' }} className="text-[#6c757d]">
                          📍 {hospital.distance} away
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleHospitalCall(hospital.name, hospital.phone)}
                      className="bg-[#2C7DA0] hover:bg-[#236180]"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Important Info */}
          <Card className="p-4 bg-[#FFF3CD] border-[#FFC107]">
            <p style={{ fontSize: '14px' }} className="text-[#856404]">
              <strong>Important:</strong> In case of medical emergency, call 108 (Ambulance) immediately. 
              Your location will be automatically shared with emergency services.
            </p>
            <p style={{ fontSize: '13px' }} className="text-[#856404] mt-2">
              महत्वपूर्ण: चिकित्सा आपातकाल के मामले में, तुरंत 108 (एम्बुलेंस) पर कॉल करें।
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

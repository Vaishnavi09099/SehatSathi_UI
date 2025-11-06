import { Video, MessageCircle, FileText, Gift, Shield, Globe, Clock, Users } from "lucide-react";
import { Card } from "./ui/card";

const features = [
  {
    icon: Video,
    title: "Video Consultation",
    titleHi: "वीडियो परामर्श",
    description: "Talk to doctors face-to-face from anywhere",
    color: "from-[#2C7DA0] to-[#236180]",
  },
  {
    icon: MessageCircle,
    title: "24/7 AI Chatbot",
    titleHi: "24/7 AI चैटबॉट",
    description: "Instant health answers anytime",
    color: "from-[#52B788] to-[#3d8a66]",
  },
  {
    icon: FileText,
    title: "Medical Records",
    titleHi: "चिकित्सा रिकॉर्ड",
    description: "All your health data in one secure place",
    color: "from-[#F77F00] to-[#d66d00]",
  },
  {
    icon: Gift,
    title: "Rewards Program",
    titleHi: "पुरस्कार कार्यक्रम",
    description: "Earn points for staying healthy",
    color: "from-[#2C7DA0] to-[#52B788]",
  },
  {
    icon: Shield,
    title: "Verified Doctors",
    titleHi: "सत्यापित डॉक्टर",
    description: "500+ certified medical professionals",
    color: "from-[#52B788] to-[#2C7DA0]",
  },
  {
    icon: Globe,
    title: "10+ Languages",
    titleHi: "10+ भाषाएं",
    description: "Consult in your preferred language",
    color: "from-[#F77F00] to-[#2C7DA0]",
  },
  {
    icon: Clock,
    title: "Quick Response",
    titleHi: "त्वरित प्रतिक्रिया",
    description: "Get consultation within 30 minutes",
    color: "from-[#2C7DA0] to-[#F77F00]",
  },
  {
    icon: Users,
    title: "Family Care",
    titleHi: "परिवार की देखभाल",
    description: "Manage health for entire family",
    color: "from-[#52B788] to-[#F77F00]",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-[#212529] mb-3 text-4xl font-bold">
            Everything You Need for Better Health
          </h2>
          <p className="text-[#6c757d] text-lg">
            बेहतर स्वास्थ्य के लिए आपको जो कुछ भी चाहिए
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card 
              key={feature.title}
              className="group p-6 text-center hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#2C7DA0] cursor-pointer relative overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" 
                   style={{ backgroundImage: `linear-gradient(to bottom right, #2C7DA0, #52B788)` }} 
              />
              
              <div className="relative">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-[#6c757d] mb-2 text-sm">
                  {feature.description}
                </p>
                <p className="text-[#2C7DA0] text-[13px] font-semibold">
                  {feature.titleHi}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

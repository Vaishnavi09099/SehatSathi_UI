import { Phone, Video, Calendar, Check } from "lucide-react";
import { Button } from "./ui/button";

const steps = [
  {
    number: 1,
    icon: Phone,
    title: "Register & Book",
    titleHi: "पंजीकरण और बुकिंग",
    description: "Create your profile and book a consultation with a verified doctor in your language",
    descriptionHi: "अपना प्रोफाइल बनाएं और अपनी भाषा में डॉक्टर से परामर्श बुक करें",
    color: "from-[#2C7DA0] to-[#236180]",
    numberBg: "bg-[#F77F00]",
  },
  {
    number: 2,
    icon: Video,
    title: "Video Consultation",
    titleHi: "वीडियो परामर्श",
    description: "Meet your doctor through video call. AI assistant helps translate and take notes",
    descriptionHi: "वीडियो कॉल के माध्यम से अपने डॉक्टर से मिलें। AI सहायक अनुवाद और नोट लेने में मदद करता है",
    color: "from-[#52B788] to-[#3d8a66]",
    numberBg: "bg-[#F77F00]",
  },
  {
    number: 3,
    icon: Calendar,
    title: "Get Prescription & Follow-up",
    titleHi: "प्रिस्क्रिप्शन और फॉलो-अप",
    description: "Receive digital prescription and set reminders for medicine and follow-up visits",
    descriptionHi: "डिजिटल प्रिस्क्रिप्शन प्राप्त करें और दवा और फॉलो-अप विजिट के लिए रिमाइंडर सेट करें",
    color: "from-[#F77F00] to-[#d66d00]",
    numberBg: "bg-[#2C7DA0]",
  },
];

interface HowItWorksProps {
  onGetStarted: () => void;
}

export function HowItWorks({ onGetStarted }: HowItWorksProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white via-[#E8F4F8] to-[#E8F9F0]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-[#212529] mb-4 text-[40px] font-bold">
            How It Works
          </h2>
          <p className="text-[#6c757d] mb-2 text-xl">
            Get healthcare in 3 simple steps
          </p>
          <p className="text-[#6c757d] text-lg">
            तीन आसान चरणों में स्वास्थ्य सेवा प्राप्त करें
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="relative animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${index * 200}ms` }}>
              <div className="text-center relative z-10">
                <div className="relative inline-block mb-6">
                  <div className={`w-28 h-28 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mx-auto shadow-2xl hover:scale-105 transition-transform duration-300`}>
                    <step.icon className="w-14 h-14 text-white" />
                  </div>
                  <div 
                    className={`absolute -top-3 -right-3 w-12 h-12 ${step.numberBg} rounded-full flex items-center justify-center text-white shadow-xl text-2xl font-bold`}
                  >
                    {step.number}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#52B788] rounded-full animate-pulse" />
                </div>
                
                <h3 className="mb-3 text-2xl font-bold">
                  {step.title}
                </h3>
                <p className="text-[#495057] mb-3 text-base leading-relaxed">
                  {step.description}
                </p>
                <p className="text-[#2C7DA0] text-[15px] font-semibold leading-relaxed">
                  {step.titleHi}
                </p>
                <p className="text-[#6c757d] mt-2 text-sm leading-relaxed">
                  {step.descriptionHi}
                </p>
              </div>
              
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[60%] w-full z-0">
                  <div className="flex items-center">
                    <div className="flex-1 h-1 bg-gradient-to-r from-[#52B788] to-transparent" />
                    <div className="flex gap-1 mx-2">
                      {[0, 1, 2].map((i) => (
                        <div 
                          key={i}
                          className="w-2 h-2 bg-[#52B788] rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 300}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Success Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { number: "100K+", label: "Families Served", labelHi: "परिवारों की सेवा की" },
            { number: "500+", label: "Verified Doctors", labelHi: "सत्यापित डॉक्टर" },
            { number: "24/7", label: "Available", labelHi: "उपलब्ध" },
            { number: "10+", label: "Languages", labelHi: "भाषाएं" },
          ].map((metric, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow border-2 border-white"
            >
              <div className="text-[#2C7DA0] text-4xl font-bold">
                {metric.number}
              </div>
              <div className="text-[#495057] text-[15px] font-semibold">
                {metric.label}
              </div>
              <div className="text-[#6c757d] text-[13px]">
                {metric.labelHi}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-[#52B788] to-[#3d8a66] hover:from-[#3d8a66] hover:to-[#2d6b4d] text-white px-12 py-7 rounded-2xl shadow-2xl hover:shadow-3xl transition-all min-h-[64px] group text-[22px] font-semibold"
          >
            <Check className="w-6 h-6 mr-3 group-hover:scale-125 transition-transform" />
            Start Your Healthcare Journey
            <span className="ml-3 group-hover:translate-x-2 transition-transform inline-block">→</span>
          </Button>
          <p className="mt-4 text-[#6c757d] text-[15px]">
            अपनी स्वास्थ्य यात्रा शुरू करें
          </p>
        </div>
      </div>
    </section>
  );
}

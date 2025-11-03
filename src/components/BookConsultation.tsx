import { useState } from "react";
import { Search, Star, Clock, MapPin, ArrowRight, Filter, Upload, FileText, X, MessageSquare, CreditCard, Banknote, Smartphone, Wallet, CheckCircle2, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { toast } from "sonner";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface Doctor {
  id: number;
  name: string;
  nameHi: string;
  specialty: string;
  specialtyHi: string;
  experience: number;
  languages: string[];
  rating: number;
  reviews: number;
  fee: number;
  available: string;
  image: string;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    nameHi: "डॉ. प्रिया शर्मा",
    specialty: "General Physician",
    specialtyHi: "सामान्य चिकित्सक",
    experience: 12,
    languages: ["Hindi", "English", "Punjabi"],
    rating: 4.8,
    reviews: 523,
    fee: 199,
    available: "Today, 2:00 PM",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    nameHi: "डॉ. राजेश कुमार",
    specialty: "Pediatrician",
    specialtyHi: "बाल रोग विशेषज्ञ",
    experience: 15,
    languages: ["Hindi", "English", "Bengali"],
    rating: 4.9,
    reviews: 678,
    fee: 249,
    available: "Tomorrow, 10:00 AM",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"
  },
  {
    id: 3,
    name: "Dr. Anjali Verma",
    nameHi: "डॉ. अंजलि वर्मा",
    specialty: "Gynecologist",
    specialtyHi: "स्त्री रोग विशेषज्ञ",
    experience: 10,
    languages: ["Hindi", "English", "Marathi"],
    rating: 4.7,
    reviews: 412,
    fee: 299,
    available: "Today, 4:00 PM",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400"
  },
  {
    id: 4,
    name: "Dr. Amit Patel",
    nameHi: "डॉ. अमित पटेल",
    specialty: "Cardiologist",
    specialtyHi: "हृदय रोग विशेषज्ञ",
    experience: 18,
    languages: ["Hindi", "English", "Gujarati"],
    rating: 4.9,
    reviews: 892,
    fee: 399,
    available: "Today, 6:00 PM",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400"
  },
  {
    id: 5,
    name: "Dr. Sunita Reddy",
    nameHi: "डॉ. सुनीता रेड्डी",
    specialty: "Dermatologist",
    specialtyHi: "त्वचा विशेषज्ञ",
    experience: 8,
    languages: ["Hindi", "English", "Telugu"],
    rating: 4.6,
    reviews: 321,
    fee: 249,
    available: "Tomorrow, 11:00 AM",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400"
  },
  {
    id: 6,
    name: "Dr. Mohammed Ali",
    nameHi: "डॉ. मोहम्मद अली",
    specialty: "Orthopedic Surgeon",
    specialtyHi: "आर्थोपेडिक सर्जन",
    experience: 14,
    languages: ["Hindi", "English", "Urdu"],
    rating: 4.8,
    reviews: 567,
    fee: 349,
    available: "Today, 5:00 PM",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400"
  }
];

export function BookConsultation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{ name: string; size: string; type: string; file?: File }>>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [needAshaWorker, setNeedAshaWorker] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");

  const filteredDoctors = doctors.filter(
    (doctor) => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSpecialty = filterSpecialty === "all" || doctor.specialty === filterSpecialty;
      
      return matchesSearch && matchesSpecialty;
    }
  );

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newDocs = Array.from(files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type.includes("pdf") ? "PDF" : file.type.includes("image") ? "Image" : "Document",
        file: file
      }));
      setUploadedDocuments([...uploadedDocuments, ...newDocs]);
      toast.success(`${newDocs.length} document(s) uploaded successfully`);
    }
  };

  const handleRemoveDocument = (index: number) => {
    setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      toast.success("Message sent to doctor", {
        description: "The doctor will review your message before the consultation.",
      });
      setChatMessage("");
    }
  };

  const handleProceedToPayment = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      setShowPayment(true);
    } else {
      toast.error("Please select date and time");
    }
  };

  const handleCompletePayment = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (selectedDoctor && selectedDate && selectedTime) {
      // Store appointment in localStorage
      const appointment = {
        id: Date.now().toString(),
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        date: selectedDate.toLocaleDateString(),
        time: selectedTime,
        fee: selectedDoctor.fee,
        documents: uploadedDocuments.map(doc => ({ name: doc.name, size: doc.size, type: doc.type })),
        message: chatMessage,
        needAshaWorker: needAshaWorker,
        paymentMethod: paymentMethod,
        paymentStatus: "paid",
        status: "pending",
        createdAt: new Date().toISOString()
      };

      const existingAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
      localStorage.setItem("appointments", JSON.stringify([...existingAppointments, appointment]));

      const docsInfo = uploadedDocuments.length > 0 ? ` | ${uploadedDocuments.length} document(s) attached` : "";
      const ashaInfo = needAshaWorker ? " | ASHA Worker assistance requested" : "";
      toast.success(`Appointment booked with ${selectedDoctor.name} on ${selectedDate.toLocaleDateString()} at ${selectedTime}${docsInfo}${ashaInfo}`, {
        description: `Payment of ₹${selectedDoctor.fee} via ${paymentMethod} successful. You will receive a confirmation SMS shortly.`,
        duration: 5000,
      });
      
      setSelectedDoctor(null);
      setSelectedTime("");
      setUploadedDocuments([]);
      setChatMessage("");
      setShowPayment(false);
      setPaymentMethod("");
      setNeedAshaWorker(false);
    }
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white to-[#F8F9FA]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#212529] mb-3">
            Book Your Consultation
          </h2>
          <p style={{ fontSize: '18px' }} className="text-[#6c757d] mb-2">
            Choose from our network of verified doctors
          </p>
          <p style={{ fontSize: '16px' }} className="text-[#6c757d]">
            हमारे सत्यापित डॉक्टरों के नेटवर्क से चुनें
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6c757d]" />
            <Input
              type="text"
              placeholder="Search by name, specialty, or language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 rounded-xl border-2"
              style={{ fontSize: '16px' }}
            />
          </div>
          <Button 
            variant="outline" 
            className="h-14 px-6 rounded-xl border-2"
            onClick={() => setShowFilterDialog(true)}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card 
              key={doctor.id} 
              className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-[#2C7DA0] cursor-pointer group"
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16 border-2 border-[#52B788]">
                  <AvatarImage src={doctor.image} alt={doctor.name} />
                  <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="text-[#212529] mb-1">
                    {doctor.name}
                  </h3>
                  <p style={{ fontSize: '14px' }} className="text-[#6c757d] mb-2">
                    {doctor.specialty}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{doctor.rating}</span>
                    </div>
                    <span style={{ fontSize: '13px' }} className="text-[#6c757d]">
                      ({doctor.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-[#495057]">
                  <Clock className="w-4 h-4 text-[#2C7DA0]" />
                  <span style={{ fontSize: '14px' }}>{doctor.experience} years exp.</span>
                </div>
                <div className="flex items-center gap-2 text-[#495057]">
                  <MapPin className="w-4 h-4 text-[#52B788]" />
                  <span style={{ fontSize: '14px' }}>Available: {doctor.available}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {doctor.languages.map((lang) => (
                  <Badge 
                    key={lang} 
                    variant="secondary" 
                    className="bg-[#E8F4F8] text-[#2C7DA0]"
                    style={{ fontSize: '12px' }}
                  >
                    {lang}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <span style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#2C7DA0]">
                    ₹{doctor.fee}
                  </span>
                  <span style={{ fontSize: '14px' }} className="text-[#6c757d] ml-1">
                    / session
                  </span>
                </div>
                <Button 
                  className="bg-[#52B788] hover:bg-[#3d8a66] text-white group-hover:bg-[#2C7DA0] transition-colors"
                >
                  Book Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Booking Dialog */}
        <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle style={{ fontSize: '24px' }}>Book Appointment</DialogTitle>
              <DialogDescription style={{ fontSize: '16px' }}>
                Schedule your consultation with {selectedDoctor?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedDoctor && (
              <div className="space-y-6">
                {/* Doctor Info */}
                <Card className="p-4 bg-[#E8F4F8] border-0">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedDoctor.image} alt={selectedDoctor.name} />
                      <AvatarFallback>{selectedDoctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 600 }}>{selectedDoctor.name}</h4>
                      <p style={{ fontSize: '14px' }} className="text-[#6c757d]">{selectedDoctor.specialty}</p>
                      <p style={{ fontSize: '16px', fontWeight: 600 }} className="text-[#2C7DA0] mt-1">
                        ₹{selectedDoctor.fee}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Date Selection */}
                <div>
                  <h4 className="mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
                    Select Date
                  </h4>
                  <div className="flex justify-center">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <h4 className="mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
                    Select Time Slot
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className={selectedTime === time ? "bg-[#2C7DA0]" : ""}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* ASHA Worker Preference */}
                <Card className="p-4 border-2 border-[#E8F4F8] bg-gradient-to-r from-[#FFF8E7] to-white">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-[#F77F00]" />
                        <Label htmlFor="asha-worker" style={{ fontSize: '16px', fontWeight: 600 }}>
                          Need ASHA Worker Assistance?
                        </Label>
                      </div>
                      <p style={{ fontSize: '14px' }} className="text-[#6c757d] mb-1">
                        ASHA workers can help with language translation and technical support during your consultation
                      </p>
                      <p style={{ fontSize: '13px' }} className="text-[#6c757d]">
                        क्या आपको आशा कार्यकर्ता सहायता चाहिए? (भाषा अनुवाद और तकनीकी सहायता)
                      </p>
                    </div>
                    <Switch
                      id="asha-worker"
                      checked={needAshaWorker}
                      onCheckedChange={setNeedAshaWorker}
                      className="mt-1"
                    />
                  </div>
                  {needAshaWorker && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-[#F77F00]">
                      <p style={{ fontSize: '13px' }} className="text-[#F77F00]">
                        ✓ An ASHA worker will join your consultation to assist you
                      </p>
                    </div>
                  )}
                </Card>

                {/* Documents & Chat Section */}
                <Card className="border-2 border-[#E8F4F8] overflow-hidden">
                  <Tabs defaultValue="documents" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="documents" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Reports
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Message Doctor
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="documents" className="p-4">
                      <div className="space-y-4">
                        <div>
                          <p style={{ fontSize: '14px' }} className="text-[#6c757d] mb-3">
                            Upload medical reports, prescriptions, or test results
                          </p>
                          <p style={{ fontSize: '13px' }} className="text-[#6c757d] mb-3">
                            चिकित्सा रिपोर्ट, नुस्खे या परीक्षण परिणाम अपलोड करें
                          </p>
                          
                          <label htmlFor="file-upload">
                            <div className="border-2 border-dashed border-[#2C7DA0] rounded-xl p-6 text-center cursor-pointer hover:bg-[#E8F4F8] transition-colors">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-[#2C7DA0]" />
                              <p style={{ fontSize: '14px', fontWeight: 600 }} className="text-[#2C7DA0]">
                                Click to upload documents
                              </p>
                              <p style={{ fontSize: '12px' }} className="text-[#6c757d] mt-1">
                                PDF, JPG, PNG (Max 10MB each)
                              </p>
                            </div>
                            <input
                              id="file-upload"
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {uploadedDocuments.length > 0 && (
                          <div className="space-y-2">
                            <h5 style={{ fontSize: '14px', fontWeight: 600 }}>Uploaded Documents:</h5>
                            {uploadedDocuments.map((doc, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-[#2C7DA0]" />
                                  <div>
                                    <p style={{ fontSize: '14px', fontWeight: 600 }}>{doc.name}</p>
                                    <p style={{ fontSize: '12px' }} className="text-[#6c757d]">
                                      {doc.type} • {doc.size}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveDocument(index)}
                                  className="text-[#DC3545] hover:text-[#DC3545] hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="chat" className="p-4">
                      <div className="space-y-4">
                        <div>
                          <p style={{ fontSize: '14px' }} className="text-[#6c757d] mb-3">
                            Send a message to the doctor before your consultation
                          </p>
                          <p style={{ fontSize: '13px' }} className="text-[#6c757d] mb-3">
                            अपने परामर्श से पहले डॉक्टर को संदेश भेजें
                          </p>
                        </div>

                        <Textarea
                          placeholder="Describe your symptoms, concerns, or any questions you have..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          className="min-h-[150px]"
                          style={{ fontSize: '15px' }}
                        />

                        <Button
                          onClick={handleSendMessage}
                          disabled={!chatMessage.trim()}
                          className="w-full bg-[#2C7DA0] hover:bg-[#236180]"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>

                {/* Payment Summary & Proceed Button */}
                <Card className="p-4 bg-gradient-to-r from-[#E8F4F8] to-white border-2 border-[#2C7DA0]">
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Consultation Fee</span>
                    <span style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#2C7DA0]">
                      ₹{selectedDoctor.fee}
                    </span>
                  </div>
                  {uploadedDocuments.length > 0 && (
                    <p style={{ fontSize: '13px' }} className="text-[#6c757d] mb-2">
                      ✓ {uploadedDocuments.length} document(s) will be shared with doctor
                    </p>
                  )}
                  {needAshaWorker && (
                    <p style={{ fontSize: '13px' }} className="text-[#F77F00] mb-2">
                      ✓ ASHA Worker assistance included
                    </p>
                  )}
                </Card>

                <Button
                  onClick={handleProceedToPayment}
                  disabled={!selectedTime}
                  className="w-full h-14 bg-gradient-to-r from-[#52B788] to-[#3d8a66] hover:from-[#3d8a66] hover:to-[#2d6b4d] text-white"
                  style={{ fontSize: '18px' }}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Payment
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle style={{ fontSize: '24px' }}>
                Payment
              </DialogTitle>
              <DialogDescription style={{ fontSize: '16px' }}>
                Complete payment to confirm your appointment
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Amount Card */}
              <Card className="p-6 bg-gradient-to-r from-[#2C7DA0] to-[#52B788] text-white border-0">
                <div className="text-center">
                  <p style={{ fontSize: '14px' }} className="opacity-90 mb-2">Total Amount</p>
                  <p style={{ fontSize: '48px', fontWeight: 700 }}>₹{selectedDoctor?.fee}</p>
                  <p style={{ fontSize: '13px' }} className="opacity-75 mt-1">Consultation Fee</p>
                </div>
              </Card>

              {/* Payment Methods */}
              <div>
                <h4 className="mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Select Payment Method
                </h4>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-[#F8F9FA] transition-colors has-[:checked]:border-[#2C7DA0] has-[:checked]:bg-[#E8F4F8]">
                      <RadioGroupItem value="upi" id="upi" />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p style={{ fontSize: '16px', fontWeight: 600 }}>UPI</p>
                          <p style={{ fontSize: '13px' }} className="text-[#6c757d]">GPay, PhonePe, Paytm</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-[#F8F9FA] transition-colors has-[:checked]:border-[#2C7DA0] has-[:checked]:bg-[#E8F4F8]">
                      <RadioGroupItem value="card" id="card" />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p style={{ fontSize: '16px', fontWeight: 600 }}>Credit/Debit Card</p>
                          <p style={{ fontSize: '13px' }} className="text-[#6c757d]">Visa, Mastercard, RuPay</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-[#F8F9FA] transition-colors has-[:checked]:border-[#2C7DA0] has-[:checked]:bg-[#E8F4F8]">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p style={{ fontSize: '16px', fontWeight: 600 }}>Digital Wallet</p>
                          <p style={{ fontSize: '13px' }} className="text-[#6c757d]">Paytm, PhonePe Wallet</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-[#F8F9FA] transition-colors has-[:checked]:border-[#2C7DA0] has-[:checked]:bg-[#E8F4F8]">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Banknote className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p style={{ fontSize: '16px', fontWeight: 600 }}>Net Banking</p>
                          <p style={{ fontSize: '13px' }} className="text-[#6c757d]">All major banks</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Secure Payment Badge */}
              <div className="flex items-center justify-center gap-2 text-[#52B788] bg-green-50 p-3 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
                <p style={{ fontSize: '14px', fontWeight: 600 }}>100% Secure Payment</p>
              </div>

              {/* Pay Button */}
              <Button
                onClick={handleCompletePayment}
                disabled={!paymentMethod}
                className="w-full h-14 bg-gradient-to-r from-[#52B788] to-[#3d8a66] hover:from-[#3d8a66] hover:to-[#2d6b4d] text-white"
                style={{ fontSize: '18px' }}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ₹{selectedDoctor?.fee}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle style={{ fontSize: '24px' }}>Filter Doctors</DialogTitle>
              <DialogDescription style={{ fontSize: '16px' }}>
                Refine your search
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <Label style={{ fontSize: '16px', fontWeight: 600 }} className="mb-3 block">
                  Specialty
                </Label>
                <RadioGroup value={filterSpecialty} onValueChange={setFilterSpecialty}>
                  <div className="space-y-2">
                    {["all", "General Physician", "Pediatrician", "Gynecologist", "Cardiologist", "Dermatologist", "Orthopedic Surgeon"].map((specialty) => (
                      <label key={specialty} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F8F9FA] has-[:checked]:border-[#2C7DA0] has-[:checked]:bg-[#E8F4F8]">
                        <RadioGroupItem value={specialty} id={specialty} />
                        <span style={{ fontSize: '15px' }}>{specialty === "all" ? "All Specialties" : specialty}</span>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={() => setShowFilterDialog(false)}
                className="w-full bg-[#2C7DA0] hover:bg-[#236180]"
              >
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Calendar, Users, Video, Clock, TrendingUp, FileText, Bell, CheckCircle, XCircle, AlertCircle, Download, Eye, MessageSquare, CreditCard, Edit, Settings } from "lucide-react";
import { appointmentsAPI, usersAPI, consultationsAPI } from "../services/api";
import { VideoConsultation } from "./VideoConsultation";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface Appointment {
  id: string;
  patientName?: string;
  patientNameHi?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  time: string;
  date?: string;
  type?: "video" | "chat";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  symptoms?: string;
  symptomsHi?: string;
  documents?: Array<{ name: string; size: string; type: string }>;
  message?: string;
  needAshaWorker?: boolean;
  paymentMethod?: string;
  paymentStatus?: string;
  fee?: number;
}

export function DoctorDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showVideoConsultation, setShowVideoConsultation] = useState(false);
  const [currentConsultation, setCurrentConsultation] = useState<any>(null);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    specialty: '',
    experience: '',
    consultationFee: '',
    languages: '',
    qualifications: ''
  });

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, profileRes] = await Promise.all([
        appointmentsAPI.getAll(),
        usersAPI.getProfile()
      ]);
      
      setAppointments(appointmentsRes.appointments || []);
      setDoctorProfile(profileRes.user);
      
      if (profileRes.user?.doctorProfile) {
        const dp = profileRes.user.doctorProfile;
        setProfileForm({
          specialty: dp.specialty || '',
          experience: dp.experience?.toString() || '',
          consultationFee: dp.consultationFee?.toString() || '',
          languages: dp.languages?.join(', ') || '',
          qualifications: dp.qualifications?.join(', ') || ''
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showVideoConsultation && currentConsultation) {
    return (
      <VideoConsultation
        consultationId={currentConsultation.consultationId}
        appointmentId={currentConsultation.appointmentId}
        userRole="doctor"
        onEnd={() => {
          setShowVideoConsultation(false);
          setCurrentConsultation(null);
          loadDashboardData();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const recentPatients = appointments.slice(0, 5).map(apt => ({
    name: apt.patient?.name || 'Unknown Patient',
    nameHi: apt.patient?.name || 'अज्ञात रोगी',
    lastVisit: new Date(apt.appointmentDate).toLocaleDateString(),
    condition: apt.symptoms || 'General consultation',
    conditionHi: apt.symptoms || 'सामान्य परामर्श'
  })) || [
    {
      name: "Meera Patel",
      nameHi: "मीरा पटेल",
      lastVisit: "2 days ago",
      condition: "Diabetes",
      conditionHi: "मधुमेह"
    },
    {
      name: "Vikram Yadav",
      nameHi: "विक्रम यादव",
      lastVisit: "1 week ago",
      condition: "Hypertension",
      conditionHi: "उच्च रक्तचाप"
    },
    {
      name: "Anjali Gupta",
      nameHi: "अंजलि गुप्ता",
      lastVisit: "3 days ago",
      condition: "Asthma",
      conditionHi: "दमा"
    }
  ];

  const handleAcceptAppointment = async (id: string) => {
    try {
      await appointmentsAPI.updateStatus(id, 'confirmed');
      await loadDashboardData();
      toast.success("Appointment Confirmed!");
    } catch (error) {
      toast.error('Failed to confirm appointment');
    }
  };

  const handleRejectAppointment = async (id: string) => {
    try {
      await appointmentsAPI.updateStatus(id, 'cancelled');
      await loadDashboardData();
      toast.error("Appointment Cancelled");
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleStartConsultation = async (appointmentId: string) => {
    try {
      const response = await consultationsAPI.start(appointmentId);
      setCurrentConsultation({
        consultationId: response.consultation.roomId,
        appointmentId: appointmentId
      });
      setShowVideoConsultation(true);
    } catch (error) {
      toast.error('Failed to start consultation');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const doctorProfileData = {
        doctorProfile: {
          specialty: profileForm.specialty,
          experience: parseInt(profileForm.experience) || 0,
          consultationFee: parseInt(profileForm.consultationFee) || 0,
          languages: profileForm.languages.split(',').map(l => l.trim()).filter(l => l),
          qualifications: profileForm.qualifications.split(',').map(q => q.trim()).filter(q => q)
        }
      };
      
      await usersAPI.updateProfile(doctorProfileData);
      await loadDashboardData();
      setShowProfileDialog(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleViewDocuments = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDocumentsDialog(true);
  };

  const handleViewPatientRecords = (patientName: string) => {
    toast.success(`Loading records for ${patientName}...`, {
      description: "Patient medical history and previous consultations"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-[#F77F00] text-white">Pending / लंबित</Badge>;
      case "confirmed":
        return <Badge className="bg-[#52B788] text-white">Confirmed / पुष्टि</Badge>;
      case "completed":
        return <Badge className="bg-[#2C7DA0] text-white">Completed / पूर्ण</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-500 text-white">Cancelled / रद्द</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F9FA] py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2C7DA0] to-[#52B788] rounded-full flex items-center justify-center">
              <span style={{ fontSize: '24px' }}>👨‍⚕️</span>
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 700 }} className="text-[#212529]">
                Doctor Dashboard
              </h1>
              <p style={{ fontSize: '16px' }} className="text-[#6c757d]">
                डॉक्टर डैशबोर्ड
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-[#2C7DA0] to-[#1e5770] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">12</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">Today's Appointments</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">आज की नियुक्तियां</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#52B788] to-[#3a8a63] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">245</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">Total Patients</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">कुल मरीज</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#F77F00] to-[#c96600] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <Clock className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">8</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">Consultations Today</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">आज के परामर्श</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#6c757d] to-[#495057] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <Bell className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">4</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">Pending Requests</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">लंबित अनुरोध</div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto p-1 bg-white border-2 border-gray-200 shadow-md">
            <TabsTrigger 
              value="appointments" 
              className="min-h-[56px] data-[state=active]:bg-[#2C7DA0] data-[state=active]:text-white"
            >
              <div className="text-center">
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Appointments</div>
                <div style={{ fontSize: '12px' }} className="opacity-75">नियुक्तियां</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="patients" 
              className="min-h-[56px] data-[state=active]:bg-[#52B788] data-[state=active]:text-white"
            >
              <div className="text-center">
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Patients</div>
                <div style={{ fontSize: '12px' }} className="opacity-75">मरीज</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="min-h-[56px] data-[state=active]:bg-[#F77F00] data-[state=active]:text-white"
            >
              <div className="text-center">
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Reports</div>
                <div style={{ fontSize: '12px' }} className="opacity-75">रिपोर्ट</div>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <Card className="p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#212529]">
                    Today's Appointments
                  </h2>
                  <p style={{ fontSize: '14px' }} className="text-[#6c757d]">
                    आज की नियुक्तियां
                  </p>
                </div>
                <Badge className="bg-[#2C7DA0] text-white px-4 py-2">
                  {appointments.length} Total
                </Badge>
              </div>

              <div className="space-y-4">
                {appointments.map((appointment, index) => (
                  <div 
                    key={appointment._id}
                    className="p-6 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <Avatar className="w-16 h-16 border-2 border-[#52B788]">
                        <AvatarFallback className="bg-[#52B788] text-white" style={{ fontSize: '20px' }}>
                          {appointment.patient?.name?.charAt(0) || "P"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="text-[#212529]">
                            {appointment.patient?.name || 'Unknown Patient'}
                          </h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <p style={{ fontSize: '14px' }} className="text-[#6c757d] mb-1">
                          {appointment.patient?.name || 'अज्ञात रोगी'}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#6c757d]">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {appointment.type === "video" ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            <span className="capitalize">{appointment.type}</span>
                          </div>
                        </div>
                        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                          <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#212529] mb-1">
                            Symptoms: {appointment.symptoms || 'Not specified'}
                          </p>
                          <p style={{ fontSize: '12px' }} className="text-[#6c757d]">
                            लक्षण: {appointment.symptoms || 'निर्दिष्ट नहीं'}
                          </p>
                        </div>
                        
                        {/* Documents and ASHA Worker Info */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {appointment.documents && appointment.documents.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocuments(appointment)}
                              className="border-[#2C7DA0] text-[#2C7DA0] hover:bg-[#E8F4F8]"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              {appointment.documents.length} Document(s)
                            </Button>
                          )}
                          {appointment.preConsultationMessage && (
                            <Badge className="bg-blue-100 text-blue-700 border-0">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Has Message
                            </Badge>
                          )}
                          {appointment.ashaWorker && (
                            <Badge className="bg-orange-100 text-orange-700 border-0">
                              👥 ASHA Worker Assigned
                            </Badge>
                          )}
                          {appointment.payment?.status === "paid" && (
                            <Badge className="bg-green-100 text-green-700 border-0">
                              <CreditCard className="w-3 h-3 mr-1" />
                              Paid ₹{appointment.payment.amount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        {appointment.status === "pending" && (
                          <>
                            <Button
                              onClick={() => handleAcceptAppointment(appointment._id)}
                              className="bg-[#52B788] hover:bg-[#3a8a63] text-white min-h-[48px] flex-1"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleRejectAppointment(appointment._id)}
                              variant="outline"
                              className="border-2 border-red-500 text-red-500 hover:bg-red-50 min-h-[48px] flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <Button
                            onClick={() => handleStartConsultation(appointment._id)}
                            className="bg-[#2C7DA0] hover:bg-[#1e5770] text-white min-h-[56px] px-6"
                          >
                            <Video className="w-5 h-5 mr-2" />
                            Start Consultation
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-4">
            <Card className="p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#212529]">
                    Recent Patients
                  </h2>
                  <p style={{ fontSize: '14px' }} className="text-[#6c757d]">
                    हाल के मरीज
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {recentPatients.map((patient, index) => (
                  <div 
                    key={index}
                    className="p-6 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 border-2 border-[#2C7DA0]">
                        <AvatarFallback className="bg-[#2C7DA0] text-white" style={{ fontSize: '20px' }}>
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="text-[#212529]">
                          {patient.name}
                        </h3>
                        <p style={{ fontSize: '14px' }} className="text-[#6c757d] mb-2">
                          {patient.nameHi}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="text-[#6c757d]">Last visit: {patient.lastVisit}</span>
                          <Badge className="bg-[#F77F00] text-white">
                            {patient.condition} / {patient.conditionHi}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleViewPatientRecords(patient.name)}
                        className="bg-[#52B788] hover:bg-[#3a8a63] text-white min-h-[56px]"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Records
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card className="p-6 border-2 border-gray-200 shadow-lg">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-[#F77F00] to-[#c96600] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#212529] mb-2">
                  Medical Reports
                </h3>
                <p style={{ fontSize: '16px' }} className="text-[#6c757d] mb-1">
                  View and manage patient reports
                </p>
                <p style={{ fontSize: '14px' }} className="text-[#6c757d]">
                  रोगी रिपोर्ट देखें और प्रबंधित करें
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card 
            className="p-6 border-2 border-[#2C7DA0] hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setShowScheduleDialog(true)}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#2C7DA0] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Manage Schedule</h3>
                <p style={{ fontSize: '13px' }} className="text-[#6c757d]">समय प्रबंधित करें</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 border-2 border-[#52B788] hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setShowNotificationsDialog(true)}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#52B788] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Notifications</h3>
                <p style={{ fontSize: '13px' }} className="text-[#6c757d]">सूचनाएं</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 border-2 border-[#F77F00] hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => toast.info("No emergency cases at the moment", { description: "कोई आपातकालीन मामला नहीं" })}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#F77F00] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Emergency Cases</h3>
                <p style={{ fontSize: '13px' }} className="text-[#6c757d]">आपातकालीन मामले</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Documents Dialog */}
        <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle style={{ fontSize: '24px' }}>
                Patient Documents
              </DialogTitle>
              <DialogDescription style={{ fontSize: '16px' }}>
                Medical reports and documents uploaded by {selectedAppointment?.patientName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedAppointment?.message && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 600 }} className="mb-2">
                        Patient Message:
                      </h4>
                      <p style={{ fontSize: '15px' }} className="text-gray-700">
                        {selectedAppointment.message}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {selectedAppointment?.documents && selectedAppointment.documents.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {selectedAppointment.documents.map((doc, index) => (
                      <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-[#E8F4F8] rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-[#2C7DA0]" />
                            </div>
                            <div className="flex-1">
                              <h4 style={{ fontSize: '16px', fontWeight: 600 }} className="text-[#212529]">
                                {doc.name}
                              </h4>
                              <p style={{ fontSize: '14px' }} className="text-[#6c757d]">
                                {doc.type} • {doc.size}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.success("Opening document...", { description: doc.name })}
                              className="border-[#2C7DA0] text-[#2C7DA0] hover:bg-[#E8F4F8]"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.success("Downloading document...", { description: doc.name })}
                              className="border-[#52B788] text-[#52B788] hover:bg-green-50"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12 text-[#6c757d]">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p style={{ fontSize: '16px' }}>No documents uploaded for this appointment</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Schedule Dialog */}
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle style={{ fontSize: '24px' }}>
                Manage Schedule
              </DialogTitle>
              <DialogDescription style={{ fontSize: '16px' }}>
                Set your availability and manage appointments
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-r from-[#2C7DA0] to-[#52B788] text-white">
                <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-4">Today's Schedule</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p style={{ fontSize: '14px' }} className="opacity-90">Total Slots</p>
                    <p style={{ fontSize: '32px', fontWeight: 700 }}>12</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px' }} className="opacity-90">Booked</p>
                    <p style={{ fontSize: '32px', fontWeight: 700 }}>{appointments.length}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px' }} className="opacity-90">Available</p>
                    <p style={{ fontSize: '32px', fontWeight: 700 }}>{12 - appointments.length}</p>
                  </div>
                </div>
              </Card>

              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-4">Weekly Availability</h4>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <Button
                      key={day}
                      variant="outline"
                      className="h-20 flex flex-col"
                    >
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{day}</span>
                      <span style={{ fontSize: '12px' }} className="text-[#6c757d]">9AM-6PM</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-[#2C7DA0] hover:bg-[#236180]">
                Update Availability
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notifications Dialog */}
        <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle style={{ fontSize: '24px' }}>
                Notifications
              </DialogTitle>
              <DialogDescription style={{ fontSize: '16px' }}>
                Recent updates and alerts
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {[
                  { type: "new", title: "New Appointment Request", desc: "Priya Sharma requested a consultation", time: "5 min ago", icon: Calendar, color: "blue" },
                  { type: "payment", title: "Payment Received", desc: "₹249 from Rajesh Kumar", time: "30 min ago", icon: CreditCard, color: "green" },
                  { type: "reminder", title: "Upcoming Consultation", desc: "Video call with Sunita Devi in 30 minutes", time: "1 hour ago", icon: Clock, color: "orange" },
                  { type: "document", title: "New Document Uploaded", desc: "Amit Singh uploaded lab reports", time: "2 hours ago", icon: FileText, color: "purple" },
                ].map((notif, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 bg-${notif.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                        <notif.icon className={`w-6 h-6 text-${notif.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h4 style={{ fontSize: '16px', fontWeight: 600 }} className="mb-1">{notif.title}</h4>
                        <p style={{ fontSize: '14px' }} className="text-[#6c757d] mb-2">{notif.desc}</p>
                        <p style={{ fontSize: '12px' }} className="text-[#6c757d]">{notif.time}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast.success("All notifications marked as read")}
            >
              Mark All as Read
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

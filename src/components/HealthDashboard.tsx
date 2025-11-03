import { useState } from "react";
import { 
  Calendar, Pill, Heart, Activity, Download,
  TrendingUp, CheckCircle, AlertCircle, Clock, Droplet
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const vitalData = [
  { month: "Jan", bp: 120, sugar: 95 },
  { month: "Feb", bp: 118, sugar: 98 },
  { month: "Mar", bp: 122, sugar: 92 },
  { month: "Apr", bp: 119, sugar: 96 },
  { month: "May", bp: 121, sugar: 94 },
  { month: "Jun", bp: 120, sugar: 93 },
];

const appointments = [
  {
    id: 1,
    doctor: "Dr. Priya Sharma",
    specialty: "General Physician",
    date: "Oct 25, 2025",
    time: "2:00 PM",
    status: "upcoming",
  },
  {
    id: 2,
    doctor: "Dr. Rajesh Kumar",
    specialty: "Pediatrician",
    date: "Oct 20, 2025",
    time: "10:00 AM",
    status: "completed",
  },
];

const prescriptions = [
  {
    id: 1,
    medicine: "Paracetamol 500mg",
    dosage: "1-0-1",
    duration: "5 days",
    taken: 3,
    total: 15,
  },
  {
    id: 2,
    medicine: "Amoxicillin 250mg",
    dosage: "1-1-1",
    duration: "7 days",
    taken: 12,
    total: 21,
  },
];

const vaccinations = [
  { name: "COVID-19 Booster", status: "completed", date: "Jan 15, 2025" },
  { name: "Influenza", status: "pending", date: "Due Nov 2025" },
  { name: "Typhoid", status: "completed", date: "Jun 20, 2024" },
];

export function HealthDashboard() {
  const [healthScore] = useState(78);

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white to-[#F8F9FA]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h2 style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#212529] mb-2">
            My Health Dashboard
          </h2>
          <p style={{ fontSize: '16px' }} className="text-[#6c757d]">
            मेरा स्वास्थ्य डैशबोर्ड - Track your health journey
          </p>
        </div>

        {/* Patient Profile Card */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-[#2C7DA0] to-[#52B788] text-white border-0 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-white/30">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200" />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 700 }}>Ramesh Kumar</h3>
                <p style={{ fontSize: '16px' }} className="opacity-90">रमेश कुमार</p>
                <div className="flex gap-4 mt-2" style={{ fontSize: '14px' }}>
                  <span>Age: 45 years</span>
                  <span>•</span>
                  <span>Blood Group: O+</span>
                  <span>•</span>
                  <span>Village: Rampur</span>
                </div>
                <p style={{ fontSize: '13px' }} className="opacity-75 mt-1">
                  Health ID: ABHA-1234-5678-9012
                </p>
              </div>
            </div>

            {/* Health Score */}
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl p-6 min-w-[180px]">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    opacity="0.3"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeDasharray={`${healthScore * 3.51} 351.68`}
                    strokeLinecap="round"
                    transform="rotate(-90 64 64)"
                  />
                </svg>
                <div className="absolute">
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>{healthScore}</div>
                  <div style={{ fontSize: '14px' }} className="opacity-90">Score</div>
                </div>
              </div>
              <p style={{ fontSize: '13px' }} className="mt-2 opacity-90">
                Health Status: Good
              </p>
            </div>
          </div>
        </Card>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Appointments */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2C7DA0]" />
                Upcoming Appointments
              </h3>
              <Button variant="link" className="text-[#2C7DA0]">View All</Button>
            </div>
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#E8F4F8] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      apt.status === "upcoming" ? "bg-[#52B788]" : "bg-[#6c757d]"
                    }`}>
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{apt.doctor}</h4>
                      <p style={{ fontSize: '14px' }} className="text-[#6c757d]">{apt.specialty}</p>
                      <p style={{ fontSize: '13px' }} className="text-[#6c757d] mt-1">
                        {apt.date} at {apt.time}
                      </p>
                    </div>
                  </div>
                  {apt.status === "upcoming" && (
                    <Button size="sm" className="bg-[#2C7DA0] hover:bg-[#236180]">
                      Join Call
                    </Button>
                  )}
                  {apt.status === "completed" && (
                    <Badge className="bg-[#28A745] text-white border-0">
                      Completed
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-[#2C7DA0] to-[#236180] text-white border-0">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-8 h-8" />
                <TrendingUp className="w-5 h-5 opacity-75" />
              </div>
              <h4 style={{ fontSize: '16px' }} className="opacity-90">Blood Pressure</h4>
              <p style={{ fontSize: '28px', fontWeight: 700 }}>120/80</p>
              <p style={{ fontSize: '13px' }} className="opacity-75 mt-1">Normal Range</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#52B788] to-[#3d8a66] text-white border-0">
              <div className="flex items-center justify-between mb-2">
                <Droplet className="w-8 h-8" />
                <TrendingUp className="w-5 h-5 opacity-75" />
              </div>
              <h4 style={{ fontSize: '16px' }} className="opacity-90">Blood Sugar</h4>
              <p style={{ fontSize: '28px', fontWeight: 700 }}>93 mg/dL</p>
              <p style={{ fontSize: '13px' }} className="opacity-75 mt-1">Fasting</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#F77F00] to-[#d66d00] text-white border-0">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8" />
                <Clock className="w-5 h-5 opacity-75" />
              </div>
              <h4 style={{ fontSize: '16px' }} className="opacity-90">Last Checkup</h4>
              <p style={{ fontSize: '20px', fontWeight: 700 }}>15 days ago</p>
              <p style={{ fontSize: '13px' }} className="opacity-75 mt-1">Next due: Nov 5</p>
            </Card>
          </div>
        </div>

        {/* Detailed Sections with Tabs */}
        <Tabs defaultValue="vitals" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="vitals">Vital Statistics</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          </TabsList>

          {/* Vitals Tab */}
          <TabsContent value="vitals">
            <Card className="p-6">
              <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-6">
                Vital Statistics Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis dataKey="month" stroke="#6c757d" />
                  <YAxis stroke="#6c757d" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="bp" 
                    stroke="#2C7DA0" 
                    strokeWidth={3}
                    name="Blood Pressure"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sugar" 
                    stroke="#52B788" 
                    strokeWidth={3}
                    name="Blood Sugar"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions">
            <Card className="p-6">
              <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-6">
                Active Prescriptions
              </h3>
              <div className="space-y-4">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="p-4 bg-[#F8F9FA] rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 style={{ fontSize: '18px', fontWeight: 600 }}>{rx.medicine}</h4>
                        <p style={{ fontSize: '14px' }} className="text-[#6c757d] mt-1">
                          Dosage: {rx.dosage} | Duration: {rx.duration}
                        </p>
                      </div>
                      <Pill className="w-6 h-6 text-[#2C7DA0]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between" style={{ fontSize: '14px' }}>
                        <span>Progress</span>
                        <span className="text-[#2C7DA0]" style={{ fontWeight: 600 }}>
                          {rx.taken}/{rx.total} doses
                        </span>
                      </div>
                      <Progress value={(rx.taken / rx.total) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Medical History Tab */}
          <TabsContent value="history">
            <Card className="p-6">
              <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-6">
                Medical History Timeline
              </h3>
              <div className="relative space-y-6 pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#E0E0E0]" />
                
                {[
                  { date: "Oct 10, 2025", event: "Annual Health Checkup", doctor: "Dr. Priya Sharma", status: "completed" },
                  { date: "Aug 5, 2025", event: "Follow-up Consultation", doctor: "Dr. Rajesh Kumar", status: "completed" },
                  { date: "Jun 15, 2025", event: "Blood Test", doctor: "Lab Tests", status: "completed" },
                ].map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[33px] w-4 h-4 bg-[#52B788] rounded-full border-4 border-white" />
                    <div className="bg-[#F8F9FA] p-4 rounded-xl hover:bg-[#E8F4F8] transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{item.event}</h4>
                          <p style={{ fontSize: '14px' }} className="text-[#6c757d] mt-1">
                            {item.doctor}
                          </p>
                          <p style={{ fontSize: '13px' }} className="text-[#6c757d] mt-1">
                            {item.date}
                          </p>
                        </div>
                        <Badge className="bg-[#28A745] text-white border-0">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Vaccinations Tab */}
          <TabsContent value="vaccinations">
            <Card className="p-6">
              <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-6">
                Vaccination Status
              </h3>
              <div className="space-y-4">
                {vaccinations.map((vac, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        vac.status === "completed" ? "bg-[#28A745]" : "bg-[#FFC107]"
                      }`}>
                        {vac.status === "completed" ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{vac.name}</h4>
                        <p style={{ fontSize: '14px' }} className="text-[#6c757d]">{vac.date}</p>
                      </div>
                    </div>
                    {vac.status === "pending" && (
                      <Button size="sm" className="bg-[#F77F00] hover:bg-[#d66d00]">
                        Schedule
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <Button className="bg-[#2C7DA0] hover:bg-[#236180] px-6">
            <Download className="w-5 h-5 mr-2" />
            Download Health Report
          </Button>
        </div>
      </div>
    </section>
  );
}

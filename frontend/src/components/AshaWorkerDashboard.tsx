import { useState } from "react";
import { Users, MapPin, TrendingUp, Activity, Phone, Heart, AlertTriangle, CheckCircle2, Calendar, Award } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

interface Patient {
  id: string;
  name: string;
  nameHi: string;
  village: string;
  status: "critical" | "stable" | "followup";
  lastVisit: string;
  condition: string;
  conditionHi: string;
}

interface VillageData {
  name: string;
  nameHi: string;
  families: number;
  healthScore: number;
  vaccination: number;
  criticalCases: number;
}

export function AshaWorkerDashboard() {
  const [patients] = useState<Patient[]>([
    {
      id: "1",
      name: "Lakshmi Devi",
      nameHi: "लक्ष्मी देवी",
      village: "Rampur",
      status: "critical",
      lastVisit: "Today",
      condition: "High Fever",
      conditionHi: "तेज बुखार"
    },
    {
      id: "2",
      name: "Ramesh Yadav",
      nameHi: "रमेश यादव",
      village: "Sitapur",
      status: "followup",
      lastVisit: "2 days ago",
      condition: "Diabetes Check",
      conditionHi: "मधुमेह जांच"
    },
    {
      id: "3",
      name: "Geeta Singh",
      nameHi: "गीता सिंह",
      village: "Rampur",
      status: "stable",
      lastVisit: "1 week ago",
      condition: "Prenatal Care",
      conditionHi: "प्रसवपूर्व देखभाल"
    },
    {
      id: "4",
      name: "Mohan Kumar",
      nameHi: "मोहन कुमार",
      village: "Bharatpur",
      status: "critical",
      lastVisit: "Today",
      condition: "Chest Pain",
      conditionHi: "सीने में दर्द"
    }
  ]);

  const [villages] = useState<VillageData[]>([
    {
      name: "Rampur Village",
      nameHi: "रामपुर गाँव",
      families: 150,
      healthScore: 85,
      vaccination: 92,
      criticalCases: 2
    },
    {
      name: "Sitapur Village",
      nameHi: "सीतापुर गाँव",
      families: 120,
      healthScore: 78,
      vaccination: 88,
      criticalCases: 1
    },
    {
      name: "Bharatpur Village",
      nameHi: "भरतपुर गाँव",
      families: 180,
      healthScore: 90,
      vaccination: 95,
      criticalCases: 1
    }
  ]);

  const [activities] = useState([
    {
      title: "Health Camp Organized",
      titleHi: "स्वास्थ्य शिविर आयोजित",
      date: "Today",
      village: "Rampur",
      participants: 45
    },
    {
      title: "Vaccination Drive",
      titleHi: "टीकाकरण अभियान",
      date: "Yesterday",
      village: "Sitapur",
      participants: 38
    },
    {
      title: "Maternal Health Session",
      titleHi: "मातृ स्वास्थ्य सत्र",
      date: "2 days ago",
      village: "Bharatpur",
      participants: 25
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge className="bg-red-500 text-white">Critical / गंभीर</Badge>;
      case "stable":
        return <Badge className="bg-[#52B788] text-white">Stable / स्थिर</Badge>;
      case "followup":
        return <Badge className="bg-[#F77F00] text-white">Follow-up / अनुवर्ती</Badge>;
      default:
        return null;
    }
  };

  const handleCallPatient = (patientName: string) => {
    toast.success(`Calling ${patientName}... / ${patientName} को कॉल कर रहे हैं...`);
  };

  const handleVisitSchedule = (patientName: string) => {
    toast.success(`Visit scheduled for ${patientName} / ${patientName} के लिए यात्रा निर्धारित`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F9FA] py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#52B788] to-[#3a8a63] rounded-full flex items-center justify-center">
              <span style={{ fontSize: '24px' }}>🤝</span>
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 700 }} className="text-[#212529]">
                ASHA Worker Dashboard
              </h1>
              <p style={{ fontSize: '16px' }} className="text-[#6c757d]">
                आशा कार्यकर्ता डैशबोर्ड
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-[#52B788] to-[#3a8a63] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">450</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">Families Monitored</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">निगरानी परिवार</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#2C7DA0] to-[#1e5770] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <CheckCircle2 className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">8</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">Villages Covered</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">कवर किए गए गांव</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#F77F00] to-[#c96600] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <Heart className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">28</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">Active Cases</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">सक्रिय मामले</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <Activity className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">4</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">Critical Cases</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">गंभीर मामले</div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto p-1 bg-white border-2 border-gray-200 shadow-md">
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
              value="villages" 
              className="min-h-[56px] data-[state=active]:bg-[#2C7DA0] data-[state=active]:text-white"
            >
              <div className="text-center">
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Villages</div>
                <div style={{ fontSize: '12px' }} className="opacity-75">गांव</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="min-h-[56px] data-[state=active]:bg-[#F77F00] data-[state=active]:text-white"
            >
              <div className="text-center">
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Activities</div>
                <div style={{ fontSize: '12px' }} className="opacity-75">गतिविधियाँ</div>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-4">
            <Card className="p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#212529]">
                    Patient Monitoring
                  </h2>
                  <p style={{ fontSize: '14px' }} className="text-[#6c757d]">
                    रोगी निगरानी
                  </p>
                </div>
                <Badge className="bg-red-500 text-white px-4 py-2">
                  {patients.filter(p => p.status === 'critical').length} Critical
                </Badge>
              </div>

              <div className="space-y-4">
                {patients.map((patient, index) => (
                  <div 
                    key={patient.id}
                    className={`p-6 border-2 rounded-xl hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-right ${
                      patient.status === 'critical' 
                        ? 'bg-red-50 border-red-300' 
                        : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <Avatar className="w-16 h-16 border-2 border-[#52B788]">
                        <AvatarFallback className="bg-[#52B788] text-white" style={{ fontSize: '20px' }}>
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="text-[#212529]">
                            {patient.name}
                          </h3>
                          {getStatusBadge(patient.status)}
                        </div>
                        <p style={{ fontSize: '14px' }} className="text-[#6c757d] mb-2">
                          {patient.nameHi}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#6c757d]">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{patient.village}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{patient.lastVisit}</span>
                          </div>
                        </div>
                        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                          <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#212529] mb-1">
                            {patient.condition}
                          </p>
                          <p style={{ fontSize: '12px' }} className="text-[#6c757d]">
                            {patient.conditionHi}
                          </p>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        <Button
                          onClick={() => handleCallPatient(patient.name)}
                          className="bg-[#2C7DA0] hover:bg-[#1e5770] text-white min-h-[56px] flex-1"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button
                          onClick={() => handleVisitSchedule(patient.name)}
                          className="bg-[#52B788] hover:bg-[#3a8a63] text-white min-h-[56px] flex-1"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Villages Tab */}
          <TabsContent value="villages" className="space-y-4">
            <Card className="p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#212529]">
                    Village Health Overview
                  </h2>
                  <p style={{ fontSize: '14px' }} className="text-[#6c757d]">
                    ग्राम स्वास्थ्य अवलोकन
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {villages.map((village, index) => (
                  <Card 
                    key={index}
                    className="p-6 border-2 border-gray-200 hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#2C7DA0] rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{village.name}</h3>
                        <p style={{ fontSize: '13px' }} className="text-[#6c757d]">{village.nameHi}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: '14px' }} className="text-[#6c757d]">Families</span>
                        <span style={{ fontSize: '16px', fontWeight: 600 }}>{village.families}</span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ fontSize: '14px' }} className="text-[#6c757d]">Health Score</span>
                          <span style={{ fontSize: '14px', fontWeight: 600 }}>{village.healthScore}%</span>
                        </div>
                        <Progress value={village.healthScore} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ fontSize: '14px' }} className="text-[#6c757d]">Vaccination</span>
                          <span style={{ fontSize: '14px', fontWeight: 600 }}>{village.vaccination}%</span>
                        </div>
                        <Progress value={village.vaccination} className="h-2" />
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span style={{ fontSize: '13px', fontWeight: 600 }} className="text-red-500">
                            {village.criticalCases} Critical Cases
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            <Card className="p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#212529]">
                    Recent Activities
                  </h2>
                  <p style={{ fontSize: '14px' }} className="text-[#6c757d]">
                    हाल की गतिविधियां
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div 
                    key={index}
                    className="p-6 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#F77F00] to-[#c96600] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-7 h-7 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="text-[#212529] mb-1">
                          {activity.title}
                        </h3>
                        <p style={{ fontSize: '14px' }} className="text-[#6c757d] mb-3">
                          {activity.titleHi}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <Badge className="bg-[#2C7DA0] text-white">
                            {activity.village}
                          </Badge>
                          <span className="text-[#6c757d]">{activity.date}</span>
                          <span className="text-[#52B788]">
                            {activity.participants} participants
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <Card className="p-6 border-2 border-[#52B788] hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#52B788] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Health Camp</h3>
              <p style={{ fontSize: '12px' }} className="text-[#6c757d]">स्वास्थ्य शिविर</p>
            </div>
          </Card>

          <Card className="p-6 border-2 border-[#2C7DA0] hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#2C7DA0] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Vaccination</h3>
              <p style={{ fontSize: '12px' }} className="text-[#6c757d]">टीकाकरण</p>
            </div>
          </Card>

          <Card className="p-6 border-2 border-[#F77F00] hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#F77F00] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Home Visits</h3>
              <p style={{ fontSize: '12px' }} className="text-[#6c757d]">घर का दौरा</p>
            </div>
          </Card>

          <Card className="p-6 border-2 border-[#6c757d] hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#6c757d] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Reports</h3>
              <p style={{ fontSize: '12px' }} className="text-[#6c757d]">रिपोर्ट</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

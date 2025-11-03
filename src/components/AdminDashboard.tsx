import { useState } from "react";
import { Users, UserCog, Activity, BarChart3, Shield, TrendingUp, AlertTriangle, CheckCircle2, Settings, Database } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  role: "doctor" | "patient" | "asha" | "admin";
  email: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
}

interface SystemMetric {
  label: string;
  labelHi: string;
  value: number;
  total: number;
  status: "good" | "warning" | "critical";
}

export function AdminDashboard() {
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Dr. Amit Sharma",
      role: "doctor",
      email: "amit.sharma@example.com",
      status: "active",
      joinDate: "2024-01-15"
    },
    {
      id: "2",
      name: "Priya Verma",
      role: "asha",
      email: "priya.verma@example.com",
      status: "active",
      joinDate: "2024-02-20"
    },
    {
      id: "3",
      name: "Rajesh Kumar",
      role: "patient",
      email: "rajesh.kumar@example.com",
      status: "active",
      joinDate: "2024-03-10"
    },
    {
      id: "4",
      name: "Dr. Sunita Singh",
      role: "doctor",
      email: "sunita.singh@example.com",
      status: "pending",
      joinDate: "2025-10-20"
    },
    {
      id: "5",
      name: "Geeta Devi",
      role: "asha",
      email: "geeta.devi@example.com",
      status: "active",
      joinDate: "2024-04-05"
    }
  ]);

  const [systemMetrics] = useState<SystemMetric[]>([
    {
      label: "Server Uptime",
      labelHi: "सर्वर अपटाइम",
      value: 99.8,
      total: 100,
      status: "good"
    },
    {
      label: "Database Health",
      labelHi: "डेटाबेस स्वास्थ्य",
      value: 95,
      total: 100,
      status: "good"
    },
    {
      label: "API Response Time",
      labelHi: "API प्रतिक्रिया समय",
      value: 78,
      total: 100,
      status: "warning"
    },
    {
      label: "Storage Usage",
      labelHi: "संग्रहण उपयोग",
      value: 65,
      total: 100,
      status: "good"
    }
  ]);

  const handleApproveUser = (userId: string, userName: string) => {
    // reference the id to satisfy noUnusedParameters until logic is added
    void userId;
    toast.success(`${userName} approved! / ${userName} को मंजूरी दी गई!`);
  };

  const handleRejectUser = (userId: string, userName: string) => {
    void userId;
    toast.error(`${userName} rejected / ${userName} को अस्वीकार किया गया`);
  };

  const handleDeactivateUser = (userId: string, userName: string) => {
    void userId;
    toast.info(`${userName} deactivated / ${userName} को निष्क्रिय किया गया`);
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      doctor: "bg-[#2C7DA0]",
      patient: "bg-[#52B788]",
      asha: "bg-[#F77F00]",
      admin: "bg-[#6c757d]"
    };
    return (
      <Badge className={`${colors[role as keyof typeof colors]} text-white`}>
        {role.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#52B788] text-white">Active / सक्रिय</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500 text-white">Inactive / निष्क्रिय</Badge>;
      case "pending":
        return <Badge className="bg-[#F77F00] text-white">Pending / लंबित</Badge>;
      default:
        return null;
    }
  };

  const getMetricStatus = (status: string) => {
    switch (status) {
      case "good":
        return "bg-[#52B788]";
      case "warning":
        return "bg-[#F77F00]";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F9FA] py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6c757d] to-[#495057] rounded-full flex items-center justify-center">
              <span style={{ fontSize: '24px' }}>🛡️</span>
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 700 }} className="text-[#212529]">
                Admin Dashboard
              </h1>
              <p style={{ fontSize: '16px' }} className="text-[#6c757d]">
                व्यवस्थापक डैशबोर्ड
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-[#2C7DA0] to-[#1e5770] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <UserCog className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">150</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">Doctors Registered</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">पंजीकृत डॉक्टर</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#52B788] to-[#3a8a63] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">12.5K</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">Total Patients</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">कुल रोगी</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#F77F00] to-[#c96600] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <CheckCircle2 className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">245</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">ASHA Workers</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">आशा कार्यकर्ता</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#6c757d] to-[#495057] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }} className="mb-1">8.9K</div>
            <div style={{ fontSize: '14px' }} className="opacity-90">Total Consultations</div>
            <div style={{ fontSize: '12px' }} className="opacity-75">कुल परामर्श</div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto p-1 bg-white border-2 border-gray-200 shadow-md">
            <TabsTrigger 
              value="users" 
              className="min-h-[56px] data-[state=active]:bg-[#6c757d] data-[state=active]:text-white"
            >
              <div className="text-center">
                <div style={{ fontSize: '16px', fontWeight: 600 }}>User Management</div>
                <div style={{ fontSize: '12px' }} className="opacity-75">उपयोगकर्ता प्रबंधन</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="min-h-[56px] data-[state=active]:bg-[#2C7DA0] data-[state=active]:text-white"
            >
              <div className="text-center">
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Analytics</div>
                <div style={{ fontSize: '12px' }} className="opacity-75">विश्लेषण</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="min-h-[56px] data-[state=active]:bg-[#52B788] data-[state=active]:text-white"
            >
              <div className="text-center">
                <div style={{ fontSize: '16px', fontWeight: 600 }}>System Health</div>
                <div style={{ fontSize: '12px' }} className="opacity-75">सिस्टम स्वास्थ्य</div>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#212529]">
                    User Management
                  </h2>
                  <p style={{ fontSize: '14px' }} className="text-[#6c757d]">
                    उपयोगकर्ता प्रबंधन
                  </p>
                </div>
                <Badge className="bg-[#F77F00] text-white px-4 py-2">
                  {users.filter(u => u.status === 'pending').length} Pending Approvals
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-[#2C7DA0] text-white">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 600 }}>
                                {user.name}
                              </div>
                              <div style={{ fontSize: '12px' }} className="text-[#6c757d]">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell style={{ fontSize: '14px' }}>{user.joinDate}</TableCell>
                        <TableCell className="text-right">
                          {user.status === "pending" ? (
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                onClick={() => handleApproveUser(user.id, user.name)}
                                className="bg-[#52B788] hover:bg-[#3a8a63] text-white min-h-[40px]"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectUser(user.id, user.name)}
                                className="border-2 border-red-500 text-red-500 hover:bg-red-50 min-h-[40px]"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeactivateUser(user.id, user.name)}
                              className="min-h-[40px]"
                            >
                              Deactivate
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 border-2 border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#2C7DA0] rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Platform Usage</h3>
                    <p style={{ fontSize: '13px' }} className="text-[#6c757d]">प्लेटफॉर्म उपयोग</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ fontSize: '14px' }}>Daily Active Users</span>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>2,345</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ fontSize: '14px' }}>Weekly Active Users</span>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>8,920</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ fontSize: '14px' }}>Monthly Active Users</span>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>12,500</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#52B788] rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Consultation Stats</h3>
                    <p style={{ fontSize: '13px' }} className="text-[#6c757d]">परामर्श आँकड़े</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ fontSize: '14px' }}>Video Consultations</span>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>5,234</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ fontSize: '14px' }}>Chat Consultations</span>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>3,656</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ fontSize: '14px' }}>Emergency Cases</span>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>245</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Regional Distribution */}
            <Card className="p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#F77F00] rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Regional Distribution</h3>
                  <p style={{ fontSize: '13px' }} className="text-[#6c757d]">क्षेत्रीय वितरण</p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { state: "Uttar Pradesh", patients: "3,245", color: "from-[#2C7DA0] to-[#1e5770]" },
                  { state: "Bihar", patients: "2,890", color: "from-[#52B788] to-[#3a8a63]" },
                  { state: "Madhya Pradesh", patients: "2,456", color: "from-[#F77F00] to-[#c96600]" },
                  { state: "Rajasthan", patients: "1,987", color: "from-[#6c757d] to-[#495057]" }
                ].map((region, index) => (
                  <Card key={index} className={`p-4 bg-gradient-to-br ${region.color} text-white border-0`}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }} className="mb-1">
                      {region.patients}
                    </div>
                    <div style={{ fontSize: '13px' }} className="opacity-90">
                      {region.state}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="system" className="space-y-4">
            <Card className="p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#212529]">
                    System Health Monitoring
                  </h2>
                  <p style={{ fontSize: '14px' }} className="text-[#6c757d]">
                    सिस्टम स्वास्थ्य निगरानी
                  </p>
                </div>
                <Badge className="bg-[#52B788] text-white px-4 py-2">
                  All Systems Operational
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {systemMetrics.map((metric, index) => (
                  <Card 
                    key={index}
                    className="p-6 border-2 border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 ${getMetricStatus(metric.status)} rounded-full flex items-center justify-center`}>
                        {metric.status === "good" && <CheckCircle2 className="w-5 h-5 text-white" />}
                        {metric.status === "warning" && <AlertTriangle className="w-5 h-5 text-white" />}
                        {metric.status === "critical" && <AlertTriangle className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{metric.label}</h3>
                        <p style={{ fontSize: '12px' }} className="text-[#6c757d]">{metric.labelHi}</p>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700 }} className="text-[#212529]">
                        {metric.value}%
                      </div>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </Card>
                ))}
              </div>
            </Card>

            {/* Quick System Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-2 border-[#2C7DA0] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#2C7DA0] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Database Backup</h3>
                    <p style={{ fontSize: '13px' }} className="text-[#6c757d]">डेटाबेस बैकअप</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-[#52B788] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#52B788] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>System Settings</h3>
                    <p style={{ fontSize: '13px' }} className="text-[#6c757d]">सिस्टम सेटिंग्स</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-[#F77F00] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F77F00] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Security Logs</h3>
                    <p style={{ fontSize: '13px' }} className="text-[#6c757d]">सुरक्षा लॉग</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

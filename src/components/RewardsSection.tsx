import { useState } from "react";
import { 
  Gift, Trophy, Star, Check, Users, Video, Pill, Heart,
  Sparkles, TrendingUp, Award, Target
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

interface Task {
  id: number;
  title: string;
  titleHi: string;
  description: string;
  points: number;
  icon: any;
  completed: boolean;
  progress?: number;
  total?: number;
}

interface Reward {
  id: number;
  title: string;
  titleHi: string;
  cost: number;
  type: string;
  icon: string;
  available: boolean;
}

const tasks: Task[] = [
  {
    id: 1,
    title: "Complete Your Profile",
    titleHi: "अपनी प्रोफ़ाइल पूरी करें",
    description: "Add your health details",
    points: 50,
    icon: Check,
    completed: true,
  },
  {
    id: 2,
    title: "Book First Consultation",
    titleHi: "पहला परामर्श बुक करें",
    description: "Schedule your first doctor visit",
    points: 100,
    icon: Video,
    completed: true,
  },
  {
    id: 3,
    title: "Complete 5 Checkups",
    titleHi: "5 जांच पूरी करें",
    description: "Regular health monitoring",
    points: 500,
    icon: Heart,
    completed: false,
    progress: 2,
    total: 5,
  },
  {
    id: 4,
    title: "Take Medicines on Time",
    titleHi: "समय पर दवाएं लें",
    description: "7 days streak",
    points: 200,
    icon: Pill,
    completed: false,
    progress: 4,
    total: 7,
  },
  {
    id: 5,
    title: "Refer a Friend",
    titleHi: "एक मित्र को रेफर करें",
    description: "Help others get healthy",
    points: 150,
    icon: Users,
    completed: false,
  },
];

const rewards: Reward[] = [
  {
    id: 1,
    title: "Free Health Checkup",
    titleHi: "मुफ्त स्वास्थ्य जांच",
    cost: 1000,
    type: "Service",
    icon: "🏥",
    available: true,
  },
  {
    id: 2,
    title: "Premium Doctor Consultation",
    titleHi: "प्रीमियम डॉक्टर परामर्श",
    cost: 800,
    type: "Consultation",
    icon: "👨‍⚕️",
    available: true,
  },
  {
    id: 3,
    title: "Free Vaccination",
    titleHi: "मुफ्त टीकाकरण",
    cost: 600,
    type: "Vaccination",
    icon: "💉",
    available: true,
  },
  {
    id: 4,
    title: "Family Health Package",
    titleHi: "पारिवारिक स्वास्थ्य पैकेज",
    cost: 1500,
    type: "Family",
    icon: "👨‍👩‍👧‍👦",
    available: true,
  },
  {
    id: 5,
    title: "Home Visit by ASHA Worker",
    titleHi: "आशा कार्यकर्ता द्वारा घर पर विजिट",
    cost: 400,
    type: "Home Service",
    icon: "🏠",
    available: true,
  },
];

const leaderboard = [
  { rank: 1, name: "Priya S.", village: "Rampur", points: 2450 },
  { rank: 2, name: "Rahul K.", village: "Sitapur", points: 2280 },
  { rank: 3, name: "Anjali V.", village: "Bharatpur", points: 2150 },
  { rank: 4, name: "You (Ramesh)", village: "Rampur", points: 1850 },
  { rank: 5, name: "Sunita M.", village: "Durgapur", points: 1720 },
];

export function RewardsSection() {
  const [currentPoints, setCurrentPoints] = useState(1850);
  const [currentTier] = useState("Silver");
  const nextTierPoints = 2500;
  const progressToNext = (currentPoints / nextTierPoints) * 100;

  const handleRedeem = (reward: Reward) => {
    if (currentPoints >= reward.cost) {
      setCurrentPoints(currentPoints - reward.cost);
      toast.success(`Redeemed: ${reward.title}`, {
        description: `${reward.cost} points used. Remaining: ${currentPoints - reward.cost} points`,
        duration: 5000,
      });
    } else {
      toast.error("Insufficient points", {
        description: `You need ${reward.cost - currentPoints} more points to redeem this reward.`,
      });
    }
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white via-[#FFF5E6] to-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F77F00] to-[#d66d00] rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#212529] mb-2">
            Rewards & Points
          </h2>
          <p style={{ fontSize: '16px' }} className="text-[#6c757d]">
            पुरस्कार और अंक - Earn rewards for staying healthy!
          </p>
        </div>

        {/* Hero Section - User Level */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-[#F77F00] via-[#F77F00] to-[#d66d00] text-white border-0 shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Character/Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                  <span style={{ fontSize: '80px' }}>🏆</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-[#F77F00] px-6 py-2 rounded-full shadow-lg">
                  <span style={{ fontSize: '18px', fontWeight: 700 }}>{currentTier} Tier</span>
                </div>
              </div>
              <h3 style={{ fontSize: '28px', fontWeight: 700 }} className="mb-2">Ramesh Kumar</h3>
              <p style={{ fontSize: '16px' }} className="opacity-90">Health Champion 🌟</p>
            </div>

            {/* Right - Points & Progress */}
            <div className="space-y-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span style={{ fontSize: '16px' }}>Total Points</span>
                  <Sparkles className="w-6 h-6" />
                </div>
                <div style={{ fontSize: '48px', fontWeight: 700 }} className="mb-2">
                  {currentPoints.toLocaleString()}
                </div>
                <p style={{ fontSize: '14px' }} className="opacity-90">
                  {nextTierPoints - currentPoints} points to Gold Tier
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2" style={{ fontSize: '14px' }}>
                  <span>Progress to Gold</span>
                  <span>{Math.round(progressToNext)}%</span>
                </div>
                <Progress value={progressToNext} className="h-3 bg-white/30" />
                <div className="flex justify-between mt-2 opacity-75" style={{ fontSize: '12px' }}>
                  <span>Bronze</span>
                  <span>Silver</span>
                  <span>Gold</span>
                  <span>Platinum</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>15</div>
                  <div style={{ fontSize: '12px' }} className="opacity-90">Tasks Done</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>8</div>
                  <div style={{ fontSize: '12px' }} className="opacity-90">Checkups</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>3</div>
                  <div style={{ fontSize: '12px' }} className="opacity-90">Referrals</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Tasks to Earn Points */}
          <Card className="p-6">
            <h3 style={{ fontSize: '24px', fontWeight: 600 }} className="mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-[#2C7DA0]" />
              Earn More Points
            </h3>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    task.completed
                      ? "bg-[#E8F9F0] border-[#52B788]"
                      : "bg-white border-gray-200 hover:border-[#2C7DA0]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        task.completed
                          ? "bg-[#52B788]"
                          : "bg-gradient-to-br from-[#2C7DA0] to-[#52B788]"
                      }`}
                    >
                      <task.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{task.title}</h4>
                          <p style={{ fontSize: '14px' }} className="text-[#6c757d]">
                            {task.description}
                          </p>
                        </div>
                        <Badge className="bg-[#F77F00] text-white border-0 ml-2">
                          +{task.points}
                        </Badge>
                      </div>
                      {task.progress !== undefined && task.total && (
                        <div className="mt-3">
                          <div className="flex justify-between mb-1" style={{ fontSize: '13px' }}>
                            <span className="text-[#6c757d]">Progress</span>
                            <span className="text-[#2C7DA0]" style={{ fontWeight: 600 }}>
                              {task.progress}/{task.total}
                            </span>
                          </div>
                          <Progress value={(task.progress / task.total) * 100} className="h-2" />
                        </div>
                      )}
                      {task.completed && (
                        <div className="flex items-center gap-2 mt-2 text-[#52B788]">
                          <Check className="w-4 h-4" />
                          <span style={{ fontSize: '14px', fontWeight: 600 }}>Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Redeem Rewards */}
          <Card className="p-6">
            <h3 style={{ fontSize: '24px', fontWeight: 600 }} className="mb-6 flex items-center gap-2">
              <Gift className="w-6 h-6 text-[#F77F00]" />
              Redeem Rewards
            </h3>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    reward.available && currentPoints >= reward.cost
                      ? "bg-white border-gray-200 hover:border-[#F77F00] hover:shadow-md"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{reward.icon}</div>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{reward.title}</h4>
                        <p style={{ fontSize: '14px' }} className="text-[#6c757d]">{reward.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-4 h-4 text-[#F77F00]" />
                          <span style={{ fontSize: '14px', fontWeight: 600 }} className="text-[#F77F00]">
                            {reward.cost} points
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRedeem(reward)}
                      disabled={!reward.available || currentPoints < reward.cost}
                      className="bg-[#F77F00] hover:bg-[#d66d00] disabled:opacity-50"
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card className="p-6">
          <h3 style={{ fontSize: '24px', fontWeight: 600 }} className="mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#F77F00]" />
            Community Leaderboard
          </h3>
          <p style={{ fontSize: '14px' }} className="text-[#6c757d] mb-4">
            Top health champions in your region | आपके क्षेत्र में शीर्ष स्वास्थ्य चैंपियन
          </p>
          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  user.name.includes("You")
                    ? "bg-gradient-to-r from-[#E8F4F8] to-[#E8F9F0] border-2 border-[#2C7DA0]"
                    : "bg-[#F8F9FA] hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      user.rank === 1
                        ? "bg-gradient-to-br from-[#FFD700] to-[#FFA500]"
                        : user.rank === 2
                        ? "bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8]"
                        : user.rank === 3
                        ? "bg-gradient-to-br from-[#CD7F32] to-[#B87333]"
                        : "bg-[#E0E0E0]"
                    }`}
                  >
                    <span style={{ fontSize: '18px', fontWeight: 700 }} className="text-white">
                      {user.rank}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{user.name}</h4>
                    <p style={{ fontSize: '14px' }} className="text-[#6c757d]">{user.village}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#52B788]" />
                  <span style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#2C7DA0]">
                    {user.points.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

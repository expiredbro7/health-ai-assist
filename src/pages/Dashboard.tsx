import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  FileText, 
  Trophy, 
  MapPin, 
  Activity,
  Users,
  Award,
  TrendingUp,
  Heart,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import StatsOverview from "@/components/dashboard/StatsOverview";
import OverviewTab from "@/components/dashboard/OverviewTab";
import ChatHistoryTab from "@/components/dashboard/ChatHistoryTab";
import ReportsTab from "@/components/dashboard/ReportsTab";
import GamificationTab from "@/components/dashboard/GamificationTab";
import HealthTab from "@/components/dashboard/HealthTab";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const chatSessions = useQuery(api.chatbot.getUserChatSessions);
  const medicalReports = useQuery(api.chatbot.getUserMedicalReports);
  const achievements = useQuery(api.gamification.getUserAchievements);
  const leaderboard = useQuery(api.gamification.getLeaderboard, { limit: 5 });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const totalPoints = user.totalPoints || 0;
  const totalBadges = user.badges?.length || 0;
  const totalReports = medicalReports?.length || 0;
  const totalSessions = chatSessions?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img
                src="/logo.svg"
                alt="HealthBot"
                className="h-8 w-8 cursor-pointer"
                onClick={() => navigate("/")}
              />
              <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name || "User"}</span>
              <Button
                variant="outline"
                onClick={() => navigate("/chat")}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>New Chat</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsOverview
          totalPoints={totalPoints}
          totalBadges={totalBadges}
          totalReports={totalReports}
          totalSessions={totalSessions}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chat">Chat History</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="gamification">Achievements</TabsTrigger>
            <TabsTrigger value="health">Health Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab chatSessions={chatSessions} leaderboard={leaderboard} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatHistoryTab chatSessions={chatSessions} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab medicalReports={medicalReports} />
          </TabsContent>

          <TabsContent value="gamification">
            <GamificationTab achievements={achievements} user={user} />
          </TabsContent>

          <TabsContent value="health">
            <HealthTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
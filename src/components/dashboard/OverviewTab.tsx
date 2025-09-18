import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Activity, MessageCircle, Users, Target, MapPin, Trophy } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

type ChatSession = any;
type LeaderboardUser = any;

export default function OverviewTab({
  chatSessions,
  leaderboard,
}: {
  chatSessions: ChatSession[] | undefined;
  leaderboard: LeaderboardUser[] | undefined;
}) {
  const navigate = useNavigate();

  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chatSessions?.slice(0, 3).map((session: any) => (
                <div key={session._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{session.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(session._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/chat/${session._id}`)}>
                    View
                  </Button>
                </div>
              ))}
              {(!chatSessions || chatSessions.length === 0) && (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard?.map((user: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.totalPoints} points</p>
                  </div>
                  <div className="flex space-x-1">
                    {user.badges.slice(0, 3).map((_: any, i: number) => (
                      <div key={i} className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your health journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate("/chat")} className="flex items-center space-x-2 h-16">
              <MessageCircle className="h-5 w-5" />
              <span>Start Health Chat</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/quiz")} className="flex items-center space-x-2 h-16">
              <Trophy className="h-5 w-5" />
              <span>Take Health Quiz</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/map")} className="flex items-center space-x-2 h-16">
              <MapPin className="h-5 w-5" />
              <span>Find Healthcare</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

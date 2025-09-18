import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Award, Trophy, TrendingUp, Heart } from "lucide-react";
import { useNavigate } from "react-router";

type Achievement = any;
type User = any;

export default function GamificationTab({
  achievements,
  user,
}: {
  achievements: Achievement[] | undefined;
  user: User;
}) {
  const navigate = useNavigate();
  const totalPoints = user?.totalPoints || 0;

  return (
    <TabsContent value="gamification">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements?.map((achievement: any) => (
                <div
                  key={achievement._id}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{achievement.badgeName}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-gray-500">Earned {new Date(achievement.earnedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">+{achievement.pointsEarned}</p>
                  </div>
                </div>
              ))}
              {(!achievements || achievements.length === 0) && (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No achievements yet</p>
                  <Button onClick={() => navigate("/quiz")} className="mt-4">
                    Take a Quiz
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Health Knowledge</span>
                  <span className="text-sm text-gray-600">{Math.min(100, Math.floor(totalPoints / 10))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.floor(totalPoints / 10))}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{totalPoints}</p>
                  <p className="text-sm text-gray-600">Total Points</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Heart className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{user?.currentStreak || 0}</p>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </div>
              </div>

              <Button onClick={() => navigate("/quiz")} className="w-full">
                Take Health Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}

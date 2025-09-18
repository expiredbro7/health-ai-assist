import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type ChatSession = any;

export default function ChatHistoryTab({ chatSessions }: { chatSessions: ChatSession[] | undefined }) {
  const navigate = useNavigate();

  return (
    <TabsContent value="chat">
      <Card>
        <CardHeader>
          <CardTitle>Chat History</CardTitle>
          <CardDescription>Your previous health consultations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chatSessions?.map((session: any) => (
              <div key={session._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(session._creationTime).toLocaleDateString()} • {session.language}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/chat/${session._id}`)}>
                    Continue
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      toast.success("Report generation started");
                    }}
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            ))}
            {(!chatSessions || chatSessions.length === 0) && (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No chat sessions yet</p>
                <Button onClick={() => navigate("/chat")} className="mt-4">
                  Start Your First Chat
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Mic, 
  Send, 
  Volume2, 
  VolumeX,
  ArrowLeft,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface Message {
  _id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  messageType: "text" | "voice" | "system";
  severity?: "low" | "moderate" | "high" | "emergency";
  symptoms?: string[];
  recommendations?: string[];
  possibleConditions?: string[];
}

export default function Chat() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  const [message, setMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi" | "te" | "ta" | "bn">("en");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<Id<"chatSessions"> | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const createSession = useMutation(api.chatbot.createChatSession);
  const addMessage = useMutation(api.chatbot.addChatMessage);
  const generateReport = useMutation(api.chatbot.generateMedicalReport);
  
  const messages = useQuery(
    api.chatbot.getChatMessages,
    currentSessionId ? { sessionId: currentSessionId } : "skip"
  );

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }

    if (sessionId && sessionId !== "new") {
      setCurrentSessionId(sessionId as Id<"chatSessions">);
    } else if (user && !currentSessionId) {
      // Create new session
      createSession({ language: selectedLanguage })
        .then((newSessionId) => {
          setCurrentSessionId(newSessionId);
          navigate(`/chat/${newSessionId}`, { replace: true });
        })
        .catch((error) => {
          console.error("Failed to create session:", error);
          toast.error("Failed to start chat session");
        });
    }
  }, [user, isLoading, sessionId, currentSessionId, selectedLanguage, createSession, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentSessionId) return;

    const userMessage = message.trim();
    setMessage("");

    try {
      // Add user message
      await addMessage({
        sessionId: currentSessionId,
        content: userMessage,
        isUser: true,
        messageType: "text",
      });

      // Simulate AI response (in a real app, this would call an AI service)
      setTimeout(async () => {
        const aiResponse = generateAIResponse(userMessage);
        
        await addMessage({
          sessionId: currentSessionId,
          content: aiResponse.content,
          isUser: false,
          messageType: "text",
          severity: aiResponse.severity,
          symptoms: aiResponse.symptoms,
          recommendations: aiResponse.recommendations,
          possibleConditions: aiResponse.possibleConditions,
        });

        // Speak the response if enabled
        if (isSpeaking) {
          speakText(aiResponse.content);
        }
      }, 1000);

    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const generateAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple symptom detection and response generation
    const symptoms: string[] = [];
    const recommendations: string[] = [];
    const possibleConditions: string[] = [];
    let severity: "low" | "moderate" | "high" | "emergency" = "low";
    
    // Detect symptoms
    if (lowerMessage.includes("fever") || lowerMessage.includes("temperature")) {
      symptoms.push("fever");
      severity = "moderate";
    }
    if (lowerMessage.includes("cough")) {
      symptoms.push("cough");
    }
    if (lowerMessage.includes("headache") || lowerMessage.includes("head pain")) {
      symptoms.push("headache");
    }
    if (lowerMessage.includes("chest pain") || lowerMessage.includes("breathing")) {
      symptoms.push("chest pain");
      severity = "high";
    }
    if (lowerMessage.includes("emergency") || lowerMessage.includes("severe")) {
      severity = "emergency";
    }

    // Generate recommendations based on severity
    if (severity === "emergency") {
      recommendations.push("Seek emergency medical care immediately");
      recommendations.push("Call emergency services");
      possibleConditions.push("Medical Emergency");
    } else if (severity === "high") {
      recommendations.push("Consult a doctor within 24 hours");
      recommendations.push("Monitor symptoms closely");
      if (symptoms.includes("fever")) {
        possibleConditions.push("Viral infection", "Bacterial infection");
      }
    } else if (severity === "moderate") {
      recommendations.push("Consider consulting a healthcare provider");
      recommendations.push("Rest and stay hydrated");
      if (symptoms.includes("fever")) {
        possibleConditions.push("Common cold", "Flu");
      }
    } else {
      recommendations.push("Monitor symptoms");
      recommendations.push("Rest and maintain good hygiene");
      possibleConditions.push("Minor illness");
    }

    // Generate response content
    let content = "I understand you're experiencing some symptoms. ";
    
    if (symptoms.length > 0) {
      content += `Based on what you've described (${symptoms.join(", ")}), `;
    }
    
    if (severity === "emergency") {
      content += "this sounds like it could be serious. Please seek emergency medical care immediately. ";
    } else if (severity === "high") {
      content += "I recommend consulting with a healthcare provider within 24 hours. ";
    } else if (severity === "moderate") {
      content += "you may want to consider seeing a healthcare provider if symptoms persist or worsen. ";
    } else {
      content += "these symptoms are often manageable with rest and self-care. ";
    }
    
    content += "\n\n**Recommendations:**\n";
    recommendations.forEach(rec => {
      content += `• ${rec}\n`;
    });
    
    content += "\n⚠️ **Medical Disclaimer:** This is for awareness only. Always consult qualified healthcare professionals for proper medical advice and treatment.";

    return {
      content,
      severity,
      symptoms: symptoms.length > 0 ? symptoms : undefined,
      recommendations,
      possibleConditions: possibleConditions.length > 0 ? possibleConditions : undefined,
    };
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition) as any;
    const recognition: any = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedLanguage === "en" ? "en-US" : 
                     selectedLanguage === "hi" ? "hi-IN" :
                     selectedLanguage === "te" ? "te-IN" :
                     selectedLanguage === "ta" ? "ta-IN" :
                     "bn-IN";

    recognition.onstart = () => {
      setIsRecording(true);
      toast.info("Listening... Speak now");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast.error("Speech recognition failed");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === "en" ? "en-US" : 
                      selectedLanguage === "hi" ? "hi-IN" :
                      selectedLanguage === "te" ? "te-IN" :
                      selectedLanguage === "ta" ? "ta-IN" :
                      "bn-IN";
      speechSynthesis.speak(utterance);
    }
  };

  const handleGenerateReport = async () => {
    if (!currentSessionId) return;
    
    try {
      await generateReport({ sessionId: currentSessionId });
      toast.success("Medical report generated successfully!");
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast.error("Failed to generate report");
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case "emergency":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "moderate":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <h1 className="text-xl font-semibold text-gray-900">Health Chat</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedLanguage} onValueChange={(value: any) => setSelectedLanguage(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="bn">বাংলা</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSpeaking(!isSpeaking)}
              >
                {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateReport}
                disabled={!messages || messages.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>AI Health Assistant</span>
            </CardTitle>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <AlertTriangle className="inline h-4 w-4 mr-1" />
                <strong>Medical Disclaimer:</strong> This AI provides health awareness information only. 
                Always consult qualified healthcare professionals for medical advice.
              </p>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
            <AnimatePresence>
              {messages?.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.isUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {!msg.isUser && msg.severity && (
                      <div className="flex items-center space-x-2 mb-2">
                        {getSeverityIcon(msg.severity)}
                        <span className="text-xs font-medium capitalize">{msg.severity} Priority</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your symptoms or ask a health question..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleVoiceInput}
                disabled={isRecording}
                className={isRecording ? "bg-red-100 border-red-300" : ""}
              >
                <Mic className={`h-4 w-4 ${isRecording ? "text-red-500" : ""}`} />
              </Button>
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  Shield, 
  Trophy, 
  MapPin, 
  Mic, 
  Globe, 
  Heart,
  Users,
  FileText,
  Award,
  ChevronRight,
  Play
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.svg"
                alt="HealthBot AI"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900">HealthBot AI</span>
            </div>
            <div className="flex items-center space-x-4">
              {!isLoading && (
                <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
                  {isAuthenticated ? "Dashboard" : "Get Started"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                AI-Powered Health
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                  {" "}Awareness
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Get instant health guidance with our intelligent chatbot. Voice-enabled consultations, 
                outbreak alerts, and personalized health insights - all in one secure platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Health Chat
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/demo")}
                className="text-lg px-8 py-3"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Medical Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto"
            >
              <p className="text-sm text-yellow-800">
                <Shield className="inline h-4 w-4 mr-1" />
                <strong>Medical Disclaimer:</strong> This AI chatbot provides health awareness information only. 
                Always consult qualified healthcare professionals for medical advice and treatment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Health Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for health awareness and medical guidance in one intelligent platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>AI Health Chatbot</CardTitle>
                  <CardDescription>
                    Intelligent conversations about symptoms with voice input/output support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Mic className="h-4 w-4 mr-2 text-green-500" />
                      Voice-enabled interactions
                    </li>
                    <li className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-green-500" />
                      Multi-language support
                    </li>
                    <li className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      Secure & private conversations
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Outbreak Alerts</CardTitle>
                  <CardDescription>
                    GPS-powered localized disease outbreak notifications and healthcare resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-green-500" />
                      Real-time outbreak tracking
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-green-500" />
                      Nearby hospitals & clinics
                    </li>
                    <li className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      Prevention recommendations
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Trophy className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Health Gamification</CardTitle>
                  <CardDescription>
                    Earn points, badges, and compete on leaderboards while learning about health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-green-500" />
                      Interactive health quizzes
                    </li>
                    <li className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-green-500" />
                      Achievement badges
                    </li>
                    <li className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-green-500" />
                      Community leaderboards
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Report Vault</CardTitle>
                  <CardDescription>
                    Secure storage of all health consultations with downloadable reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-green-500" />
                      Automated report generation
                    </li>
                    <li className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      HIPAA-inspired security
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-green-500" />
                      Doctor-ready format
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Multi-Language Support</CardTitle>
                  <CardDescription>
                    Available in English, Hindi, Telugu, Tamil, Bengali and more languages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-green-500" />
                      5+ supported languages
                    </li>
                    <li className="flex items-center">
                      <Mic className="h-4 w-4 mr-2 text-green-500" />
                      Voice in native language
                    </li>
                    <li className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-green-500" />
                      Culturally aware responses
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>
                    End-to-end encryption and privacy-first approach to protect your health data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      Encrypted data storage
                    </li>
                    <li className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-green-500" />
                      Anonymous options available
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-green-500" />
                      GDPR compliant
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Your Health Journey Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who trust HealthBot AI for reliable health guidance and awareness.
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo.svg" alt="HealthBot AI" className="h-8 w-8" />
                <span className="text-xl font-bold">HealthBot AI</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered health awareness platform providing intelligent health guidance, 
                outbreak alerts, and personalized health insights.
              </p>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
                <p className="text-xs text-yellow-200">
                  <Shield className="inline h-3 w-3 mr-1" />
                  Medical Disclaimer: This platform provides health information for awareness purposes only. 
                  Always consult healthcare professionals for medical advice.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>AI Health Chatbot</li>
                <li>Voice Interactions</li>
                <li>Outbreak Alerts</li>
                <li>Health Gamification</li>
                <li>Report Vault</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 HealthBot AI. Built with care for global health awareness.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
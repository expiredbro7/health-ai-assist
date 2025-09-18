import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  Award,
  Brain,
  Target
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  explanation: string;
}

export default function Quiz() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const questions = useQuery(api.gamification.getQuizQuestions, { limit: 10 });
  const submitAnswer = useMutation(api.gamification.submitQuizAnswer);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = questions ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !currentQuestion) return;

    try {
      const result = await submitAnswer({
        questionId: currentQuestion._id,
        selectedAnswer,
      });

      setShowResult(true);
      
      if (result.isCorrect) {
        setScore(score + 1);
        setTotalPoints(totalPoints + result.pointsEarned);
        toast.success(`Correct! +${result.pointsEarned} points`);
      } else {
        toast.error("Incorrect answer");
      }

    } catch (error) {
      console.error("Failed to submit answer:", error);
      toast.error("Failed to submit answer");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setScore(0);
    setTotalPoints(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Quiz Questions Available</h2>
              <p className="text-gray-600 mb-4">Quiz questions are being loaded. Please try again later.</p>
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
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
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h1 className="text-xl font-semibold text-gray-900">Health Quiz</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Score: {score}/{questions.length}
              </div>
              <div className="text-sm text-gray-600">
                Points: {totalPoints}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!quizComplete ? (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{currentQuestion?.category}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      currentQuestion?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      currentQuestion?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentQuestion?.difficulty}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {currentQuestion?.points} pts
                    </span>
                  </div>
                </div>
                <Progress value={progress} className="mb-4" />
                <CardDescription className="text-lg font-medium text-gray-900">
                  {currentQuestion?.question}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-6">
                  {currentQuestion?.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? showResult
                            ? currentQuestion.correctAnswer === index
                              ? "border-green-500 bg-green-50"
                              : "border-red-500 bg-red-50"
                            : "border-blue-500 bg-blue-50"
                          : showResult && currentQuestion.correctAnswer === index
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && (
                          <div>
                            {currentQuestion.correctAnswer === index && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            {selectedAnswer === index && currentQuestion.correctAnswer !== index && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-50 rounded-lg p-4 mb-6"
                    >
                      <h3 className="font-medium mb-2">Explanation:</h3>
                      <p className="text-gray-700">{currentQuestion?.explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">
                    {currentQuestionIndex + 1} of {questions.length} questions
                  </div>
                  <div className="space-x-2">
                    {!showResult ? (
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={selectedAnswer === null}
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion}>
                        {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
                <CardDescription>Great job on completing the health quiz</CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{score}</div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">{totalPoints}</div>
                    <div className="text-sm text-gray-600">Points Earned</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {Math.round((score / questions.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                </div>

                <div className="space-x-4">
                  <Button onClick={handleRestartQuiz} variant="outline">
                    <Trophy className="h-4 w-4 mr-2" />
                    Take Another Quiz
                  </Button>
                  <Button onClick={() => navigate("/dashboard")}>
                    <Award className="h-4 w-4 mr-2" />
                    View Achievements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

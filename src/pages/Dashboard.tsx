import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import { 
  Brain, 
  Moon, 
  Activity, 
  Droplet, 
  Coffee, 
  Eye, 
  Heart,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

interface WellnessData {
  mood: string;
  sleepQuality: number;
  sleepHours: number;
  stressLevel: number;
  exerciseFrequency: string;
  waterIntake: number;
  screenTime: number;
  workBreaks: string;
  posture: string;
}

interface Recommendation {
  category: string;
  icon: any;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [wellnessData, setWellnessData] = useState<WellnessData | null>(null);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem("wellnessData");
    if (storedData) {
      const data: WellnessData = JSON.parse(storedData);
      setWellnessData(data);
      calculateScore(data);
    } else {
      navigate("/assessment");
    }
  }, [navigate]);

  const calculateScore = (data: WellnessData) => {
    let score = 0;
    
    // Mood scoring
    const moodScores: { [key: string]: number } = {
      "Excellent": 20,
      "Good": 16,
      "Okay": 12,
      "Not Great": 8,
      "Poor": 4
    };
    score += moodScores[data.mood] || 0;

    // Sleep quality & duration
    score += (data.sleepQuality / 10) * 15;
    if (data.sleepHours >= 7 && data.sleepHours <= 9) {
      score += 15;
    } else {
      score += 10;
    }

    // Stress level (inverse scoring)
    score += ((11 - data.stressLevel) / 10) * 15;

    // Exercise
    const exerciseScores: { [key: string]: number } = {
      "Daily": 15,
      "3-4 times per week": 12,
      "1-2 times per week": 8,
      "Rarely": 4,
      "Never": 0
    };
    score += exerciseScores[data.exerciseFrequency] || 0;

    // Water intake
    score += Math.min((data.waterIntake / 8) * 10, 10);

    // Screen time (inverse scoring)
    score += Math.max(10 - (data.screenTime / 8) * 10, 0);

    setOverallScore(Math.round(score));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "wellness-excellent";
    if (score >= 60) return "wellness-good";
    if (score >= 40) return "wellness-fair";
    return "wellness-poor";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  const generateRecommendations = (): Recommendation[] => {
    if (!wellnessData) return [];

    const recommendations: Recommendation[] = [];

    // Sleep recommendations
    if (wellnessData.sleepQuality < 6 || wellnessData.sleepHours < 7) {
      recommendations.push({
        category: "Sleep",
        icon: Moon,
        title: "Improve Sleep Quality",
        description: "Try a consistent sleep schedule. Aim for 7-9 hours. Avoid screens 1 hour before bed and create a relaxing bedtime routine.",
        priority: "high"
      });
    }

    // Stress recommendations
    if (wellnessData.stressLevel > 6) {
      recommendations.push({
        category: "Stress",
        icon: Brain,
        title: "Stress Relief Exercises",
        description: "Practice deep breathing for 5 minutes: Inhale for 4 counts, hold for 4, exhale for 6. Try meditation apps or take short walks in nature.",
        priority: "high"
      });
    }

    // Hydration recommendations
    if (wellnessData.waterIntake < 6) {
      recommendations.push({
        category: "Hydration",
        icon: Droplet,
        title: "Increase Water Intake",
        description: `You're drinking ${wellnessData.waterIntake} glasses. Aim for 8-10 glasses daily. Set hourly reminders and keep a water bottle nearby.`,
        priority: "medium"
      });
    }

    // Screen time recommendations
    if (wellnessData.screenTime > 8) {
      recommendations.push({
        category: "Digital Wellness",
        icon: Eye,
        title: "Reduce Screen Time",
        description: "Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds. Consider blue light filters.",
        priority: "medium"
      });
    }

    // Exercise recommendations
    if (wellnessData.exerciseFrequency === "Rarely" || wellnessData.exerciseFrequency === "Never") {
      recommendations.push({
        category: "Physical Activity",
        icon: Activity,
        title: "Start Moving More",
        description: "Begin with 15-minute walks daily. Try desk stretches, stairs instead of elevators, or short yoga sessions.",
        priority: "high"
      });
    }

    // Break recommendations
    if (wellnessData.workBreaks !== "Yes, regularly") {
      recommendations.push({
        category: "Work Breaks",
        icon: Coffee,
        title: "Take Regular Breaks",
        description: "Use the Pomodoro Technique: 25 minutes of work, 5-minute breaks. Stand, stretch, or walk every hour to boost productivity and health.",
        priority: "medium"
      });
    }

    // Mood recommendations
    if (wellnessData.mood === "Not Great" || wellnessData.mood === "Poor") {
      recommendations.push({
        category: "Mental Health",
        icon: Heart,
        title: "Boost Your Mood",
        description: "Practice gratitude journaling, connect with friends, engage in hobbies you enjoy, or consider speaking with a mental health professional.",
        priority: "high"
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  if (!wellnessData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Your Wellness Dashboard</h1>
            <p className="text-muted-foreground">Based on your recent assessment</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate("/patterns")}
            >
              <TrendingUp className="h-4 w-4" />
              View Patterns
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate("/assessment")}
            >
              <RefreshCw className="h-4 w-4" />
              Retake Assessment
            </Button>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 overflow-hidden shadow-medium">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
            <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
              <div className="mb-6 text-center md:mb-0 md:text-left">
                <h2 className="mb-2 text-2xl font-bold text-foreground">Overall Wellness Score</h2>
                <p className="text-muted-foreground">Keep track of your progress over time</p>
              </div>
              <div className="text-center">
                <div className={`mb-2 text-6xl font-bold text-${getScoreColor(overallScore)}`}>
                  {overallScore}
                </div>
                <Badge 
                  variant="secondary" 
                  className={`bg-${getScoreColor(overallScore)}/10 text-${getScoreColor(overallScore)} border-${getScoreColor(overallScore)}/20`}
                >
                  {getScoreLabel(overallScore)}
                </Badge>
                <Progress 
                  value={overallScore} 
                  className="mt-4 h-3 w-48" 
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Wellness Categories</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <Brain className="h-8 w-8 text-primary" />
                <Badge variant="outline">{wellnessData.mood}</Badge>
              </div>
              <h3 className="mb-1 font-semibold text-foreground">Mood</h3>
              <p className="text-sm text-muted-foreground">Current emotional state</p>
            </Card>

            <Card className="p-6 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <Moon className="h-8 w-8 text-secondary" />
                <Badge variant="outline">{wellnessData.sleepQuality}/10</Badge>
              </div>
              <h3 className="mb-1 font-semibold text-foreground">Sleep Quality</h3>
              <p className="text-sm text-muted-foreground">{wellnessData.sleepHours}h average</p>
            </Card>

            <Card className="p-6 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <Activity className="h-8 w-8 text-accent" />
                <Badge variant="outline">{11 - wellnessData.stressLevel}/10</Badge>
              </div>
              <h3 className="mb-1 font-semibold text-foreground">Stress Level</h3>
              <p className="text-sm text-muted-foreground">Inverse scale</p>
            </Card>

            <Card className="p-6 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <Droplet className="h-8 w-8 text-primary" />
                <Badge variant="outline">{wellnessData.waterIntake} glasses</Badge>
              </div>
              <h3 className="mb-1 font-semibold text-foreground">Hydration</h3>
              <p className="text-sm text-muted-foreground">Daily water intake</p>
            </Card>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Personalized Recommendations</h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <Card key={index} className="p-6 shadow-soft transition-all hover:shadow-medium">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl bg-${rec.priority === "high" ? "accent" : "primary"}/10 p-3`}>
                        <Icon className={`h-6 w-6 text-${rec.priority === "high" ? "accent" : "primary"}`} />
                      </div>
                      <div>
                        <Badge 
                          variant="secondary" 
                          className="mb-1"
                        >
                          {rec.category}
                        </Badge>
                        <h3 className="font-semibold text-foreground">{rec.title}</h3>
                      </div>
                    </div>
                    {rec.priority === "high" ? (
                      <AlertCircle className="h-5 w-5 text-accent" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {rec.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

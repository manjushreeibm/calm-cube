import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  Zap,
  TrendingDown,
  Coffee,
  Moon,
  Laptop,
  AlertCircle,
  CheckCircle2,
  Clock,
  Target,
  Heart,
} from "lucide-react";

interface CheckIn {
  timestamp: string;
  mood: string;
  focusLevel: number;
  stressLevel: number;
  activity: string;
  energy: number;
}

interface Recommendation {
  title: string;
  description: string;
  icon: any;
  priority: "high" | "medium" | "low";
}

const Monitor = () => {
  const { toast } = useToast();
  const [mood, setMood] = useState("Neutral");
  const [focusLevel, setFocusLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [activity, setActivity] = useState("");
  const [recentCheckIns, setRecentCheckIns] = useState<CheckIn[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    loadCheckIns();
  }, []);

  useEffect(() => {
    generateRecommendations();
  }, [mood, focusLevel, stressLevel, energy, activity]);

  const loadCheckIns = () => {
    const stored = localStorage.getItem("checkIns");
    if (stored) {
      const checkIns = JSON.parse(stored);
      setRecentCheckIns(checkIns.slice(-5).reverse());
    }
  };

  const saveCheckIn = () => {
    if (!activity) {
      toast({
        title: "Activity Required",
        description: "Please select your current activity",
        variant: "destructive",
      });
      return;
    }

    const checkIn: CheckIn = {
      timestamp: new Date().toISOString(),
      mood,
      focusLevel,
      stressLevel,
      activity,
      energy,
    };

    const stored = localStorage.getItem("checkIns");
    const checkIns = stored ? JSON.parse(stored) : [];
    checkIns.push(checkIn);
    localStorage.setItem("checkIns", JSON.stringify(checkIns));

    setRecentCheckIns([checkIn, ...recentCheckIns.slice(0, 4)]);

    toast({
      title: "Check-in Saved!",
      description: "Your wellness data has been recorded",
    });
  };

  const generateRecommendations = () => {
    const recs: Recommendation[] = [];

    // Focus-based recommendations
    if (focusLevel < 4) {
      recs.push({
        title: "Boost Your Focus",
        description: "Try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break. Eliminate distractions and use focus music or white noise.",
        icon: Target,
        priority: "high",
      });
    }

    // Stress-based recommendations
    if (stressLevel > 7) {
      recs.push({
        title: "Reduce Stress Now",
        description: "Take 5 deep breaths: Inhale for 4 counts, hold for 4, exhale for 6. Step away from your screen and do light stretching for 2 minutes.",
        icon: Brain,
        priority: "high",
      });
    }

    // Energy-based recommendations
    if (energy < 4) {
      recs.push({
        title: "Energy Boost",
        description: "Take a 10-minute walk outside for natural light exposure. Drink a glass of water and have a healthy snack with protein and complex carbs.",
        icon: Zap,
        priority: "high",
      });
    }

    // Mood-based recommendations
    if (mood === "Poor" || mood === "Stressed") {
      recs.push({
        title: "Improve Your Mood",
        description: "Listen to uplifting music, practice gratitude by writing 3 things you're grateful for, or connect with a friend for a quick chat.",
        icon: Heart,
        priority: "high",
      });
    }

    // Activity-based recommendations
    if (activity === "Working" && focusLevel < 5) {
      recs.push({
        title: "Optimize Work Environment",
        description: "Ensure proper lighting, adjust your posture, and organize your workspace. Use website blockers for distracting sites during focus time.",
        icon: Laptop,
        priority: "medium",
      });
    }

    if (activity === "Resting" && stressLevel > 5) {
      recs.push({
        title: "Better Rest Practices",
        description: "Practice progressive muscle relaxation: tense and release each muscle group. Try a guided meditation or gentle yoga for 10 minutes.",
        icon: Moon,
        priority: "medium",
      });
    }

    // Pattern-based recommendations
    if (recentCheckIns.length >= 3) {
      const avgStress = recentCheckIns.slice(0, 3).reduce((sum, c) => sum + c.stressLevel, 0) / 3;
      if (avgStress > 6) {
        recs.push({
          title: "Persistent Stress Detected",
          description: "Your stress levels have been elevated. Consider scheduling regular breaks, practicing mindfulness, or speaking with a wellness professional.",
          icon: AlertCircle,
          priority: "high",
        });
      }
    }

    // General wellness recommendation
    if (recs.length === 0) {
      recs.push({
        title: "You're Doing Great!",
        description: "Your current state looks balanced. Keep maintaining healthy habits: stay hydrated, take regular breaks, and practice mindfulness.",
        icon: CheckCircle2,
        priority: "low",
      });
    }

    setRecommendations(recs);
  };

  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      "Excellent": "wellness-excellent",
      "Good": "wellness-good",
      "Neutral": "wellness-fair",
      "Stressed": "wellness-poor",
      "Poor": "wellness-poor",
    };
    return colors[mood] || "muted";
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Behavior Monitor</h1>
          <p className="text-muted-foreground">
            Track your current state and get instant recommendations for better wellbeing
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Check-in Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-medium">
              <h2 className="mb-6 text-xl font-semibold text-foreground">Quick Check-in</h2>
              
              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block text-base font-medium">Current Mood</Label>
                  <RadioGroup value={mood} onValueChange={setMood}>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                      {["Excellent", "Good", "Neutral", "Stressed", "Poor"].map((m) => (
                        <Card
                          key={m}
                          className={`cursor-pointer p-3 transition-all hover:shadow-soft ${
                            mood === m ? "border-primary bg-primary/5" : ""
                          }`}
                          onClick={() => setMood(m)}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <RadioGroupItem value={m} id={m} className="sr-only" />
                            <Label htmlFor={m} className="cursor-pointer text-sm font-medium">
                              {m}
                            </Label>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="mb-4 block text-base font-medium">
                    Focus Level: <span className="text-primary">{focusLevel}/10</span>
                  </Label>
                  <Slider
                    value={[focusLevel]}
                    onValueChange={(v) => setFocusLevel(v[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="py-2"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Distracted</span>
                    <span>Highly Focused</span>
                  </div>
                </div>

                <div>
                  <Label className="mb-4 block text-base font-medium">
                    Stress Level: <span className="text-primary">{stressLevel}/10</span>
                  </Label>
                  <Slider
                    value={[stressLevel]}
                    onValueChange={(v) => setStressLevel(v[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="py-2"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Relaxed</span>
                    <span>Very Stressed</span>
                  </div>
                </div>

                <div>
                  <Label className="mb-4 block text-base font-medium">
                    Energy Level: <span className="text-primary">{energy}/10</span>
                  </Label>
                  <Slider
                    value={[energy]}
                    onValueChange={(v) => setEnergy(v[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="py-2"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Exhausted</span>
                    <span>Energized</span>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block text-base font-medium">Current Activity</Label>
                  <RadioGroup value={activity} onValueChange={setActivity}>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { value: "Working", icon: Laptop },
                        { value: "Exercising", icon: Zap },
                        { value: "Resting", icon: Moon },
                        { value: "Socializing", icon: Coffee },
                      ].map(({ value, icon: Icon }) => (
                        <Card
                          key={value}
                          className={`cursor-pointer p-3 transition-all hover:shadow-soft ${
                            activity === value ? "border-primary bg-primary/5" : ""
                          }`}
                          onClick={() => setActivity(value)}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <RadioGroupItem value={value} id={value} className="sr-only" />
                            <Icon className="h-5 w-5 text-primary" />
                            <Label htmlFor={value} className="cursor-pointer text-sm">
                              {value}
                            </Label>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={saveCheckIn} className="w-full" size="lg">
                  Save Check-in
                </Button>
              </div>
            </Card>
          </div>

          {/* Recent Check-ins */}
          <div>
            <Card className="p-6 shadow-medium">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Recent Check-ins</h2>
              </div>
              
              {recentCheckIns.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  No check-ins yet. Start monitoring your behavior!
                </p>
              ) : (
                <div className="space-y-3">
                  {recentCheckIns.map((checkIn, index) => (
                    <Card key={index} className="p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant="outline" className={`bg-${getMoodColor(checkIn.mood)}/10`}>
                          {checkIn.mood}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(checkIn.timestamp)}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Focus:</span>
                          <span className="font-medium text-foreground">{checkIn.focusLevel}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stress:</span>
                          <span className="font-medium text-foreground">{checkIn.stressLevel}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Activity:</span>
                          <span className="font-medium text-foreground">{checkIn.activity}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Instant Recommendations */}
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Instant Recommendations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <Card key={index} className="p-6 shadow-soft transition-all hover:shadow-medium">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-xl p-3 ${
                          rec.priority === "high"
                            ? "bg-accent/10"
                            : rec.priority === "medium"
                            ? "bg-primary/10"
                            : "bg-secondary/10"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            rec.priority === "high"
                              ? "text-accent"
                              : rec.priority === "medium"
                              ? "text-primary"
                              : "text-secondary"
                          }`}
                        />
                      </div>
                      <h3 className="font-semibold text-foreground">{rec.title}</h3>
                    </div>
                    {rec.priority === "high" && (
                      <Badge variant="destructive" className="bg-accent/20 text-accent">
                        Priority
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{rec.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitor;

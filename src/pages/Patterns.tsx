import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  Activity,
  Clock,
  AlertCircle,
  BarChart3,
} from "lucide-react";

interface CheckIn {
  timestamp: string;
  mood: string;
  focusLevel: number;
  stressLevel: number;
  activity: string;
  energy: number;
}

interface Pattern {
  type: string;
  title: string;
  description: string;
  icon: any;
  trend: "up" | "down" | "stable";
}

const Patterns = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [stats, setStats] = useState({
    avgFocus: 0,
    avgStress: 0,
    avgEnergy: 0,
    mostCommonActivity: "",
    totalCheckIns: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const stored = localStorage.getItem("checkIns");
    if (stored) {
      const data: CheckIn[] = JSON.parse(stored);
      setCheckIns(data);
      analyzePatterns(data);
      calculateStats(data);
    }
  };

  const calculateStats = (data: CheckIn[]) => {
    if (data.length === 0) return;

    const avgFocus = data.reduce((sum, c) => sum + c.focusLevel, 0) / data.length;
    const avgStress = data.reduce((sum, c) => sum + c.stressLevel, 0) / data.length;
    const avgEnergy = data.reduce((sum, c) => sum + c.energy, 0) / data.length;

    const activityCount: { [key: string]: number } = {};
    data.forEach((c) => {
      activityCount[c.activity] = (activityCount[c.activity] || 0) + 1;
    });
    const mostCommonActivity = Object.entries(activityCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    setStats({
      avgFocus: Math.round(avgFocus * 10) / 10,
      avgStress: Math.round(avgStress * 10) / 10,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      mostCommonActivity,
      totalCheckIns: data.length,
    });
  };

  const analyzePatterns = (data: CheckIn[]) => {
    if (data.length < 3) {
      setPatterns([
        {
          type: "info",
          title: "Insufficient Data",
          description: "Keep tracking your behavior to discover personalized patterns and insights.",
          icon: AlertCircle,
          trend: "stable",
        },
      ]);
      return;
    }

    const detectedPatterns: Pattern[] = [];
    const recent = data.slice(-7); // Last 7 check-ins
    const older = data.slice(-14, -7); // Previous 7 check-ins

    // Focus trend
    const recentFocus = recent.reduce((sum, c) => sum + c.focusLevel, 0) / recent.length;
    const olderFocus = older.length > 0 ? older.reduce((sum, c) => sum + c.focusLevel, 0) / older.length : recentFocus;
    if (recentFocus > olderFocus + 1) {
      detectedPatterns.push({
        type: "focus",
        title: "Focus Improving",
        description: `Your focus levels have increased by ${Math.round((recentFocus - olderFocus) * 10) / 10} points. Keep up the good work!`,
        icon: Zap,
        trend: "up",
      });
    } else if (recentFocus < olderFocus - 1) {
      detectedPatterns.push({
        type: "focus",
        title: "Focus Declining",
        description: `Your focus has decreased. Consider implementing better work habits or reducing distractions.`,
        icon: Zap,
        trend: "down",
      });
    }

    // Stress trend
    const recentStress = recent.reduce((sum, c) => sum + c.stressLevel, 0) / recent.length;
    const olderStress = older.length > 0 ? older.reduce((sum, c) => sum + c.stressLevel, 0) / older.length : recentStress;
    if (recentStress > olderStress + 1) {
      detectedPatterns.push({
        type: "stress",
        title: "Stress Increasing",
        description: `Your stress levels have risen. Prioritize relaxation techniques and self-care activities.`,
        icon: Brain,
        trend: "down",
      });
    } else if (recentStress < olderStress - 1) {
      detectedPatterns.push({
        type: "stress",
        title: "Stress Decreasing",
        description: `Great job managing stress! Your levels have improved significantly.`,
        icon: Brain,
        trend: "up",
      });
    }

    // Energy patterns
    const recentEnergy = recent.reduce((sum, c) => sum + c.energy, 0) / recent.length;
    if (recentEnergy < 4) {
      detectedPatterns.push({
        type: "energy",
        title: "Low Energy Pattern",
        description: "Your energy levels are consistently low. Review your sleep, nutrition, and exercise habits.",
        icon: Activity,
        trend: "down",
      });
    } else if (recentEnergy > 7) {
      detectedPatterns.push({
        type: "energy",
        title: "High Energy Levels",
        description: "You're maintaining excellent energy levels. Your lifestyle habits are working well!",
        icon: Activity,
        trend: "up",
      });
    }

    // Activity patterns
    const activityCount: { [key: string]: number } = {};
    recent.forEach((c) => {
      activityCount[c.activity] = (activityCount[c.activity] || 0) + 1;
    });
    const dominantActivity = Object.entries(activityCount).sort((a, b) => b[1] - a[1])[0];
    if (dominantActivity && dominantActivity[1] > recent.length * 0.6) {
      detectedPatterns.push({
        type: "routine",
        title: "Routine Detected",
        description: `You spend most of your time ${dominantActivity[0].toLowerCase()}. Consider balancing with other activities.`,
        icon: Clock,
        trend: "stable",
      });
    }

    // Mood consistency
    const moodScores: { [key: string]: number } = {
      "Excellent": 5,
      "Good": 4,
      "Neutral": 3,
      "Stressed": 2,
      "Poor": 1,
    };
    const moodVariance = recent.reduce((sum, c, i, arr) => {
      if (i === 0) return sum;
      return sum + Math.abs(moodScores[c.mood] - moodScores[arr[i - 1].mood]);
    }, 0) / (recent.length - 1);

    if (moodVariance > 2) {
      detectedPatterns.push({
        type: "mood",
        title: "Mood Fluctuations",
        description: "Your mood varies significantly. Consider tracking triggers and practicing emotional regulation techniques.",
        icon: Brain,
        trend: "down",
      });
    } else if (moodVariance < 1) {
      detectedPatterns.push({
        type: "mood",
        title: "Stable Mood",
        description: "Your emotional state is consistent and balanced. Great emotional regulation!",
        icon: Brain,
        trend: "up",
      });
    }

    setPatterns(detectedPatterns.length > 0 ? detectedPatterns : [
      {
        type: "info",
        title: "Stable Patterns",
        description: "Your behavior patterns are relatively stable. Continue monitoring to track changes over time.",
        icon: BarChart3,
        trend: "stable",
      },
    ]);
  };

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "wellness-excellent";
    if (trend === "down") return "wellness-poor";
    return "wellness-fair";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return TrendingUp;
    if (trend === "down") return TrendingDown;
    return Activity;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Behavior Patterns & Insights</h1>
          <p className="text-muted-foreground">
            Analyze your wellness trends and discover patterns in your behavior
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="p-6 shadow-soft">
            <div className="mb-2 text-sm text-muted-foreground">Total Check-ins</div>
            <div className="text-3xl font-bold text-foreground">{stats.totalCheckIns}</div>
          </Card>
          <Card className="p-6 shadow-soft">
            <div className="mb-2 text-sm text-muted-foreground">Avg Focus</div>
            <div className="text-3xl font-bold text-primary">{stats.avgFocus}/10</div>
          </Card>
          <Card className="p-6 shadow-soft">
            <div className="mb-2 text-sm text-muted-foreground">Avg Stress</div>
            <div className="text-3xl font-bold text-accent">{stats.avgStress}/10</div>
          </Card>
          <Card className="p-6 shadow-soft">
            <div className="mb-2 text-sm text-muted-foreground">Avg Energy</div>
            <div className="text-3xl font-bold text-secondary">{stats.avgEnergy}/10</div>
          </Card>
          <Card className="p-6 shadow-soft">
            <div className="mb-2 text-sm text-muted-foreground">Main Activity</div>
            <div className="text-lg font-bold text-foreground">{stats.mostCommonActivity || "N/A"}</div>
          </Card>
        </div>

        {/* Detected Patterns */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">Detected Patterns</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {patterns.map((pattern, index) => {
              const Icon = pattern.icon;
              const TrendIcon = getTrendIcon(pattern.trend);
              return (
                <Card key={index} className="p-6 shadow-soft transition-all hover:shadow-medium">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl bg-${getTrendColor(pattern.trend)}/10 p-3`}>
                        <Icon className={`h-6 w-6 text-${getTrendColor(pattern.trend)}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{pattern.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {pattern.type}
                        </Badge>
                      </div>
                    </div>
                    <TrendIcon className={`h-5 w-5 text-${getTrendColor(pattern.trend)}`} />
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {pattern.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Check-ins Timeline */}
        {checkIns.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Recent Timeline</h2>
            <Card className="p-6 shadow-soft">
              <div className="space-y-4">
                {checkIns.slice(-10).reverse().map((checkIn, index) => {
                  const date = new Date(checkIn.timestamp);
                  return (
                    <div key={index} className="flex items-center gap-4 border-l-2 border-primary/30 pl-4">
                      <div className="flex-shrink-0">
                        <div className="text-xs text-muted-foreground">
                          {date.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <Badge variant="outline">{checkIn.mood}</Badge>
                          <span className="text-sm text-muted-foreground">{checkIn.activity}</span>
                        </div>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Focus: <span className="text-foreground">{checkIn.focusLevel}</span></span>
                          <span>Stress: <span className="text-foreground">{checkIn.stressLevel}</span></span>
                          <span>Energy: <span className="text-foreground">{checkIn.energy}</span></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patterns;

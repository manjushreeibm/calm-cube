import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Heart, Brain, Activity, Coffee, Moon, Smile } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Mental Wellbeing",
      description: "Track your mood and get personalized tips for better mental health",
    },
    {
      icon: Moon,
      title: "Sleep Tracking",
      description: "Understand your sleep patterns and improve rest quality",
    },
    {
      icon: Activity,
      title: "Stress Management",
      description: "Learn stress-relief exercises tailored to your needs",
    },
    {
      icon: Coffee,
      title: "Healthy Habits",
      description: "Get reminders for hydration, breaks, and posture correction",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-background" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Heart className="h-4 w-4" />
              <span>AI-Powered Wellness Assistant</span>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Your Personal Path to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Holistic Wellness
              </span>
            </h1>
            
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              Get personalized insights on your mood, sleep, stress levels, and daily habits. 
              Receive AI-powered recommendations to improve your overall wellbeing.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                className="group h-14 px-8 text-lg shadow-medium transition-all hover:scale-105 hover:shadow-lg"
                onClick={() => navigate("/assessment")}
              >
                <Smile className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                Start Wellness Assessment
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg transition-all hover:scale-105"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Comprehensive Wellness Support
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Our AI assistant analyzes multiple aspects of your health to provide 
            personalized recommendations that work for you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-border/50 p-6 shadow-soft transition-all hover:scale-105 hover:shadow-medium"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-secondary p-12 text-center shadow-medium">
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Transform Your Wellbeing?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Take our comprehensive assessment and start your journey to better health today.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="h-14 px-8 text-lg shadow-lg transition-all hover:scale-105"
              onClick={() => navigate("/assessment")}
            >
              Begin Your Assessment
            </Button>
          </div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        </Card>
      </section>
    </div>
  );
};

export default Index;

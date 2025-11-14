import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

interface AssessmentData {
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

const Assessment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    mood: "",
    sleepQuality: 5,
    sleepHours: 7,
    stressLevel: 5,
    exerciseFrequency: "",
    waterIntake: 4,
    screenTime: 6,
    workBreaks: "",
    posture: "",
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const updateData = (field: keyof AssessmentData, value: any) => {
    setAssessmentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Store data and navigate to dashboard
      localStorage.setItem("wellnessData", JSON.stringify(assessmentData));
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-foreground">How are you feeling today?</h2>
              <p className="text-muted-foreground">Select the option that best describes your current mood</p>
            </div>
            <RadioGroup value={assessmentData.mood} onValueChange={(value) => updateData("mood", value)}>
              {["Excellent", "Good", "Okay", "Not Great", "Poor"].map((mood) => (
                <Card key={mood} className="p-4 transition-all hover:shadow-soft">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={mood} id={mood} />
                    <Label htmlFor={mood} className="flex-1 cursor-pointer text-lg">
                      {mood}
                    </Label>
                  </div>
                </Card>
              ))}
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-foreground">Sleep Patterns</h2>
              <p className="text-muted-foreground">Help us understand your sleep quality and duration</p>
            </div>
            <div className="space-y-6">
              <div>
                <Label className="mb-4 block text-lg">Sleep Quality (1-10)</Label>
                <div className="space-y-3">
                  <Slider
                    value={[assessmentData.sleepQuality]}
                    onValueChange={(value) => updateData("sleepQuality", value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Poor</span>
                    <span className="text-lg font-semibold text-primary">{assessmentData.sleepQuality}</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="mb-4 block text-lg">Average Sleep Hours</Label>
                <div className="space-y-3">
                  <Slider
                    value={[assessmentData.sleepHours]}
                    onValueChange={(value) => updateData("sleepHours", value[0])}
                    min={3}
                    max={12}
                    step={0.5}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>3 hours</span>
                    <span className="text-lg font-semibold text-primary">{assessmentData.sleepHours} hours</span>
                    <span>12 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-foreground">Stress & Mental Health</h2>
              <p className="text-muted-foreground">Rate your current stress levels</p>
            </div>
            <div>
              <Label className="mb-4 block text-lg">Current Stress Level (1-10)</Label>
              <div className="space-y-3">
                <Slider
                  value={[assessmentData.stressLevel]}
                  onValueChange={(value) => updateData("stressLevel", value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Relaxed</span>
                  <span className="text-lg font-semibold text-primary">{assessmentData.stressLevel}</span>
                  <span>Very Stressed</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-foreground">Physical Activity</h2>
              <p className="text-muted-foreground">How often do you exercise?</p>
            </div>
            <RadioGroup value={assessmentData.exerciseFrequency} onValueChange={(value) => updateData("exerciseFrequency", value)}>
              {["Daily", "3-4 times per week", "1-2 times per week", "Rarely", "Never"].map((freq) => (
                <Card key={freq} className="p-4 transition-all hover:shadow-soft">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={freq} id={freq} />
                    <Label htmlFor={freq} className="flex-1 cursor-pointer text-lg">
                      {freq}
                    </Label>
                  </div>
                </Card>
              ))}
            </RadioGroup>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-foreground">Daily Habits</h2>
              <p className="text-muted-foreground">Tell us about your daily routines</p>
            </div>
            <div className="space-y-6">
              <div>
                <Label className="mb-4 block text-lg">Daily Water Intake (glasses)</Label>
                <div className="space-y-3">
                  <Slider
                    value={[assessmentData.waterIntake]}
                    onValueChange={(value) => updateData("waterIntake", value[0])}
                    min={0}
                    max={15}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0</span>
                    <span className="text-lg font-semibold text-primary">{assessmentData.waterIntake} glasses</span>
                    <span>15+</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="mb-4 block text-lg">Average Screen Time (hours/day)</Label>
                <div className="space-y-3">
                  <Slider
                    value={[assessmentData.screenTime]}
                    onValueChange={(value) => updateData("screenTime", value[0])}
                    min={0}
                    max={16}
                    step={0.5}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0</span>
                    <span className="text-lg font-semibold text-primary">{assessmentData.screenTime} hours</span>
                    <span>16+</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="mb-3 block text-lg">Do you take regular work breaks?</Label>
                <RadioGroup value={assessmentData.workBreaks} onValueChange={(value) => updateData("workBreaks", value)}>
                  {["Yes, regularly", "Sometimes", "Rarely", "No"].map((option) => (
                    <Card key={option} className="p-3 transition-all hover:shadow-soft">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={option} id={`breaks-${option}`} />
                        <Label htmlFor={`breaks-${option}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    </Card>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <Card className="p-8 shadow-medium">
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {renderStep()}

          <div className="mt-8 flex justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {step === 1 ? "Back to Home" : "Previous"}
            </Button>
            <Button 
              onClick={handleNext}
              disabled={
                (step === 1 && !assessmentData.mood) ||
                (step === 4 && !assessmentData.exerciseFrequency) ||
                (step === 5 && !assessmentData.workBreaks)
              }
              className="gap-2"
            >
              {step === totalSteps ? (
                <>
                  Complete Assessment
                  <CheckCircle2 className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BreathingTechnique {
  id: string;
  name: string;
  pattern: { instruction: string; duration: number }[];
  description: string;
  supportsCustomization: boolean;
}

const techniques: BreathingTechnique[] = [
  {
    id: "box",
    name: "Box Breathing",
    pattern: [
      { instruction: "Inhale", duration: 4 },
      { instruction: "Hold", duration: 4 },
      { instruction: "Exhale", duration: 4 },
      { instruction: "Hold", duration: 4 },
    ],
    description: "Balances the nervous system, reduces stress, and improves focus.",
    supportsCustomization: true,
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    pattern: [
      { instruction: "Inhale", duration: 4 },
      { instruction: "Hold", duration: 7 },
      { instruction: "Exhale", duration: 8 },
    ],
    description: "Promotes relaxation and can help with sleep.",
    supportsCustomization: false,
  },
  {
    id: "deep",
    name: "Deep Abdominal Breathing",
    pattern: [
      { instruction: "Inhale Deeply", duration: 5 },
      { instruction: "Exhale Slowly", duration: 7 },
    ],
    description: "Encourages full oxygen exchange and reduces stress.",
    supportsCustomization: true,
  },
];

export default function BreathingPage() {
  const [selectedTechnique, setSelectedTechnique] = React.useState(techniques[0]);
  const [customDurations, setCustomDurations] = React.useState<{ [key: number]: number }>({});
  const [isRunning, setIsRunning] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(selectedTechnique.pattern[0].duration);

  const [userDefinedCycles, setUserDefinedCycles] = React.useState(4);
  const [cyclesRemaining, setCyclesRemaining] = React.useState(0);

  const inhaleExhaleAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const holdAudioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    inhaleExhaleAudioRef.current = new Audio("/sounds/inhale_exhale.mp3");
    holdAudioRef.current = new Audio("/sounds/hold.mp3");
  }, []);

  const playInstructionSound = (instruction: string) => {
    const isHold = instruction.toLowerCase().includes("hold");
    const audio = isHold ? holdAudioRef.current : inhaleExhaleAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  const handleTechniqueChange = (id: string) => {
    const newTechnique = techniques.find((t) => t.id === id)!;
    setSelectedTechnique(newTechnique);
    setCustomDurations({});
    resetExercise(newTechnique);
  };

  const resetExercise = (technique = selectedTechnique) => {
    setIsRunning(false);
    setCurrentStep(0);
    setTimeLeft(technique.pattern[0].duration);
    setCyclesRemaining(userDefinedCycles);
  };

  const togglePlayPause = () => {
    if (!isRunning) {
      setCyclesRemaining(userDefinedCycles);
      playInstructionSound(selectedTechnique.pattern[currentStep].instruction);
    }
    setIsRunning(!isRunning);
  };

  React.useEffect(() => {
  if (!isRunning) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
  }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  React.useEffect(() => {
  if (!isRunning) return;
  if (timeLeft !== 0) return;

  const nextStep = currentStep + 1;

  if (nextStep >= selectedTechnique.pattern.length) {
    // End of cycle
    if (cyclesRemaining <= 1) {
      setIsRunning(false);
      setCyclesRemaining(0);
      resetExercise()
    } else {
      setCyclesRemaining((prev) => prev - 1);
      setCurrentStep(0);
      playInstructionSound(selectedTechnique.pattern[0].instruction);
      setTimeLeft(customDurations[0] ?? selectedTechnique.pattern[0].duration);
    }
  } else {
    setCurrentStep(nextStep);
    playInstructionSound(selectedTechnique.pattern[nextStep].instruction);
    setTimeLeft(customDurations[nextStep] ?? selectedTechnique.pattern[nextStep].duration);
  }
}, [timeLeft, isRunning, currentStep, cyclesRemaining, selectedTechnique, customDurations]);

  React.useEffect(() => {
    resetExercise(selectedTechnique);
  }, [selectedTechnique]);

  const totalDuration = selectedTechnique.pattern.reduce(
    (sum, step, i) => sum + (customDurations[i] ?? step.duration),
    0
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-headline font-semibold text-foreground">Breathing Exercises</h1>
        <p className="text-lg text-muted-foreground">Guide your breath, calm your mind.</p>
      </header>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Choose Your Technique</CardTitle>
          <Select onValueChange={handleTechniqueChange} defaultValue={selectedTechnique.id}>
            <SelectTrigger>
              <SelectValue placeholder="Select a breathing technique" />
            </SelectTrigger>
            <SelectContent>
              {techniques.map((tech) => (
                <SelectItem key={tech.id} value={tech.id}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-5xl font-bold">{timeLeft}</div>
            <div className="text-lg">{selectedTechnique.pattern[currentStep].instruction}</div>
            <p className="text-sm text-muted-foreground font-body">
              Cycle: {currentStep + 1} / {selectedTechnique.pattern.length} | Total Cycle Duration: {totalDuration}s
            </p>
            <p className="text-sm text-muted-foreground font-body">
              Cycles Remaining: {cyclesRemaining}
            </p>
          </div>

          {selectedTechnique.supportsCustomization && (
            <div className="grid grid-cols-2 gap-4">
              {selectedTechnique.pattern.map((step, index) => (
                <div key={index}>
                  <label className="text-sm font-medium">{step.instruction}</label>
                  <input
                    type="number"
                    min="1"
                    value={customDurations[index] ?? step.duration}
                    onChange={(e) =>
                      setCustomDurations((prev) => ({
                        ...prev,
                        [index]: Number(e.target.value),
                      }))
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium">Cycles</label>
          <input
            type="number"
            min="1"
            value={userDefinedCycles}
            onChange={(e) => setUserDefinedCycles(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24 text-center"
          />
        </div>

          <div className="flex space-x-4 justify-center">
            <Button onClick={togglePlayPause}>
              {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={() => resetExercise()} variant="outline">
              <RotateCcw className="mr-2" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert className="max-w-2xl mx-auto">
        <Info className="h-5 w-5" />
        <AlertTitle>{selectedTechnique.name} - How it helps</AlertTitle>
        <AlertDescription>{selectedTechnique.description}</AlertDescription>
      </Alert>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Classification {
  label: string;
  confidence: number;
  color: string;
}

interface SoundClassificationProps {
  audioFile: File;
}

export const SoundClassification = ({ audioFile }: SoundClassificationProps) => {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const analyzeAudio = async () => {
      if (!audioFile) return;
      setIsAnalyzing(true);

      const formData = new FormData();
      formData.append("file", audioFile);

      try {
        // Call your FastAPI backend running YAMNet
        const response = await fetch("http://127.0.0.1:8000/classify", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Server returned error");
        }

        const result = await response.json();

        // Example response:
        // { "class": "Siren", "confidence": 87.52 }

        const classification: Classification = {
          label: result.class,
          confidence: result.confidence,
          color: "hsl(270, 80%, 65%)",
        };

        setClassifications([classification]);
      } catch (error) {
        console.error("Error analyzing sound:", error);
        setClassifications([
          {
            label: "Error analyzing sound",
            confidence: 0,
            color: "hsl(0, 80%, 60%)",
          },
        ]);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeAudio();
  }, [audioFile]);

  if (isAnalyzing) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analyzing Audio...</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-2 bg-muted/50 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Sound Classification</h3>
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            YAMNet Model
          </Badge>
        </div>

        <div className="space-y-4">
          {classifications.map((classification, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  {classification.label}
                </span>
                <span className="text-muted-foreground">
                  {classification.confidence}%
                </span>
              </div>
              <Progress 
                value={classification.confidence} 
                className="h-2"
                style={{
                  // @ts-ignore
                  "--progress-background": classification.color
                }}
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Classification powered by Google's YAMNet (TensorFlow Audio Model)
          </p>
        </div>
      </div>
    </Card>
  );
};
export default SoundClassification;

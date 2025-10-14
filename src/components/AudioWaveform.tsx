import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface AudioWaveformProps {
  audioFile: File;
}

export const AudioWaveform = ({ audioFile }: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext] = useState(() => new AudioContext());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWaveform = async () => {
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const rawData = audioBuffer.getChannelData(0);

      const samples = 200;
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];

      for (let i = 0; i < samples; i++) {
        const blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }

      const multiplier = Math.max(...filteredData) ** -1;
      const normalizedData = filteredData.map((n) => n * multiplier);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw waveform
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / normalizedData.length;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "hsl(270, 80%, 65%)");
      gradient.addColorStop(0.5, "hsl(280, 60%, 50%)");
      gradient.addColorStop(1, "hsl(180, 60%, 55%)");

      normalizedData.forEach((value, index) => {
        const barHeight = value * height * 0.8;
        const x = index * barWidth;
        const y = (height - barHeight) / 2;

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
      });
    };

    drawWaveform();
  }, [audioFile, audioContext]);

  return (
    <Card className="p-6 bg-card/50 backdrop-blur">
      <h3 className="text-lg font-semibold mb-4">Audio Waveform</h3>
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full h-auto rounded-lg"
      />
    </Card>
  );
};

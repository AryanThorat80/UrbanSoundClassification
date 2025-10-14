import { useState, useRef } from "react";
import { Upload, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
}

export const AudioUploader = ({ onFileSelect }: AudioUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={`relative p-12 border-2 border-dashed transition-all duration-300 cursor-pointer group hover:border-primary ${
        dragActive ? "border-primary bg-primary/10" : "border-border"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="audio/*"
        onChange={handleChange}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
          <div className="relative bg-card p-6 rounded-full border border-primary/50 group-hover:border-primary transition-colors">
            {selectedFile ? (
              <Music className="w-12 h-12 text-primary" />
            ) : (
              <Upload className="w-12 h-12 text-primary" />
            )}
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {selectedFile ? selectedFile.name : "Upload Audio File"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {selectedFile
              ? "File ready for analysis"
              : "Drag and drop your audio file here, or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: MP3, WAV, OGG, M4A
          </p>
        </div>

        {!selectedFile && (
          <Button variant="outline" className="mt-4">
            Select File
          </Button>
        )}
      </div>
    </Card>
  );
};

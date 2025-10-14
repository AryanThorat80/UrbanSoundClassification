import { useState } from "react";
import { AudioUploader } from "@/components/AudioUploader";
import { AudioWaveform } from "@/components/AudioWaveform";
import { SoundClassification } from "@/components/SoundClassification";
import { Waves, Music2 } from "lucide-react";

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 blur-3xl" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
              <div className="relative bg-card p-4 rounded-2xl border border-primary/50">
                <Waves className="w-12 h-12 text-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Urban Sound Analyzer
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Advanced AI-powered audio classification for urban environments. 
                Upload your audio file and discover the sounds of the city.
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Music2 className="w-4 h-4 text-primary" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-secondary" />
                <span>Waveform Visualization</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Upload Section */}
          <section>
            <AudioUploader onFileSelect={setAudioFile} />
          </section>

          {/* Analysis Results */}
          {audioFile && (
            <section className="space-y-8 animate-in fade-in duration-500">
              <div className="grid md:grid-cols-1 gap-8">
                <AudioWaveform audioFile={audioFile} />
              </div>
              
              <div className="grid md:grid-cols-1 gap-8">
                <SoundClassification audioFile={audioFile} />
              </div>
            </section>
          )}

          {/* Features Section */}
          {!audioFile && (
            <section className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="p-6 rounded-xl bg-card/30 border border-border backdrop-blur space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Waves className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Smart Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Identify traffic, sirens, construction, and other urban sounds with high accuracy
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card/30 border border-border backdrop-blur space-y-3">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">Audio Visualization</h3>
                <p className="text-sm text-muted-foreground">
                  See your audio come to life with beautiful waveform representations
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card/30 border border-border backdrop-blur space-y-3">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Waves className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  Get detailed classification results in seconds with confidence scores
                </p>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Urban Sound Analyzer • Powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

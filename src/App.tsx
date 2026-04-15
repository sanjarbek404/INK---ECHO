import { useState } from 'react';
import { motion } from 'motion/react';
import { ImageUpload } from './components/ImageUpload';
import { StoryDisplay } from './components/StoryDisplay';
import { generateStoryFromImage, StoryResult } from './services/gemini';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState<StoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [lastImage, setLastImage] = useState<{base64: string, mimeType: string} | null>(null);

  const handleImageSelect = async (base64: string, mimeType: string) => {
    setIsLoading(true);
    setError(null);
    setLastImage({ base64, mimeType });
    try {
      const result = await generateStoryFromImage(base64, mimeType);
      setStory(result);
    } catch (err) {
      console.error(err);
      setError("The muse is silent. Please try another image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastImage) {
      handleImageSelect(lastImage.base64, lastImage.mimeType);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-10 bg-[var(--surface)] shrink-0">
        <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 bg-[var(--accent)] rounded" />
          INK & ECHO
        </div>
        <div className="flex gap-6 text-sm text-[var(--text-muted)]">
          <span className="cursor-pointer hover:text-[var(--text-main)] transition-colors">Library</span>
          <span className="cursor-pointer hover:text-[var(--text-main)] transition-colors">Voices</span>
          <span className="cursor-pointer hover:text-[var(--text-main)] transition-colors">Settings</span>
          <span className="text-[var(--text-main)] font-medium cursor-pointer">New Project</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-[460px_1fr] overflow-hidden">
        {/* Visual Pane */}
        <section className="bg-[#111] p-10 border-r border-[var(--border)] flex flex-col overflow-y-auto">
          <ImageUpload onImageSelect={handleImageSelect} isLoading={isLoading} />
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </section>

        {/* Story Pane */}
        <section className="p-10 flex flex-col justify-center bg-[radial-gradient(circle_at_top_right,#1e1b4b,transparent)] overflow-y-auto">
          <StoryDisplay story={story} onRegenerate={handleRegenerate} />
        </section>
      </main>

      {/* Status Bar */}
      <footer className="h-8 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-10 text-[11px] text-[var(--text-muted)] shrink-0">
        <div>Engine: Gemini 3.1 Pro Writing Assistant</div>
        <div>Expressive Voice: "Kore" (Atmospheric)</div>
        <div>Analysis Confidence: {story ? '98.4%' : 'N/A'}</div>
      </footer>
    </div>
  );
}

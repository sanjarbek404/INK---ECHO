import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { textToSpeech, StoryResult } from '../services/gemini';

interface StoryDisplayProps {
  story: StoryResult | null;
  onRegenerate: () => void;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, onRegenerate }) => {
  const [isReading, setIsReading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!story) return (
    <div className="text-center">
      <p className="text-[var(--text-muted)] text-sm italic">Upload an image to begin the narrative...</p>
    </div>
  );

  const handleReadAloud = async () => {
    if (isReading) {
      stopAudio();
      return;
    }

    try {
      setIsAudioLoading(true);
      await playRawPcm(await textToSpeech(story.paragraph));
      setIsReading(true);
    } catch (error) {
      console.error("TTS Error:", error);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const playRawPcm = async (base64: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
    const float32Array = new Float32Array(arrayBuffer.byteLength / 2);
    const view = new DataView(arrayBuffer);
    for (let i = 0; i < float32Array.length; i++) {
      float32Array[i] = view.getInt16(i * 2, true) / 32768;
    }
    const audioBuffer = audioContext.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.onended = () => setIsReading(false);
    source.start();
    (window as any).currentAudioSource = source;
  };

  const stopAudio = () => {
    if ((window as any).currentAudioSource) {
      (window as any).currentAudioSource.stop();
      setIsReading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-[480px]"
    >
      <div className="text-[0.875rem] color-[var(--text-muted)] mb-3 italic">
        Generated Scene: {story.mood || 'The Unfolding'}
      </div>
      
      <div className="text-2xl md:text-[1.5rem] leading-[1.6] font-light mb-10 text-[#e2e8f0]">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p>{children}</p>,
            strong: ({ children }) => <span className="text-[var(--accent)] font-medium">{children}</span>
          }}
        >
          {story.paragraph}
        </ReactMarkdown>
      </div>

      <div className="flex gap-4 items-center">
        <button 
          onClick={onRegenerate}
          className="btn btn-primary"
        >
          Regenerate
        </button>
        
        <button
          onClick={isReading ? stopAudio : handleReadAloud}
          disabled={isAudioLoading}
          className="btn btn-secondary"
        >
          {isAudioLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isReading ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          <span>{isReading ? 'Stop' : 'Read Aloud'}</span>
          
          {isReading && (
            <div className="audio-visualizer ml-2">
              <motion.div animate={{ height: ['40%', '90%', '40%'] }} transition={{ repeat: Infinity, duration: 0.5 }} className="bar" />
              <motion.div animate={{ height: ['80%', '40%', '80%'] }} transition={{ repeat: Infinity, duration: 0.6 }} className="bar" />
              <motion.div animate={{ height: ['60%', '90%', '60%'] }} transition={{ repeat: Infinity, duration: 0.4 }} className="bar" />
              <motion.div animate={{ height: ['90%', '50%', '90%'] }} transition={{ repeat: Infinity, duration: 0.7 }} className="bar" />
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
};

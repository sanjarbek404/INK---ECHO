import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageUploadProps {
  onImageSelect: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      const base64Data = base64.split(',')[1];
      onImageSelect(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload-area"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`
              relative group cursor-pointer
              aspect-square rounded-xl
              transition-all duration-300 ease-out
              flex flex-col items-center justify-center gap-4
              bg-gradient-to-br from-[#1e293b] to-[#0f172a]
              border-2 border-dashed
              ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-white/10 hover:border-white/20'}
            `}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
              disabled={isLoading}
            />
            
            <div className="p-4 rounded-lg bg-white/5 group-hover:scale-110 transition-transform duration-300 border border-white/5">
              <Upload className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            
            <div className="text-center">
              <p className="text-sm font-semibold text-[var(--text-main)]">Upload Concept</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Drop image or click to browse</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview-area"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)] group"
          >
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={clearImage}
                className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-[var(--glass)] backdrop-blur-md rounded-lg p-4 border border-[var(--border)]">
              <span className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-bold mb-1 block">AI Scene Analysis</span>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[11px] bg-white/5 px-2 py-1 rounded border border-[var(--border)] text-[var(--text-muted)]">Awaiting Input</span>
              </div>
            </div>

            {isLoading && (
              <div className="absolute inset-0 bg-[#0b0e14]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                <p className="text-[var(--accent)] text-xs font-semibold animate-pulse uppercase tracking-widest">Analyzing Scene</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FoodScannerProps {
  onImageSelected: (file: File) => void;
  isScanning: boolean;
}

export function FoodScanner({ onImageSelected, isScanning }: FoodScannerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelected(file);
    }
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-all cursor-pointer ${
              isDragOver
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border bg-card hover:border-primary/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-glow"
              >
                <Camera className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">
                Scan Your Food
              </h3>
              <p className="text-muted-foreground mb-6">
                Drop an image here or click to upload
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-primary/5" />
            <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-accent/5" />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-3xl overflow-hidden bg-card shadow-lg"
          >
            <div className="relative aspect-square">
              <img
                src={preview}
                alt="Food preview"
                className="w-full h-full object-cover"
              />
              
              {/* Scanning overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-foreground/10">
                  {/* Scan line animation */}
                  <motion.div
                    className="absolute left-0 right-0 h-1 scan-line"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: 'linear',
                    }}
                  />
                  
                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary rounded-br-lg" />
                  
                  {/* Center scanning indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-24 h-24 rounded-full border-4 border-primary"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.4, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                    <div className="absolute flex items-center gap-2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      <span className="text-sm font-medium">Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Clear button */}
              {!isScanning && (
                <button
                  onClick={clearPreview}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-card transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">AI Scanning in Progress</p>
                    <p className="text-sm text-muted-foreground">Identifying food & nutrition...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

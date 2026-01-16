import { motion } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6 px-4"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow"
          >
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-foreground">NutriScan AI</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Powered by AI
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

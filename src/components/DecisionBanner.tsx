import { motion } from 'framer-motion';
import { Check, AlertTriangle, X } from 'lucide-react';
import { DecisionType } from '@/types/nutrition';

interface DecisionBannerProps {
  type: DecisionType;
  message: string;
  reason: string;
}

export function DecisionBanner({ type, message, reason }: DecisionBannerProps) {
  const config = {
    allow: {
      icon: Check,
      emoji: '✅',
      gradient: 'gradient-success',
      bg: 'bg-success/10',
      border: 'border-success/30',
      text: 'text-success',
    },
    limited: {
      icon: AlertTriangle,
      emoji: '⚠️',
      gradient: 'gradient-accent',
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      text: 'text-warning',
    },
    avoid: {
      icon: X,
      emoji: '❌',
      gradient: 'gradient-danger',
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      text: 'text-destructive',
    },
  };

  const { emoji, gradient, bg, border, text } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`rounded-2xl overflow-hidden border ${border} ${bg}`}
    >
      {/* Top banner with icon */}
      <div className={`${gradient} p-6 text-center`}>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
          className="text-5xl block mb-3"
        >
          {emoji}
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold text-white"
        >
          {message}
        </motion.h3>
      </div>
      
      {/* Reason section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4"
      >
        <p className="text-foreground text-center">{reason}</p>
      </motion.div>
    </motion.div>
  );
}

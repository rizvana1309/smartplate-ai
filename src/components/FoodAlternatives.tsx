import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface Alternative {
  name: string;
  calories: number;
  reason: string;
}

interface FoodAlternativesProps {
  alternatives: Alternative[];
}

export function FoodAlternatives({ alternatives }: FoodAlternativesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-md border border-border overflow-hidden"
    >
      <div className="p-5 border-b border-border bg-primary/5">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Healthier Alternatives
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Consider these options instead
        </p>
      </div>

      <div className="p-5 space-y-3">
        {alternatives.map((alt, index) => (
          <motion.div
            key={alt.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group"
          >
            <div className="flex-1">
              <p className="font-semibold text-foreground">{alt.name}</p>
              <p className="text-xs text-muted-foreground">{alt.reason}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{alt.calories}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WaterReminderProps {
  current: number;
  goal: number;
  onUpdate: (amount: number) => void;
}

export function WaterReminder({ current, goal, onUpdate }: WaterReminderProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const glasses = Math.floor(current * 4); // 1L = 4 glasses (250ml each)
  const totalGlasses = Math.ceil(goal * 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-200/50 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Water Intake</h3>
            <p className="text-xs text-muted-foreground">{glasses}/{totalGlasses} glasses</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-500">{current}L</p>
          <p className="text-xs text-muted-foreground">of {goal}L</p>
        </div>
      </div>

      {/* Water visualization */}
      <div className="relative h-8 bg-blue-100/50 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-foreground/70">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdate(Math.max(0, current - 0.25))}
          className="rounded-full border-blue-200 hover:bg-blue-50"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">+/- 250ml</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdate(current + 0.25)}
          className="rounded-full border-blue-200 hover:bg-blue-50"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {percentage < 50 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-blue-500/10 rounded-xl text-center"
        >
          <p className="text-sm text-blue-600">
            💧 You're behind on hydration! Try to drink more water.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

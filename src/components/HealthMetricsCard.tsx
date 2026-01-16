import { motion } from 'framer-motion';
import { Scale, Flame, Target, Droplet } from 'lucide-react';
import { HealthMetrics, UserProfile } from '@/types/nutrition';
import { Progress } from '@/components/ui/progress';

interface HealthMetricsCardProps {
  metrics: HealthMetrics;
  profile: UserProfile;
  consumedCalories: number;
}

export function HealthMetricsCard({ metrics, profile, consumedCalories }: HealthMetricsCardProps) {
  const calorieProgress = Math.min((consumedCalories / metrics.dailyCalorieLimit) * 100, 100);
  const waterProgress = (profile.waterIntake / metrics.dailyWaterGoal) * 100;

  const bmiColors = {
    Underweight: 'text-blue-500',
    Normal: 'text-success',
    Overweight: 'text-warning',
    Obese: 'text-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-md border border-border p-5"
    >
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        Health Metrics
      </h3>

      <div className="space-y-5">
        {/* BMI */}
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">BMI</p>
              <p className="font-bold text-foreground">{metrics.bmi}</p>
            </div>
          </div>
          <span className={`font-semibold ${bmiColors[metrics.bmiCategory as keyof typeof bmiColors]}`}>
            {metrics.bmiCategory}
          </span>
        </div>

        {/* Calorie Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-foreground">Daily Calories</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {consumedCalories} / {metrics.dailyCalorieLimit} kcal
            </span>
          </div>
          <Progress value={calorieProgress} className="h-3" />
          <p className="text-xs text-muted-foreground text-right">
            {metrics.remainingCalories} kcal remaining
          </p>
        </div>

        {/* Water Intake */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-foreground">Water Intake</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {profile.waterIntake}L / {metrics.dailyWaterGoal}L
            </span>
          </div>
          <Progress value={waterProgress} className="h-3" />
          {waterProgress < 50 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-blue-500 flex items-center gap-1"
            >
              💧 Reminder: Stay hydrated! Drink more water.
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

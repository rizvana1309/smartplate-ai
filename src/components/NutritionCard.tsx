import { motion } from 'framer-motion';
import { Flame, Beef, Wheat, Droplets } from 'lucide-react';
import { NutritionInfo } from '@/types/nutrition';

interface NutritionCardProps {
  nutrition: NutritionInfo;
  foodName: string;
  category: string;
  servingSize: string;
}

export function NutritionCard({ nutrition, foodName, category, servingSize }: NutritionCardProps) {
  const categoryColors = {
    healthy: 'bg-success/10 text-success border-success/30',
    moderate: 'bg-warning/10 text-warning border-warning/30',
    unhealthy: 'bg-destructive/10 text-destructive border-destructive/30',
  };

  const nutrients = [
    {
      label: 'Calories',
      value: nutrition.calories,
      unit: 'kcal',
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Protein',
      value: nutrition.protein,
      unit: 'g',
      icon: Beef,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Carbs',
      value: nutrition.carbohydrates,
      unit: 'g',
      icon: Wheat,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Fat',
      value: nutrition.fat,
      unit: 'g',
      icon: Droplets,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-md border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">{foodName}</h3>
            <p className="text-sm text-muted-foreground">{servingSize}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
              categoryColors[category as keyof typeof categoryColors]
            }`}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Nutrients Grid */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {nutrients.map((nutrient, index) => (
            <motion.div
              key={nutrient.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-secondary/50 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${nutrient.bg} flex items-center justify-center`}>
                  <nutrient.icon className={`w-4 h-4 ${nutrient.color}`} />
                </div>
                <span className="text-sm text-muted-foreground">{nutrient.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{nutrient.value}</span>
                <span className="text-sm text-muted-foreground">{nutrient.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export interface UserProfile {
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female';
  activityLevel: 'low' | 'moderate' | 'high';
  healthGoal: 'weight_loss' | 'weight_gain' | 'healthy';
  waterIntake: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface FoodAnalysis {
  name: string;
  category: 'healthy' | 'moderate' | 'unhealthy';
  nutrition: NutritionInfo;
  servingSize: string;
  confidence: number;
}

export type DecisionType = 'allow' | 'limited' | 'avoid';

export interface IntakeDecision {
  type: DecisionType;
  message: string;
  reason: string;
}

export interface HealthMetrics {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  dailyCalorieLimit: number;
  remainingCalories: number;
  dailyWaterGoal: number;
}

export interface FoodAlternative {
  name: string;
  calories: number;
  reason: string;
}

import { UserProfile, HealthMetrics, FoodAnalysis, IntakeDecision, DecisionType } from '@/types/nutrition';

export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function calculateBMR(profile: UserProfile): number {
  // Mifflin-St Jeor Equation
  const { weight, height, age, gender } = profile;
  
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
}

export function calculateDailyCalorieLimit(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  
  const activityMultipliers = {
    low: 1.2,
    moderate: 1.55,
    high: 1.9,
  };
  
  const tdee = bmr * activityMultipliers[profile.activityLevel];
  
  const goalAdjustments = {
    weight_loss: -500,
    weight_gain: 500,
    healthy: 0,
  };
  
  return Math.round(tdee + goalAdjustments[profile.healthGoal]);
}

export function calculateDailyWaterGoal(weight: number): number {
  // 30-35ml per kg of body weight
  return Math.round((weight * 33) / 1000 * 10) / 10;
}

export function getHealthMetrics(profile: UserProfile, consumedCalories: number = 0): HealthMetrics {
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmr = calculateBMR(profile);
  const dailyCalorieLimit = calculateDailyCalorieLimit(profile);
  
  return {
    bmi,
    bmiCategory: getBMICategory(bmi),
    bmr,
    dailyCalorieLimit,
    remainingCalories: dailyCalorieLimit - consumedCalories,
    dailyWaterGoal: calculateDailyWaterGoal(profile.weight),
  };
}

export function makeIntakeDecision(
  food: FoodAnalysis,
  metrics: HealthMetrics,
  profile: UserProfile
): IntakeDecision {
  const { calories, protein, fat } = food.nutrition;
  const { remainingCalories, bmiCategory } = metrics;
  const { healthGoal } = profile;
  
  // Decision logic
  let type: DecisionType = 'allow';
  let message = '';
  let reason = '';
  
  // Check if food fits within calorie budget
  const calorieRatio = calories / remainingCalories;
  
  // Rule 1: If food is unhealthy and user wants weight loss
  if (food.category === 'unhealthy' && healthGoal === 'weight_loss') {
    type = 'avoid';
    message = 'You should avoid this food';
    reason = 'This food is high in calories and doesn\'t align with your weight loss goal.';
    return { type, message, reason };
  }
  
  // Rule 2: If calories exceed remaining budget significantly
  if (calorieRatio > 0.8) {
    type = 'avoid';
    message = 'You should avoid this food';
    reason = `This food contains ${calories} kcal, which exceeds your remaining daily budget of ${remainingCalories} kcal.`;
    return { type, message, reason };
  }
  
  // Rule 3: If calories are moderate compared to remaining
  if (calorieRatio > 0.4 || food.category === 'moderate') {
    type = 'limited';
    message = 'Take this food in limited quantity';
    reason = `Consider a smaller portion. This uses ${Math.round(calorieRatio * 100)}% of your remaining calorie budget.`;
    return { type, message, reason };
  }
  
  // Rule 4: BMI consideration
  if ((bmiCategory === 'Overweight' || bmiCategory === 'Obese') && food.category !== 'healthy') {
    type = 'limited';
    message = 'Take this food in limited quantity';
    reason = 'Based on your BMI, choosing healthier options would better support your health.';
    return { type, message, reason };
  }
  
  // Rule 5: Healthy food and good fit
  if (food.category === 'healthy' && calorieRatio < 0.3) {
    type = 'allow';
    message = 'You may take this food';
    reason = 'This food fits your daily calorie limit and supports your health goal!';
    return { type, message, reason };
  }
  
  // Default: Allow with standard message
  type = 'allow';
  message = 'You may take this food';
  reason = `This food contains ${calories} kcal and fits well within your remaining ${remainingCalories} kcal budget.`;
  
  return { type, message, reason };
}

export function getHealthyAlternatives(food: FoodAnalysis): { name: string; calories: number; reason: string }[] {
  const alternatives: { [key: string]: { name: string; calories: number; reason: string }[] } = {
    burger: [
      { name: 'Grilled Chicken Wrap', calories: 350, reason: 'Lean protein with vegetables' },
      { name: 'Turkey Burger', calories: 300, reason: 'Lower fat alternative' },
      { name: 'Veggie Burger', calories: 250, reason: 'Plant-based, lower calories' },
    ],
    pizza: [
      { name: 'Cauliflower Crust Pizza', calories: 200, reason: 'Lower carb option' },
      { name: 'Greek Salad', calories: 180, reason: 'Fresh and nutritious' },
      { name: 'Whole Wheat Flatbread', calories: 220, reason: 'Better grain choice' },
    ],
    fries: [
      { name: 'Sweet Potato Fries (baked)', calories: 150, reason: 'More nutrients, less oil' },
      { name: 'Side Salad', calories: 80, reason: 'Fresh vegetables' },
      { name: 'Roasted Vegetables', calories: 100, reason: 'Fiber-rich option' },
    ],
    soda: [
      { name: 'Sparkling Water', calories: 0, reason: 'Zero calories, refreshing' },
      { name: 'Green Tea', calories: 2, reason: 'Antioxidants, minimal calories' },
      { name: 'Infused Water', calories: 5, reason: 'Natural flavors, hydrating' },
    ],
    default: [
      { name: 'Mixed Green Salad', calories: 100, reason: 'Nutrient-dense, low calorie' },
      { name: 'Grilled Fish', calories: 200, reason: 'Lean protein, omega-3' },
      { name: 'Fresh Fruit Bowl', calories: 120, reason: 'Natural sugars, vitamins' },
    ],
  };
  
  const foodNameLower = food.name.toLowerCase();
  
  for (const key of Object.keys(alternatives)) {
    if (foodNameLower.includes(key)) {
      return alternatives[key];
    }
  }
  
  return alternatives.default;
}

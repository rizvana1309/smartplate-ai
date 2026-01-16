import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Header } from '@/components/Header';
import { UserProfileForm } from '@/components/UserProfileForm';
import { FoodScanner } from '@/components/FoodScanner';
import { DecisionBanner } from '@/components/DecisionBanner';
import { NutritionCard } from '@/components/NutritionCard';
import { HealthMetricsCard } from '@/components/HealthMetricsCard';
import { FoodAlternatives } from '@/components/FoodAlternatives';
import { WaterReminder } from '@/components/WaterReminder';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, FoodAnalysis, IntakeDecision, HealthMetrics } from '@/types/nutrition';
import { getHealthMetrics, makeIntakeDecision, getHealthyAlternatives } from '@/utils/healthCalculations';

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Analyze food using AI
const analyzeFood = async (file: File): Promise<FoodAnalysis> => {
  const base64 = await fileToBase64(file);
  
  const { data, error } = await supabase.functions.invoke('analyze-food', {
    body: { imageBase64: base64 },
  });

  if (error) {
    throw new Error(error.message || 'Failed to analyze food');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as FoodAnalysis;
};

export default function Index() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [foodAnalysis, setFoodAnalysis] = useState<FoodAnalysis | null>(null);
  const [decision, setDecision] = useState<IntakeDecision | null>(null);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [consumedCalories, setConsumedCalories] = useState(0);

  const handleProfileSubmit = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
    const healthMetrics = getHealthMetrics(newProfile, consumedCalories);
    setMetrics(healthMetrics);
  }, [consumedCalories]);

  const handleImageSelected = useCallback(async (file: File) => {
    if (!profile || !metrics) return;
    
    setIsScanning(true);
    setFoodAnalysis(null);
    setDecision(null);
    
    try {
      const analysis = await analyzeFood(file);
      setFoodAnalysis(analysis);
      
      const intakeDecision = makeIntakeDecision(analysis, metrics, profile);
      setDecision(intakeDecision);
      
      toast({
        title: "Analysis Complete!",
        description: `Detected: ${analysis.name}`,
      });
    } catch (error) {
      console.error('Error analyzing food:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Please try again with a clearer image",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  }, [profile, metrics, toast]);

  const handleWaterUpdate = useCallback((amount: number) => {
    if (!profile) return;
    const updatedProfile = { ...profile, waterIntake: amount };
    setProfile(updatedProfile);
  }, [profile]);

  const handleScanAnother = useCallback(() => {
    // Add the food's calories to consumed if it was allowed
    if (decision?.type === 'allow' && foodAnalysis) {
      const newConsumed = consumedCalories + foodAnalysis.nutrition.calories;
      setConsumedCalories(newConsumed);
      if (profile) {
        setMetrics(getHealthMetrics(profile, newConsumed));
      }
      toast({
        title: "Food Added",
        description: `${foodAnalysis.nutrition.calories} kcal added to your daily intake.`,
      });
    }
    setFoodAnalysis(null);
    setDecision(null);
  }, [decision, foodAnalysis, consumedCalories, profile, toast]);

  const handleBack = useCallback(() => {
    setProfile(null);
    setFoodAnalysis(null);
    setDecision(null);
    setMetrics(null);
    setConsumedCalories(0);
  }, []);

  return (
    <div className="min-h-screen gradient-secondary">
      <Header />
      
      <main className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!profile ? (
              <motion.div
                key="profile-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-foreground mb-2"
                  >
                    Let's Get Started
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                  >
                    Set up your profile for personalized nutrition advice
                  </motion.p>
                </div>
                <UserProfileForm onSubmit={handleProfileSubmit} />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Back button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit Profile
                </Button>

                {/* Scanner or Results */}
                {!foodAnalysis ? (
                  <FoodScanner
                    onImageSelected={handleImageSelected}
                    isScanning={isScanning}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Decision Banner */}
                    {decision && (
                      <DecisionBanner
                        type={decision.type}
                        message={decision.message}
                        reason={decision.reason}
                      />
                    )}

                    {/* Nutrition Info */}
                    <NutritionCard
                      nutrition={foodAnalysis.nutrition}
                      foodName={foodAnalysis.name}
                      category={foodAnalysis.category}
                      servingSize={foodAnalysis.servingSize}
                    />

                    {/* Alternatives for limited/avoid */}
                    {decision && (decision.type === 'limited' || decision.type === 'avoid') && (
                      <FoodAlternatives alternatives={getHealthyAlternatives(foodAnalysis)} />
                    )}

                    {/* Scan Another Button */}
                    <Button
                      onClick={handleScanAnother}
                      className="w-full gradient-primary border-0 gap-2"
                      size="lg"
                    >
                      <RefreshCw className="w-5 h-5" />
                      {decision?.type === 'allow' ? 'Add to Log & Scan Another' : 'Scan Another Food'}
                    </Button>
                  </motion.div>
                )}

                {/* Health Metrics Sidebar */}
                {metrics && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <HealthMetricsCard
                      metrics={metrics}
                      profile={profile}
                      consumedCalories={consumedCalories}
                    />
                    <WaterReminder
                      current={profile.waterIntake}
                      goal={metrics.dailyWaterGoal}
                      onUpdate={handleWaterUpdate}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Ruler, Weight, Activity, Target, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/types/nutrition';

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

export function UserProfileForm({ onSubmit }: UserProfileFormProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    age: 25,
    height: 170,
    weight: 70,
    gender: 'male',
    activityLevel: 'moderate',
    healthGoal: 'healthy',
    waterIntake: 0,
  });

  const handleSubmit = () => {
    if (profile.age && profile.height && profile.weight) {
      onSubmit(profile as UserProfile);
    }
  };

  const activities = [
    { value: 'low', label: 'Low', description: 'Desk job, minimal exercise' },
    { value: 'moderate', label: 'Moderate', description: '3-5 workouts per week' },
    { value: 'high', label: 'High', description: 'Daily intense exercise' },
  ];

  const goals = [
    { value: 'weight_loss', label: 'Weight Loss', emoji: '🔥' },
    { value: 'weight_gain', label: 'Weight Gain', emoji: '💪' },
    { value: 'healthy', label: 'Stay Healthy', emoji: '🌿' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Your Profile</h2>
            <p className="text-sm text-muted-foreground">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-secondary rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full gradient-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="text-lg"
                min={10}
                max={100}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-primary" />
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                  className="text-lg"
                  min={100}
                  max={250}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-primary" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                  className="text-lg"
                  min={30}
                  max={300}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Gender</Label>
              <div className="grid grid-cols-2 gap-3">
                {['male', 'female'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setProfile({ ...profile, gender: gender as 'male' | 'female' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      profile.gender === gender
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{gender === 'male' ? '👨' : '👩'}</span>
                    <span className="text-sm font-medium capitalize">{gender}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Label className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-primary" />
              Activity Level
            </Label>
            {activities.map((activity) => (
              <button
                key={activity.value}
                type="button"
                onClick={() => setProfile({ ...profile, activityLevel: activity.value as UserProfile['activityLevel'] })}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  profile.activityLevel === activity.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="font-semibold block">{activity.label}</span>
                <span className="text-sm text-muted-foreground">{activity.description}</span>
              </button>
            ))}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Label className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-primary" />
              Health Goal
            </Label>
            {goals.map((goal) => (
              <button
                key={goal.value}
                type="button"
                onClick={() => setProfile({ ...profile, healthGoal: goal.value as UserProfile['healthGoal'] })}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                  profile.healthGoal === goal.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-3xl">{goal.emoji}</span>
                <span className="font-semibold">{goal.label}</span>
              </button>
            ))}
          </motion.div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="flex-1 gradient-primary border-0"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 gradient-primary border-0"
            >
              Start Scanning
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

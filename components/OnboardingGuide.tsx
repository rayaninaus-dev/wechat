import React, { useState, useEffect } from 'react';
import { View, Text, Button } from './WxComponents';
import { X, BookOpen, Zap, Target, Trophy } from 'lucide-react';
import { wx } from '../utils/wx';

interface OnboardingGuideProps {
  show: boolean;
  onClose: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ show, onClose }) => {
  const [step, setStep] = useState(0);

  const guides = [
    {
      icon: BookOpen,
      title: "Welcome to WeVocab!",
      description: "Learn vocabulary with SRS (Spaced Repetition System) - the most effective method.",
      bgColor: "bg-blue-500 dark:bg-blue-600"
    },
    {
      icon: Zap,
      title: "Flip Card to Learn",
      description: "Swipe up or click on the card to see the definition, examples, and related words.",
      bgColor: "bg-blue-500 dark:bg-blue-600"
    },
    {
      icon: Target,
      title: "Rate Your Knowledge",
      description: "After flipping, rate how well you know the word (1-6). We'll adjust review timing accordingly.",
      bgColor: "bg-blue-500 dark:bg-blue-600"
    },
    {
      icon: Trophy,
      title: "Track Progress",
      description: "View your statistics, achievements, and improvement over time in the Stats tab.",
      bgColor: "bg-blue-500 dark:bg-blue-600"
    }
  ];

  if (!show) return null;

  const currentGuide = guides[step];
  const IconComponent = currentGuide.icon;

  return (
    <View className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end">
      <View className="w-full bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl p-6 pb-8 animate-in slide-in-from-bottom border-t border-gray-200 dark:border-gray-800">
        {/* Close Button */}
        <View className="flex justify-end mb-4">
          <View
            onClick={() => {
              onClose();
              wx.setStorageSync('onboarding_completed', true);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </View>
        </View>

        {/* Content */}
        <View className="text-center mb-8">
          <View className={`${currentGuide.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
            <IconComponent size={40} className="text-white" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2 block">
            {currentGuide.title}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            {currentGuide.description}
          </Text>
        </View>

        {/* Progress Indicators */}
        <View className="flex justify-center gap-2 mb-8">
          {guides.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full transition-all ${
                i <= step
                  ? 'bg-blue-500 dark:bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              style={{ width: i === step ? '24px' : '8px' }}
            />
          ))}
        </View>

        {/* Buttons */}
        <View className="flex gap-3">
          {step > 0 && (
            <Button
              type="default"
              className="flex-1 rounded-lg !bg-gray-100 dark:!bg-gray-800 !border-gray-100 dark:!border-gray-800 !text-gray-700 dark:!text-gray-300"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          <Button
            type="primary"
            className="flex-1 rounded-lg !bg-blue-500 dark:!bg-blue-600 !border-blue-500 dark:!border-blue-600"
            onClick={() => {
              if (step < guides.length - 1) {
                setStep(step + 1);
              } else {
                onClose();
                wx.setStorageSync('onboarding_completed', true);
              }
            }}
          >
            {step === guides.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </View>

        {/* Skip Link */}
        <View className="text-center mt-4">
          <Text
            className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            onClick={() => {
              onClose();
              wx.setStorageSync('onboarding_completed', true);
            }}
          >
            Skip Tutorial
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OnboardingGuide;

import React, { useState, useEffect } from 'react';
import { Achievement } from '../types';
import { View, Text } from './WxComponents';
import { Lock, Unlock, Award } from 'lucide-react';
import { getUnlockedAchievements, ALL_ACHIEVEMENTS, getAchievementStats } from '../services/achievementService';

interface AchievementDisplayProps {
  compact?: boolean; // 紧凑模式（用于主页）
}

const AchievementDisplay: React.FC<AchievementDisplayProps> = ({ compact = false }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({
    totalAchievements: 0,
    unlockedCount: 0,
    lockedCount: 0,
    percentage: 0,
    byCategory: { streak: 0, milestone: 0, accuracy: 0, consistency: 0 }
  });

  useEffect(() => {
    setUnlockedAchievements(getUnlockedAchievements());
    setStats(getAchievementStats());
  }, []);

  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));

  if (compact) {
    // 紧凑模式：只显示最新解锁的成就
    return (
      <View className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
        <View className="flex items-center gap-2 mb-3">
          <Award size={18} className="text-purple-500 dark:text-purple-400" />
          <Text className="font-bold text-gray-800 dark:text-white">最近成就</Text>
          <View className="ml-auto bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-lg border border-purple-200 dark:border-purple-700">
            <Text className="text-xs font-bold text-purple-700 dark:text-purple-300">
              {stats.unlockedCount}/{stats.totalAchievements}
            </Text>
          </View>
        </View>

        <View className="flex gap-2 overflow-x-auto pb-2">
          {unlockedAchievements.slice(-5).reverse().map((achievement) => (
            <View key={achievement.id} className="flex-shrink-0 text-center">
              <View className="text-3xl mb-1">{achievement.icon}</View>
              <Text className="text-xs font-bold text-gray-700 dark:text-gray-300 max-w-[60px] truncate">
                {achievement.name}
              </Text>
            </View>
          ))}
          {unlockedAchievements.length === 0 && (
            <Text className="text-xs text-gray-500 dark:text-gray-400">继续学习解锁成就...</Text>
          )}
        </View>
      </View>
    );
  }

  // 完整模式：显示所有成就
  return (
    <View className="space-y-6">
      {/* 成就概览 */}
      <View className="bg-blue-500 dark:bg-blue-600 rounded-2xl p-6 text-white">
        <View className="flex items-center gap-3 mb-4">
          <Award size={24} />
          <Text className="text-2xl font-bold">成就中心</Text>
        </View>

        <View className="grid grid-cols-2 gap-3 mb-4">
          <View className="bg-white/20 rounded-lg p-3">
            <Text className="text-sm opacity-90">已解锁</Text>
            <Text className="text-3xl font-bold">{stats.unlockedCount}</Text>
          </View>
          <View className="bg-white/20 rounded-lg p-3">
            <Text className="text-sm opacity-90">进度</Text>
            <Text className="text-3xl font-bold">{stats.percentage.toFixed(0)}%</Text>
          </View>
        </View>

        <View className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
          <View
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          />
        </View>
      </View>

      {/* 按类别显示成就 */}
      <View className="space-y-4">
        {/* 连续学习 */}
        <View className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
          <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">🔥 连续学习</Text>
          <View className="grid grid-cols-3 gap-2">
            {ALL_ACHIEVEMENTS.filter(a => a.category === 'streak').map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={unlockedIds.has(achievement.id)}
              />
            ))}
          </View>
        </View>

        {/* 里程碑 */}
        <View className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
          <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">📚 里程碑</Text>
          <View className="grid grid-cols-3 gap-2">
            {ALL_ACHIEVEMENTS.filter(a => a.category === 'milestone').map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={unlockedIds.has(achievement.id)}
              />
            ))}
          </View>
        </View>

        {/* 准确率 */}
        <View className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
          <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">🎯 准确率</Text>
          <View className="grid grid-cols-3 gap-2">
            {ALL_ACHIEVEMENTS.filter(a => a.category === 'accuracy').map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={unlockedIds.has(achievement.id)}
              />
            ))}
          </View>
        </View>

        {/* 一致性 */}
        <View className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
          <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">📅 一致性</Text>
          <View className="grid grid-cols-3 gap-2">
            {ALL_ACHIEVEMENTS.filter(a => a.category === 'consistency').map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={unlockedIds.has(achievement.id)}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked }) => {
  return (
    <View className={`p-3 rounded-lg text-center transition-all border ${
      isUnlocked 
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' 
        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
    }`}>
      <View className="text-3xl mb-2">{achievement.icon}</View>
      <Text className={`text-xs font-bold mb-1 ${isUnlocked ? 'text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
        {achievement.name}
      </Text>
      <Text className={`text-[10px] ${isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'}`}>
        {achievement.description}
      </Text>
      {isUnlocked && (
        <View className="flex justify-center mt-2">
          <Unlock size={14} className="text-green-500 dark:text-green-400" />
        </View>
      )}
    </View>
  );
};

export default AchievementDisplay;

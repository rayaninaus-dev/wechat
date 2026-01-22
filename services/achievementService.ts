/**
 * 成就和激励系统
 * 追踪用户的成就、徽章和学习里程碑
 */

import { Achievement } from '../types';
import { wx } from '../utils/wx';

const STORAGE_KEY_ACHIEVEMENTS = 'wevocab_achievements';

// 所有可用的成就定义
export const ALL_ACHIEVEMENTS: Achievement[] = [
  // 连续学习
  {
    id: 'streak-3',
    name: '连续学习者',
    description: '连续 3 天学习',
    icon: '🔥',
    category: 'streak'
  },
  {
    id: 'streak-7',
    name: '周坚持者',
    description: '连续 7 天学习',
    icon: '🌟',
    category: 'streak'
  },
  {
    id: 'streak-30',
    name: '月坚持者',
    description: '连续 30 天学习',
    icon: '👑',
    category: 'streak'
  },

  // 单词掌握里程碑
  {
    id: 'milestone-10',
    name: '初学者',
    description: '掌握 10 个单词',
    icon: '📚',
    category: 'milestone'
  },
  {
    id: 'milestone-50',
    name: '学习者',
    description: '掌握 50 个单词',
    icon: '📖',
    category: 'milestone'
  },
  {
    id: 'milestone-100',
    name: '词汇大师',
    description: '掌握 100 个单词',
    icon: '🎓',
    category: 'milestone'
  },
  {
    id: 'milestone-500',
    name: '词汇专家',
    description: '掌握 500 个单词',
    icon: '🏆',
    category: 'milestone'
  },

  // 准确率成就
  {
    id: 'accuracy-80',
    name: '精准学习者',
    description: '单日准确率达到 80%',
    icon: '🎯',
    category: 'accuracy'
  },
  {
    id: 'accuracy-90',
    name: '完美主义者',
    description: '单日准确率达到 90%',
    icon: '💯',
    category: 'accuracy'
  },

  // 一致性成就
  {
    id: 'consistency-weekly',
    name: '周学习计划',
    description: '一周内学习 5 天以上',
    icon: '📅',
    category: 'consistency'
  },
  {
    id: 'consistency-daily-30min',
    name: '每日小时',
    description: '单日学习 30 分钟以上',
    icon: '⏱️',
    category: 'consistency'
  }
];

/**
 * 获取所有已解锁的成就
 */
export function getUnlockedAchievements(): Achievement[] {
  const data = wx.getStorageSync(STORAGE_KEY_ACHIEVEMENTS);
  return data || [];
}

/**
 * 解锁一个成就
 */
export function unlockAchievement(achievementId: string): void {
  const achievement = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return;

  const unlockedList = getUnlockedAchievements();
  
  // 检查是否已解锁
  if (unlockedList.some(a => a.id === achievementId)) {
    return;
  }

  // 添加解锁时间
  const newAchievement = {
    ...achievement,
    unlockedDate: Date.now()
  };

  unlockedList.push(newAchievement);
  wx.setStorageSync(STORAGE_KEY_ACHIEVEMENTS, unlockedList);
}

/**
 * 检查并更新成就
 */
export function checkAndUnlockAchievements(stats: {
  masteredCount: number;
  streakDays: number;
  todayAccuracy?: number;
  todayMinutes?: number;
  sessionCountThisWeek?: number;
}): string[] {
  const newlyUnlockedIds: string[] = [];
  const unlockedIds = getUnlockedAchievements().map(a => a.id);

  // 检查里程碑成就
  if (stats.masteredCount >= 10 && !unlockedIds.includes('milestone-10')) {
    unlockAchievement('milestone-10');
    newlyUnlockedIds.push('milestone-10');
  }
  if (stats.masteredCount >= 50 && !unlockedIds.includes('milestone-50')) {
    unlockAchievement('milestone-50');
    newlyUnlockedIds.push('milestone-50');
  }
  if (stats.masteredCount >= 100 && !unlockedIds.includes('milestone-100')) {
    unlockAchievement('milestone-100');
    newlyUnlockedIds.push('milestone-100');
  }
  if (stats.masteredCount >= 500 && !unlockedIds.includes('milestone-500')) {
    unlockAchievement('milestone-500');
    newlyUnlockedIds.push('milestone-500');
  }

  // 检查连续学习成就
  if (stats.streakDays >= 3 && !unlockedIds.includes('streak-3')) {
    unlockAchievement('streak-3');
    newlyUnlockedIds.push('streak-3');
  }
  if (stats.streakDays >= 7 && !unlockedIds.includes('streak-7')) {
    unlockAchievement('streak-7');
    newlyUnlockedIds.push('streak-7');
  }
  if (stats.streakDays >= 30 && !unlockedIds.includes('streak-30')) {
    unlockAchievement('streak-30');
    newlyUnlockedIds.push('streak-30');
  }

  // 检查准确率成就
  if (stats.todayAccuracy && stats.todayAccuracy >= 80 && !unlockedIds.includes('accuracy-80')) {
    unlockAchievement('accuracy-80');
    newlyUnlockedIds.push('accuracy-80');
  }
  if (stats.todayAccuracy && stats.todayAccuracy >= 90 && !unlockedIds.includes('accuracy-90')) {
    unlockAchievement('accuracy-90');
    newlyUnlockedIds.push('accuracy-90');
  }

  // 检查一致性成就
  if ((stats.sessionCountThisWeek || 0) >= 5 && !unlockedIds.includes('consistency-weekly')) {
    unlockAchievement('consistency-weekly');
    newlyUnlockedIds.push('consistency-weekly');
  }

  if ((stats.todayMinutes || 0) >= 30 && !unlockedIds.includes('consistency-daily-30min')) {
    unlockAchievement('consistency-daily-30min');
    newlyUnlockedIds.push('consistency-daily-30min');
  }

  return newlyUnlockedIds;
}

/**
 * 获取成就进度信息
 */
export function getAchievementProgress(masteredCount: number, streakDays: number): {
  category: string;
  title: string;
  current: number;
  target: number;
  percentage: number;
}[] {
  return [
    {
      category: 'milestone',
      title: '掌握单词',
      current: masteredCount,
      target: 100,
      percentage: Math.min((masteredCount / 100) * 100, 100)
    },
    {
      category: 'streak',
      title: '连续学习天数',
      current: streakDays,
      target: 30,
      percentage: Math.min((streakDays / 30) * 100, 100)
    }
  ];
}

/**
 * 获取下一个即将获得的成就
 */
export function getNextMilestoneAchievements(): Achievement[] {
  const unlockedIds = getUnlockedAchievements().map(a => a.id);
  
  // 返回未解锁的前 3 个成就
  return ALL_ACHIEVEMENTS
    .filter(a => !unlockedIds.includes(a.id))
    .slice(0, 3);
}

/**
 * 获取成就统计
 */
export function getAchievementStats() {
  const unlockedAchievements = getUnlockedAchievements();
  const totalAchievements = ALL_ACHIEVEMENTS.length;
  const unlockedCount = unlockedAchievements.length;

  return {
    totalAchievements,
    unlockedCount,
    lockedCount: totalAchievements - unlockedCount,
    percentage: (unlockedCount / totalAchievements) * 100,
    byCategory: {
      streak: unlockedAchievements.filter(a => a.category === 'streak').length,
      milestone: unlockedAchievements.filter(a => a.category === 'milestone').length,
      accuracy: unlockedAchievements.filter(a => a.category === 'accuracy').length,
      consistency: unlockedAchievements.filter(a => a.category === 'consistency').length
    }
  };
}

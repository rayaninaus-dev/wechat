/**
 * 学习统计和分析服务
 * 用于追踪用户的学习进度、准确率、成就等
 */

import { WordItem, StudySession, DailyStats, TopicStats } from '../types';
import { wx } from '../utils/wx';

const STORAGE_KEY_SESSIONS = 'wevocab_sessions';
const STORAGE_KEY_DAILY_STATS = 'wevocab_daily_stats';

/**
 * 记录一个学习会话
 */
export function recordStudySession(session: StudySession): void {
  const sessions = getStudySessions();
  sessions.push(session);
  wx.setStorageSync(STORAGE_KEY_SESSIONS, sessions);
}

/**
 * 获取所有学习会话
 */
export function getStudySessions(): StudySession[] {
  const data = wx.getStorageSync(STORAGE_KEY_SESSIONS);
  return data || [];
}

/**
 * 获取指定日期范围的学习会话
 */
export function getSessionsInRange(startDate: string, endDate: string): StudySession[] {
  const sessions = getStudySessions();
  return sessions.filter(s => s.date >= startDate && s.date <= endDate);
}

/**
 * 获取今天的学习会话
 */
export function getTodaySessions(): StudySession[] {
  const today = new Date().toISOString().split('T')[0];
  return getSessionsInRange(today, today);
}

/**
 * 计算今日学习统计
 */
export function getTodayStats(): {
  sessionsCompleted: number;
  wordsStudied: number;
  totalMinutes: number;
  averageAccuracy: number;
} {
  const sessions = getTodaySessions();
  
  let wordsStudied = 0;
  let correctCount = 0;
  let totalCount = 0;
  let totalMinutes = 0;

  sessions.forEach(session => {
    wordsStudied += session.wordsStudied;
    totalMinutes += Math.round(session.duration / 60);
    correctCount += session.wordResults.filter(r => r.quality >= 3).length;
    totalCount += session.wordResults.length;
  });

  const averageAccuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

  return {
    sessionsCompleted: sessions.length,
    wordsStudied,
    totalMinutes,
    averageAccuracy
  };
}

/**
 * 计算各话题的学习统计
 */
export function getTopicStudyStats(words: WordItem[]): Array<{
  topic: string;
  newCount: number;
  learningCount: number;
  reviewDueCount: number;
  masteredCount: number;
  totalAccuracy: number;
}> {
  const now = Date.now();
  const topicMap = new Map<string, WordItem[]>();

  // 按话题分组
  words.forEach(word => {
    if (!topicMap.has(word.topic)) {
      topicMap.set(word.topic, []);
    }
    topicMap.get(word.topic)!.push(word);
  });

  // 计算每个话题的统计
  return Array.from(topicMap.entries()).map(([topic, topicWords]) => {
    const newCount = topicWords.filter(w => w.learningStatus === 'new').length;
    const learningCount = topicWords.filter(w => w.learningStatus === 'learning').length;
    const reviewDueCount = topicWords.filter(w => 
      (w.learningStatus === 'learning' || w.learningStatus === 'review') && 
      w.nextReviewDate <= now
    ).length;
    const masteredCount = topicWords.filter(w => w.learningStatus === 'mastered').length;

    // 计算准确率
    const totalReviews = topicWords.reduce((sum, w) => sum + w.reviewCount, 0);
    const totalCorrect = topicWords.reduce((sum, w) => sum + w.correctCount, 0);
    const totalAccuracy = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0;

    return {
      topic,
      newCount,
      learningCount,
      reviewDueCount,
      masteredCount,
      totalAccuracy
    };
  });
}

/**
 * 获取错误率最高的单词（需要重点学习的）
 */
export function getMostDifficultWords(words: WordItem[], limit: number = 10): WordItem[] {
  return words
    .filter(w => w.reviewCount > 0)
    .sort((a, b) => {
      const accuracyA = (a.correctCount / a.reviewCount) * 100;
      const accuracyB = (b.correctCount / b.reviewCount) * 100;
      return accuracyA - accuracyB;
    })
    .slice(0, limit);
}

/**
 * 获取已掌握的单词数
 */
export function getMasteredCount(words: WordItem[]): number {
  return words.filter(w => w.learningStatus === 'mastered').length;
}

/**
 * 获取学习中的单词数
 */
export function getLearningCount(words: WordItem[]): number {
  return words.filter(w => w.learningStatus === 'learning' || w.learningStatus === 'review').length;
}

/**
 * 获取新词数量
 */
export function getNewCount(words: WordItem[]): number {
  return words.filter(w => w.learningStatus === 'new').length;
}

/**
 * 获取需要复习的单词
 */
export function getDueCount(words: WordItem[]): number {
  const now = Date.now();
  return words.filter(w => 
    (w.learningStatus === 'learning' || w.learningStatus === 'review') && 
    w.nextReviewDate <= now
  ).length;
}

/**
 * 计算学习进度百分比
 */
export function getProgressPercentage(words: WordItem[]): number {
  if (words.length === 0) return 0;
  
  const masteredCount = getMasteredCount(words);
  return (masteredCount / words.length) * 100;
}

/**
 * 获取学习数据曲线（过去 N 天）
 */
export function getStudyTrend(days: number = 7): Array<{
  date: string;
  newWordsAdded: number;
  wordsReviewed: number;
  averageAccuracy: number;
}> {
  const today = new Date();
  const trend = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const sessions = getSessionsInRange(dateStr, dateStr);
    
    const newWordsAdded = sessions.reduce((sum, s) => {
      const newWords = s.wordResults.filter(r => r.quality >= 3).length;
      return sum + newWords;
    }, 0);

    const wordsReviewed = sessions.reduce((sum, s) => sum + s.wordsStudied, 0);

    const correctCount = sessions.reduce((sum, s) => {
      return sum + s.wordResults.filter(r => r.quality >= 3).length;
    }, 0);

    const totalCount = sessions.reduce((sum, s) => sum + s.wordResults.length, 0);
    const averageAccuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

    trend.push({
      date: dateStr,
      newWordsAdded,
      wordsReviewed,
      averageAccuracy
    });
  }

  return trend;
}

/**
 * 检查是否应该提醒用户复习
 * 返回需要复习的单词数
 */
export function getReviewReminder(words: WordItem[]): number {
  const now = Date.now();
  return words.filter(w => 
    w.learningStatus !== 'new' && 
    w.learningStatus !== 'mastered' && 
    w.nextReviewDate <= now
  ).length;
}

/**
 * 获取学习建议
 */
export function getStudySuggestions(words: WordItem[]): string[] {
  const suggestions: string[] = [];
  const masteredCount = getMasteredCount(words);
  const learningCount = getLearningCount(words);
  const dueCount = getDueCount(words);
  const newCount = getNewCount(words);

  // 根据学习进度生成建议
  if (dueCount > 0) {
    suggestions.push(`你有 ${dueCount} 个单词需要复习了！`);
  }

  if (newCount > 0 && newCount <= 5) {
    suggestions.push(`加油！再学习 ${newCount} 个新单词就能完成这个话题的基础学习了！`);
  }

  if (masteredCount > 0 && masteredCount % 5 === 0) {
    suggestions.push(`太棒了！你已经掌握了 ${masteredCount} 个单词！`);
  }

  if (learningCount > 10) {
    suggestions.push(`专注于复习！你有 ${learningCount} 个单词在学习中。`);
  }

  const difficulWords = getMostDifficultWords(words, 3);
  if (difficulWords.length > 0) {
    suggestions.push(`重点关注这些困难单词：${difficulWords.map(w => w.word).join(', ')}`);
  }

  return suggestions;
}

/**
 * SRS (Spaced Repetition System) Service
 * 基于 Anki 算法的间隔重复学习系统
 */

import { WordItem, StudyQuality, LearningStatus } from '../types';

const INITIAL_EASE_FACTOR = 2.5;
const MINIMUM_EASE_FACTOR = 1.3;
const MAXIMUM_EASE_FACTOR = 2.5;

// 学习阶段的默认间隔（天数）
const STAGE_INTERVALS = {
  0: 1,      // 阶段 0: 1 天后
  1: 3,      // 阶段 1: 3 天后
  2: 7,      // 阶段 2: 7 天后
  3: 14,     // 阶段 3: 14 天后
  4: 30,     // 阶段 4: 30 天后
};

/**
 * 根据用户反馈计算新的间隔和难度系数
 * 基于 Anki 的 SM-2 算法
 * 
 * @param word 单词
 * @param quality 答题质量 (0-5)
 *   0: 又错了 (again)
 *   1: 太困难 (hard)
 *   2: 困难 (difficult)
 *   3: 一般 (good)
 *   4: 容易 (easy)
 *   5: 太简单 (very easy)
 * @returns 更新后的单词对象
 */
export function updateWordProgress(word: WordItem, quality: StudyQuality): WordItem {
  const now = Date.now();
  
  // 计算新的难度系数（Ease Factor）
  const newEaseFactor = calculateNewEaseFactor(word.easeFactor, quality);
  
  // 更新学习统计
  const newCorrectCount = quality >= 3 ? word.correctCount + 1 : word.correctCount;
  const newWrongCount = quality < 3 ? word.wrongCount + 1 : word.wrongCount;
  
  // 确定新的学习状态和阶段
  let newStage = word.stage;
  let newLearningStatus = word.learningStatus;
  let newInterval = word.interval;
  let masteredDate = word.masteredDate;
  
  if (quality === 0) {
    // 又错了：重置回初始阶段
    newStage = 0;
    newInterval = 1;
    newLearningStatus = 'learning';
  } else if (quality === 1) {
    // 太困难：降低一个阶段
    newStage = Math.max(0, word.stage - 1);
    newInterval = STAGE_INTERVALS[newStage as keyof typeof STAGE_INTERVALS] || 1;
    newLearningStatus = 'learning';
  } else if (quality === 2) {
    // 困难：保持当前阶段但更新间隔
    newInterval = Math.max(1, Math.floor(word.interval * 0.8));
    newLearningStatus = 'learning';
  } else if (quality >= 3) {
    // 一般、容易、太简单：提升阶段
    newStage = Math.min(5, word.stage + 1);
    newInterval = STAGE_INTERVALS[newStage as keyof typeof STAGE_INTERVALS] || 30;
    
    if (newStage >= 5) {
      newLearningStatus = 'mastered';
      masteredDate = now;
    } else {
      newLearningStatus = 'review';
    }
  }
  
  // 计算下次复习时间
  const nextReviewDate = now + newInterval * 24 * 60 * 60 * 1000;
  
  return {
    ...word,
    stage: newStage,
    interval: newInterval,
    easeFactor: newEaseFactor,
    learningStatus: newLearningStatus,
    nextReviewDate,
    lastReviewDate: now,
    reviewCount: word.reviewCount + 1,
    correctCount: newCorrectCount,
    wrongCount: newWrongCount,
    lastWrongDate: quality < 3 ? now : word.lastWrongDate,
    masteredDate,
  };
}

/**
 * 计算新的难度系数
 * Anki 的 SM-2 公式：
 * EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
 * 
 * @param currentEaseFactor 当前难度系数
 * @param quality 答题质量 (0-5)
 * @returns 新的难度系数
 */
function calculateNewEaseFactor(currentEaseFactor: number, quality: StudyQuality): number {
  const newFactor = currentEaseFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  
  // 限制在最小和最大范围内
  return Math.max(MINIMUM_EASE_FACTOR, Math.min(MAXIMUM_EASE_FACTOR, newFactor));
}

/**
 * 创建一个新词（刚导入或创建）
 * @param word 基础词汇信息
 * @returns 完整的 WordItem 对象
 */
export function createNewWord(word: Partial<WordItem>): WordItem {
  const now = Date.now();
  return {
    word: word.word || '',
    phonetic: word.phonetic || '',
    definition: word.definition || '',
    translation: word.translation || '',
    example: word.example || '',
    topic: word.topic || 'General',
    
    // SRS 初始状态
    learningStatus: 'new',
    stage: 0,
    interval: 1,
    easeFactor: INITIAL_EASE_FACTOR,
    nextReviewDate: now,
    lastReviewDate: 0,
    createdDate: now,
    
    // 学习统计
    reviewCount: 0,
    correctCount: 0,
    wrongCount: 0,
    
    // 可选扩展信息
    synonyms: word.synonyms || [],
    antonyms: word.antonyms || [],
    collocations: word.collocations || [],
    wordFamily: word.wordFamily || [],
    personalTags: word.personalTags || [],
    isFavorite: word.isFavorite || false,
  };
}

/**
 * 获取学习进度的星级表示
 * @param learningStatus 学习状态
 * @returns 星级 0-5
 */
export function getStarRating(learningStatus: LearningStatus): number {
  switch (learningStatus) {
    case 'new':
      return 0;
    case 'learning':
      return 1;
    case 'review':
      return 2;
    case 'lapsed':
      return 1;
    case 'mastered':
      return 5;
    default:
      return 0;
  }
}

/**
 * 获取学习状态的中文描述
 */
export function getStatusLabel(learningStatus: LearningStatus): string {
  const labels = {
    new: '新词',
    learning: '学习中',
    review: '复习中',
    lapsed: '遗忘',
    mastered: '已掌握',
  };
  return labels[learningStatus] || '未知';
}

/**
 * 获取学习质量的中文描述
 */
export function getQualityLabel(quality: StudyQuality): string {
  const labels = {
    0: '又错了',
    1: '太困难',
    2: '困难',
    3: '一般',
    4: '容易',
    5: '太简单',
  };
  return labels[quality] || '未知';
}

/**
 * 计算距离下次复习还有多少天
 * @param nextReviewDate 下次复习时间戳
 * @returns 天数（如果为负数表示已逾期）
 */
export function getDaysUntilNextReview(nextReviewDate: number): number {
  const now = Date.now();
  const diffMs = nextReviewDate - now;
  const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  return diffDays;
}

/**
 * 检查单词是否应该复习（已逾期）
 */
export function isDueForReview(word: WordItem): boolean {
  const now = Date.now();
  return word.nextReviewDate <= now;
}

/**
 * 获取单词的准确率
 */
export function getAccuracyRate(word: WordItem): number {
  if (word.reviewCount === 0) return 0;
  return (word.correctCount / word.reviewCount) * 100;
}

/**
 * 根据学习状态推荐下一个学习焦点
 */
export function getNextStudyFocus(word: WordItem): string {
  const accuracy = getAccuracyRate(word);
  
  if (word.learningStatus === 'new') {
    return '新词：多复习定义和例句';
  }
  
  if (accuracy < 50) {
    return '低准确率：这个词对你来说很困难，建议多复习例句';
  }
  
  if (accuracy < 80) {
    return '中等准确率：继续练习，快要掌握了';
  }
  
  return '高准确率：保持学习进度';
}

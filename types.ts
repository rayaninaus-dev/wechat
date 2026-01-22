export const SRS_MAX_STAGE = 5; // Graduation stage (approx 1 month)

export type LearningStatus = 'new' | 'learning' | 'review' | 'mastered' | 'lapsed';
export type StudyQuality = 0 | 1 | 2 | 3 | 4 | 5; // 0=又错了, 1=太困难, 2=困难, 3=一般, 4=容易, 5=太简单

export interface WordItem {
  // Basic info
  word: string;
  phonetic: string;
  definition: string;
  translation: string;
  example: string;
  topic: string;
  
  // Extended content
  synonyms?: string[];           // 同义词
  antonyms?: string[];           // 反义词
  collocations?: string[];       // 搭配短语 (e.g., "appropriate for", "appropriate time")
  wordFamily?: string[];         // 词族 (e.g., appropriate, inappropriately, inappropriateness)
  
  // User interaction
  userNotes?: string;            // 个人笔记
  personalTags?: string[];       // 个人标签
  isFavorite?: boolean;          // 收藏标记
  
  // SRS 学习系统（Anki-like）
  learningStatus: LearningStatus;
  stage: number;                 // 0-5 阶段
  interval: number;              // 当前间隔天数
  easeFactor: number;            // Anki难度系数 (1.3-2.5)，初始值 2.5
  
  // 学习历史
  nextReviewDate: number;        // Timestamp - 下次复习时间
  lastReviewDate: number;        // Timestamp - 最后复习时间
  createdDate: number;           // Timestamp - 创建时间
  masteredDate?: number;         // Timestamp - 掌握时间
  
  // 学习统计
  reviewCount: number;           // 总复习次数
  correctCount: number;          // 正确次数
  wrongCount: number;            // 错误次数
  lastWrongDate?: number;        // 最后出错时间
  
  // 旧字段（向后兼容）
  masteryLevel?: number;         // Visual stars (0-3) - 已弃用，使用 learningStatus 替代
}

export enum ViewState {
  HOME = 'HOME',
  STUDY = 'STUDY',
  STATS = 'STATS',
  PROFILE = 'PROFILE',
  STUDY_NEW = 'STUDY_NEW',
  STUDY_REVIEW = 'STUDY_REVIEW',
  STUDY_SHUFFLE = 'STUDY_SHUFFLE'
}

export interface UserStats {
  totalWordsLearned: number;
  streakDays: number;
  lastStudyDate: string; // YYYY-MM-DD
  todayCount: number;
}

export enum Difficulty {
  EASY = 'Elementary',
  MEDIUM = 'Intermediate',
  HARD = 'Advanced',
  TOEFL = 'TOEFL',
  IELTS = 'IELTS',
  BUSINESS = 'Business'
}

export interface TopicStats {
  topic: string;
  newCount: number;
  learningCount: number;
  dueCount: number;
  masteredCount: number;
}

// 学习会话记录
export interface StudySession {
  id: string;
  date: string;                 // YYYY-MM-DD
  topicId: string;
  wordsStudied: number;
  correctCount: number;
  correctRate: number;          // 0-1
  duration: number;             // 秒
  sessionType: 'new' | 'review' | 'test';
  wordResults: {
    wordId: string;
    quality: StudyQuality;
    timeSpent: number;          // 秒
  }[];
}

// 学习统计数据（用于图表和分析）
export interface DailyStats {
  date: string;                 // YYYY-MM-DD
  newWordsAdded: number;
  wordsReviewed: number;
  correctCount: number;
  sessionCount: number;
  totalMinutes: number;
  correctRate: number;
}

// 成就系统
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate?: number;       // Timestamp - null if not unlocked
  category: 'streak' | 'milestone' | 'accuracy' | 'consistency';
}

// 扩展的用户统计
export interface ExtendedUserStats extends UserStats {
  totalSessionsCompleted: number;
  averageAccuracy: number;     // 0-1
  longestStreak: number;
  totalMinutesStudied: number;
  totalWordsReviewed: number;
  unlockedAchievements: string[]; // Achievement IDs
}
export const SRS_MAX_STAGE = 5; // Graduation stage (approx 1 month)

export interface WordItem {
  word: string;
  phonetic: string;
  definition: string;
  translation: string;
  example: string;
  topic: string; // Category this word belongs to
  masteryLevel: number; // Visual stars (0-3)
  
  // SRS Fields
  // -1: Unlearned (New)
  // 0 to SRS_MAX_STAGE-1: Learning/Reviewing
  // SRS_MAX_STAGE: Graduated/Mastered
  stage: number; 
  nextReviewDate: number; // Timestamp
  lastReview: number; // Timestamp
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
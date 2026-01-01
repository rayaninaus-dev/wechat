import { WordItem, SRS_MAX_STAGE } from '../types';
import { getPresetWords } from './presetData';
import { wx } from '../utils/wx';

const STORAGE_KEY_WORDS = 'wevocab_words';
const STORAGE_KEY_STATS = 'wevocab_stats';

// Ebbinghaus-style intervals in days
const INTERVALS = [0.5, 1, 3, 7, 15, 30];

export const getLocalWords = (): WordItem[] => {
  const data = wx.getStorageSync(STORAGE_KEY_WORDS);
  return data ? data : [];
};

export const saveLocalWords = (words: WordItem[]) => {
  wx.setStorageSync(STORAGE_KEY_WORDS, words);
};

export const addWords = (newWords: WordItem[]) => {
  const existing = getLocalWords();
  // Avoid duplicates based on word text
  const uniqueNew = newWords.filter(nw => !existing.some(ew => ew.word === nw.word));
  const updated = [...existing, ...uniqueNew];
  saveLocalWords(updated);
  return updated;
};

// Initialize with presets if empty or if specific topics are missing
export const initializePresets = () => {
    const currentWords = getLocalWords();
    if (currentWords.length < 5) {
        // If library is very small, inject all presets
        addWords(getPresetWords());
    } else {
        addWords(getPresetWords());
    }
};

// Get stats for a specific topic
export const getTopicStats = (topic: string) => {
  const words = getLocalWords().filter(w => w.topic === topic);
  const now = Date.now();

  return {
    topic,
    newCount: words.filter(w => w.stage === -1).length,
    learningCount: words.filter(w => w.stage >= 0 && w.stage < SRS_MAX_STAGE).length,
    dueCount: words.filter(w => w.stage >= 0 && w.stage < SRS_MAX_STAGE && w.nextReviewDate <= now).length,
    masteredCount: words.filter(w => w.stage >= SRS_MAX_STAGE).length
  };
};

// Get words ready for "New Learning" session for a topic
export const getNewWordsForTopic = (topic: string, limit: number = 5): WordItem[] => {
  const words = getLocalWords().filter(w => w.topic === topic && w.stage === -1);
  return words.slice(0, limit);
};

// Get words ready for "Review" session for a topic
export const getDueWordsForTopic = (topic: string): WordItem[] => {
  const now = Date.now();
  const words = getLocalWords().filter(w => 
    w.topic === topic && 
    w.stage >= 0 && 
    w.stage < SRS_MAX_STAGE && 
    w.nextReviewDate <= now
  );
  // Sort by overdue time (most overdue first)
  return words.sort((a, b) => a.nextReviewDate - b.nextReviewDate);
};

// Get all words currently known (for exclusion list in generator)
export const getAllKnownWords = (): string[] => {
  return getLocalWords().map(w => w.word);
};

// Update a word after a study session
export const updateWordProgress = (word: WordItem, isRemembered: boolean): WordItem[] => {
  const words = getLocalWords();
  const index = words.findIndex(w => w.word === word.word);
  
  if (index === -1) return words;

  const now = Date.now();
  let currentStage = words[index].stage;
  
  let newStage = currentStage;
  let nextReview = now;

  // Handle "New" words (Stage -1) transitioning to Learning
  if (currentStage === -1) {
    if (isRemembered) {
      newStage = 1; // Jump start
    } else {
      newStage = 0; // Start at beginning
    }
  } else {
    // Handle Review words
    if (isRemembered) {
      newStage = currentStage + 1;
    } else {
      // Forgot: Reset drastically
      newStage = Math.max(0, currentStage - 2); 
    }
  }

  // Calculate Next Review Date if not mastered
  if (newStage < SRS_MAX_STAGE) {
    const daysToAdd = INTERVALS[newStage] || 1;
    nextReview = now + (daysToAdd * 24 * 60 * 60 * 1000);
  } else {
    // Mastered
    nextReview = 0; // No next review
  }

  // Update Mastery Visuals (0-3 stars) roughly mapping to stages
  const mastery = Math.min(3, Math.floor(newStage / 2));

  words[index] = {
    ...words[index],
    stage: newStage,
    masteryLevel: mastery,
    lastReview: now,
    nextReviewDate: nextReview
  };

  saveLocalWords(words);
  return words;
};

// User Stats Helpers
export const getUserStats = () => {
    return wx.getStorageSync(STORAGE_KEY_STATS) || null;
}

export const saveUserStats = (stats: any) => {
    wx.setStorageSync(STORAGE_KEY_STATS, stats);
}

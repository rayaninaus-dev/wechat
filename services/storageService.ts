import { WordItem, SRS_MAX_STAGE, LearningStatus, StudyQuality } from '../types';
import { getPresetWords } from './presetData';
import { wx } from '../utils/wx';
import { updateWordProgress as srsUpdateWordProgress, createNewWord, isDueForReview } from './srsService';

const STORAGE_KEY_WORDS = 'wevocab_words';
const STORAGE_KEY_STATS = 'wevocab_stats';
const STORAGE_KEY_SESSIONS = 'wevocab_sessions';

// 迁移老版本数据到新格式
function migrateOldWord(word: any): WordItem {
  // 如果已经是新格式，直接返回
  if (word.learningStatus) {
    return word;
  }
  
  // 将旧格式转换为新格式
  const stage = word.stage || -1;
  let learningStatus: LearningStatus = 'new';
  
  if (stage === -1) {
    learningStatus = 'new';
  } else if (stage >= SRS_MAX_STAGE) {
    learningStatus = 'mastered';
  } else if (stage > 0) {
    learningStatus = 'review';
  } else {
    learningStatus = 'learning';
  }

  return {
    ...word,
    learningStatus,
    interval: word.interval || 1,
    easeFactor: word.easeFactor || 2.5,
    reviewCount: word.reviewCount || 0,
    correctCount: word.correctCount || 0,
    wrongCount: word.wrongCount || 0,
    createdDate: word.createdDate || Date.now(),
    lastReviewDate: word.lastReview || 0,
  };
}

export const getLocalWords = (): WordItem[] => {
  const data = wx.getStorageSync(STORAGE_KEY_WORDS);
  if (!data) return [];
  
  // 迁移旧版本数据
  return data.map(migrateOldWord);
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
    newCount: words.filter(w => w.learningStatus === 'new').length,
    learningCount: words.filter(w => w.learningStatus === 'learning').length,
    dueCount: words.filter(w => (w.learningStatus === 'learning' || w.learningStatus === 'review') && w.nextReviewDate <= now).length,
    masteredCount: words.filter(w => w.learningStatus === 'mastered').length
  };
};

// Get words ready for "New Learning" session for a topic
export const getNewWordsForTopic = (topic: string, limit: number = 5): WordItem[] => {
  const words = getLocalWords().filter(w => w.topic === topic && w.learningStatus === 'new');
  return words.slice(0, limit);
};

// Get words ready for "Review" session for a topic
export const getDueWordsForTopic = (topic: string): WordItem[] => {
  const now = Date.now();
  const words = getLocalWords().filter(w => 
    w.topic === topic && 
    (w.learningStatus === 'learning' || w.learningStatus === 'review' || w.learningStatus === 'lapsed') && 
    w.nextReviewDate <= now
  );
  // Sort by overdue time (most overdue first)
  return words.sort((a, b) => a.nextReviewDate - b.nextReviewDate);
};

// Get all words currently known (for exclusion list in generator)
export const getAllKnownWords = (): string[] => {
  return getLocalWords().map(w => w.word);
};

// Update a word after a study session using SRS algorithm
export const updateWordProgress = (word: WordItem, quality: StudyQuality): WordItem[] => {
  const words = getLocalWords();
  const index = words.findIndex(w => w.word === word.word);
  
  if (index === -1) return words;

  // 使用 SRS 服务更新单词进度
  const updatedWord = srsUpdateWordProgress(words[index], quality);
  
  words[index] = updatedWord;
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

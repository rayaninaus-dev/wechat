import { WordItem, Difficulty } from '../types';

export const generateWordBatch = async (
  topic: string,
  difficulty: Difficulty,
  excludeWords: string[],
  count: number = 5
): Promise<WordItem[]> => {
  try {
    const res = await fetch('/api/generate-words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, excludeWords, count })
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const rawData = await res.json();

    return rawData.map((item: any) => ({
      ...item,
      topic,
      masteryLevel: 0,
      stage: -1,
      lastReview: 0,
      nextReviewDate: 0
    }));
  } catch (error) {
    console.error('Error generating words:', error);
    throw error;
  }
};

export const generatePronunciation = async (text: string): Promise<string> => {
  try {
    const res = await fetch('/api/generate-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    return data.base64Audio || '';
  } catch (error) {
    console.error('Error generating speech:', error);
    return '';
  }
};

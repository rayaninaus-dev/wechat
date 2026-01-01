import { GoogleGenAI, Type, Modality } from "@google/genai";
import { WordItem, Difficulty } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWordBatch = async (
  topic: string, 
  difficulty: Difficulty, 
  excludeWords: string[],
  count: number = 5
): Promise<WordItem[]> => {
  
  try {
    // Construct the exclusion list string
    const excludeString = excludeWords.length > 0 
      ? `IMPORTANT: You must NOT generate any of the following words: ${excludeWords.join(', ')}.`
      : '';

    const prompt = `Generate a list of ${count} high-frequency, advanced English vocabulary words specifically found in real IELTS exams (Academic Reading/Writing or Speaking) related to the topic "${topic}".
    The words should be suitable for a ${difficulty} learner aiming for a high band score (Band 7.0+).
    
    ${excludeString}
    
    Requirements:
    1. Words must be sophisticated and academically relevant (e.g., words used in IELTS Writing Task 2 or Reading passages).
    2. Provide a clear, precise English definition.
    3. Provide a Chinese translation (Simplified Chinese).
    4. Provide one complex example sentence relevant to an IELTS context (e.g., an argument for an essay or a description of a trend).
    
    Output Format: JSON Array`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              phonetic: { type: Type.STRING },
              definition: { type: Type.STRING },
              translation: { type: Type.STRING },
              example: { type: Type.STRING },
            },
            required: ['word', 'phonetic', 'definition', 'translation', 'example']
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Map to WordItem structure
    return rawData.map((item: any) => ({
      ...item,
      topic: topic,
      masteryLevel: 0,
      stage: -1, // -1 indicates "Unlearned" / "New"
      lastReview: 0,
      nextReviewDate: 0 
    }));

  } catch (error) {
    console.error("Error generating words:", error);
    throw error;
  }
};

export const generatePronunciation = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");

    return base64Audio;

  } catch (error) {
    console.error("Error generating speech:", error);
    return "";
  }
};

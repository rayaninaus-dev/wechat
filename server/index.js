require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenAI, Type, Modality } = require('@google/genai');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

const PORT = process.env.PORT || 4000;

if (!process.env.GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set. Set it in your environment to use AI features.');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/generate-words', async (req, res) => {
  try {
    const { topic = 'General', difficulty = 'IELTS', excludeWords = [], count = 5 } = req.body;

    const excludeString = excludeWords.length > 0 ? `IMPORTANT: You must NOT generate any of the following words: ${excludeWords.join(', ')}.` : '';

    const prompt = `Generate a list of ${count} high-frequency, advanced English vocabulary words specifically found in real IELTS exams (Academic Reading/Writing or Speaking) related to the topic "${topic}".
The words should be suitable for a ${difficulty} learner aiming for a high band score (Band 7.0+).

${excludeString}

Requirements:
1. Words must be sophisticated and academically relevant.
2. Provide a clear, precise English definition.
3. Provide a Chinese translation (Simplified Chinese).
4. Provide one complex example sentence relevant to an IELTS context.
5. Provide 2-3 synonyms (words with similar meaning).
6. Provide 1-2 antonyms (words with opposite meaning) if applicable.
7. Provide 2-3 common collocations (phrases the word is commonly used with).
8. Provide 2-3 related word forms (same word family, e.g., adjective form, adverb form, noun form).

Output Format: JSON Array of objects with fields: word, phonetic, definition, translation, example, synonyms (array), antonyms (array), collocations (array), wordFamily (array)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
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
              synonyms: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              antonyms: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              collocations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              wordFamily: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['word', 'phonetic', 'definition', 'translation', 'example']
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    res.json(rawData);
  } catch (err) {
    console.error('generate-words error', err);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

app.post('/generate-tts', async (req, res) => {
  try {
    const { text = '' } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return res.status(500).json({ error: 'No audio data returned' });

    res.json({ base64Audio });
  } catch (err) {
    console.error('generate-tts error', err);
    res.status(500).json({ error: 'TTS generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
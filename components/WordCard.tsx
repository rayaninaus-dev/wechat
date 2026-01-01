import React, { useState, useEffect } from 'react';
import { WordItem } from '../types';
import { Volume2, ThumbsUp, HelpCircle } from 'lucide-react';
import { playAudioData } from '../services/audioService';
import { generatePronunciation } from '../services/geminiService';
import { View, Text, Button } from './WxComponents';

interface WordCardProps {
  word: WordItem;
  onNext: (remembered: boolean) => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, onNext }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [audioCache, setAudioCache] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
    setAudioCache(null);
  }, [word]);

  const handlePlayAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioCache) {
      playAudioData(audioCache);
    } else {
      setIsLoadingAudio(true);
      const audioData = await generatePronunciation(word.word);
      setAudioCache(audioData);
      setIsLoadingAudio(false);
      playAudioData(audioData);
    }
  };

  return (
    <View className="w-full h-full flex flex-col justify-end pb-24 relative">
      
      {/* The Card Container */}
      <View className="w-full flex-1 mb-6 perspective-1000 relative group" onClick={() => setIsFlipped(!isFlipped)}>
        <View className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front of Card */}
          <View className="absolute w-full h-full backface-hidden bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 flex flex-col items-center justify-center p-8 border border-white/50">
            <View className="w-16 h-1 bg-gray-100 rounded-full mb-auto" />
            
            <View className="flex-1 flex flex-col items-center justify-center w-full">
              <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6 bg-gray-50 px-3 py-1 rounded-full">
                {word.topic}
              </Text>
              <Text className="text-5xl font-extrabold text-gray-800 mb-4 text-center tracking-tight leading-tight block">
                {word.word}
              </Text>
              
              <View 
                onClick={handlePlayAudio}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <Volume2 size={20} className={`${isLoadingAudio ? 'text-indigo-300 animate-pulse' : 'text-indigo-600'}`} />
                <Text className="text-indigo-900 font-mono text-lg font-medium">{word.phonetic}</Text>
              </View>
            </View>

            <Text className="mt-auto text-gray-300 text-sm font-medium animate-pulse">Tap to flip</Text>
          </View>

          {/* Back of Card */}
          <View className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 flex flex-col p-8 border border-white/50 overflow-y-auto no-scrollbar">
            {/* Header */}
            <View className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
              <Text className="text-2xl font-bold text-gray-800">{word.word}</Text>
              <View onClick={handlePlayAudio} className="p-2 bg-gray-50 rounded-full text-gray-600">
                <Volume2 size={20} />
              </View>
            </View>
            
            <View className="space-y-6">
              <View>
                <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">Meaning</Text>
                <Text className="text-xl text-gray-800 leading-snug font-medium block">{word.definition}</Text>
                <Text className="text-gray-500 mt-1 font-medium block">{word.translation}</Text>
              </View>

              <View className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50">
                <Text className="text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-2 block">Context</Text>
                <Text className="text-indigo-900/80 italic text-base leading-relaxed block">"{word.example}"</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons using Wx Button Component */}
      <View className={`flex gap-4 transition-all duration-500 transform ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
        <Button 
          type="warn" 
          plain 
          onClick={(e) => { e.stopPropagation(); onNext(false); }}
          className="flex-1 h-16 rounded-2xl !bg-orange-50 !border-orange-100 !text-orange-600 font-bold text-lg hover:!bg-orange-100"
        >
            <View className="flex items-center gap-2">
                <HelpCircle size={24} strokeWidth={2.5} />
                Unsure
            </View>
        </Button>
        <Button 
          type="primary"
          onClick={(e) => { e.stopPropagation(); onNext(true); }}
          className="flex-1 h-16 rounded-2xl font-bold text-lg shadow-lg shadow-green-200"
        >
            <View className="flex items-center gap-2">
                <ThumbsUp size={24} strokeWidth={2.5} />
                Got it
            </View>
        </Button>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </View>
  );
};

export default WordCard;
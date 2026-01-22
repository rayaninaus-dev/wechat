import React, { useState, useEffect } from 'react';
import { WordItem, StudyQuality } from '../types';
import { Volume2, Lightbulb } from 'lucide-react';
import { playAudioData } from '../services/audioService';
import { generatePronunciation } from '../services/geminiService';
import { View, Text } from './WxComponents';
import { getAccuracyRate, getDaysUntilNextReview, getStatusLabel } from '../services/srsService';

interface WordCardProps {
  word: WordItem;
  onNext: (quality: StudyQuality) => void;
  currentIndex: number;
  totalCount: number;
}

type FeedbackLevel = 0 | 1 | 2 | 3 | 4 | 5;

interface FeedbackOption {
  quality: FeedbackLevel;
  label: string;
  emoji: string;
  description: string;
  color: string;
  bgColor: string;
}

const FEEDBACK_OPTIONS: FeedbackOption[] = [
  {
    quality: 0,
    label: '又错了',
    emoji: '😫',
    description: '彻底遗忘了',
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100'
  },
  {
    quality: 1,
    label: '太困难',
    emoji: '😤',
    description: '太难了',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100'
  },
  {
    quality: 2,
    label: '困难',
    emoji: '😕',
    description: '有点困难',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100'
  },
  {
    quality: 3,
    label: '一般',
    emoji: '😐',
    description: '还可以',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100'
  },
  {
    quality: 4,
    label: '容易',
    emoji: '🙂',
    description: '比较容易',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100'
  },
  {
    quality: 5,
    label: '太简单',
    emoji: '😎',
    description: '非常简单',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100'
  }
];

const WordCard: React.FC<WordCardProps> = ({ word, onNext, currentIndex, totalCount }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [audioCache, setAudioCache] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<FeedbackLevel | null>(null);

  useEffect(() => {
    setIsFlipped(false);
    setAudioCache(null);
    setSelectedQuality(null);
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

  const handleQualitySelect = (quality: FeedbackLevel) => {
    setSelectedQuality(quality);
    setTimeout(() => {
      onNext(quality as StudyQuality);
    }, 150);
  };

  const accuracy = getAccuracyRate(word);
  const daysUntilNext = getDaysUntilNextReview(word.nextReviewDate);
  const progressPercent = ((currentIndex + 1) / totalCount) * 100;

  return (
    <View className="w-full h-full flex flex-col justify-between pb-4 relative">
      {/* 进度条 */}
      <View className="w-full h-1 bg-gray-200 dark:bg-gray-700">
        <View 
          className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </View>

      {/* 顶部信息栏 */}
      <View className="px-6 pt-4 pb-2 flex justify-between items-center bg-white/50 dark:bg-black/30 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <View className="flex items-center gap-2">
          <View className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-700">
            <Text className="text-xs font-bold text-blue-700 dark:text-blue-400">
              {currentIndex + 1}/{totalCount}
            </Text>
          </View>
          <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {word.topic}
          </Text>
        </View>
        <View className="flex items-center gap-3 text-xs font-medium">
          {word.reviewCount > 0 && (
            <View className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-700">
              <View className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400" />
              <Text className="text-green-700 dark:text-green-400">{accuracy.toFixed(0)}%</Text>
            </View>
          )}
          {word.reviewCount > 0 && (
            <View className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Text className={daysUntilNext < 0 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-600 dark:text-gray-400'}>
                {daysUntilNext < 0 ? `逾期${-daysUntilNext}d` : `${daysUntilNext}d后`}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 卡片容器 */}
      <View className="flex-1 px-4 mb-4 perspective-1000 relative group">
        <View 
          className={`relative w-full h-full duration-500 transform-style-3d transition-all cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* 正面 - 单词 */}
          <View className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-8">
            <View className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
              {word.reviewCount > 0 && (
                <View className="mb-8 text-center">
                  <Text className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-3 block">
                    {getStatusLabel(word.learningStatus)}
                  </Text>
                  <View className="flex justify-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <View
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i < Math.ceil(word.stage) 
                            ? 'bg-blue-500 dark:bg-blue-400' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </View>
                </View>
              )}

              <Text className="text-7xl font-black text-gray-800 dark:text-white mb-6 text-center tracking-tight leading-tight block">
                {word.word}
              </Text>
              
              <View 
                onClick={handlePlayAudio}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all cursor-pointer transform active:scale-95 ${
                  isLoadingAudio 
                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-700'
                }`}
              >
                <Volume2 
                  size={22} 
                  className={`${isLoadingAudio ? 'text-blue-600 dark:text-blue-400 animate-pulse' : 'text-blue-500 dark:text-blue-400'}`}
                />
                <Text className="text-gray-800 dark:text-gray-200 font-mono text-lg font-bold">{word.phonetic}</Text>
              </View>
            </View>

            <Text className="mt-auto text-gray-400 dark:text-gray-600 text-sm font-medium animate-bounce">
              {isFlipped ? '↓ 返回' : '↑ 查看含义'}
            </Text>
          </View>

          {/* 背面 - 含义和例句 */}
          <View className="absolute w-full h-full backface-hidden rotate-y-180 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col p-8 overflow-y-auto no-scrollbar">
            <View className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 relative z-10">
              <View className="flex-1">
                <Text className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 block">
                  Definition
                </Text>
                <Text className="text-xl font-bold text-gray-800 dark:text-white">{word.word}</Text>
              </View>
              <View 
                onClick={handlePlayAudio} 
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-blue-500 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 transition-all cursor-pointer transform active:scale-90 ml-3 flex-shrink-0"
              >
                <Volume2 size={20} />
              </View>
            </View>
            
            <View className="space-y-4 flex-1 relative z-10 text-sm">
              {/* 定义 */}
              <View>
                <Text className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 block">
                  Meaning
                </Text>
                <Text className="text-base text-gray-800 dark:text-gray-200 leading-relaxed font-medium block">
                  {word.definition}
                </Text>
              </View>

              {/* 翻译 */}
              <View>
                <Text className="text-xs font-black text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-1.5 block">
                  Translation
                </Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300 font-semibold block">{word.translation}</Text>
              </View>

              {/* 例句 */}
              <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <Text className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 block">
                  Example
                </Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed block">
                  "{word.example}"
                </Text>
              </View>

              {/* 同义词 */}
              {word.synonyms?.length ? (
                <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <Text className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2.5 block">
                    Synonyms
                  </Text>
                  <View className="flex flex-wrap gap-2">
                    {word.synonyms.slice(0, 4).map((syn, i) => (
                      <View key={i} className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-700 text-xs font-semibold text-blue-700 dark:text-blue-400 shadow-sm">
                        {syn}
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* 反义词 */}
              {word.antonyms?.length ? (
                <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                  <Text className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider mb-2.5 block">
                    Antonyms
                  </Text>
                  <View className="flex flex-wrap gap-2">
                    {word.antonyms.slice(0, 4).map((ant, i) => (
                      <View key={i} className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-700 text-xs font-semibold text-red-700 dark:text-red-400 shadow-sm">
                        {ant}
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* 常见搭配 */}
              {word.collocations?.length ? (
                <View className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                  <Text className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2.5 block">
                    Collocations
                  </Text>
                  <View className="flex flex-wrap gap-2">
                    {word.collocations.slice(0, 4).map((col, i) => (
                      <View key={i} className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-700 text-xs font-semibold text-purple-700 dark:text-purple-400 shadow-sm">
                        {col}
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* 词族 */}
              {word.wordFamily?.length ? (
                <View className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                  <Text className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2.5 block">
                    Word Family
                  </Text>
                  <View className="flex flex-wrap gap-2">
                    {word.wordFamily.slice(0, 4).map((wf, i) => (
                      <View key={i} className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-700 text-xs font-semibold text-amber-700 dark:text-amber-400 shadow-sm">
                        {wf}
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {word.reviewCount > 3 && accuracy < 60 && (
                <View className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700 flex gap-3 items-start">
                  <Lightbulb size={20} className="text-orange-500 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <View>
                    <Text className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1.5 block">
                      Learning Tip
                    </Text>
                    <Text className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
                      You're struggling with this word. Review the synonyms and example sentences more carefully.
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* 5 级反馈按钮 */}
      <View className={`px-4 pb-2 transition-all duration-500 ${
        isFlipped ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'
      }`}>
        <Text className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 block">
          How did it go?
        </Text>
        
        <View className="grid grid-cols-3 gap-2 mb-3">
          {FEEDBACK_OPTIONS.slice(0, 3).map((option) => (
            <View
              key={option.quality}
              onClick={() => handleQualitySelect(option.quality)}
              className={`p-3 rounded-lg border-2 transition-all transform cursor-pointer text-center active:scale-95 ${
                selectedQuality === option.quality
                  ? `border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-sm`
                  : `border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 active:shadow-sm`
              }`}
            >
              <Text className="text-3xl mb-1 block">{option.emoji}</Text>
              <Text className={`text-[10px] font-bold ${option.color}`}>{option.label}</Text>
            </View>
          ))}
        </View>

        <View className="grid grid-cols-3 gap-2">
          {FEEDBACK_OPTIONS.slice(3).map((option) => (
            <View
              key={option.quality}
              onClick={() => handleQualitySelect(option.quality)}
              className={`p-3 rounded-lg border-2 transition-all transform cursor-pointer text-center active:scale-95 ${
                selectedQuality === option.quality
                  ? `border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-sm`
                  : `border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 active:shadow-sm`
              }`}
            >
              <Text className="text-3xl mb-1 block">{option.emoji}</Text>
              <Text className={`text-[10px] font-bold ${option.color}`}>{option.label}</Text>
            </View>
          ))}
        </View>
      </View>

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
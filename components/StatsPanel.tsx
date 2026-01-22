import React, { useState, useEffect } from 'react';
import { WordItem, TopicStats } from '../types';
import { View, Text, ScrollView } from './WxComponents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getTodayStats, getTopicStudyStats, getMostDifficultWords, getProgressPercentage, getStudyTrend, getStudySuggestions } from '../services/statsService';
import { TrendingUp, BookOpen, Zap, Target, AlertCircle } from 'lucide-react';

interface StatsPanel {
  words: WordItem[];
}

const StatsPanel: React.FC<StatsPanel> = ({ words }) => {
  const [todayStats, setTodayStats] = useState({
    sessionsCompleted: 0,
    wordsStudied: 0,
    totalMinutes: 0,
    averageAccuracy: 0
  });
  const [topicStats, setTopicStats] = useState<any[]>([]);
  const [difficulWords, setDifficulWords] = useState<WordItem[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [studyTrend, setStudyTrend] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setTodayStats(getTodayStats());
    setTopicStats(getTopicStudyStats(words));
    setDifficulWords(getMostDifficultWords(words, 5));
    setProgressPercent(getProgressPercentage(words));
    setStudyTrend(getStudyTrend(7));
    setSuggestions(getStudySuggestions(words));
  }, [words]);

  // 话题统计数据用于图表
  const topicChartData = topicStats.map(stat => ({
    name: stat.topic.substring(0, 6),
    'New': stat.newCount,
    'Learning': stat.learningCount,
    'Mastered': stat.masteredCount
  }));

  return (
    <ScrollView className="w-full h-full bg-white dark:bg-black">
      <View className="p-6 space-y-6 pb-20">
        {/* 今日统计概览 */}
        <View className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <View className="flex items-center gap-2 mb-4">
            <Zap size={20} className="text-blue-500 dark:text-blue-400" />
            <Text className="text-lg font-bold text-gray-800 dark:text-white">今日学习</Text>
          </View>

          <View className="grid grid-cols-2 gap-4">
            <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <Text className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">学习会话</Text>
              <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400">{todayStats.sessionsCompleted}</Text>
              <Text className="text-xs text-blue-600 dark:text-blue-400 mt-1">次</Text>
            </View>

            <View className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <Text className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-1">学习单词</Text>
              <Text className="text-3xl font-bold text-purple-600 dark:text-purple-400">{todayStats.wordsStudied}</Text>
              <Text className="text-xs text-purple-600 dark:text-purple-400 mt-1">个</Text>
            </View>

            <View className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <Text className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">学习时长</Text>
              <Text className="text-3xl font-bold text-green-600 dark:text-green-400">{todayStats.totalMinutes}</Text>
              <Text className="text-xs text-green-600 dark:text-green-400 mt-1">分钟</Text>
            </View>

            <View className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <Text className="text-sm text-orange-700 dark:text-orange-300 font-medium mb-1">准确率</Text>
              <Text className="text-3xl font-bold text-orange-600 dark:text-orange-400">{todayStats.averageAccuracy.toFixed(0)}%</Text>
              <Text className="text-xs text-orange-600 dark:text-orange-400 mt-1">正确</Text>
            </View>
          </View>
        </View>

        {/* 学习进度 */}
        <View className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <View className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-blue-500 dark:text-blue-400" />
            <Text className="text-lg font-bold text-gray-800 dark:text-white">学习进度</Text>
          </View>

          <View className="mb-4">
            <View className="flex justify-between items-center mb-2">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">总体掌握率</Text>
              <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">{progressPercent.toFixed(1)}%</Text>
            </View>
            <View className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <View 
                className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </View>

          <View className="grid grid-cols-3 gap-3">
            {topicStats.slice(0, 3).map((stat, i) => (
              <View key={i} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center border border-gray-200 dark:border-gray-700">
                <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium truncate">{stat.topic}</Text>
                <Text className="text-xl font-bold text-gray-800 dark:text-white mt-1">{stat.masteredCount}</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">已掌握</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 话题学习分布图 */}
        {topicChartData.length > 0 && (
          <View className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <View className="flex items-center gap-2 mb-4">
              <BarChart size={20} className="text-blue-500 dark:text-blue-400" />
              <Text className="text-lg font-bold text-gray-800 dark:text-white">各话题进度</Text>
            </View>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topicChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="New" fill="#3b82f6" />
                <Bar dataKey="Learning" fill="#06b6d4" />
                <Bar dataKey="Mastered" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </View>
        )}

        {/* 7天学习趋势 */}
        {studyTrend.length > 0 && (
          <View className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <View className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-blue-500 dark:text-blue-400" />
              <Text className="text-lg font-bold text-gray-800 dark:text-white">7日学习趋势</Text>
            </View>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={studyTrend} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  tickFormatter={(date) => new Date(date).getDate().toString()}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  labelFormatter={(date) => new Date(date as string).toLocaleDateString('zh-CN')}
                  formatter={(value: any) => typeof value === 'number' ? value.toFixed(0) : value}
                />
                <Line 
                  type="monotone" 
                  dataKey="averageAccuracy" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="准确率(%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </View>
        )}

        {/* 困难单词 */}
        {difficulWords.length > 0 && (
          <View className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <View className="flex items-center gap-2 mb-4">
              <AlertCircle size={20} className="text-red-500 dark:text-red-400" />
              <Text className="text-lg font-bold text-gray-800 dark:text-white">重点关注</Text>
            </View>
            <View className="space-y-2">
              {difficulWords.map((word, i) => (
                <View key={i} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <View>
                    <Text className="font-bold text-gray-800 dark:text-white">{word.word}</Text>
                    <Text className="text-xs text-gray-600 dark:text-gray-400">{word.translation}</Text>
                  </View>
                  <View className="text-right">
                    <Text className="text-sm font-bold text-red-600 dark:text-red-400">
                      {((word.correctCount / word.reviewCount) * 100).toFixed(0)}%
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">{word.reviewCount} 次复习</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 学习建议 */}
        {suggestions.length > 0 && (
          <View className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <View className="flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-blue-500 dark:text-blue-400" />
              <Text className="text-lg font-bold text-gray-800 dark:text-white">学习建议</Text>
            </View>
            <View className="space-y-2">
              {suggestions.map((suggestion, i) => (
                <View key={i} className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <View className="text-blue-500 dark:text-blue-400 flex-shrink-0">✨</View>
                  <Text className="text-sm text-blue-800 dark:text-blue-300">{suggestion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default StatsPanel;

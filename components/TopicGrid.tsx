import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from './WxComponents';
import { TopicStats } from '../types';
import { PlusCircle, CheckCircle, DownloadCloud, RefreshCw, Zap } from 'lucide-react';

interface TopicGridProps {
  topicStats: TopicStats[];
  isLoading: boolean;
  loadingTopic: string | null;
  getTopicGradient: (index: number) => string;
  onLearnNew: (topic: string) => void;
  onDownload: (topic: string) => void;
  onReview: (topic: string) => void;
}

type FilterType = 'all' | 'new' | 'due' | 'mastered';

const TopicGrid: React.FC<TopicGridProps> = ({
  topicStats,
  isLoading,
  loadingTopic,
  getTopicGradient,
  onLearnNew,
  onDownload,
  onReview,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');

  // Filter topics based on selected filter
  const filteredStats = topicStats.filter(t => {
    if (filter === 'new') return t.newCount > 0;
    if (filter === 'due') return t.dueCount > 0;
    if (filter === 'mastered') return t.masteredCount > 0;
    return true; // 'all'
  });

  // Sort by priority: due > new > in-progress > mastered
  const sortedStats = [...filteredStats].sort((a, b) => {
    const priorityA = a.dueCount > 0 ? 0 : a.newCount > 0 ? 1 : a.learningCount > 0 ? 2 : 3;
    const priorityB = b.dueCount > 0 ? 0 : b.newCount > 0 ? 1 : b.learningCount > 0 ? 2 : 3;
    return priorityA - priorityB;
  });

  const getStatusIcon = (topic: TopicStats) => {
    if (topic.dueCount > 0) return <Zap size={12} className="text-red-500" />;
    if (topic.newCount > 0) return <PlusCircle size={12} className="text-blue-500" />;
    if (topic.masteredCount === topic.learningCount + topic.newCount + topic.masteredCount + topic.dueCount) {
      return <CheckCircle size={12} className="text-green-500" />;
    }
    return null;
  };

  return (
    <View className="flex-1 flex flex-col pb-32">
      {/* Filter Tabs */}
      <View className="px-6 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <View className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(['all', 'new', 'due', 'mastered'] as const).map(f => (
            <Button
              key={f}
              size="small"
              type={filter === f ? 'primary' : 'default'}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                filter === f 
                  ? 'bg-blue-500 dark:bg-blue-600 border-blue-500 dark:border-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' && 'All'}
              {f === 'new' && 'New'}
              {f === 'due' && 'Due'}
              {f === 'mastered' && 'Done'}
            </Button>
          ))}
        </View>
      </View>

      {/* Grid Container */}
      <ScrollView scrollY className="flex-1 px-4">
        <View className="grid grid-cols-2 gap-3 pb-20 pt-3">
          {sortedStats.map((t, i) => (
            <View
              key={t.topic}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow active:shadow-none"
            >
              {/* Gradient Header */}
              <View
                className={`bg-gradient-to-br ${getTopicGradient(
                  topicStats.indexOf(t)
                )} p-3 text-white relative min-h-[100px] flex flex-col justify-between`}
              >
                {/* Topic Name */}
                <View className="flex justify-between items-start gap-2">
                  <Text className="font-bold text-sm leading-tight flex-1 line-clamp-2">
                    {t.topic}
                  </Text>
                  {getStatusIcon(t) && (
                    <View className="flex-shrink-0">
                      {getStatusIcon(t)}
                    </View>
                  )}
                </View>

                {/* Word Count */}
                <Text className="text-xs text-white/80 font-medium">
                  {t.learningCount + t.masteredCount}/{t.learningCount + t.newCount + t.masteredCount}
                </Text>
              </View>

              {/* Stats Section */}
              <View className="p-3 space-y-2">
                {/* Primary Stat */}
                {t.dueCount > 0 ? (
                  <View className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg p-2 border border-red-200 dark:border-red-800/30">
                    <Text className="text-xs font-semibold text-red-600 dark:text-red-400">Review</Text>
                    <Text className="text-base font-bold text-red-600 dark:text-red-400">{t.dueCount}</Text>
                  </View>
                ) : t.newCount > 0 ? (
                  <View className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800/30">
                    <Text className="text-xs font-semibold text-blue-600 dark:text-blue-400">New</Text>
                    <Text className="text-base font-bold text-blue-600 dark:text-blue-400">+{t.newCount}</Text>
                  </View>
                ) : (
                  <View className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800/30">
                    <Text className="text-xs font-semibold text-green-600 dark:text-green-400">Done</Text>
                    <Text className="text-base font-bold text-green-600 dark:text-green-400">
                      {t.masteredCount}/{t.learningCount + t.newCount + t.masteredCount}
                    </Text>
                  </View>
                )}

                {/* Mini Stats */}
                <View className="flex gap-2 text-xs">
                  <View className="flex-1 text-center">
                    <Text className="text-gray-500 dark:text-gray-400 font-semibold block text-[10px]">Learning</Text>
                    <Text className="text-gray-800 dark:text-gray-200 font-bold text-sm">{t.learningCount}</Text>
                  </View>
                  <View className="flex-1 text-center">
                    <Text className="text-gray-500 dark:text-gray-400 font-semibold block text-[10px]">Mastered</Text>
                    <Text className="text-green-600 dark:text-green-400 font-bold text-sm">{t.masteredCount}</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="px-3 pb-3 flex gap-2">
                {/* Primary Button */}
                <Button
                  type={t.newCount > 0 || t.dueCount > 0 ? 'primary' : 'default'}
                  size="small"
                  plain={t.newCount === 0 && t.dueCount === 0}
                  className={`flex-1 rounded-lg !h-9 !text-xs font-semibold ${
                    t.newCount > 0 || t.dueCount > 0
                      ? '!bg-blue-500 dark:!bg-blue-600 !border-blue-500 dark:!border-blue-600 !text-white'
                      : '!bg-gray-100 dark:!bg-gray-800 !border-gray-100 dark:!border-gray-800 !text-gray-400 dark:!text-gray-500'
                  }`}
                  onClick={() =>
                    t.dueCount > 0 ? onReview(t.topic) : onLearnNew(t.topic)
                  }
                >
                  {t.dueCount > 0 ? 'Review' : t.newCount > 0 ? 'Learn' : 'Done'}
                </Button>

                {/* Download Button */}
                <Button
                  size="small"
                  onClick={() => onDownload(t.topic)}
                  disabled={isLoading}
                  className="!w-9 !h-9 !px-0 rounded-lg !bg-gray-100 dark:!bg-gray-800 !border-gray-100 dark:!border-gray-800 !text-gray-600 dark:!text-gray-400 !flex !items-center !justify-center"
                >
                  {isLoading && loadingTopic === t.topic ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <DownloadCloud size={16} />
                  )}
                </Button>
              </View>
            </View>
          ))}
        </View>

        {/* Empty State */}
        {sortedStats.length === 0 && (
          <View className="flex items-center justify-center py-20">
            <View className="text-center">
              <Text className="text-gray-400 dark:text-gray-600 font-semibold mb-2">
                No courses
              </Text>
              <Text className="text-gray-400 dark:text-gray-600 text-sm">
                Try another filter
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TopicGrid;

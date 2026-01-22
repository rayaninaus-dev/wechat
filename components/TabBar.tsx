import React, { useEffect, useState } from 'react';
import { ViewState } from '../types';
import { Home, BookOpen, BarChart2, User, Zap } from 'lucide-react';
import { View, Text } from './WxComponents';
import { wx } from '../utils/wx';
import { getDueWordsForTopic } from '../services/storageService';

interface TabBarProps {
  currentView: ViewState;
}

const TabBar: React.FC<TabBarProps> = ({ currentView }) => {
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // Calculate total due words across all topics
    const topics = [
      "Environment", "Education", "Technology", 
      "Health & Science", "Work & Business", 
      "Society & Culture", "Government & Law", 
      "Media & Advertising", "Urbanisation", "Arts & Traditions"
    ];
    
    let totalDue = 0;
    topics.forEach(topic => {
      const dueWords = getDueWordsForTopic(topic);
      totalDue += dueWords.length;
    });
    
    setReviewCount(totalDue);
  }, []);

  const isStudyActive = 
    currentView === ViewState.STUDY ||
    currentView === ViewState.STUDY_NEW ||
    currentView === ViewState.STUDY_REVIEW ||
    currentView === ViewState.STUDY_SHUFFLE;

  const navItems = [
    { 
      view: ViewState.HOME, 
      icon: Home, 
      label: 'Home',
      url: 'pages/home',
      badge: null
    },
    { 
      view: ViewState.STATS, 
      icon: BarChart2, 
      label: 'Stats', 
      url: 'pages/stats',
      badge: null
    },
    { 
      view: ViewState.PROFILE, 
      icon: User, 
      label: 'Me', 
      url: 'pages/profile',
      badge: null
    },
  ];

  const handleSwitchTab = (url: string) => {
    wx.switchTab({ url });
  };

  return (
    <View className="fixed bottom-0 left-0 w-full z-50 pointer-events-none bg-gradient-to-t from-white dark:from-black via-white/95 dark:via-black/95 to-white/80 dark:to-black/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
      {/* 导航容器 */}
      <View className="relative px-4 py-4 pb-6 flex justify-around items-center pointer-events-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <View
              key={item.label}
              onClick={() => handleSwitchTab(item.url)}
              className="flex flex-col items-center justify-center py-2 px-3 relative cursor-pointer group transition-all duration-200 active:scale-95"
            >
              {/* 图标容器 */}
              <View className="relative z-10 mb-1.5">
                <item.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-500 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                />

                {/* 徽章 */}
                {item.badge !== null && item.badge > 0 && (
                  <View className="absolute -top-3 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md text-xs font-bold">
                    {item.badge > 99 ? '99+' : item.badge}
                  </View>
                )}

                {/* 激活指示点 */}
                {isActive && (
                  <View className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 dark:bg-blue-400 rounded-full shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                )}
              </View>

              {/* 标签 */}
              <Text className={`text-[11px] font-medium transition-all duration-300 ${
                isActive 
                  ? 'text-blue-500 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
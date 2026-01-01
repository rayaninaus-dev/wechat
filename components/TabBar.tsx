import React from 'react';
import { ViewState } from '../types';
import { Home, BookOpen, BarChart2, User } from 'lucide-react';
import { View, Text } from './WxComponents';
import { wx } from '../utils/wx';

interface TabBarProps {
  currentView: ViewState;
}

const TabBar: React.FC<TabBarProps> = ({ currentView }) => {
  const isStudyActive = 
    currentView === ViewState.STUDY ||
    currentView === ViewState.STUDY_NEW ||
    currentView === ViewState.STUDY_REVIEW ||
    currentView === ViewState.STUDY_SHUFFLE;

  const navItems = [
    { view: ViewState.HOME, icon: Home, label: 'Home', url: 'pages/home' },
    { view: ViewState.STUDY, icon: BookOpen, label: 'Study', activeCheck: isStudyActive, url: 'pages/study' }, // Note: Study is usually navigateTo, but for tab bar logic we keep it here
    { view: ViewState.STATS, icon: BarChart2, label: 'Stats', url: 'pages/stats' },
    { view: ViewState.PROFILE, icon: User, label: 'Me', url: 'pages/profile' },
  ];

  const handleSwitchTab = (url: string) => {
    wx.switchTab({ url });
  };

  return (
    <View className="absolute bottom-6 left-0 w-full px-6 z-50 pointer-events-none">
      <View className="bg-white/90 backdrop-blur-xl shadow-2xl shadow-gray-200/50 border border-white/50 rounded-3xl p-2 flex justify-between items-center pointer-events-auto">
        {navItems.map((item) => {
          const isActive = item.activeCheck ?? currentView === item.view;
          return (
            <View
              key={item.label}
              onClick={() => handleSwitchTab(item.url)}
              className="flex-1 flex flex-col items-center justify-center py-2 relative"
            >
              <View className={`transition-all duration-300 ${isActive ? 'text-[#07c160]' : 'text-gray-400'}`}>
                {isActive && (
                  <View className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#07c160] rounded-b-full shadow-[0_0_10px_#07c160]" />
                )}
                <item.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}
                />
              </View>
              <Text className={`text-[10px] font-bold mt-1 ${isActive ? 'text-[#07c160]' : 'text-gray-400'} transition-all duration-200`}>
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
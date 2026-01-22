import React, { useState, useEffect } from 'react';
import { ViewState, WordItem, UserStats, Difficulty, TopicStats } from './types';
import TabBar from './components/TabBar';
import WordCard from './components/WordCard';
import StatsPanel from './components/StatsPanel';
import AchievementDisplay from './components/AchievementDisplay';
import OnboardingGuide from './components/OnboardingGuide';
import { WxOverlays } from './components/WxOverlays';
import { View, Text, Button, Image } from './components/WxComponents';
import { generateWordBatch } from './services/geminiService';
import { 
  getLocalWords, 
  addWords, 
  updateWordProgress, 
  getTopicStats,
  getNewWordsForTopic,
  getDueWordsForTopic,
  getAllKnownWords,
  initializePresets,
  getUserStats,
  saveUserStats
} from './services/storageService';
import { wx } from './utils/wx';
import { Sparkles, Trophy, Book, ArrowRight, User, Clock, CheckCircle, PlusCircle, X, Flame, DownloadCloud, Database, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

const INITIAL_STATS: UserStats = {
  totalWordsLearned: 0,
  streakDays: 1,
  lastStudyDate: new Date().toISOString().split('T')[0],
  todayCount: 0
};

const TOPICS = [
  "Environment", "Education", "Technology", 
  "Health & Science", "Work & Business", 
  "Society & Culture", "Government & Law", 
  "Media & Advertising", "Urbanisation", "Arts & Traditions"
];

// Aesthetic gradients for topics
const getTopicGradient = (index: number) => {
  const gradients = [
    "from-emerald-400 to-teal-500",
    "from-blue-400 to-indigo-500", 
    "from-violet-400 to-purple-500",
    "from-rose-400 to-pink-500",
    "from-orange-400 to-amber-500",
    "from-cyan-400 to-blue-500",
    "from-fuchsia-400 to-purple-500",
    "from-lime-400 to-green-500",
    "from-sky-400 to-blue-600",
    "from-yellow-400 to-orange-500"
  ];
  return gradients[index % gradients.length];
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [topicStats, setTopicStats] = useState<TopicStats[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Study Session State
  const [words, setWords] = useState<WordItem[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null);
  
  // Initialization
  useEffect(() => {
    initializePresets();
    const savedStats = getUserStats();
    if (savedStats) setStats(savedStats);
    
    // Check if user has seen onboarding
    const onboardingCompleted = wx.getStorageSync('onboarding_completed');
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
    
    refreshData();

    // Listen to routing events from components
    const handleRoute = (e: CustomEvent) => {
        const { type, url } = e.detail;
        if (type === 'switchTab') {
            if (url.includes('home')) setCurrentView(ViewState.HOME);
            if (url.includes('stats')) setCurrentView(ViewState.STATS);
            if (url.includes('profile')) setCurrentView(ViewState.PROFILE);
            // Note: 'study' as a tab usually means review list, but here we keep it simple
        }
        if (type === 'navigateTo') {
            if (url === 'pages/study') setCurrentView(ViewState.STUDY);
        }
        if (type === 'navigateBack') {
            setCurrentView(ViewState.HOME); // Simplified back behavior
        }
        refreshData();
    };

    window.addEventListener('wx:route', handleRoute as EventListener);
    return () => window.removeEventListener('wx:route', handleRoute as EventListener);
  }, []);

  useEffect(() => {
    saveUserStats(stats);
  }, [stats]);

  const refreshData = () => {
    const tStats = TOPICS.map(t => getTopicStats(t));
    setTopicStats(tStats);
  };

  const handleLearnNew = async (topic: string) => {
    let newWords = getNewWordsForTopic(topic, 5);

    if (newWords.length === 0) {
       wx.showModal({
         title: 'Library Empty',
         content: `You have finished all prepared words for ${topic}. Download 10 new words using AI?`,
         confirmText: 'Download',
         success: (res) => {
           if (res.confirm) {
             handleDownloadPack(topic);
           }
         }
       });
       return;
    }

    setWords(newWords);
    setCurrentCardIndex(0);
    setLoadingTopic(null);
    setIsLoading(false);
    wx.navigateTo({ url: 'pages/study' });
  };

  const handleDownloadPack = async (topic: string) => {
    setIsLoading(true);
    setLoadingTopic(topic);
    try {
      const knownWords = getAllKnownWords();
      const generated = await generateWordBatch(topic, Difficulty.IELTS, knownWords, 10);
      addWords(generated);
      refreshData();
      wx.showToast({ title: 'Download Complete', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: 'Network Error', icon: 'error' });
    } finally {
      setIsLoading(false);
      setLoadingTopic(null);
    }
  };

  const handleReview = (topic: string) => {
    const dueWords = getDueWordsForTopic(topic);
    if (dueWords.length === 0) {
      wx.showToast({ title: 'No reviews due', icon: 'none' });
      return;
    }
    setWords(dueWords);
    setCurrentCardIndex(0);
    wx.navigateTo({ url: 'pages/study' });
  };

  const handleCardResult = (remembered: boolean) => {
    const currentWord = words[currentCardIndex];
    // 转换为 5 级反馈（暂时用 3 级映射，稍后会升级为 5 级）
    const quality = remembered ? 4 : 1;  // 4=容易, 1=太困难
    updateWordProgress(currentWord, quality);
    
    if (remembered) {
      setStats(prev => ({
        ...prev,
        todayCount: prev.todayCount + 1,
        totalWordsLearned: prev.totalWordsLearned + (currentWord.learningStatus === 'new' ? 1 : 0)
      }));
    }

    if (currentCardIndex < words.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      wx.navigateBack();
      wx.showToast({ title: 'Session Complete!', icon: 'success' });
    }
  };

  // --- UI RENDERERS ---

  const renderHome = () => (
    <View className="w-full bg-white dark:bg-black transition-colors duration-200">
      {/* Header Section - Apple Minimalist */}
      <View className="relative z-10 px-6 pt-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        {/* Top Bar - Date & Streak */}
        <View className="flex justify-between items-center mb-8">
          <View>
            <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 block">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
            <Text className="text-3xl font-bold text-black dark:text-white">Ready to learn?</Text>
          </View>
          <View className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-xl border border-orange-200 dark:border-orange-800/50 shadow-sm">
            <Flame size={18} className="fill-orange-500 text-orange-500" />
            <View className="flex flex-col items-end">
              <Text className="text-xs font-semibold text-orange-600 dark:text-orange-400 leading-none">{stats.streakDays}</Text>
              <Text className="text-[10px] text-orange-600/70 dark:text-orange-400/60 font-medium">streak</Text>
            </View>
          </View>
        </View>

        {/* Daily Goal Card - Apple Style */}
        <View className="bg-blue-500 dark:bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm">
          {/* Subtle Background */}
          <View className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />

          {/* Content */}
          <View className="relative z-10 flex justify-between items-center">
            <View className="flex-1">
              <Text className="text-blue-100 text-xs font-semibold uppercase tracking-wider block mb-2">Today's Goal</Text>
              <View className="flex items-baseline gap-2">
                <Text className="text-5xl font-bold">{stats.todayCount}</Text>
                <Text className="text-blue-100 font-medium">/ 20</Text>
              </View>
              <View className="mt-4 flex items-center gap-2">
                <View className="flex-1 h-2 bg-blue-400/30 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${(stats.todayCount / 20) * 100}%` }}
                  />
                </View>
                <Text className="text-xs font-semibold text-blue-100 ml-2">
                  {Math.round((stats.todayCount / 20) * 100)}%
                </Text>
              </View>
            </View>

            {/* Circular Progress */}
            <View className="h-20 w-20 relative flex items-center justify-center ml-4 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-blue-400/30" />
                <circle 
                  cx="40" cy="40" r="36" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="transparent" 
                  className="text-white transition-all duration-500"
                  strokeDasharray={226}
                  strokeDashoffset={226 - (226 * Math.min(stats.todayCount, 20) / 20)}
                  strokeLinecap="round"
                />
              </svg>
              <Trophy size={28} className="text-white absolute" />
            </View>
          </View>

          {/* Action Button */}
          <View className="mt-4 pt-4 border-t border-white/20 flex gap-3">
            <Button
              type="primary"
              className="flex-1 !bg-white !border-white !text-blue-500 rounded-lg !font-semibold"
              onClick={() => {
                const newWordTopics = topicStats.filter(t => t.newCount > 0);
                if (newWordTopics.length > 0) {
                  handleLearnNew(newWordTopics[0].topic);
                }
              }}
            >
              <PlusCircle size={16} />
              Start
            </Button>
          </View>
        </View>
      </View>

      {/* Achievements Section */}
      <View className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 block">
          Recent Achievements
        </Text>
        <AchievementDisplay compact={true} />
      </View>

      {/* Courses Section */}
      <View className="w-full">
        <View className="px-6 pb-3 pt-4">
          <Text className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
            <Book size={20} className="text-blue-500" />
            My Courses
          </Text>
        </View>
        
        {/* Topic Grid Component - Inline with no ScrollView */}
        <View className="px-4 pb-32">
          {/* Filter Tabs */}
          <View className="px-2 pb-3 border-b border-gray-200 dark:border-gray-800">
            <View className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {(['all', 'new', 'due', 'mastered'] as const).map(f => (
                <Button
                  key={f}
                  size="small"
                  type={'default'}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all bg-gray-100 dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300`}
                  onClick={() => {}}
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
          <View className="grid grid-cols-2 gap-3 pb-4 pt-3">
            {topicStats.map((t, i) => (
              <View
                key={t.topic}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow active:shadow-none cursor-pointer"
                onClick={() => {
                  if (t.dueCount > 0) {
                    handleReview(t.topic);
                  } else if (t.newCount > 0) {
                    handleLearnNew(t.topic);
                  }
                }}
              >
                {/* Gradient Header */}
                <View
                  className={`bg-gradient-to-br ${getTopicGradient(i)} p-3 text-white relative min-h-[100px] flex flex-col justify-between`}
                >
                  {/* Topic Name */}
                  <View className="flex justify-between items-start gap-2">
                    <Text className="font-bold text-sm leading-tight flex-1 line-clamp-2">
                      {t.topic}
                    </Text>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      if (t.dueCount > 0) {
                        handleReview(t.topic);
                      } else if (t.newCount > 0) {
                        handleLearnNew(t.topic);
                      }
                    }}
                  >
                    {t.dueCount > 0 ? 'Review' : t.newCount > 0 ? 'Learn' : 'Done'}
                  </Button>

                  {/* Download Button */}
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPack(t.topic);
                    }}
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
        </View>
      </View>
    </View>
  );

  const renderStudy = () => {
    if (words.length === 0) return null;
    const currentTopic = words[0]?.topic || "General";
    const topicIdx = TOPICS.indexOf(currentTopic);
    const bgGradient = topicIdx >= 0 ? getTopicGradient(topicIdx) : "from-gray-400 to-gray-500";

    return (
      <View className="fixed inset-0 z-40 flex flex-col h-full bg-slate-50">
        <View className={`absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b ${bgGradient} opacity-10 rounded-b-[3rem] z-0`}></View>
        
        <View className="relative z-10 px-6 py-6 flex justify-between items-center">
             <View className="bg-white/50 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/20">
                <Text className="text-sm font-bold text-slate-700">
                    {currentCardIndex + 1} <Text className="text-slate-400 mx-1">/</Text> {words.length}
                </Text>
             </View>
             <View 
                onClick={() => wx.navigateBack()} 
                className="w-10 h-10 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-full text-slate-600 shadow-sm hover:bg-white transition-colors"
             >
                <X size={20} />
             </View>
        </View>

        <View className="relative z-10 px-8 mb-4">
          <View className="h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
            <View 
              className={`h-full bg-gradient-to-r ${bgGradient} transition-all duration-500 ease-out`}
              style={{ width: `${((currentCardIndex + 1) / words.length) * 100}%` }}
            />
          </View>
        </View>
        
        <View className="flex-1 px-6 pb-8 z-10 flex flex-col">
          <WordCard 
            word={words[currentCardIndex]} 
            onNext={handleCardResult}
            currentIndex={currentCardIndex}
            totalCount={words.length}
          />
        </View>
      </View>
    );
  };

  const renderStats = () => {
    const localWords = getLocalWords();
    return (
      <View className="h-full">
        <View className="p-6 pb-4 bg-white border-b border-gray-200">
          <Text className="text-3xl font-black text-gray-800">学习统计</Text>
        </View>
        <StatsPanel words={localWords} />
      </View>
    );
  };

  const renderProfile = () => (
    <View className="h-full p-8 flex flex-col items-center justify-center bg-slate-50">
        <View className="w-24 h-24 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-full mb-6 flex items-center justify-center shadow-lg border-4 border-white">
            <User size={40} className="text-slate-400" />
        </View>
        <Text className="text-2xl font-black text-slate-800 block">Guest User</Text>
        <Text className="text-slate-400 font-medium mb-10 block">Free Account</Text>
        
        <View className="w-full space-y-3">
             <Button className="!w-full !py-4 bg-white rounded-2xl text-slate-700 font-bold shadow-sm border border-slate-100 !flex !items-center !justify-between px-6 hover:bg-slate-50 transition-colors">
                <Text>Preferences</Text>
                <ArrowRight size={18} className="text-slate-300" />
             </Button>
             <Button 
                onClick={() => {
                    wx.showModal({
                        title: 'Reset Data',
                        content: 'Are you sure you want to delete all progress? This cannot be undone.',
                        showCancel: true,
                        confirmText: 'Reset',
                        success: (res) => {
                            if(res.confirm) {
                                wx.clearStorageSync();
                                window.location.reload();
                            }
                        }
                    });
                }}
                type="warn"
                className="!w-full !py-4 rounded-2xl font-bold !flex !items-center !justify-between px-6 mt-4 transition-colors"
            >
                <Text>Reset Data</Text>
             </Button>
        </View>
    </View>
  );

  return (
    <View className="h-screen w-full bg-slate-100 flex justify-center overflow-hidden font-sans text-slate-900 selection:bg-green-100">
      <View className="w-full max-w-md bg-slate-50 h-full relative shadow-2xl flex flex-col overflow-hidden">
        {/* WeChat Global Overlays */}
        <WxOverlays />

        {/* Main Content Area */}
        <View className="flex-1 overflow-y-auto relative">
          {currentView === ViewState.HOME && renderHome()}
          {currentView === ViewState.STUDY && renderStudy()}
          {currentView === ViewState.STATS && renderStats()}
          {currentView === ViewState.PROFILE && renderProfile()}
        </View>

        {/* Floating Tab Bar - Only show if not in study mode */}
        {currentView !== ViewState.STUDY && <TabBar currentView={currentView} />}
        
        {/* Loading Overlay Global */}
        {isLoading && (
          <View className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            <View className="relative">
               <View className="w-16 h-16 border-4 border-slate-200 border-t-[#07c160] rounded-full animate-spin"></View>
               <View className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={20} className="text-[#07c160] animate-pulse" />
               </View>
            </View>
            <Text className="mt-6 font-bold text-slate-800 text-lg block">Curating Content...</Text>
            <Text className="text-slate-500 text-sm block">Building {loadingTopic || 'vocabulary'} cards</Text>
          </View>
        )}

        {/* Onboarding Guide */}
        <OnboardingGuide show={showOnboarding} onClose={() => setShowOnboarding(false)} />
      </View>
    </View>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { ViewState, WordItem, UserStats, Difficulty, TopicStats } from './types';
import TabBar from './components/TabBar';
import WordCard from './components/WordCard';
import { WxOverlays } from './components/WxOverlays';
import { View, Text, Button, ScrollView, Image } from './components/WxComponents';
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
    updateWordProgress(currentWord, remembered);
    
    if (remembered) {
      setStats(prev => ({
        ...prev,
        todayCount: prev.todayCount + 1,
        totalWordsLearned: prev.totalWordsLearned + (currentWord.masteryLevel === 0 ? 1 : 0)
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
    <View className="flex flex-col h-full bg-slate-50 relative">
      {/* Hero Dashboard */}
      <View className="bg-white rounded-b-[2.5rem] p-8 pt-10 pb-10 shadow-xl shadow-slate-100 z-10 relative overflow-hidden">
        <View className="absolute top-[-50%] right-[-20%] w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-60 pointer-events-none"></View>
        
        <View className="flex justify-between items-start mb-6 relative">
          <View>
            <Text className="text-3xl font-black text-slate-800 tracking-tight block">Hello, <br/>Guest</Text>
            <Text className="text-slate-400 font-medium mt-1 block">Ready to learn?</Text>
          </View>
          <View className="flex flex-col items-end">
            <View className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
               <Flame size={18} className="fill-orange-500 text-orange-500" />
               <Text className="text-sm font-bold text-orange-600">{stats.streakDays} Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Daily Goal Card */}
        <View className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-slate-300">
           <View className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl opacity-50"></View>
           <View className="relative z-10 flex justify-between items-center">
              <View>
                <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 block">Daily Goal</Text>
                <View className="flex items-baseline gap-1">
                  <Text className="text-4xl font-black">{stats.todayCount}</Text>
                  <Text className="text-slate-400 font-medium">/ 20 words</Text>
                </View>
              </View>
              <View className="h-14 w-14 relative flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-700" />
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-[#07c160]" strokeDasharray={150} strokeDashoffset={150 - (150 * Math.min(stats.todayCount, 20) / 20)} strokeLinecap="round" />
                 </svg>
                 <Trophy size={20} className="text-white absolute" />
              </View>
           </View>
        </View>
      </View>

      {/* Courses Grid */}
      <ScrollView scrollY className="flex-1 p-6 pb-32 space-y-6">
        <Text className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Book size={20} className="text-slate-400" />
          My Courses
        </Text>
        
        <View className="space-y-4 pb-20">
        {topicStats.map((t, i) => (
          <View key={t.topic} className="bg-white p-1 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <View className="flex p-4 gap-4">
              {/* Icon / Cover */}
              <View className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getTopicGradient(i)} flex items-center justify-center shadow-inner text-white shrink-0 relative`}>
                 <Text className="text-2xl font-bold opacity-40">{t.topic.charAt(0)}</Text>
                 {t.newCount > 0 && (
                   <View className="absolute top-1 right-1 bg-white px-1.5 rounded-full shadow-sm">
                     <Text className="text-[10px] font-bold text-slate-800">+{t.newCount}</Text>
                   </View>
                 )}
              </View>
              
              <View className="flex-1 flex flex-col justify-between py-1">
                <View className="flex justify-between items-start">
                   <Text className="font-bold text-slate-800 text-lg leading-tight">{t.topic}</Text>
                   {t.dueCount > 0 ? (
                     <View className="bg-red-100 px-2 py-0.5 rounded-full">
                       <Text className="text-red-600 text-[10px] font-bold">{t.dueCount} Review</Text>
                     </View>
                   ) : (
                     <View className="bg-slate-100 px-2 py-0.5 rounded-full">
                       <Text className="text-slate-400 text-[10px] font-bold">All Caught Up</Text>
                     </View>
                   )}
                </View>
                
                {/* Micro Stats */}
                <View className="flex gap-4 mt-2">
                   <View className="flex flex-col">
                      <Text className="text-[10px] font-bold text-slate-400 uppercase">Mastered</Text>
                      <Text className="text-sm font-bold text-emerald-500">{t.masteredCount}</Text>
                   </View>
                   <View className="flex flex-col">
                      <Text className="text-[10px] font-bold text-slate-400 uppercase">Library</Text>
                      <Text className="text-sm font-bold text-blue-500">{t.learningCount + t.newCount}</Text>
                   </View>
                </View>
              </View>
            </View>

            {/* Actions Bar - using Button wrappers */}
            <View className="flex items-center gap-2 px-4 pb-4">
              <Button 
                type={t.newCount > 0 ? 'primary' : 'default'}
                plain={t.newCount === 0}
                className={`flex-1 rounded-2xl font-bold h-12 !flex !flex-row !gap-2 !items-center !justify-center ${t.newCount === 0 ? 'bg-slate-100 !border-slate-100 text-slate-400' : 'bg-slate-800 border-slate-800 text-white'}`}
                onClick={() => handleLearnNew(t.topic)}
              >
                 {t.newCount > 0 ? <PlusCircle size={16} /> : <CheckCircle size={16} />}
                 {t.newCount > 0 ? 'Start' : 'Done'}
              </Button>
              
              {/* Download Button */}
               <Button 
                onClick={() => handleDownloadPack(t.topic)}
                disabled={isLoading}
                className="!w-12 h-12 !px-0 rounded-2xl bg-blue-50 border-blue-50 text-blue-600"
              >
                {isLoading && loadingTopic === t.topic ? <RefreshCw size={18} className="animate-spin"/> : <DownloadCloud size={18} />}
              </Button>
              
              <Button 
                onClick={() => handleReview(t.topic)}
                disabled={t.dueCount === 0 || isLoading}
                type="warn"
                className={`!w-12 h-12 !px-0 rounded-2xl ${
                  t.dueCount > 0 ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-slate-50 border-slate-50 text-slate-300'
                }`}
              >
                <Clock size={18} />
              </Button>
            </View>
          </View>
        ))}
        </View>
      </ScrollView>
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
          />
        </View>
      </View>
    );
  };

  const renderStats = () => {
    const data = [
      { name: 'M', count: 12 }, { name: 'T', count: 19 }, { name: 'W', count: 3 },
      { name: 'T', count: 25 }, { name: 'F', count: stats.todayCount },
      { name: 'S', count: 0 }, { name: 'S', count: 0 },
    ];
    const localWords = getLocalWords();
    const mastered = localWords.filter(w => w.stage >= 5).length;
    const learning = localWords.length - mastered;

    return (
      <View className="h-full bg-slate-50 flex flex-col">
        <View className="p-8 pb-4">
           <Text className="text-3xl font-black text-slate-800">Your Stats</Text>
        </View>
        
        <ScrollView scrollY className="flex-1 px-6 pb-32 space-y-6">
          <View className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <Text className="text-sm font-bold text-slate-400 uppercase mb-6 tracking-wider block">Weekly Activity</Text>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                  <Bar dataKey="count" radius={[6, 6, 6, 6]} barSize={12}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'F' ? '#07c160' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </View>

          <View className="grid grid-cols-2 gap-4">
             <View className="bg-emerald-50 p-5 rounded-[2rem] border border-emerald-100">
                <Text className="text-emerald-600 font-medium text-sm block">Mastered</Text>
                <Text className="text-3xl font-black text-emerald-800 mt-2 block">{mastered}</Text>
             </View>
             <View className="bg-blue-50 p-5 rounded-[2rem] border border-blue-100">
                <Text className="text-blue-600 font-medium text-sm block">Learning</Text>
                <Text className="text-3xl font-black text-blue-800 mt-2 block">{learning}</Text>
             </View>
          </View>

          <View className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100 pb-20">
             <View className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
               <Text className="font-bold text-slate-700">Vocabulary Library</Text>
               <View className="flex items-center gap-1 text-slate-400 text-xs font-bold bg-slate-100 px-2 py-1 rounded-md">
                   <Database size={12} /> <Text>{localWords.length}</Text>
               </View>
             </View>
             <View className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
               {localWords.slice(0, 10).map((w, i) => (
                 <View key={i} className="p-4 flex justify-between items-center hover:bg-slate-50">
                   <View>
                     <Text className="font-bold text-slate-700 block">{w.word}</Text>
                     <Text className="text-[10px] text-slate-400 uppercase block">{w.topic}</Text>
                   </View>
                   {w.stage >= 5 && <CheckCircle size={16} className="text-emerald-500" />}
                 </View>
               ))}
               <View className="p-4 text-center text-sm text-slate-400 font-medium hover:bg-slate-50 cursor-pointer">
                  <Text>View All {localWords.length} Words</Text>
               </View>
             </View>
          </View>
        </ScrollView>
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
        <View className="flex-1 overflow-hidden relative">
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
      </View>
    </View>
  );
};

export default App;
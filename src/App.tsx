import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Search, 
  Library as LibraryIcon, 
  User, 
  Play, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  Star,
  Download,
  CheckCircle2,
  ArrowLeft,
  MoreVertical,
  MessageSquare,
  Share2,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Mic,
  Menu,
  Bookmark,
  Headphones,
  Volume2,
  Shield,
  CreditCard,
  Mail,
  HelpCircle,
  Plus,
  Pencil,
  LogOut,
  LogIn,
  Zap,
  BarChart3,
  ThumbsUp,
  ThumbsDown,



  Pause,
  SkipForward,
  SkipBack,
  VolumeX,
  BookOpen,
  LayoutGrid
} from 'lucide-react';
import { useAuth } from './auth';
import { LoginView } from './components/LoginView';
import { SignupView } from './components/SignupView';
import { PlanSelectionView } from './components/PlanSelectionView';
import { WriterOnboardingView } from './components/WriterOnboardingView';
import { AuthorDashboardView } from './components/AuthorDashboardView';
import { MOCK_COMICS, MOCK_AUDIO_STORYS, MOCK_PROFILES, Comic, Chapter, AudioStory, UserProfile } from './types';

type View = 'home' | 'search' | 'library' | 'detail' | 'reader' | 'profile' | 'settings' | 'profileSelection' | 'editProfile' | 'audioPlayer' | 'login' | 'signup' | 'plans' | 'becoming-writer' | 'author-dashboard';
type SearchViewProps = { 
  onComicSelect: (c: Comic) => void,
  onAudioSelect: (a: AudioStory) => void 
};

export default function App() {
  const { user, profile: authProfile, logout, updateProfileData } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [profiles, setProfiles] = useState<UserProfile[]>(MOCK_PROFILES);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(MOCK_PROFILES[0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync activeProfile with authProfile when user logs in
  useEffect(() => {
    if (authProfile) {
      setActiveProfile(authProfile);
    } else {
      setActiveProfile(MOCK_PROFILES[0]);
    }
  }, [authProfile]);
  const [selectedAudioStory, setSelectedAudioStory] = useState<AudioStory | null>(null);
  const [comics, setComics] = useState<Comic[]>(MOCK_COMICS);
  const [listenedAudioCount, setListenedAudioCount] = useState(0);
  
  // Auto-upgrade Jarod to Author for testing
  useEffect(() => {
    if (user?.email === 'jarodsystem64@gmail.com' && activeProfile.role !== 'author') {
      const updated = { ...activeProfile, role: 'author' as const };
      setActiveProfile(updated);
      updateProfileData({ role: 'author' });
      setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
    }
  }, [user?.email, activeProfile.role]);

  const toggleSaveComic = (comicId: string) => {
    setComics(prev => prev.map(c => 
      c.id === comicId ? { ...c, isSaved: !c.isSaved } : c
    ));
  };

  const toggleVoteComic = (comicId: string, type: 'up' | 'down') => {
    setComics(prev => prev.map(c => {
      if (c.id !== comicId) return c;
      
      let newVote: 'up' | 'down' | null = type;
      let upvotes = c.upvotes || 0;
      let downvotes = c.downvotes || 0;

      // If clicking the same vote again, remove the vote
      if (c.userVote === type) {
        newVote = null;
        if (type === 'up') upvotes = Math.max(0, upvotes - 1);
        if (type === 'down') downvotes = Math.max(0, downvotes - 1);
      } else {
        // If changing vote from up to down or vice-versa
        if (c.userVote === 'up') upvotes = Math.max(0, upvotes - 1);
        if (c.userVote === 'down') downvotes = Math.max(0, downvotes - 1);
        
        // Add new vote
        if (type === 'up') upvotes += 1;
        if (type === 'down') downvotes += 1;
      }

      return { ...c, userVote: newVote, upvotes, downvotes };
    }));
  };

  const updateChapterProgress = (comicId: string, chapterId: number) => {
    // Basic logic to mark as read or update progress
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (view: View, comic?: Comic, chapter?: Chapter, audio?: AudioStory) => {
    if (comic) setSelectedComic(comic);
    if (chapter) setSelectedChapter(chapter);
    if (audio) {
      if (activeProfile.plan === 'Free' && listenedAudioCount >= 1) {
        alert("Você atingiu seu limite de 1 AudioStory semanal no plano Free. Faça o upgrade para continuar ouvindo!");
        setCurrentView('plans');
        return;
      }
      setSelectedAudioStory(audio);
      if (activeProfile.plan === 'Free') setListenedAudioCount(prev => prev + 1);
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentView('login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };


  // Auth Redirect Logic - Only for Auth views
  useEffect(() => {
    if (user && (currentView === 'login' || currentView === 'signup')) {
      setCurrentView('home');
    }
  }, [user, currentView]);

  /* Removed early return for mandatory login */

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary selection:text-white">
      {currentView !== 'login' && currentView !== 'signup' && currentView !== 'reader' && (
        <motion.aside 
        animate={{ width: isSidebarCollapsed ? 96 : 280 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-surface-container-low border-r border-white/5 z-[70] pt-20"
      >
        <div className={`p-8 mb-4 flex flex-col ${isSidebarCollapsed ? 'items-center' : ''}`}>
          <div 
            onClick={() => navigateTo(user ? 'profileSelection' : 'login')}
            className={`flex items-center gap-4 mb-8 relative cursor-pointer group/profile ${isSidebarCollapsed ? 'justify-center' : ''}`}
          >
            <div className={`rounded-full overflow-hidden border-2 border-transparent group-hover/profile:border-primary shrink-0 transition-all bg-surface-container-high flex items-center justify-center ${isSidebarCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`}>
              {user ? (
                <img 
                  src={activeProfile.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={24} className="text-on-surface-variant" />
              )}
            </div>
            {!isSidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <p className="font-bold text-on-surface truncate group-hover/profile:text-primary transition-colors">
                  {user?.displayName || (user ? activeProfile.name : 'Visitante')}
                </p>
                <p className="text-[10px] text-primary font-black tracking-widest uppercase">
                  {user ? (activeProfile.plan || 'Free') : 'Clique para entrar'}
                </p>
              </motion.div>
            )}
          </div>
          
          <div className="mb-6">
            <button 
              onClick={() => navigateTo('plans')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
            >
              <Zap size={14} />
              {!isSidebarCollapsed && "Ver Planos"}
            </button>
          </div>
          
          <nav className="flex flex-col gap-2 w-full">
            <SidebarLink 
              icon={<Home size={22} />} 
              label="Início" 
              active={currentView === 'home'} 
              collapsed={isSidebarCollapsed}
              onClick={() => navigateTo('home')} 
            />
            <SidebarLink 
              icon={<SearchIcon size={22} />} 
              label="Explorar" 
              active={currentView === 'search'} 
              collapsed={isSidebarCollapsed}
              onClick={() => navigateTo('search')} 
            />
            <SidebarLink 
              icon={<Star size={22} />} 
              label="Originais" 
              active={false} 
              collapsed={isSidebarCollapsed}
              onClick={() => {}} 
            />
            <SidebarLink 
              icon={<LibraryIcon size={22} />} 
              label="Biblioteca" 
              active={currentView === 'library'} 
              collapsed={isSidebarCollapsed}
              onClick={() => navigateTo('library')} 
            />
          </nav>
        </div>

        <div className={`p-8 pt-0 flex flex-col gap-2 ${isSidebarCollapsed ? 'items-center' : ''}`}>
           <SidebarLink 
             icon={<Pencil size={22} />} 
             label="Seja um Escritor" 
             active={currentView === 'becoming-writer'} 
             collapsed={isSidebarCollapsed}
             onClick={() => navigateTo('becoming-writer')} 
           />
           {activeProfile.role === 'author' && (
             <SidebarLink 
               icon={<BarChart3 size={22} />} 
               label="Painel do Autor" 
               active={currentView === 'author-dashboard'} 
               collapsed={isSidebarCollapsed}
               onClick={() => navigateTo('author-dashboard')} 
             />
           )}
        </div>

        <div className={`mt-auto p-8 flex flex-col gap-4 ${isSidebarCollapsed ? 'items-center' : ''}`}>
          <SidebarLink 
            icon={<SettingsIcon size={22} />} 
            label="Ajustes" 
            active={currentView === 'settings'} 
            collapsed={isSidebarCollapsed}
            onClick={() => navigateTo('settings')} 
          />
          {user ? (
            <SidebarLink 
              icon={<LogOut size={22} />} 
              label="Sair" 
              active={false} 
              collapsed={isSidebarCollapsed}
              onClick={handleLogout} 
            />
          ) : (
            <SidebarLink 
              icon={<LogIn size={22} />} 
              label="Entrar" 
              active={currentView === 'login'} 
              collapsed={isSidebarCollapsed}
              onClick={() => navigateTo('login')} 
            />
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex items-center justify-center p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-on-surface-variant hover:text-white"
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </motion.aside>
      )}

      {/* Top App Bar - Fixed */}
      {currentView !== 'reader' && currentView !== 'login' && currentView !== 'signup' && (
        <motion.header 
          animate={{ paddingLeft: isMobile ? 0 : (isSidebarCollapsed ? 96 : 280) }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className={`fixed top-0 left-0 right-0 h-16 lg:h-20 z-[60] flex items-center justify-between px-6 lg:px-8 xl:px-12 transition-colors duration-500 ${isScrolled ? 'bg-background/95 backdrop-blur-xl border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'}`}
        >
          <div className="flex items-center gap-10">
            <button className="lg:hidden p-2 rounded-full hover:bg-white/10">
              <Menu size={24} />
            </button>
            <div 
              onClick={() => navigateTo('home')}
              className="text-2xl lg:text-3xl font-black tracking-tighter text-primary cursor-pointer transition-transform active:scale-95 uppercase"
            >
              TORI STUDIO
            </div>
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <button onClick={() => navigateTo('home')} className={`transition-colors ${currentView === 'home' ? 'text-white' : 'text-on-surface-variant hover:text-white'}`}>Início</button>
              <button onClick={() => navigateTo('library')} className={`transition-colors ${currentView === 'library' ? 'text-white' : 'text-on-surface-variant hover:text-white'}`}>Minha Lista</button>
              <button className="text-on-surface-variant hover:text-white transition-colors">Originais</button>
              <button className="text-on-surface-variant hover:text-white transition-colors">Bombando</button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigateTo('search')}
              className="p-2 lg:p-3 text-on-surface hover:text-white transition-colors"
            >
              <SearchIcon size={20} />
            </button>
            <div 
              onClick={() => navigateTo(user ? 'profileSelection' : 'login')}
              className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-xs text-white cursor-pointer hover:scale-110 transition-transform"
            >
              {user ? (user.displayName?.charAt(0) || activeProfile.name.charAt(0)) : <User size={16} />}
            </div>
          </div>
        </motion.header>
      )}

      {/* Profile Selection Overlay */}
      <AnimatePresence>
        {currentView === 'profileSelection' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background"
          >
            <ProfileSelectionView 
              profiles={profiles} 
              onSelect={(p) => { setActiveProfile(p); navigateTo('home'); }}
              onEdit={() => navigateTo('editProfile')}
              onClose={() => navigateTo('home')}
            />
          </motion.div>
        )}

        {currentView === 'audioPlayer' && selectedAudioStory && (
          <motion.div 
            key="audioPlayer"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <AudioPlayerView 
              story={selectedAudioStory} 
              onClose={() => navigateTo('home')} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.main 
        animate={{ 
          paddingLeft: isMobile 
            ? 0 
            : ((currentView !== 'reader' && currentView !== 'login' && currentView !== 'signup') 
              ? (isSidebarCollapsed ? 96 : 280) 
              : 0)
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="transition-all duration-500 pb-24 lg:pb-0"
      >
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <HomeView 
                onComicSelect={(c) => navigateTo('detail', c)} 
                onAudioSelect={(a) => navigateTo('audioPlayer', undefined, undefined, a)} 
                comics={comics}
              />
            </motion.div>
          )}

          {currentView === 'detail' && selectedComic && (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <DetailView 
                comic={comics.find(c => c.id === selectedComic.id) || selectedComic} 
                onBack={() => navigateTo('home')} 
                onRead={(chapter) => navigateTo('reader', selectedComic, chapter)}
                onToggleSave={() => toggleSaveComic(selectedComic.id)}
                onVote={(type) => toggleVoteComic(selectedComic.id, type)}
              />
            </motion.div>
          )}

          {currentView === 'reader' && selectedComic && selectedChapter && (
            <motion.div 
              key="reader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReaderView 
                comic={selectedComic} 
                chapter={selectedChapter} 
                onBack={() => navigateTo('detail', selectedComic)} 
                onChapterChange={(ch) => {
                  setSelectedChapter(ch);
                  window.scrollTo(0, 0);
                }}
              />
            </motion.div>
          )}

          {currentView === 'library' && (
            <motion.div 
              key="library"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LibraryView 
                onComicSelect={(c) => navigateTo('detail', c)} 
                comics={comics}
              />
            </motion.div>
          )}

          {currentView === 'search' && (
            <motion.div 
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SearchView 
              onComicSelect={(c) => navigateTo('detail', c)} 
              onAudioSelect={(a) => navigateTo('audioPlayer', undefined, undefined, a)} 
            />
            </motion.div>
          )}

          {currentView === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProfileView profile={activeProfile} />
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SettingsView 
                profile={activeProfile} 
                onEdit={() => navigateTo('editProfile')} 
                onShowPlans={() => navigateTo('plans')}
              />
            </motion.div>
          )}

          {currentView === 'editProfile' && (
            <motion.div 
              key="editProfile"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <EditProfileView 
                profile={activeProfile} 
                onSave={async (updated) => {
                  setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
                  setActiveProfile(updated);
                  await updateProfileData({ name: updated.name, avatar: updated.avatar });
                  navigateTo('settings');
                }}
                onBack={() => navigateTo('settings')}
              />
            </motion.div>
          )}

          {currentView === 'login' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LoginView onSignupClick={() => setCurrentView('signup')} onSuccess={() => setCurrentView('home')} />
            </motion.div>
          )}

          {currentView === 'signup' && (
            <motion.div 
              key="signup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <SignupView onLoginClick={() => setCurrentView('login')} onSuccess={() => setCurrentView('home')} />
            </motion.div>
          )}

          {currentView === 'plans' && (
            <motion.div 
              key="plans"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <PlanSelectionView 
                currentPlan={activeProfile.plan}
                onSelectPlan={async (newPlan) => {
                  const updated = { ...activeProfile, plan: newPlan };
                  setActiveProfile(updated);
                  setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
                  await updateProfileData({ plan: newPlan });
                  navigateTo('settings');
                }}
                onBack={() => navigateTo('settings')}
              />
            </motion.div>
          )}

          {currentView === 'becoming-writer' && (
            <motion.div 
              key="becoming-writer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WriterOnboardingView 
                onBack={() => navigateTo('home')} 
                onSuccess={async () => {
                  const updated = { ...activeProfile, role: 'author' as const };
                  setActiveProfile(updated);
                  setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
                  await updateProfileData({ role: 'author' });
                  navigateTo('author-dashboard');
                }} 
              />
            </motion.div>
          )}

          {currentView === 'author-dashboard' && (
            <motion.div 
              key="author-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AuthorDashboardView 
                comics={comics} 
                onViewChapter={(comic, chapter) => {
                  setSelectedComic(comic);
                  setSelectedChapter(chapter);
                  setCurrentView('reader');
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </motion.main>

      {/* Mobile Bottom Navbar */}
      {currentView !== 'reader' && currentView !== 'login' && currentView !== 'signup' && (
        <nav className="lg:hidden fixed bottom-0 left-0 w-full glass z-50 h-20 px-6 flex items-center justify-around border-t border-white/5 pb-safe">
          <MobileNavLink 
            icon={<Home size={24} />} 
            label="Home" 
            active={currentView === 'home'} 
            onClick={() => navigateTo('home')} 
          />
          <MobileNavLink 
            icon={<SearchIcon size={24} />} 
            label="Explorar" 
            active={currentView === 'search'} 
            onClick={() => navigateTo('search')} 
          />
          <MobileNavLink 
            icon={<LibraryIcon size={24} />} 
            label="Biblioteca" 
            active={currentView === 'library'} 
            onClick={() => navigateTo('library')} 
          />
          <MobileNavLink 
            icon={<User size={24} />} 
            label="Perfil" 
            active={currentView === 'profile'} 
            onClick={() => navigateTo('profile')} 
          />
        </nav>
      )}
    </div>
  );
}

// --- Views ---

function HomeView({ onComicSelect, onAudioSelect, comics }: { 
  onComicSelect: (c: Comic) => void, 
  onAudioSelect: (a: AudioStory) => void,
  comics: Comic[]
}) {
  const featured = comics[0];
  
  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="relative h-[85vh] w-full flex items-end p-6 lg:p-12 xl:p-20 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={featured.bannerUrl} 
            alt={featured.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        </motion.div>
        
        <div className="relative z-10 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="px-1.5 py-0.5 bg-primary text-[10px] font-black text-white tracking-widest uppercase rounded-sm">
              SÉRIE
            </span>
            <span className="text-on-surface-variant text-xs font-bold tracking-widest uppercase opacity-80">
              Original Tori Studio
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="text-5xl lg:text-7xl xl:text-9xl font-black mb-6 text-white leading-[0.9] tracking-tighter italic uppercase text-glow"
          >
            {featured.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="text-on-surface-variant text-lg lg:text-xl mb-12 line-clamp-3 leading-relaxed max-w-2xl font-medium"
          >
            {featured.description}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex items-center gap-4"
          >
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: '#ffffff' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComicSelect(featured)}
              className="px-10 py-4 bg-white text-black font-black rounded-sm transition-colors flex items-center gap-3 shadow-2xl"
            >
              <Play fill="currentColor" size={24} />
              LER AGORA
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComicSelect(featured)}
              className="px-10 py-4 bg-white/10 text-white font-black rounded-sm backdrop-blur-md transition-colors flex items-center gap-3 border border-white/10"
            >
              <Info size={24} />
              SAIBA MAIS
            </motion.button>
          </motion.div>
        </div>

        {/* AudioStorys Mini Slide - Desktop Position */}
        <div className="hidden lg:block absolute top-24 right-20 z-20">
           <AudioStorysSlide onOpen={onAudioSelect} />
        </div>
      </section>

      {/* Content Rows */}
      <div className="px-6 lg:px-12 xl:px-20 -mt-20 relative z-20 pb-20">
        <HomeRow title="Continuar Lendo" comics={comics} onComicSelect={onComicSelect} />
        
        {/* Mobile-only AudioStorys if needed, or just desktop */}
        <div className="lg:hidden mb-12">
           <AudioStorysSlide onOpen={onAudioSelect} />
        </div>

        <HomeRow title="Mais Populares" comics={[...comics].reverse()} onComicSelect={onComicSelect} />
        <HomeRow title="Estreias de Maio" comics={comics} onComicSelect={onComicSelect} />
      </div>
    </div>
  );
}

function AudioStorysSlide({ onOpen }: { onOpen: (s: AudioStory) => void }) {
  const [index, setIndex] = useState(0);
  const stories = MOCK_AUDIO_STORYS;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [stories.length]);

  return (
    <div 
      className="relative group cursor-pointer w-full lg:w-72"
      onClick={() => onOpen(stories[index])}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black tracking-widest text-primary uppercase italic">AudioStorys</h3>
        <div className="flex gap-1">
          {stories.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-4 bg-primary' : 'w-1 bg-white/20'}`} 
            />
          ))}
        </div>
      </div>
      
      <div className="relative aspect-[16/9] rounded-sm overflow-hidden border border-white/5 shadow-2xl glass group-hover:border-primary/30 transition-colors">
        <AnimatePresence mode="wait">
          <motion.div
            key={stories[index].id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0"
          >
            <img 
              src={stories[index].coverUrl} 
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" 
              alt={stories[index].title} 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-2 mb-1">
                 <Headphones size={12} className="text-primary" />
                 <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">{stories[index].duration}</span>
              </div>
              <h4 className="text-sm font-black text-white truncate uppercase italic tracking-tighter leading-none">{stories[index].title}</h4>
              <p className="text-[10px] font-bold text-on-surface-variant/80 truncate">{stories[index].author}</p>
            </div>

            <div className="absolute top-2 right-2">
               <motion.div 
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,62,62,0.8)]" 
               />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DetailView({ comic, onBack, onRead, onToggleSave, onVote }: { comic: Comic, onBack: () => void, onRead: (chapter: Chapter) => void, onToggleSave: () => void, onVote: (type: 'up' | 'down') => void }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Header Overly */}
      <header className="fixed top-0 left-0 lg:left-80 right-0 h-20 px-8 flex items-center justify-between z-50 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <MoreVertical />
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative h-[65vh] w-full flex items-end p-6 lg:p-12 xl:p-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={comic.coverUrl} 
            alt={comic.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <div className="flex flex-wrap gap-2 mb-6">
            {comic.ageRating && (
              <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center justify-center min-w-[32px] shadow-lg ${
                comic.ageRating === 'L' ? 'bg-[#00A551] text-white shadow-[#00A551]/20' :
                comic.ageRating === '10' ? 'bg-[#0071C5] text-white shadow-[#0071C5]/20' :
                comic.ageRating === '12' ? 'bg-[#F2CA00] text-black shadow-[#F2CA00]/20' :
                comic.ageRating === '14' ? 'bg-[#E36616] text-white shadow-[#E36616]/20' :
                comic.ageRating === '16' ? 'bg-[#DF2128] text-white shadow-[#DF2128]/20' :
                'bg-black border-2 border-[#DF2128] text-[#DF2128] shadow-[#DF2128]/20'
              }`}>
                {comic.ageRating}
              </span>
            )}
            {comic.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-on-surface">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-extrabold text-primary mb-4">
            {comic.title}
          </h1>
          
          <div className="flex items-center gap-6 text-on-surface-variant font-medium text-sm mb-8">
            <div className="flex items-center gap-1">
              <Star size={16} fill="#ff5f40" className="text-primary" />
              <span>{comic.rating} ({comic.ratingCount})</span>
            </div>
            <span>•</span>
            <span>{comic.status}</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onRead(comic.chapters[0])}
              className="w-full lg:w-max px-12 py-5 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20"
            >
              <Play fill="currentColor" size={24} />
              Lêr Capítulo {comic.chapters[0].id}
            </button>
            
            <div className="flex gap-2">
               <button 
                 onClick={() => onVote('up')}
                 className={`p-5 rounded-2xl transition-all group border ${comic.userVote === 'up' ? 'bg-green-500/20 border-green-500/50' : 'bg-white/5 border-white/10 hover:bg-green-500/10 hover:border-green-500/50'}`}
               >
                  <ThumbsUp size={24} className={`transition-colors ${comic.userVote === 'up' ? 'text-green-500' : 'text-on-surface-variant group-hover:text-green-500'}`} />
                  {comic.upvotes !== undefined && <span className={`ml-2 text-sm font-bold ${comic.userVote === 'up' ? 'text-green-500' : 'text-on-surface-variant group-hover:text-green-500'}`}>{comic.upvotes}</span>}
               </button>
               <button 
                 onClick={() => onVote('down')}
                 className={`p-5 rounded-2xl transition-all group border ${comic.userVote === 'down' ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 border-white/10 hover:bg-red-500/10 hover:border-red-500/50'}`}
               >
                  <ThumbsDown size={24} className={`transition-colors ${comic.userVote === 'down' ? 'text-red-500' : 'text-on-surface-variant group-hover:text-red-500'}`} />
                  {comic.downvotes !== undefined && <span className={`ml-2 text-sm font-bold ${comic.userVote === 'down' ? 'text-red-500' : 'text-on-surface-variant group-hover:text-red-500'}`}>{comic.downvotes}</span>}
               </button>
            </div>
            
            <button 
              onClick={onToggleSave}
              className={`w-full lg:w-max px-8 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all border ${comic.isSaved ? 'bg-white/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
            >
              <Bookmark fill={comic.isSaved ? "currentColor" : "none"} size={24} />
              {comic.isSaved ? 'Na Minha Lista' : 'Adicionar à Lista'}
            </button>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="max-w-4xl mx-auto w-full px-8 py-16">
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-6">Sinopse</h2>
          <p className="text-lg text-on-surface-variant leading-relaxed opacity-80">
            {comic.description}
          </p>
        </div>

        <div>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-white">Capítulos</h2>
            <span className="text-sm text-on-surface-variant">{comic.chapters.length} Lançados</span>
          </div>

          <div className="flex flex-col gap-3">
            {comic.chapters.map(chapter => (
              <button 
                key={chapter.id}
                onClick={() => onRead(chapter)}
                className="group flex items-center p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors ring-1 ring-white/5 text-left"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 mr-6">
                  <img src={comic.coverUrl} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer"/>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-on-surface text-lg mb-1 group-hover:text-primary transition-colors">
                    Capítulo {chapter.id}: {chapter.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">{chapter.date}</p>
                </div>
                <Download className="text-on-surface-variant opacity-20 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
          
          <button className="w-full mt-8 py-5 rounded-2xl border border-white/5 text-on-surface font-bold hover:bg-white/5 transition-colors">
            Carregar Mais Capítulos
          </button>
        </div>
      </section>
    </div>
  );
}

function ReaderView({ comic, chapter, onBack, onChapterChange }: { comic: Comic, chapter: Chapter, onBack: () => void, onChapterChange?: (chapter: Chapter) => void }) {
  const [showNav, setShowNav] = useState(true);
  const [readingMode, setReadingMode] = useState<'vertical' | 'paged'>('vertical');
  const [currentPage, setCurrentPage] = useState(0);

  const currentIndex = comic.chapters.findIndex(ch => ch.id === chapter.id);
  const prevChapter = currentIndex > 0 ? comic.chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < comic.chapters.length - 1 ? comic.chapters[currentIndex + 1] : null;

  const totalPages = chapter.images.length;
  const progress = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0;

  return (
    <div className="relative min-h-screen bg-black overflow-hidden select-none">
      {/* Top Nav */}
      <motion.header 
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -100 }}
        className="fixed top-0 left-0 w-full h-20 glass z-50 flex items-center px-8"
      >
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft />
        </button>
        <div className="flex-grow text-center">
          <h2 className="font-bold text-on-surface truncate px-4">Capítulo {chapter.id}: {chapter.title}</h2>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest">{comic.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setReadingMode(readingMode === 'vertical' ? 'paged' : 'vertical')}
            className={`p-2 rounded-lg transition-all ${readingMode === 'paged' ? 'bg-primary text-white' : 'hover:bg-white/10 text-on-surface-variant'}`}
          >
            {readingMode === 'vertical' ? <MoreVertical size={20} /> : <LayoutGrid size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Progress Bar */}
      <div className="fixed top-20 left-0 w-full h-0.5 z-[51] bg-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-primary shadow-[0_0_10px_#ff5f40]"
        />
      </div>

      {/* Content */}
      <div 
        onClick={() => setShowNav(!showNav)}
        className={`w-full h-screen ${readingMode === 'vertical' ? 'overflow-y-auto scrollbar-hide' : 'overflow-hidden'} relative`}
      >
        {readingMode === 'vertical' ? (
          <div className="w-full max-w-2xl mx-auto flex flex-col pt-20 pb-32 cursor-pointer">
            {chapter.images.length > 0 ? (
              chapter.images.map((img, i) => (
                <motion.img 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  key={i} 
                  src={img} 
                  alt={`Panel ${i}`} 
                  className="w-full h-auto block"
                  referrerPolicy="no-referrer"
                />
              ))
            ) : (
              <EmptyReader chapterId={chapter.id} />
            )}
            <ReaderEnd comic={comic} chapter={chapter} nextChapter={nextChapter} onChapterChange={onChapterChange} onBack={onBack} />
          </div>
        ) : (
          <div className="w-full h-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full h-full flex items-center justify-center p-4 lg:p-12"
              >
                {chapter.images.length > 0 ? (
                  <img 
                    src={chapter.images[currentPage]} 
                    alt={`Page ${currentPage}`} 
                    className="max-w-full max-h-full object-contain shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <EmptyReader chapterId={chapter.id} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Paged Navigation Areas */}
            <div className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-pointer group" onClick={(e) => { e.stopPropagation(); if(currentPage > 0) setCurrentPage(currentPage - 1); }}>
               <div className="h-full w-full bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-start p-8">
                  <ChevronLeft size={48} className="text-white/50" />
               </div>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-pointer group" onClick={(e) => { e.stopPropagation(); if(currentPage < totalPages - 1) setCurrentPage(currentPage + 1); else if(nextChapter) onChapterChange?.(nextChapter); }}>
               <div className="h-full w-full bg-gradient-to-l from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end p-8">
                  <ChevronRight size={48} className="text-white/50" />
               </div>
            </div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold text-on-surface-variant">
              Página {currentPage + 1} de {totalPages}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <motion.nav 
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : 100 }}
        className="fixed bottom-0 left-0 w-full h-24 glass z-50 flex items-center justify-between px-8"
      >
        <button 
          onClick={() => prevChapter && onChapterChange?.(prevChapter)}
          className={`flex flex-col items-center gap-1 transition-colors ${prevChapter ? 'text-on-surface-variant hover:text-primary cursor-pointer' : 'text-white/10 cursor-not-allowed'}`}
          disabled={!prevChapter}
        >
          <ChevronLeft />
          <span className="text-[10px] font-black uppercase">Anterior</span>
        </button>
        
        <div className="hidden lg:flex items-center gap-8">
          <ReaderAction icon={<MessageSquare size={20} />} label="243" />
          <ReaderAction icon={<Share2 size={20} />} label="Partilhar" />
          <ReaderAction icon={<Bookmark size={20} />} label="Salvar" />
        </div>

        <button 
          onClick={() => nextChapter && onChapterChange?.(nextChapter)}
          className={`flex flex-col items-center gap-1 transition-colors ${nextChapter ? 'text-primary hover:scale-110 cursor-pointer' : 'text-white/10 cursor-not-allowed'}`}
          disabled={!nextChapter}
        >
          <ChevronRight />
          <span className="text-[10px] font-black uppercase">Próximo</span>
        </button>
      </motion.nav>
    </div>
  );
}

const EmptyReader = ({ chapterId }: { chapterId: number }) => (
  <div className="h-screen flex items-center justify-center text-on-surface-variant p-20 text-center flex-col gap-4">
    <BookOpen size={48} className="opacity-20" />
    <p className="font-medium">O Capítulo {chapterId} está sendo preparado. <br/> Imagens em breve.</p>
  </div>
);

const ReaderAction = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex flex-col items-center cursor-pointer group">
    <div className="text-on-surface-variant group-hover:text-primary transition-colors">{icon}</div>
    <span className="text-[10px] font-black uppercase mt-1 tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">{label}</span>
  </div>
);

const ReaderEnd = ({ comic, chapter, nextChapter, onChapterChange, onBack }: any) => (
  <div className="py-20 flex flex-col items-center justify-center border-t border-white/5 bg-surface-container-lowest mx-4 rounded-3xl mt-12">
    <span className="text-8xl font-black text-white/5 mb-8 tracking-tighter">FIM</span>
    <p className="text-on-surface-variant font-medium mb-12">Você terminou o Capítulo {chapter.id}.</p>
    
    <div className="flex gap-4">
      <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 font-bold hover:bg-white/10 transition-colors">
        <CheckCircle2 size={20} className="text-primary" />
        Gostei
      </button>
      {nextChapter ? (
        <button 
          onClick={(e) => { e.stopPropagation(); onChapterChange?.(nextChapter); }}
          className="px-8 py-4 bg-primary rounded-full flex items-center gap-2 font-bold text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          Próximo Capítulo
          <ChevronRight size={20} />
        </button>
      ) : (
        <button 
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          className="px-8 py-4 bg-white/10 rounded-full flex items-center gap-2 font-bold hover:bg-white/20 transition-colors"
        >
          Voltar ao Início
        </button>
      )}
    </div>
  </div>
);


function LibraryView({ onComicSelect, comics }: { onComicSelect: (c: Comic) => void, comics: Comic[] }) {
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'saved' | 'recent' | 'downloads'>('saved');

  const filteredLibrary = useMemo(() => {
    let list = comics;
    if (activeTab === 'saved') list = comics.filter(c => c.isSaved);
    
    return list.filter(comic => 
      comic.title.toLowerCase().includes(filter.toLowerCase()) ||
      comic.category.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, comics, activeTab]);

  return (
    <div className="p-6 lg:p-12 xl:p-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 uppercase italic tracking-tighter">Minha Biblioteca</h1>
          <p className="text-on-surface-variant">Sua coleção de mundos e aventuras.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative w-full md:w-80">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              type="text" 
              placeholder="Filtrar biblioteca..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-surface-container border border-white/5 rounded-full py-4 pl-12 pr-6 text-on-surface focus:outline-none focus:ring-1 ring-primary/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-12 border-b border-white/5 mb-12 hide-scrollbar">
        <button 
          onClick={() => setActiveTab('saved')}
          className={`pb-4 border-b-2 font-bold transition-all ${activeTab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'}`}
        >
          Salvos ({comics.filter(c => c.isSaved).length})
        </button>
        <button 
          onClick={() => setActiveTab('downloads')}
          className={`pb-4 border-b-2 font-bold transition-all ${activeTab === 'downloads' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'}`}
        >
          Downloads
        </button>
        <button 
          onClick={() => setActiveTab('recent')}
          className={`pb-4 border-b-2 font-bold transition-all ${activeTab === 'recent' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'}`}
        >
          Histórico
        </button>
      </div>

      {filteredLibrary.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-12">
          {filteredLibrary.map(comic => (
            <div key={comic.id} className="group cursor-pointer" onClick={() => onComicSelect(comic)}>
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-xl">
                <img 
                  src={comic.coverUrl} 
                  alt={comic.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <button className="w-full py-3 bg-primary text-white font-bold rounded-xl text-sm leading-none shadow-lg shadow-primary/20">
                    Continuar
                  </button>
                </div>
                <div className="absolute top-3 right-3 p-1.5 glass rounded-full">
                  <Bookmark size={14} fill={comic.isSaved ? "#ff5f40" : "none"} className={comic.isSaved ? "text-primary" : "text-white/20"} />
                </div>
              </div>
              <h3 className="font-bold text-on-surface truncate group-hover:text-primary transition-colors">{comic.title}</h3>
              <p className="text-xs font-bold text-on-surface-variant mt-1">{comic.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center">
          <Bookmark size={48} className="text-white/10 mb-6" />
          <h3 className="text-xl font-bold mb-2">Nada por aqui ainda</h3>
          <p className="text-on-surface-variant max-w-xs">Salve suas obras favoritas para encontrá-las facilmente depois.</p>
        </div>
      )}
    </div>
  );
}

function SearchView({ onComicSelect, onAudioSelect }: SearchViewProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase();
    
    // If we have a query, search everything
    if (q.trim()) {
      const comics = MOCK_COMICS.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );

      const audios = MOCK_AUDIO_STORYS.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
      );

      return { comics, audios };
    }

    // If we have an active category but no query
    if (activeCategory) {
      if (activeCategory === 'AudioStorys') {
        return { comics: [], audios: MOCK_AUDIO_STORYS };
      }
      const comics = MOCK_COMICS.filter(c => c.category === activeCategory);
      return { comics, audios: [] };
    }

    return { comics: [], audios: [] };
  }, [query, activeCategory]);
  const categories = [
    { label: 'Ação', color: '#ff5f40' },
    { label: 'Fantasia', color: '#00a4b0' },
    { label: 'Romance', color: '#ff5f40' },
    { label: 'Sci-Fi', color: '#5cd7e4' },
    { label: 'Horror', color: '#e2e2e2' },
    { label: 'Mistério', color: '#c8c6c5' },
    { label: 'AudioStorys', color: '#ff5f40' },
  ];

  return (
    <div className="p-6 lg:p-12 xl:p-20">
      <div className="mb-16 relative group max-w-4xl">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <SearchIcon className="text-on-surface-variant group-focus-within:text-primary transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Explorar obras..." 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setActiveCategory(null);
          }}
          className="w-full bg-surface-container border border-white/5 rounded-full py-6 pl-16 pr-20 text-xl text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant hover:text-white"
          >
            Limpar
          </button>
        )}
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 hover:text-primary transition-colors">
          <Mic />
        </button>
      </div>

      {activeCategory && (
        <div className="mb-12 flex items-center gap-4">
          <button 
            onClick={() => setActiveCategory(null)}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            {activeCategory}
          </h2>
        </div>
      )}

      {(filteredResults.comics.length > 0 || filteredResults.audios.length > 0) && (
        <section className="mb-20">
          {!activeCategory && <h2 className="text-3xl font-black mb-8 text-white">Resultados</h2>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-12">
            {filteredResults.comics.map(comic => (
              <div key={comic.id} className="group cursor-pointer" onClick={() => onComicSelect(comic)}>
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-xl">
                  <img src={comic.coverUrl} alt={comic.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold text-on-surface truncate group-hover:text-primary transition-colors">{comic.title}</h3>
                <p className="text-xs font-bold text-on-surface-variant mt-1">{comic.category}</p>
              </div>
            ))}
            {filteredResults.audios.map(audio => (
              <div key={audio.id} className="group cursor-pointer" onClick={() => onAudioSelect(audio)}>
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-xl">
                  <img src={audio.coverUrl} alt={audio.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Play className="text-white" size={48} fill="white" />
                  </div>
                </div>
                <h3 className="font-bold text-on-surface truncate group-hover:text-primary transition-colors">{audio.title}</h3>
                <p className="text-xs font-bold text-primary mt-1 uppercase tracking-widest text-[10px]">AudioStory</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {!activeCategory && !query && (
        <section className="mb-20">
          <h2 className="text-3xl font-black mb-8 text-white">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <button 
                key={cat.label} 
                onClick={() => setActiveCategory(cat.label)}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group text-left"
              >
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
                <div 
                  className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ backgroundColor: cat.color }} 
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="text-lg font-black text-white tracking-widest uppercase">{cat.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-black mb-8 text-white">Pesquisas Populares</h2>
        <div className="flex flex-wrap gap-4">
          {['Solo Leveling', 'Omniscient Reader', 'Lore Olympus', 'Tower of God', 'Beginning After The End'].map(tag => (
            <button key={tag} className="px-8 py-4 bg-surface-container hover:bg-surface-container-high border border-white/5 rounded-full text-lg font-bold text-on-surface hover:text-primary transition-all flex items-center gap-3">
              <Star size={18} fill="#ff5f40" className="text-primary grayscale group-hover:grayscale-0" />
              {tag}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// --- Helpers ---

function SidebarLink({ icon, label, active, collapsed, onClick }: { icon: any, label: string, active: boolean, collapsed?: boolean, onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ x: collapsed ? 0 : 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all w-full text-left font-bold relative group ${
        collapsed ? 'justify-center px-0' : ''
      } ${
        active 
          ? 'text-white' 
          : 'text-on-surface-variant hover:text-on-surface'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute inset-0 bg-primary rounded-2xl z-0 shadow-lg shadow-primary/20"
        />
      )}
      <span className="relative z-10">{icon}</span>
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="relative z-10 truncate"
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  );
}

function MobileNavLink({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 transition-all ${
        active ? 'text-primary' : 'text-on-surface-variant'
      }`}
    >
      <div className={`${active ? 'scale-110' : ''} transition-transform`}>
        {icon}
      </div>
      <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
    </button>
  );
}

function HomeRow({ title, comics, onComicSelect }: { title: string, comics: Comic[], onComicSelect: (c: Comic) => void }) {
  return (
    <section className="mb-12 group/row">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-black text-on-surface hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group/title uppercase italic tracking-tighter">
          {title}
          <ChevronRight size={24} className="text-primary opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-1 transition-all" />
        </h2>
      </div>
      
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-2 -mx-2 pb-10 pt-4 scroll-snap-x">
        {comics.map((comic, index) => (
          <motion.div 
            key={`${title}-${comic.id}-${index}`} 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="w-48 lg:w-64 flex-none group cursor-pointer scroll-snap-align-start"
            onClick={() => onComicSelect(comic)}
          >
            <motion.div 
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="relative aspect-[2/3] rounded-sm overflow-hidden mb-4 bg-surface-container border border-white/5 netflix-card-shadow"
            >
              <img 
                src={comic.coverUrl} 
                alt={comic.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay with info on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black shadow-lg">
                    <Play fill="currentColor" size={16} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                    <Star fill="currentColor" size={14} className="text-primary" />
                  </div>
                </div>
                <h4 className="font-black text-white text-sm lg:text-base leading-tight mb-1 truncate">{comic.title}</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant">
                  <span className="text-primary">{comic.rating}</span>
                  <span>{comic.status}</span>
                </div>
                {comic.progress !== undefined && (
                  <div className="h-1 w-full bg-white/20 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${comic.progress}%` }} />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProfileView({ profile }: { profile: UserProfile }) {
  return (
    <div className="p-6 lg:p-12 xl:p-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary mb-8 shadow-2xl shadow-primary/20">
        <img 
          src={profile.avatar} 
          alt="Profile" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <h1 className="text-4xl font-black mb-2">{profile.name}</h1>
      <p className="text-primary font-bold tracking-widest mb-8 uppercase">{profile.plan} MEMBER</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-surface-container p-6 rounded-2xl border border-white/5">
          <p className="text-3xl font-black text-white mb-1">24</p>
          <p className="text-on-surface-variant text-sm font-bold">Obras Salvas</p>
        </div>
        <div className="bg-surface-container p-6 rounded-2xl border border-white/5">
          <p className="text-3xl font-black text-white mb-1">156</p>
          <p className="text-on-surface-variant text-sm font-bold">Capítulos Lidos</p>
        </div>
        <div className="bg-surface-container p-6 rounded-2xl border border-white/5">
          <p className="text-3xl font-black text-white mb-1">12</p>
          <p className="text-on-surface-variant text-sm font-bold">Dias Seguidos</p>
        </div>
      </div>
      
      <button className="mt-12 px-10 py-4 bg-surface-container-high hover:bg-white/5 rounded-2xl font-bold transition-colors">
        Editar Perfil
      </button>
    </div>
  );
}

function ProfileSelectionView({ profiles, onSelect, onEdit, onClose }: { 
  profiles: UserProfile[], 
  onSelect: (p: UserProfile) => void, 
  onEdit: () => void,
  onClose: () => void
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[150px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center mb-16"
      >
        <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tighter uppercase italic">Quem está assistindo?</h1>
        <p className="text-on-surface-variant font-medium">Escolha um perfil para começar sua jornada.</p>
      </motion.div>

      <div className="relative z-10 flex flex-wrap justify-center gap-8 lg:gap-16 mb-20">
        {profiles.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-col items-center gap-6 cursor-pointer"
            onClick={() => onSelect(p)}
          >
            <div className="relative w-32 h-32 lg:w-44 lg:h-44 rounded-2xl overflow-hidden ring-4 ring-transparent group-hover:ring-primary transition-all duration-300 shadow-2xl">
              <img src={p.avatar} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
            <span className="text-xl font-bold text-on-surface-variant group-hover:text-white transition-colors">{p.name}</span>
          </motion.div>
        ))}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: profiles.length * 0.1 }}
          className="group flex flex-col items-center gap-6 cursor-pointer"
        >
          <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-2xl border-4 border-dashed border-white/10 flex items-center justify-center text-white/20 group-hover:border-primary group-hover:text-primary transition-all">
            <Plus size={48} />
          </div>
          <span className="text-xl font-bold text-white/20 group-hover:text-primary transition-colors">Adicionar</span>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ backgroundColor: 'white', color: 'black' }}
        onClick={onEdit}
        className="relative z-10 px-12 py-4 border border-white/20 text-white font-black rounded-sm uppercase tracking-widest hover:border-white transition-all"
      >
        Gerenciar Perfis
      </motion.button>
      
      <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
         <LogOut size={32} />
      </button>
    </div>
  );
}

function SettingsView({ profile, onEdit, onShowPlans }: { profile: UserProfile, onEdit: () => void, onShowPlans: () => void }) {
  const [activeTab, setActiveTab] = useState('assinatura');
  
  const sections = [
    { id: 'assinatura', label: 'Assinatura', icon: <CreditCard size={20} /> },
    { id: 'conta', label: 'Conta', icon: <Mail size={20} /> },
    { id: 'privacidade', label: 'Privacidade', icon: <Shield size={20} /> },
    { id: 'ajuda', label: 'Ajuda', icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className="p-8 lg:p-20 max-w-6xl mx-auto">
      <header className="mb-16">
        <h1 className="text-4xl lg:text-5xl font-black mb-4 uppercase italic tracking-tighter">Ajustes</h1>
        <p className="text-on-surface-variant">Gerencie sua experiência no Tori Studio.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
        <aside className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === s.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-white/5'}`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </aside>

        <main className="bg-surface-container-low rounded-3xl p-8 lg:p-12 border border-white/5 min-h-[500px]">
           <AnimatePresence mode="wait">
              {activeTab === 'assinatura' && (
                <motion.div key="sub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="flex justify-between items-start mb-12">
                      <div>
                        <h2 className="text-2xl font-black mb-2 uppercase">Plano Atual</h2>
                        <p className="text-primary font-black tracking-widest">{profile.plan} Plan</p>
                      </div>
                      <button 
                        onClick={onShowPlans}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-colors"
                      >
                        Alterar Plano
                      </button>
                   </div>
                   <div className="space-y-4">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                         <div className="flex items-center gap-4">
                            <CreditCard className="text-on-surface-variant" />
                            <div>
                               <p className="font-bold">Mastercard final 4432</p>
                               <p className="text-xs text-on-surface-variant">Próxima cobrança em 12/06/2026</p>
                            </div>
                         </div>
                         <button className="text-sm font-bold text-primary">Atualizar</button>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'conta' && (
                <motion.div key="acc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <h2 className="text-2xl font-black mb-8 uppercase">Informações da Conta</h2>
                   <div className="space-y-8">
                      <div className="flex justify-between items-center pb-6 border-b border-white/5">
                         <div>
                            <p className="text-xs text-on-surface-variant font-black uppercase mb-1">E-mail</p>
                            <p className="font-bold">traveler@tori.studio</p>
                         </div>
                         <button className="text-sm font-bold text-primary">Editar</button>
                      </div>
                      <div className="flex justify-between items-center pb-6 border-b border-white/5">
                         <div>
                            <p className="text-xs text-on-surface-variant font-black uppercase mb-1">Senha</p>
                            <p className="font-bold">••••••••••••</p>
                         </div>
                         <button className="text-sm font-bold text-primary">Trocar</button>
                      </div>
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 p-1 border border-white/10">
                               <img src={profile.avatar} className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                               <p className="font-bold">{profile.name}</p>
                               <p className="text-xs text-on-surface-variant">Perfil Principal</p>
                            </div>
                         </div>
                         <button onClick={onEdit} className="flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full text-sm font-bold transition-colors">
                            <Pencil size={14} /> Editar Perfil
                         </button>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'privacidade' && (
                <motion.div key="priv" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <h2 className="text-2xl font-black mb-8 uppercase">Privacidade</h2>
                   <div className="space-y-6">
                      <p className="text-on-surface-variant leading-relaxed">Seus dados estão protegidos sob a política de segurança da Tori Studio. Nós utilizamos criptografia de ponta a ponta para garantir que suas preferências de leitura permaneçam privadas.</p>
                      <button className="w-full p-4 rounded-xl bg-white/5 border border-white/5 text-left font-bold hover:bg-white/10 transition-colors flex justify-between items-center">
                         Ver Política de Privacidade Completa
                         <Shield size={18} className="text-primary" />
                      </button>
                   </div>
                </motion.div>
              )}

              {activeTab === 'ajuda' && (
                <motion.div key="help" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <h2 className="text-2xl font-black mb-8 uppercase">Central de Ajuda</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Problemas com Pagamento', 'Dúvidas sobre Capítulos', 'Erro no Leitor', 'Reportar Bug'].map(item => (
                        <button key={item} className="p-6 rounded-2xl bg-white/5 border border-white/5 text-left hover:bg-white/10 transition-all group">
                           <HelpCircle size={20} className="mb-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                           <p className="font-bold">{item}</p>
                        </button>
                      ))}
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function EditProfileView({ profile, onSave, onBack }: { 
  profile: UserProfile, 
  onSave: (p: UserProfile) => void,
  onBack: () => void 
}) {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);

  const avatars = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuApStl9tdK_wC18iCD0VqAv-csT90TSnRAjfDLLg23TBSPrHwRqd_lmffakUW1OW3OQ07k7XHrvIyXsJgbayg804S9nT0g9ANBbxHBDQtX0BoXSHvX4oCA_Dd7jv2qh47lfao8KsxIuXUE7E6Qb_r5OdPHWXIJ4NVf1_iHr765PV0nwEfF4w3wUw4sSlgnl_S-bYgm2ixMMZl3a6pO6G26HkpOypAJ7FAMOtRg6AX6189rG3Kevh_ljdu3sc_6BCIckBNW0m2D7fuI",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDocpZnnLhxIqRckq9W1lvRrH1u8rc_QPznJTe1wkh_7OQbnjxQ1FiTyDsskRH8jrd6Svnhz6rBwQKnt6PPr1PLhzKO0o9cKBZ1pDX0mrgXPxqliNr_ChiY4mfjpWVazcHB7YRcEHsviRatXi9q-YSLO6-47IzwwPA43Vnu4Ur8S-h1JRDngcqataYQ1ZNg4EAbOkO-FSt9G1XPehsVSTiCQS14dZoKuEAYzqYbUjCbwfs5WDSUKya1QzPs0AjNTnMtLMD6HbFsHk",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC6jEbyM1bJBpNfjrYIITvVTIYg10gYYd323ElkIb2xye4-6387gg7AF6eCJ9oinqMt2Ic1XEGOEYxx__yiVNlafax-h15ZWfxgvY9QTQINpjfkthLLkd0kLtVaePgZb5kIkIujikgPn-pGYsePcDRmLCvrUyHcsHpRgqS-PWoSEcaGicUcM3KaoGSj6qfL3uvxC5nVc9T_06-sY9jBTckHgHHHJWRn-VANW-nmHDs0ljKJ3i13l5mg7pX-1zX7hkyuuiAMnMOSviM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAfz-1EfxCSyG1I4--4jJlR4hUi-SXxYYZmkiu3BPAQX4yfy1nZJB1cWgjWwUolXxg1vTfpNhXY0toiQrnOwMGsnO9jOH--ada9mWLXczUpP8UmrDiojrchcGlCPdf6xqIbLBhAqR8zEgAwc-zjkKKDbRxR3oHSKu5sDqhUCO2N6dTBJMXytYTr64wh3LbF4vo45FsD2IWitS8qzAAjxy8yu2MwkznzdE3bqVXwP0dLxwELXj-RdUHcoGH1Fh_z51OslTBP1lC8NnE",
  ];

  return (
    <div className="p-8 lg:p-20 max-w-4xl mx-auto flex flex-col min-h-screen">
      <header className="mb-20">
        <h1 className="text-4xl lg:text-5xl font-black mb-4 uppercase italic tracking-tighter">Editar Perfil</h1>
        <p className="text-on-surface-variant">Customize sua identidade digital.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="relative group">
          <div className="w-48 h-48 rounded-3xl overflow-hidden ring-4 ring-primary shadow-2xl">
            <img src={avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-primary p-4 rounded-2xl shadow-xl">
             <Pencil size={24} className="text-white" />
          </div>
        </div>

        <div className="flex-grow space-y-12 w-full">
           <div>
              <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Nome do Perfil</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container border border-white/5 rounded-2xl p-6 text-2xl font-bold text-white focus:outline-none focus:ring-2 ring-primary/50 transition-all"
              />
           </div>

           <div>
              <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Escolher Avatar</label>
              <div className="flex flex-wrap gap-4">
                 {avatars.map((av, i) => (
                   <button 
                    key={i} 
                    onClick={() => setAvatar(av)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-4 transition-all ${avatar === av ? 'border-primary scale-110' : 'border-transparent hover:border-white/20'}`}
                   >
                     <img src={av} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   </button>
                 ))}
              </div>
           </div>

           <div className="flex gap-4 pt-8">
              <button 
                onClick={() => onSave({ ...profile, name, avatar })}
                className="px-12 py-4 bg-white text-black font-black rounded-sm uppercase tracking-widest hover:bg-white/90 transition-all"
              >
                Salvar
              </button>
              <button 
                onClick={onBack}
                className="px-12 py-4 border border-white/20 text-white font-black rounded-sm uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function AudioPlayerView({ story, onClose }: { story: AudioStory, onClose: () => void }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const currentScene = story.scenes[currentSceneIndex];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / (currentScene.duration * 10)); // increment every 100ms
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIndex, currentScene.duration]);

  const handleNext = () => {
    if (currentSceneIndex < story.scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(100);
    }
  };

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-black text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          key={`bg-${currentScene.id}`}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2 }}
          src={currentScene.imageUrl} 
          className="w-full h-full object-cover blur-3xl"
        />
      </div>

      <header className="relative z-10 p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
            <img src={story.coverUrl} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tighter uppercase italic">{story.title}</h2>
            <p className="text-xs text-on-surface-variant font-bold">{story.author}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className={`p-3 rounded-full transition-all ${showInfo ? 'bg-primary text-white' : 'hover:bg-white/10 text-on-surface-variant'}`}
          >
            <Info size={24} />
          </button>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-white/10 transition-colors text-on-surface-variant">
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 lg:p-12">
        <div className="relative w-full max-w-7xl h-full max-h-[85vh] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0"
            >
              <img src={currentScene.imageUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              {currentScene.caption && (
                <div className="absolute bottom-16 left-12 right-12 lg:left-24 lg:right-24">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl"
                  >
                    <p className="text-xl lg:text-3xl font-bold text-white text-center leading-relaxed">
                      "{currentScene.caption}"
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Internal Navigation Controls */}
          <div className="absolute inset-y-0 left-0 w-32 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handlePrev}
              disabled={currentSceneIndex === 0}
              className="p-4 rounded-full bg-black/40 text-white hover:bg-primary transition-all disabled:opacity-0 disabled:pointer-events-none"
            >
              <ChevronLeft size={48} />
            </button>
          </div>

          <div className="absolute inset-y-0 right-0 w-32 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleNext}
              disabled={currentSceneIndex === story.scenes.length - 1}
              className="p-4 rounded-full bg-black/40 text-white hover:bg-primary transition-all disabled:opacity-0 disabled:pointer-events-none"
            >
              <ChevronRight size={48} />
            </button>
          </div>

          {/* Bottom Scene Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {story.scenes.map((_, i) => (
              <div key={i} className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                {i < currentSceneIndex && <div className="absolute inset-0 bg-primary" />}
                {i === currentSceneIndex && (
                  <motion.div 
                    className="h-full bg-primary" 
                    style={{ width: `${progress}%` }} 
                  />
                )}
              </div>
            ))}
          </div>

          {/* Discreet Play/Pause & Mute */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 rounded-full bg-black/40 hover:bg-white/20 text-white transition-all"
             >
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
             </button>
             <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-full bg-black/40 hover:bg-white/20 text-white transition-all"
             >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
             </button>
          </div>

          {/* Info Overlay */}
          <AnimatePresence>
            {showInfo && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-12"
              >
                <div className="max-w-2xl w-full text-center">
                  <h3 className="text-xs font-black text-primary tracking-widest uppercase mb-4">Créditos de Produção</h3>
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-12">{story.title}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                      <span className="block text-[10px] font-black text-on-surface-variant uppercase mb-4 tracking-widest">Autor</span>
                      <p className="text-2xl font-bold text-white">{story.author}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                      <span className="block text-[10px] font-black text-on-surface-variant uppercase mb-4 tracking-widest">Elenco de Voz</span>
                      <ul className="space-y-2">
                        {story.voiceActors?.map(actor => (
                          <li key={actor} className="text-lg font-bold text-white flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                             {actor}
                          </li>
                        )) || <li className="text-on-surface-variant italic">Não listados</li>}
                      </ul>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowInfo(false)}
                    className="mt-16 px-12 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
                  >
                    Voltar para a História
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

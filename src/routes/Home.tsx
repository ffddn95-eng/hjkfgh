import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, AlertTriangle, CheckCircle2, Target, CalendarDays, BarChart, RotateCcw, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { HeroParticles } from "../components/HeroParticles";
import { AuthModal } from "../components/AuthModal";
import { LoadingView } from "../components/LoadingView";
import { useNavigate } from "react-router-dom";
import { auth, signInWithGoogle, logOut, getAllAnalyses } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const PLACEHOLDER_IDEAS = [
  "e.g. An app that completely automates meal prep indexing...",
  "e.g. A marketplace connecting remote workers with local guides...",
  "e.g. AI that writes personalized cold emails that actually convert...",
  "e.g. A subscription service for indoor plant emergency care...",
  "e.g. A CRM designed exclusively for high-end wedding photographers..."
];

const useTypewriterPlaceholder = (phrases: string[]) => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentPhrase.substring(0, text.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }
    } else {
      if (text.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setText(currentPhrase.substring(0, text.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 3000);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases]);

  return text;
};

export default function Home() {
  const [idea, setIdea] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ideaParam = params.get('idea');
    if (ideaParam) {
      setIdea(decodeURIComponent(ideaParam));
      // Optionally scroll to input
      const input = document.getElementById('ideaInput');
      if (input) input.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  const typingPlaceholder = useTypewriterPlaceholder(PLACEHOLDER_IDEAS);
  const [analysisStage, setAnalysisStage] = useState<'idle' | 'transitioning' | 'loading'>('idle');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyItems, setHistoryItems] = useState<{id: string, idea: string, analysisResult: any, createdAt: any}[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const getInitialCount = () => {
    const baseTime = new Date('2026-05-13T00:00:00Z').getTime();
    const now = Date.now();
    const elapsedMs = Math.max(0, now - baseTime);
    const added = Math.floor(elapsedMs / 65000) * 2;
    return 10450 + added;
  };

  const [analyzedCount, setAnalyzedCount] = useState(getInitialCount);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const updateCount = () => {
      const increment = Math.floor(Math.random() * 3) + 1;
      setAnalyzedCount(prev => prev + increment);
      const nextDelay = Math.floor(Math.random() * 70000) + 30000;
      timeoutId = setTimeout(updateCount, nextDelay);
    };
    timeoutId = setTimeout(updateCount, Math.floor(Math.random() * 70000) + 30000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleLoadHistory = async () => {
    if (user) {
      try {
        const hist = await getAllAnalyses(user.uid);
        setHistoryItems(hist as any);
        setShowHistoryModal(true);
      } catch (err) {
        console.error("Failed to load history", err);
        setErrorMessage("Failed to load history.");
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && pendingAnalysis) {
        setPendingAnalysis(false);
        setIsAuthModalOpen(false);
        handleAnalyzeSession(currentUser);
      }
    });
    return () => unsubscribe();
  }, [pendingAnalysis]);

  const handleAnalyzeClick = () => {
    if (!idea.trim() || analysisStage !== 'idle') return;
    
    if (!user) {
      setPendingAnalysis(true);
      setIsAuthModalOpen(true);
      return;
    }

    handleAnalyzeSession(user, true);
  };

  const handleAnalyzeSession = async (activeUser: User | null, force: boolean = false) => {
    setErrorMessage(null);
    setAnalysisStage('transitioning');
    
    // In our new architecture, we'll hit our own Express route so the backend key is kept secret.
    const transitionTimer = setTimeout(() => {
      setAnalysisStage('loading');
    }, 2500);

    const startTime = Date.now();
    try {
      let ideaId = '';
      if (activeUser) {
        const { analyzeIdea } = await import('../lib/ideaService');
        ideaId = await analyzeIdea(idea, activeUser.uid);
      } else {
         throw new Error("Login required");
      }
      
      const elapsed = Date.now() - startTime;
      const minTotalTime = 5000; // Fake loading feeling
      const waitTime = Math.max(minTotalTime - elapsed, 0);

      setTimeout(() => {
        setAnalysisStage('idle');
        if (ideaId) {
          navigate('/idea/' + ideaId);
        }
      }, waitTime);
      
    } catch (error: any) {
      clearTimeout(transitionTimer);
      console.error("Analysis failed:", error);
      
      let errorMsg = error?.message || "Please try again.";
      if (errorMsg.includes("503") || errorMsg.includes("high demand")) {
        errorMsg = "AI API is currently experiencing high demand. Please wait a few seconds and try again.";
      }
      
      setErrorMessage("Failed to analyze idea: " + errorMsg);
      setAnalysisStage('idle');
    }
  };

  const handleSignInClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="bg-[#050505] text-white font-['Helvetica_Neue',Arial,sans-serif] antialiased selection:bg-white/20 min-h-screen relative overflow-hidden">
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl max-h-[80vh] rounded-2xl p-6 md:p-10 flex flex-col relative overflow-hidden"
            >
              <button onClick={() => setShowHistoryModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white p-2">✕</button>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><CalendarDays className="w-5 h-5" /> My Archives</h2>
              {historyItems.length === 0 ? (
                <p className="text-white/50 text-sm">No analysis history found.</p>
              ) : (
                <div className="flex-1 overflow-y-auto pr-2 pb-4 flex flex-col gap-4">
                  {historyItems.map((item: any, idx) => (
                    <div key={idx} className="bg-[#111] border border-white/5 p-4 rounded-xl cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                      onClick={() => {
                        navigate('/idea/' + item.id);
                        setShowHistoryModal(false);
                      }}>
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <p className="text-sm font-medium text-white/90 line-clamp-2 leading-relaxed">"{item.ideaText}"</p>
                        <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 text-white/80">{item.result?.ruthlessVerdict?.verdict || 'Unknown'}</span>
                      </div>
                      <p className="text-xs text-white/40">{item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString() : 'Recent'}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div 
          key="particles"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-0 pointer-events-none opacity-50"
        >
          <HeroParticles isAnalyzing={analysisStage === 'transitioning' || analysisStage === 'loading'} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {analysisStage === 'loading' ? (
          <motion.div key="loading" className="relative z-10 block min-h-screen pt-20">
            <LoadingView idea={idea} />
          </motion.div>
        ) : (
          <motion.div key="landing" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* HERO SECTION */}
            <motion.div 
              className="relative z-10 min-h-screen flex flex-col overflow-hidden"
              animate={analysisStage === 'transitioning' ? { opacity: [1, 1, 0] } : { opacity: 1 }}
              transition={{ duration: 2.5, times: [0, 0.8, 1], ease: "easeInOut" }}
            >
            {/* Navigation */}
            <motion.nav 
          animate={analysisStage === 'transitioning' ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 w-full flex items-center justify-between px-[60px] py-[40px] z-50 box-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-white flex items-center justify-center">
              <div className="w-2 h-2 bg-[#050505]" />
            </div>
            <span className="text-[18px] font-bold tracking-[-0.5px] uppercase">FirstRevenue</span>
          </div>
          <div className="hidden md:flex items-center gap-[32px] text-[12px] uppercase tracking-[1px] font-medium opacity-70">
            <a href="#method" className="hover:opacity-100 transition-opacity">Method</a>
            <a href="#engine" className="hover:opacity-100 transition-opacity">Engine</a>
            <a href="#pricing" className="hover:opacity-100 transition-opacity">Free Access</a>
          </div>
          <div className="flex items-center gap-4 cursor-pointer pointer-events-auto">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[12px] opacity-60 hidden md:block">
                  {user.email}
                </span>
                <button 
                  onClick={handleLoadHistory}
                  className="flex items-center gap-2 text-[12px] uppercase tracking-[1px] font-medium opacity-70 hover:opacity-100 transition-opacity"
                >
                  <CalendarDays className="w-3 h-3" />
                  My Ideas
                </button>
                <button 
                  onClick={logOut}
                  className="flex items-center gap-2 text-[12px] uppercase tracking-[1px] font-medium opacity-70 hover:opacity-100 transition-opacity"
                >
                  <LogOut className="w-3 h-3" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={handleSignInClick}
                className="text-[12px] uppercase tracking-[1px] font-medium opacity-70 hover:opacity-100 transition-opacity"
              >
                Sign In
              </button>
            )}
          </div>
        </motion.nav>

        {/* Hero Content */}
        <main className="h-screen flex flex-col justify-center items-center px-[60px] text-center relative z-10 w-full max-w-[1024px] mx-auto pointer-events-none">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={analysisStage === 'transitioning' ? { opacity: [1, 0, 0], y: [0, -20, -20] } : { opacity: 1, y: 0 }}
            transition={analysisStage === 'transitioning' ? { duration: 2.5, times: [0, 0.3, 1] } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-[14px] py-[6px] rounded-full text-[10px] uppercase tracking-[1.5px] text-[#888] mb-[24px]"
          >
            <Sparkles className="w-3 h-3 text-[#888]" />
            <span>The Execution Engine</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={analysisStage === 'transitioning' ? { opacity: [1, 0, 0], y: [0, -20, -20] } : { opacity: 1, y: 0 }}
            transition={analysisStage === 'transitioning' ? { duration: 2.5, times: [0, 0.2, 1] } : { duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-[72px] lg:text-[96px] leading-[1.2] pb-6 font-bold tracking-[-4px] mb-[16px] bg-gradient-to-b from-white to-[#b0b0b0] bg-clip-text text-transparent pointer-events-auto"
          >
            Don't build a product <br /> nobody wants.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={analysisStage === 'transitioning' ? { opacity: [1, 0, 0], y: [0, -20, -20] } : { opacity: 1, y: 0 }}
            transition={analysisStage === 'transitioning' ? { duration: 2.5, times: [0, 0.2, 1] } : { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[800px] text-[16px] md:text-[18px] leading-[1.5] text-white/90 font-light mb-[40px] mx-auto pointer-events-auto drop-shadow-md"
          >
            We ruthlessly expose your idea's fatal flaws before you write code. Get a 7-day execution roadmap to your first revenue.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[920px] relative pointer-events-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            {analysisStage === 'transitioning' && (
              <motion.div 
                className="absolute inset-y-0 left-0 flex items-center px-[32px] pointer-events-none z-[100] text-white font-light text-[16px] md:text-[18px] whitespace-nowrap drop-shadow-2xl"
                style={{ originX: 0, originY: 0.5 }}
                initial={{ x: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
                animate={{ 
                  scale: [1, 2.5, 3],
                  x: [0, 0, '80vw'],
                  opacity: [1, 1, 0],
                  filter: ['blur(0px)', 'blur(0px)', 'blur(10px)']
                }}
                transition={{ duration: 2.5, ease: "easeInOut", times: [0, 0.5, 1] }}
              >
                {idea}
              </motion.div>
            )}

            <motion.div 
               className="relative p-[2px] rounded-[16px] overflow-hidden bg-white/5 group"
               animate={analysisStage === 'transitioning' ? { opacity: [1, 0, 0], scale: [1, 0.95, 0.95] } : { opacity: 1, scale: 1 }}
               transition={{ duration: 2.5, times: [0, 0.2, 1] }}
            >
              <div className="absolute left-1/2 top-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                <div 
                  className="w-full h-full animate-spin opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    animationDuration: '4s',
                    background: 'conic-gradient(from 0deg, transparent 0%, transparent 80%, rgba(255,255,255,1) 100%)'
                  }}
                />
              </div>
              <div className="relative z-10 flex md:flex-row flex-col items-center bg-[#050505] rounded-[15px] p-2 backdrop-blur-[40px] overflow-visible">
                
                <div className={`flex-1 w-full flex items-center transition-opacity duration-300 ${analysisStage === 'transitioning' ? 'opacity-0' : 'opacity-100'}`}>
                  <input
                    id="ideaInput"
                    type="text"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeClick()}
                    placeholder={typingPlaceholder}
                    className="flex-1 w-full bg-transparent border-none outline-none px-[24px] py-[20px] text-white text-[16px] md:text-[18px] font-light placeholder:text-white/40 focus:ring-0"
                    disabled={analysisStage !== 'idle'}
                  />
                </div>
                
                <button 
                  onClick={handleAnalyzeClick}
                  disabled={analysisStage !== 'idle'}
                  className={`cursor-pointer w-full md:w-auto flex items-center justify-center gap-2 bg-white text-black font-bold text-[14px] uppercase tracking-[0.5px] px-[36px] py-[18px] rounded-[10px] hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] ${analysisStage === 'transitioning' ? 'opacity-0' : 'opacity-100'}`}
                >
                  Reveal My Blind Spots
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>
            
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 mx-auto max-w-[500px] rounded-[15px] bg-red-500/10 border border-red-500/20 flex items-center justify-between pointer-events-auto"
              >
                <p className="text-red-400 text-[14px] font-medium">{errorMessage}</p>
                <button onClick={() => setErrorMessage(null)} className="text-red-400/50 hover:text-red-400 ml-4">✕</button>
              </motion.div>
            )}

            <motion.div
               animate={analysisStage === 'transitioning' ? { opacity: [1, 0, 0] } : { opacity: 1 }}
               transition={{ duration: 2.5, times: [0, 0.2, 1] }}
               className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-6 text-[13px] text-white uppercase tracking-[0.5px] font-bold"
            >
              <div className="flex items-center gap-2 drop-shadow-lg bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <CheckCircle2 className="w-4 h-4 text-[#00ff9d]" />
                <span className="tabular-nums tracking-wider">{analyzedCount.toLocaleString()}+ Ideas Analyzed</span>
              </div>
              <div className="flex items-center gap-2 drop-shadow-lg bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <AlertTriangle className="w-4 h-4 text-[#ffdd00]" />
                <span>93% Failure Rate Avoided</span>
              </div>
              <div className="flex items-center gap-2 drop-shadow-lg bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <Target className="w-4 h-4 text-[#00aaff]" />
                <span>Brutal Honesty Guarantee</span>
              </div>
            </motion.div>

          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={analysisStage === 'transitioning' ? { opacity: [1, 0, 0] } : { opacity: 1 }}
            transition={analysisStage === 'transitioning' ? { duration: 2.5, times: [0, 0.3, 1] } : { duration: 0.8, delay: 0.5 }}
            className="mt-6 text-[11px] text-white/30 tracking-[0.5px] pointer-events-auto"
          >
            Press <kbd className="px-1.5 py-0.5 border border-white/20 bg-white/5 rounded mx-1 font-mono">Enter</kbd> to analyze why your startup might fail.
          </motion.p>
        </main>
        
        <motion.div 
          animate={analysisStage === 'transitioning' ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-[40px] w-full flex justify-between px-[60px] box-border text-[11px] text-white/30 uppercase tracking-[1px] pointer-events-none"
        >
          <div className="hidden sm:block">01 / Idea Validation</div>
          <div className="hidden sm:block">02 / Execution Strategy</div>
          <div className="hidden sm:block">03 / First Dollar</div>
        </motion.div>
      </motion.div>

      {/* SECTION 1: Problem vs Solution */}
      <section id="method" className="py-[120px] px-[24px] md:px-[60px] border-t border-white/10 relative bg-[#020202]">
        <div className="max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[80px]">
          <div>
            <div className="text-[10px] uppercase tracking-[1.5px] text-[#aaa] mb-[24px]">The Cold Truth</div>
            <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-2px] leading-[1.1] uppercase mb-[24px] text-white">
              Ideas are cheap.<br/>Validation is fake.
            </h2>
            <p className="text-[16px] text-white/80 leading-[1.7] font-light">
              Most founders spend 6 months building in secret, only to launch to zero users. They use fake validation—asking friends if their idea is "good" instead of asking for a credit card. FirstRevenue doesn't just validate your idea. We expose exactly why your current plan will fail, and force you into a daily actionable protocol designed for one singular outcome: your first transaction.
            </p>
          </div>
          <div className="flex flex-col gap-[16px] justify-center">
            <div className="bg-[#111] border border-[#ff3333]/30 p-[32px] flex items-start gap-[20px]">
              <AlertTriangle className="w-5 h-5 text-[#ff3333] shrink-0 mt-1" />
              <div>
                <h3 className="text-[15px] text-[#ff3333] uppercase tracking-[1px] font-bold mb-[8px]">The Default Path (Failure)</h3>
                <p className="text-[15px] text-white/60 font-light leading-[1.6]">You build features no one asked for. You spend $0 on marketing. You launch, hear crickets, and lose 6 months of your life.</p>
              </div>
            </div>
            <div className="bg-[#00ff9d] text-black p-[32px] flex items-start gap-[20px] shadow-[0_0_40px_rgba(0,255,157,0.15)]">
              <CheckCircle2 className="w-5 h-5 text-black shrink-0 mt-1" />
              <div>
                <h3 className="text-[15px] uppercase tracking-[1px] font-bold mb-[8px]">The FirstRevenue Protocol</h3>
                <p className="text-[15px] text-black/80 font-light leading-[1.6]">You receive a microscopic, 3-step action plan to execute TODAY. "Find 10 people in this specific subreddit. Send them this exact message."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Core Methodology */}
      <section id="engine" className="py-[120px] px-[24px] md:px-[60px] border-t border-white/10 relative overflow-hidden bg-[#050505]">
        <div className="max-w-[1024px] mx-auto text-center mb-[80px]">
          <div className="text-[10px] uppercase tracking-[1.5px] text-[#aaa] mb-[24px]">How We Strip Away The Fluff</div>
          <h2 className="text-[32px] md:text-[56px] text-white font-bold tracking-[-2px] leading-[1] uppercase">The Psychological<br />Teardown.</h2>
        </div>

        <div className="max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          <div className="border border-white/10 p-[48px] bg-[#0c0c0c] flex flex-col items-center text-center group hover:bg-[#151515] hover:border-[#00ff9d]/50 transition-colors shadow-lg">
            <Target className="w-10 h-10 text-white/50 mb-[32px] group-hover:text-[#00ff9d] transition-colors" />
            <div className="text-[10px] uppercase tracking-[1.5px] text-[#aaa] mb-[12px]">Phase 01</div>
            <h3 className="text-[20px] text-white uppercase tracking-[-0.5px] font-bold mb-[16px]">Ruthless Triage</h3>
            <p className="text-[15px] text-white/80 font-light leading-[1.6]">We analyze the 8 core metrics of business survival. If your idea is too slow to execute, we force a pivot to a leaner version instantly.</p>
          </div>
          <div className="border border-white/10 p-[48px] bg-[#0c0c0c] flex flex-col items-center text-center group hover:bg-[#151515] transition-colors shadow-lg">
            <CalendarDays className="w-10 h-10 text-white/50 mb-[32px] group-hover:text-white transition-colors" />
            <div className="text-[10px] uppercase tracking-[1.5px] text-[#aaa] mb-[12px]">Phase 02</div>
            <h3 className="text-[20px] text-white uppercase tracking-[-0.5px] font-bold mb-[16px]">Action Dissection</h3>
            <p className="text-[15px] text-white/80 font-light leading-[1.6]">We generate your exact audience definition, acquisition channels, message templates, pricing strategy, and a day-by-day checklist.</p>
          </div>
          <div className="border border-white/10 p-[48px] bg-[#0c0c0c] flex flex-col items-center text-center group hover:bg-[#151515] transition-colors shadow-lg">
            <RotateCcw className="w-10 h-10 text-white/50 mb-[32px] group-hover:text-white transition-colors" />
            <div className="text-[10px] uppercase tracking-[1.5px] text-[#aaa] mb-[12px]">Phase 03</div>
            <h3 className="text-[20px] text-white uppercase tracking-[-0.5px] font-bold mb-[16px]">Feedback Loop</h3>
            <p className="text-[15px] text-white/80 font-light leading-[1.6]">Track your progress. Log outreach replies, ignored messages, and payments. The AI adjusts your script and targeting based on real data.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: PRICING */}
      <section id="pricing" className="py-[120px] px-[24px] md:px-[60px] border-t border-white/10 relative bg-[#020202]">
        <div className="max-w-[1024px] mx-auto text-center">
          <div className="text-[10px] uppercase tracking-[1.5px] text-[#aaa] mb-[24px]">Cost of Admission</div>
          <h2 className="text-[40px] md:text-[64px] text-white font-bold tracking-[-3px] leading-[1] uppercase mb-[40px]">FREE TO EXECUTE.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
             <div className="p-8 border border-white/10 bg-[#080808] rounded-2xl flex flex-col items-center">
                <span className="text-3xl mb-4">💎</span>
                <h3 className="text-xl font-bold mb-2 uppercase">Beta Access</h3>
                <p className="text-white/40 text-sm mb-6">Full access to the 7-day validation engine. No credit card required during beta.</p>
                <div className="text-4xl font-black text-[#00ff9d] mb-4">$0</div>
                <button onClick={() => {
                  window.scrollTo({top: 0, behavior: 'smooth'});
                  setTimeout(() => document.getElementById('ideaInput')?.focus(), 800);
                }} className="w-full py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-white/90">Start Analysis</button>
             </div>
             <div className="p-8 border border-white/10 bg-[#080808]/50 rounded-2xl flex flex-col items-center opacity-70">
                <span className="text-3xl mb-4">🛡️</span>
                <h3 className="text-xl font-bold mb-2 uppercase">Pro (Legacy)</h3>
                <p className="text-white/40 text-sm mb-6">Advanced metrics and team collaboration features. Coming soon for serious founders.</p>
                <div className="text-4xl font-black text-white/20 mb-4">$49/mo</div>
                <button disabled className="w-full py-3 bg-white/10 text-white/30 font-bold uppercase text-xs tracking-widest rounded-lg cursor-not-allowed">Coming Soon</button>
             </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-[120px] px-[24px] md:px-[80px] border-t border-white/10 bg-[#020202]">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center">
          <div className="flex gap-8 mb-12 text-[12px] uppercase tracking-[2px] font-bold text-white/40">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors cursor-pointer">Terms of Service</a>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-5 h-5 bg-white/20 flex items-center justify-center rounded">
              <div className="w-2 h-2 bg-white" />
            </div>
            <span className="text-[14px] font-bold tracking-[2px] uppercase opacity-40">FirstRevenue</span>
          </div>
          <p className="text-[11px] uppercase tracking-[3px] text-white/20 font-medium text-center">
            © 2026 FirstRevenue. Stop dreaming. Start executing.
          </p>
        </div>
      </footer>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

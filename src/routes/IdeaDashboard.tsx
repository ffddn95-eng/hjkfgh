import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { getIdea, getIdeaActions } from "../lib/ideaService";
import { auth } from "../lib/firebase";
import { CopyBlock } from "../components/execution/CopyBlock";
import { ProofChecklist } from "../components/execution/ProofChecklist";
import { ExecutionNavigator } from "../components/ExecutionNavigator";
import { PivotGenerator } from "../components/PivotGenerator";
import { BuildLock } from "../components/BuildLock";
import { Target, AlertTriangle, ArrowRight, CheckCircle2, Lock, Unlock, Zap, ChevronRight, RotateCcw } from "lucide-react";
import type { ActionCard as ActionCardType } from "../types/execution";

export default function IdeaDashboard() {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const [ideaData, setIdeaData] = useState<any>(null);
  const [actions, setActions] = useState<ActionCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Verdict' | 'Execution' | 'Hooks' | 'Pivot'>('Execution');

  useEffect(() => {
    if (!ideaId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getIdea(ideaId);
        if (!data) {
          navigate("/");
          return;
        }
        setIdeaData(data);
        
        const actionsData = await getIdeaActions(ideaId);
        setActions(actionsData as any);
      } catch (err) {
        console.error("Failed to load idea data", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ideaId, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading Engine Output...</div>;
  }

  return (
    <div className="bg-[#050505] text-white font-['Helvetica_Neue',Arial,sans-serif] min-h-screen relative pb-20">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#020202] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div onClick={() => navigate("/")} className="cursor-pointer flex items-center gap-3">
            <div className="w-4 h-4 bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#050505]" />
            </div>
            <span className="text-[14px] font-bold uppercase tracking-[-0.5px]">Dashboard</span>
          </div>
          <div className="text-xs uppercase tracking-widest text-[#888] font-mono opacity-60">
            ID: {ideaId?.slice(0, 8)}
          </div>
        </div>
      </header>

      {/* Idea Context */}
      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-8 border-b border-white/5">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-12">
          <div className="max-w-3xl">
            <div className="text-[12px] uppercase tracking-[2px] text-[#00ff9d] mb-4 flex items-center gap-2 font-semibold">
              <Zap className="w-4 h-4" /> Core Concept Refined
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight mb-4 leading-snug line-clamp-2 text-white/90">
              {ideaData?.result?.idea?.refinedOneLiner || ideaData?.result?.idea?.rawInput || "No idea found"}
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/70 text-sm md:text-base max-w-full overflow-hidden">
              <Target className="w-4 h-4 text-white/50 shrink-0" />
              <div className="flex items-center gap-1 min-w-0">
                <span className="shrink-0">Target Profile: </span>
                <span className="text-white font-medium truncate">{ideaData?.result?.idea?.targetCustomer || "Undefined"}</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-6 border border-white/10 bg-gradient-to-br from-white/10 to-white/5 rounded-[24px] p-6 shadow-2xl backdrop-blur-sm self-stretch md:self-auto">
            <div className="text-center w-24">
              <div className="text-5xl font-black mb-2 tracking-tighter text-[#00ff9d]">{ideaData?.result?.ruthlessVerdict?.score || 0}</div>
              <div className="text-[11px] uppercase tracking-widest text-white/50 font-semibold">Viability</div>
            </div>
            <div className="h-full w-px bg-white/10 min-h-[80px]" />
            <div className="text-center w-24">
              <div className={`text-2xl font-black uppercase tracking-wider mb-2 ${ideaData?.result?.ruthlessVerdict?.verdict === 'build' ? 'text-[#00ff9d]' : ideaData?.result?.ruthlessVerdict?.verdict === 'kill' ? 'text-red-500' : 'text-yellow-400'}`}>
                {ideaData?.result?.ruthlessVerdict?.verdict || "N/A"}
              </div>
              <div className="text-[11px] uppercase tracking-widest text-white/50 font-semibold">Verdict</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 text-[13px] uppercase tracking-widest font-bold">
          {['Verdict', 'Execution', 'Hooks', 'Pivot'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-[#00ff9d] text-white' 
                    : 'border-transparent text-white/40 hover:text-white/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        {activeTab === 'Verdict' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
             <div className="space-y-12">
               <div>
                  <h3 className="text-[13px] font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-white/20"></span> Brutal Truth
                  </h3>
                  <div className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00ff9d]" />
                    <p className="text-[18px] leading-relaxed text-white/90 font-medium">{ideaData?.result?.ruthlessVerdict?.brutalTruth || ""}</p>
                  </div>
               </div>
               <div>
                  <h3 className="text-[13px] font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-white/20"></span> Fatal Risks
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {ideaData?.result?.fatalRisks?.map((risk: any, i: number) => (
                      <div key={i} className="group border border-red-500/20 bg-gradient-to-r from-red-500/10 to-transparent p-6 rounded-2xl transition-all hover:border-red-500/40">
                        <div className="flex items-center gap-3 text-red-400 font-bold text-[15px] mb-3">
                          <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform" /> {risk.title}
                        </div>
                        <p className="text-white/60 text-[15px] leading-relaxed">{risk.explanation}</p>
                      </div>
                    ))}
                  </div>
               </div>
             </div>
             
             <div>
               <div className="sticky top-32">
                 <h3 className="text-[13px] font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-white/20"></span> Execution Constraints
                 </h3>
                 <div className="bg-[#050505] border border-white/10 rounded-[24px] overflow-hidden p-2 shadow-2xl">
                   {ideaData?.result?.scores && Object.entries(ideaData.result.scores).map(([key, val], idx) => (
                     <div key={key} className={`p-5 flex items-center justify-between ${idx !== 0 ? 'border-t border-white/5' : ''}`}>
                       <span className="text-[15px] font-medium text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                       <div className="flex items-center gap-4">
                         <div className="w-32 sm:w-48 bg-white/5 h-2 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${val}%` }}
                             transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                             className={`h-full ${Number(val) < 40 ? 'bg-red-500' : Number(val) < 70 ? 'bg-yellow-400' : 'bg-[#00ff9d]'}`} 
                           />
                         </div>
                         <span className="text-[13px] font-mono font-bold w-10 text-right opacity-80">{String(val)}%</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        )}

        {activeTab === 'Execution' && (
          <>
            <ExecutionNavigator actions={actions} ideaId={ideaId || ''} />
            <BuildLock actions={actions} />
          </>
        )}

        {activeTab === 'Hooks' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Psychological Hooks</h2>
              <p className="text-white/50 text-lg">Using psychological triggers instead of features to drive engagement.</p>
            </div>
            <div className="flex flex-col gap-8">
              {ideaData?.result?.hooks?.map((hook: any, i: number) => (
                 <div key={i} className="border border-white/10 p-8 bg-gradient-to-b from-[#0a0a0a] to-[#050505] rounded-3xl flex flex-col gap-6 relative overflow-hidden transition-colors hover:border-white/20 shadow-xl">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 opacity-50" />
                   <div className="flex items-center gap-4">
                      <span className="bg-blue-500/10 text-blue-400 text-[11px] uppercase tracking-widest font-black px-3 py-1.5 rounded-lg border border-blue-500/20">Hook 0{i+1}</span>
                      <h3 className="text-2xl font-bold text-white/90">{hook.name}</h3>
                   </div>
                   <div className="p-5 bg-white/5 rounded-2xl font-mono text-[14px] text-blue-200/80 border border-white/5">
                     <span className="text-white/30 block mb-2 uppercase tracking-widest text-[10px] font-sans font-bold">Principle</span>
                     {hook.psychologicalPrinciple}
                   </div>
                   <p className="text-[16px] text-white/80 leading-relaxed pt-2">
                     {hook.implementation}
                   </p>
                 </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Pivot' && (
          <PivotGenerator pivots={ideaData?.result?.pivots || []} />
        )}
      </main>

    </div>
  );
}

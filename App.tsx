
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ICONS, COLORS } from './constants';
import { PredictionRequest, PredictionResult } from './types';
import { predictReaction } from './services/geminiService';

// --- Header Component ---

const Header: React.FC<{ 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}> = ({ activeTab, setActiveTab, theme, toggleTheme }) => {
  const tabs = [
    { id: 'predict', label: 'Predict' },
    { id: 'mechanism', label: 'Mechanism' },
    { id: 'safety', label: 'Safety' },
    { id: 'optimize', label: 'Optimize' },
    { id: 'history', label: 'History' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-[#05120d] border-b border-[#00ff94]/10 shadow-lg">
      <div className="flex items-center gap-2">
        <ICONS.Logo className="w-5 h-5 text-[#00ff94]" />
        <span className="text-sm font-bold tracking-tight text-white mono uppercase">Autochem</span>
      </div>

      <nav className="flex items-center h-full gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 h-full text-xs font-bold transition-all relative flex items-center tracking-wider ${
              activeTab === tab.id ? 'text-[#00ff94]' : 'text-[#a7a7a7] hover:text-[#00ff94]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00ff94] shadow-[0_0_8px_#00ff94]" />
            )}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 text-[#a7a7a7] hover:text-[#00ff94] transition-colors rounded-full hover:bg-white/5"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <ICONS.Sun className="w-4 h-4" /> : <ICONS.Moon className="w-4 h-4" />}
        </button>
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#00ff94]/5 border border-[#00ff94]/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff94] animate-pulse" />
            <span className="text-[9px] mono text-[#00ff94] font-bold">GEMINI 3 PRO SECURE</span>
        </div>
      </div>
    </header>
  );
};

// --- View: Predict Hub ---

const PredictionHub: React.FC<{
  formData: PredictionRequest;
  onInputChange: (field: string, value: any, subfield?: string) => void;
  onPredict: (e: React.FormEvent) => void;
  onClear: () => void;
  loading: boolean;
  prediction: PredictionResult | null;
  setActiveTab: (tab: string) => void;
}> = ({ formData, onInputChange, onPredict, onClear, loading, prediction, setActiveTab }) => {
  return (
    <div className="max-w-[1400px] mx-auto pt-20 px-8 pb-12 animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-white mono mb-2">Reaction Prediction Hub</h1>
            <p className="text-[#a7a7a7] text-sm">AI-powered chemical reaction analysis and optimization platform</p>
        </div>
        <div className="text-right">
            <p className="text-[10px] text-[#a7a7a7] uppercase mono">Server Location</p>
            <p className="text-xs font-bold text-white mono">LOCAL-STORAGE</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <section className="glass-card p-6 border-[#00ff94]/20 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#00ff94]/5 rounded border border-[#00ff94]/10">
                   <ICONS.Flask className="w-4 h-4 text-[#00ff94]" />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-white mono uppercase tracking-tight">Chemical Parameters</h2>
                   <p className="text-[10px] text-[#a7a7a7] uppercase tracking-widest">Input core reactants and synthesis environment</p>
                </div>
             </div>

             <form onSubmit={onPredict} className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase">Reactant Alpha <span className="text-[#ff1493]">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g., Benzene, C6H6"
                      value={formData.reactantA.name}
                      onChange={(e) => onInputChange('reactantA', e.target.value, 'name')}
                      className="w-full bg-[#05120d] border border-white/10 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00ff94] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase">Reactant Beta</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Chlorine, Cl2"
                      value={formData.reactantB?.name}
                      onChange={(e) => onInputChange('reactantB', e.target.value, 'name')}
                      className="w-full bg-[#05120d] border border-white/10 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00ff94] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase">Alpha SMILES</label>
                    <input 
                      type="text" 
                      placeholder="e.g., c1ccccc1"
                      value={formData.reactantA.smiles}
                      onChange={(e) => onInputChange('reactantA', e.target.value, 'smiles')}
                      className="w-full bg-[#05120d] border border-white/10 rounded px-4 py-2 text-sm mono focus:outline-none focus:border-[#00ff94]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase">Beta SMILES</label>
                    <input 
                      type="text" 
                      placeholder="e.g., ClCl"
                      value={formData.reactantB?.smiles}
                      onChange={(e) => onInputChange('reactantB', e.target.value, 'smiles')}
                      className="w-full bg-[#05120d] border border-white/10 rounded px-4 py-2 text-sm mono focus:outline-none focus:border-[#00ff94]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 col-span-2">
                   <div>
                      <label className="block text-xs font-bold text-white mb-2 uppercase">Reaction Medium</label>
                      <select 
                        value={formData.solvent}
                        onChange={(e) => onInputChange('solvent', e.target.value)}
                        className="w-full bg-[#05120d] border border-white/10 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00ff94]"
                      >
                         <option value="DMF">DMF (Dimethylformamide)</option>
                         <option value="DMSO">DMSO (Dimethyl sulfoxide)</option>
                         <option value="Water">H2O (Aqueous)</option>
                         <option value="DCM">DCM (Dichloromethane)</option>
                         <option value="THF">THF (Tetrahydrofuran)</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-white mb-2 uppercase">Thermal Envelope (°C)</label>
                      <input 
                        type="number" 
                        value={formData.temperature}
                        onChange={(e) => onInputChange('temperature', parseInt(e.target.value))}
                        className="w-full bg-[#05120d] border border-white/10 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00ff94]"
                      />
                   </div>
                </div>

                <div className="col-span-2 flex items-center gap-4 mt-4">
                   <button 
                    onClick={onPredict}
                    disabled={loading}
                    className="flex-1 bg-[#00ff94] text-[#05120d] font-black py-3 rounded flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_#00ff9444] uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      {loading ? (
                         <div className="w-4 h-4 border-2 border-[#05120d] border-t-transparent rounded-full animate-spin" />
                      ) : <ICONS.Molecule className="w-4 h-4" />}
                      {loading ? 'Initializing Analysis...' : 'Start Prediction'}
                   </button>
                   <button 
                    type="button" 
                    onClick={onClear}
                    className="flex items-center gap-2 text-[#a7a7a7] hover:text-white text-sm font-medium transition-colors"
                   >
                      <ICONS.Refresh className="w-4 h-4" />
                      Reset
                   </button>
                </div>
             </form>
          </section>

          {/* Results Display */}
          <section className="mt-8 glass-card border-white/10 min-h-[500px] flex flex-col p-0 overflow-hidden shadow-2xl">
             <div className="h-12 border-b border-white/5 flex items-center px-4 gap-6 bg-[#0a1f1a]/80 backdrop-blur-md">
                {[
                  { id: 'overview', label: 'Overview', icon: ICONS.Grid },
                  { id: 'mechanism', label: 'Mechanism', icon: ICONS.Molecule },
                  { id: 'optimize', label: 'Optimization', icon: ICONS.Settings },
                  { id: 'safety', label: 'Safety', icon: ICONS.Shield },
                ].map(tab => (
                   <button 
                    key={tab.id}
                    onClick={() => {
                        if(prediction) {
                            setActiveTab(tab.id === 'overview' ? 'predict' : tab.id);
                        }
                    }}
                    className={`text-[10px] font-black flex items-center gap-2 h-full border-b-2 transition-all uppercase tracking-widest ${
                       prediction ? 'text-[#a7a7a7] hover:text-[#00ff94] border-transparent' : 'text-[#a7a7a7]/20 border-transparent cursor-not-allowed'
                    } ${tab.id === 'overview' && prediction ? 'border-[#00ff94] text-[#00ff94]' : ''}`}
                   >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                   </button>
                ))}
             </div>
             
             <div className="flex-1 flex flex-col items-center justify-center p-8">
                {!prediction && !loading ? (
                  <div className="text-center animate-in fade-in zoom-in-95 duration-1000">
                    <div className="mb-6 opacity-10">
                      <ICONS.Molecule className="w-24 h-24 text-[#00ff94] mx-auto" />
                    </div>
                    <h3 className="text-xl font-black text-white mono mb-2 uppercase tracking-tighter">Engine Standby</h3>
                    <p className="text-xs text-[#a7a7a7] max-w-sm leading-relaxed opacity-60">Ready for molecular synthesis. Provide reactant parameters to begin AI-assisted prediction.</p>
                  </div>
                ) : prediction && (
                  <div className="w-full text-left space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                     <div className="flex justify-between items-start">
                        <div className="flex-1 pr-12">
                           <div className="text-[10px] font-black text-[#00ff94] uppercase mb-1 tracking-widest">Target Product</div>
                           <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">{prediction.overview.productName}</h2>
                           <div className="flex flex-wrap gap-2">
                              <span className="bg-[#00ff94]/10 text-[#00ff94] border border-[#00ff94]/20 px-3 py-1 rounded-full text-[9px] font-black mono uppercase">{prediction.overview.reactionType}</span>
                              <span className="bg-white/5 text-[#a7a7a7] border border-white/10 px-3 py-1 rounded-full text-[9px] font-black mono">{prediction.overview.smiles}</span>
                           </div>
                        </div>
                        <div className="text-right glass-card px-4 py-3 border-[#00ff94]/30 bg-[#00ff94]/5">
                           <div className="text-[9px] font-black text-[#00ff94] uppercase mb-1 tracking-widest">Model Confidence</div>
                           <div className="text-4xl font-black text-white mono">{(prediction.overview.confidence * 100).toFixed(0)}%</div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { l: 'Estimated Yield', v: `${prediction.overview.yield}%`, c: 'text-white' },
                            { l: 'Synthesis Time', v: prediction.overview.time, c: 'text-white' },
                            { l: 'Risk Profile', v: prediction.safety.overallRisk, c: prediction.safety.overallRisk === 'High' ? 'text-[#ff1493]' : 'text-[#ffeb3b]' },
                            { l: 'Session ID', v: `#${prediction.id.slice(-6).toUpperCase()}`, c: 'text-[#00ff94]' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#05120d] p-4 rounded border border-white/10 hover:border-[#00ff94]/20 transition-colors">
                                <div className="text-[9px] font-black text-[#a7a7a7] uppercase mb-1 tracking-widest">{stat.l}</div>
                                <div className={`text-xl font-black mono ${stat.c}`}>{stat.v}</div>
                            </div>
                        ))}
                     </div>

                     <div className="bg-[#0a1f1a]/80 border border-[#00ff94]/10 p-6 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ICONS.Check className="w-16 h-16 text-[#00ff94]" />
                        </div>
                        <h4 className="text-[10px] font-black text-[#00ff94] uppercase mb-3 tracking-widest flex items-center gap-2"><ICONS.Grid className="w-3 h-3" /> Predictive Summary</h4>
                        <p className="text-xs text-[#a7a7a7] leading-relaxed max-w-3xl italic">
                           "Prediction converged for {prediction.overview.productName}. Simulation indicates a high probability of success in {prediction.inputs.solvent} at {prediction.inputs.temperature}°C. Mechanism primarily follows the {prediction.overview.reactionType} pathway with a critical transition state identified. Review safety protocols regarding the {prediction.safety.overallRisk} risk classification before physical lab trial."
                        </p>
                     </div>
                  </div>
                )}
             </div>
          </section>
        </div>

        {/* Live Status Sidebar */}
        <div className="col-span-12 lg:col-span-4">
          <aside className="glass-card p-6 border-white/10 h-full min-h-[500px] flex flex-col">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#00ff94]/5 rounded border border-[#00ff94]/10 text-[#00ff94]">
                   <ICONS.History className="w-4 h-4" />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-white mono uppercase">Simulation Log</h2>
                   <p className="text-[10px] text-[#a7a7a7] uppercase tracking-widest">Active session timeline</p>
                </div>
             </div>

             <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {prediction ? (
                    <div className="bg-[#05120d] p-4 rounded border border-[#00ff94]/20 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-bold text-[#00ff94] mono bg-[#00ff94]/5 px-2 py-0.5 rounded border border-[#00ff94]/10 tracking-widest uppercase">Latest</span>
                            <span className="text-[9px] font-bold text-[#a7a7a7]">{new Date(prediction.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-sm font-black text-white mb-3 tracking-tight">{prediction.overview.productName}</div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div className="flex gap-2">
                                <span className="text-[9px] font-black text-[#a7a7a7] uppercase">{prediction.overview.yield}% Yield</span>
                                <span className="text-[9px] font-black text-[#a7a7a7] uppercase">•</span>
                                <span className="text-[9px] font-black text-[#00e5ff] uppercase">{prediction.id.slice(-6).toUpperCase()}</span>
                            </div>
                            <button onClick={() => setActiveTab('history')} className="text-[#00ff94] text-[9px] font-black uppercase tracking-widest hover:underline transition-all">Archived</button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-center opacity-20 group">
                        <ICONS.Molecule className="w-12 h-12 mb-4 transition-transform group-hover:rotate-45 duration-700" />
                        <p className="text-[10px] font-bold mono uppercase tracking-widest">No Active Simulation</p>
                    </div>
                )}
             </div>

             <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <button 
                    onClick={() => setActiveTab('history')}
                    className="w-full py-2 border border-white/10 rounded text-[10px] font-black text-[#a7a7a7] hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
                >
                    View Cloud Archive
                </button>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// --- View: Mechanism Step-Through ---

const MechanismView: React.FC<{ 
  prediction: PredictionResult | null; 
  setActiveTab: (tab: string) => void 
}> = ({ prediction, setActiveTab }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && prediction) {
      playRef.current = window.setInterval(() => {
        setCurrentStep(prev => (prev + 1) % prediction.mechanism.length);
      }, 3000);
    } else if (playRef.current) {
      clearInterval(playRef.current);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying, prediction]);

  const steps = prediction?.mechanism || [
    { step: 1, title: 'Incipient State', description: 'Simulate a reaction to view mechanistic path.' },
  ];

  const currentSmiles = prediction?.mechanism[currentStep]?.intermediate || prediction?.overview.smiles;

  return (
    <div className="max-w-[1400px] mx-auto pt-20 px-8 pb-12 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
            <div className="p-3 bg-[#00ff94]/10 rounded-xl border border-[#00ff94]/20 shadow-[0_0_15px_#00ff9422]">
                <ICONS.Molecule className="w-8 h-8 text-[#00ff94]" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-white mono mb-1 tracking-tighter uppercase">Mechanistic Pathways</h1>
                <p className="text-[#a7a7a7] text-sm italic">Simulated electron flow and intermediate trajectory mapping</p>
            </div>
        </div>
        <button onClick={() => setActiveTab('predict')} className="text-[10px] font-black text-[#a7a7a7] hover:text-[#00ff94] flex items-center gap-2 border border-white/10 px-4 py-2 rounded uppercase tracking-widest transition-all">
           <ICONS.External className="w-4 h-4" /> Back to Summary
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
           {/* Mechanism Controls */}
           <div className="glass-card p-6 border-[#00ff94]/10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-1 bg-[#00ff94]/20" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xs font-black text-[#00ff94] mono uppercase tracking-widest">Progress: {currentStep + 1} / {steps.length}</h3>
                 <div className="flex items-center gap-1">
                    {steps.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-[#00ff94] shadow-[0_0_8px_#00ff94]' : 'w-2 bg-white/10'}`} 
                        />
                    ))}
                 </div>
              </div>

              <div className="bg-[#05120d] border border-white/5 rounded-xl p-6 flex items-start gap-6 animate-in slide-in-from-left-4">
                 <div className="text-5xl font-black text-white/5 mono select-none">0{currentStep + 1}</div>
                 <div>
                    <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight">{steps[currentStep].title}</h4>
                    <p className="text-sm text-[#a7a7a7] leading-relaxed max-w-2xl">{steps[currentStep].description}</p>
                 </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                 <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        className="p-3 text-[#a7a7a7] hover:text-[#00ff94] hover:bg-[#00ff94]/5 rounded-full transition-all"
                    >
                        <ICONS.Archive className="w-5 h-5 rotate-180" />
                    </button>
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                            isPlaying ? 'bg-[#ff1493] text-white shadow-[0_0_20px_#ff149366]' : 'bg-[#00ff94] text-[#05120d] shadow-[0_0_20px_#00ff9466]'
                        }`}
                    >
                        {isPlaying ? <ICONS.Pause className="w-6 h-6" /> : <ICONS.Play className="w-6 h-6" />}
                    </button>
                    <button 
                        onClick={() => setCurrentStep(prev => (prev + 1) % steps.length)}
                        className="p-3 text-[#a7a7a7] hover:text-[#00ff94] hover:bg-[#00ff94]/5 rounded-full transition-all"
                    >
                        <ICONS.ArrowRight className="w-5 h-5" />
                    </button>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-[#a7a7a7] uppercase tracking-widest mono">Sim Speed:</span>
                    <div className="flex p-1 bg-[#05120d] rounded-lg border border-white/10">
                        {['1x', '2x', '4x'].map(s => (
                            <button key={s} className={`px-4 py-1.5 text-[10px] font-black mono rounded transition-all ${s === '1x' ? 'bg-[#00ff94] text-[#05120d]' : 'text-[#a7a7a7] hover:text-white'}`}>{s}</button>
                        ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Reaction Diagram (SMILES Viewer) */}
           <div className="glass-card border-[#00ff94]/10 min-h-[500px] flex flex-col bg-[#111] shadow-2xl overflow-hidden group">
              <div className="bg-[#1a1a1a] p-4 flex justify-between items-center border-b border-white/5">
                 <div className="flex items-center gap-3">
                    <ICONS.Settings className="w-4 h-4 text-[#00ff94]" />
                    <span className="text-xs font-black text-white mono uppercase tracking-widest">Active Complex Visualization</span>
                 </div>
                 <div className="flex gap-4 text-[10px] font-black text-[#a7a7a7] mono bg-[#05120d] px-3 py-1 rounded-full border border-white/5">
                    <span className="flex items-center gap-1.5"><ICONS.Search className="w-3 h-3" /> RES: 1024P</span>
                    <span className="w-[1px] h-3 bg-white/10" />
                    <span className="text-[#00ff94]">RENDER: NATIVE-ESM</span>
                 </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                 
                 <div className="relative z-10 animate-in zoom-in-90 duration-1000 flex flex-col items-center group-hover:scale-105 transition-transform">
                    {prediction ? (
                        <div className="relative">
                            <div className="absolute -inset-10 bg-[#00ff94]/10 blur-3xl rounded-full animate-pulse" />
                            <img 
                                src={`https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?smiles=${encodeURIComponent(currentSmiles || '')}&t=l`} 
                                alt="Reaction Transition State" 
                                className="max-h-[300px] object-contain invert grayscale brightness-[1.8] contrast-[1.4] drop-shadow-[0_0_25px_rgba(0,255,148,0.4)] relative z-20" 
                            />
                        </div>
                    ) : (
                        <div className="text-center opacity-30">
                            <ICONS.Molecule className="w-20 h-20 mb-6 mx-auto animate-pulse" />
                            <p className="text-xs font-black uppercase mono">No active diagram</p>
                        </div>
                    )}
                    
                    <div className="mt-12 grid grid-cols-2 gap-12 border-t border-white/5 pt-8 w-full max-w-md">
                       <div className="text-center">
                          <div className="text-[10px] font-black text-[#00ff94] uppercase mb-1 tracking-widest">Potential Energy</div>
                          <div className="text-xl font-black mono text-white tracking-tighter">{82.4 + (currentStep * 4.2)} kJ</div>
                       </div>
                       <div className="text-center border-l border-white/10">
                          <div className="text-[10px] font-black text-[#00e5ff] uppercase mb-1 tracking-widest">Electron Density</div>
                          <div className="text-xl font-black mono text-white tracking-tighter">0.{95 - currentStep}4 ρ</div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-4 flex gap-3 bg-[#1a1a1a] border-t border-white/5">
                 <button className="bg-white/5 text-[#a7a7a7] hover:text-white border border-white/10 px-4 py-2 rounded text-[10px] font-black flex items-center gap-2 uppercase tracking-widest transition-all">
                   <ICONS.Grid className="w-3.5 h-3.5" /> Grid Overlay
                 </button>
                 <button className="bg-[#00ff94]/10 text-[#00ff94] border border-[#00ff94]/30 px-4 py-2 rounded text-[10px] font-black flex items-center gap-2 uppercase tracking-widest hover:brightness-125 transition-all">
                   <ICONS.Check className="w-3.5 h-3.5" /> High-Fidelity Render
                 </button>
              </div>
           </div>
        </div>

        {/* Mechanism Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="glass-card p-6 border-white/10 bg-[#0a1f1a]/40 shadow-xl">
              <h3 className="text-xs font-black text-white mono uppercase mb-6 flex items-center gap-3">
                 <ICONS.Archive className="w-4 h-4 text-[#00ff94]" /> Technical Context
              </h3>
              <div className="space-y-6">
                 <div className="group">
                    <label className="block text-[9px] text-[#a7a7a7] uppercase tracking-widest mb-2 font-black">Pathway Type</label>
                    <div className="flex items-center gap-3 text-[#00ff94] font-black text-xs uppercase mono tracking-widest">
                       <div className="w-1.5 h-1.5 bg-[#00ff94] rounded-full shadow-[0_0_8px_#00ff94]" /> 
                       {prediction?.overview.reactionType || 'Inactive'}
                    </div>
                 </div>
                 <div>
                    <label className="block text-[9px] text-[#a7a7a7] uppercase tracking-widest mb-2 font-black">Predicted Barrier</label>
                    <div className="flex items-center gap-3 text-white font-black text-xs uppercase mono">
                       <ICONS.Clock className="w-4 h-4 text-[#ffeb3b]" /> {prediction ? '15.4 kcal/mol' : 'N/A'}
                    </div>
                 </div>
                 <div>
                    <label className="block text-[9px] text-[#a7a7a7] uppercase tracking-widest mb-2 font-black">Activation State</label>
                    <div className="flex items-center gap-3 text-white font-black text-xs uppercase mono">
                       <ICONS.Molecule className="w-4 h-4 text-[#00ff94]" /> {currentStep === steps.length - 1 ? 'Ground State' : 'Excited State'}
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card p-6 border-white/10 shadow-xl">
              <h3 className="text-xs font-black text-[#ffeb3b] mono uppercase mb-6 flex items-center gap-3">
                 <ICONS.Molecule className="w-4 h-4" /> Atomic Transitions
              </h3>
              <div className="space-y-4">
                 {[
                    { label: 'Transition State', val: 'Step 2', level: 'Transient' },
                    { label: 'Ion Pair Complex', val: 'Step 3', level: 'Moderate' }
                 ].map((insight, i) => (
                    <div key={i} className="p-4 border border-white/5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black text-white uppercase mono tracking-wider">{insight.label}</span>
                            <span className="text-[9px] font-bold text-[#ffeb3b] mono">{insight.val}</span>
                        </div>
                        <p className="text-[10px] text-[#a7a7a7] leading-relaxed italic opacity-70">Significant molecular dipole shift observed during orbital re-hybridization.</p>
                        <span className="text-[9px] font-black text-[#ff1493] uppercase mt-3 block tracking-widest">{insight.level} Life</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- View: Optimization Lab ---

const OptimizeView: React.FC<{ 
  prediction: PredictionResult | null; 
  setActiveTab: (tab: string) => void 
}> = ({ prediction, setActiveTab }) => {
  const [temp, setTemp] = useState(85);
  const [pressure, setPressure] = useState(1.5);
  const [time, setTime] = useState(4);
  
  // Real-time reactive mock logic for the lab dashboard
  const baseYield = prediction?.overview.yield || 72;
  const currentYield = useMemo(() => {
    const tempDev = Math.abs(temp - 85) * 0.4;
    const pressDev = Math.abs(pressure - 1.5) * 6;
    const timeDev = Math.abs(time - 4) * 1.5;
    return Math.max(0, Math.min(100, (baseYield - tempDev - pressDev - timeDev))).toFixed(1);
  }, [temp, pressure, time, baseYield]);

  return (
    <div className="max-w-[1400px] mx-auto pt-20 px-8 pb-12 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
            <div className="p-3 bg-[#00ff94]/10 rounded-xl border border-[#00ff94]/20 shadow-[0_0_15px_#00ff9422]">
                <ICONS.Settings className="w-8 h-8 text-[#00ff94]" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-white mono mb-1 uppercase tracking-tighter">Optimization Laboratory</h1>
                <p className="text-[#a7a7a7] text-sm italic">AI-driven multi-variate parameter tuning for maximal synthesis efficiency</p>
            </div>
        </div>
        <button onClick={() => setActiveTab('predict')} className="bg-[#00ff94] text-[#05120d] px-8 py-2.5 rounded text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_#00ff9455] hover:brightness-110 active:scale-95 transition-all">
           <ICONS.Molecule className="w-4 h-4" /> Start New Simulation
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
         {[
           { l: 'Yield Sensitivity', v: `+${(parseFloat(currentYield) - (prediction?.overview.yield || 72)).toFixed(1)}%`, c: '#00ff94' },
           { l: 'Effective Yield', v: `${currentYield}%`, c: '#00ff94' },
           { l: 'Synthesis Delta', v: '+14.2%', c: '#ffeb3b' },
           { l: 'Ecological Impact', v: '98.4%', c: '#00ff94' },
         ].map((m, i) => (
            <div key={i} className="glass-card p-6 border-white/10 relative overflow-hidden group hover:border-[#00ff94]/40 transition-all shadow-xl">
               <div className="text-[10px] font-black text-[#a7a7a7] uppercase mb-2 flex items-center gap-2">
                  <ICONS.Chart className="w-3.5 h-3.5 text-[#00ff94]" /> {m.l}
               </div>
               <div className="text-4xl font-black mono tracking-tighter" style={{ color: m.c }}>{m.v}</div>
               <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/5 opacity-[0.05] pointer-events-none group-hover:opacity-10 transition-opacity" />
            </div>
         ))}
      </div>

      <div className="glass-card p-10 border-[#00ff94]/10 shadow-2xl relative">
         <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-[#00ff94]/5 rounded-xl border border-[#00ff94]/10"><ICONS.Settings className="w-6 h-6 text-[#00ff94]" /></div>
            <div>
               <h3 className="text-2xl font-black text-white mono uppercase tracking-tight">Interactive Sandbox</h3>
               <p className="text-xs text-[#a7a7a7] max-w-xl italic">Live-calculated yield shifts based on mechanistic energy barrier simulation.</p>
            </div>
         </div>
         
         <div className="space-y-16 px-6 max-w-4xl">
            {[
              { l: 'Temperature Gradient', v: `${temp}°C`, opt: '85°C', min: 60, max: 100, val: temp, set: setTemp, color: '#ff1493' },
              { l: 'System Overpressure', v: `${pressure} atm`, opt: '1.5 atm', min: 0.5, max: 3.0, val: pressure, set: setPressure, color: '#00e5ff' },
              { l: 'Activation Time', v: `${time} hrs`, opt: '4 hrs', min: 1, max: 8, val: time, set: setTime, color: '#ffeb3b' },
            ].map((s, i) => (
               <div key={i} className="relative group">
                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-white uppercase mono tracking-widest">{s.l}</span>
                        <div className="flex items-center gap-2 bg-[#00ff94]/10 border border-[#00ff94]/30 px-3 py-1 rounded-full animate-pulse shadow-[0_0_10px_#00ff9422]">
                            <ICONS.Check className="w-3 h-3 text-[#00ff94]" />
                            <span className="text-[9px] font-black text-[#00ff94] uppercase tracking-widest">Ideal Target: {s.opt}</span>
                        </div>
                     </div>
                     <span className="text-4xl font-black text-white mono drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{s.v}</span>
                  </div>
                  <input 
                    type="range" 
                    step={s.min % 1 === 0 ? 1 : 0.1}
                    min={s.min} 
                    max={s.max} 
                    value={s.val}
                    onChange={(e) => s.set(parseFloat(e.target.value))}
                    className="w-full h-2.5 bg-[#05120d] rounded-full appearance-none mb-6 cursor-pointer hover:brightness-125 transition-all" 
                    style={{ accentColor: s.color }}
                  />
                  <div className="flex justify-between text-[11px] font-black mono text-[#a7a7a7] uppercase tracking-tighter opacity-60">
                     <span>MIN: {s.min}</span>
                     <span>MAX: {s.max}</span>
                  </div>
               </div>
            ))}
         </div>

         <div className="mt-16 pt-10 border-t border-white/5 flex justify-center">
            <div className="bg-[#00ff94]/5 border border-[#00ff94]/20 p-8 rounded-3xl text-center max-w-md shadow-2xl animate-pulse">
                <div className="text-[10px] font-black text-[#00ff94] uppercase mb-2 tracking-widest">Global Optima Confidence</div>
                <div className="text-6xl font-black text-white mono mb-4">{currentYield}%</div>
                <p className="text-[11px] text-[#a7a7a7] italic italic">"Current parameter matrix indicates peak synthesis efficiency at current configuration. Run physical trial with these validated conditions."</p>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- View: Safety & Risk Assessment ---

const SafetyView: React.FC<{ 
  prediction: PredictionResult | null; 
  setActiveTab: (tab: string) => void 
}> = ({ prediction, setActiveTab }) => {
  if (!prediction) {
    return (
      <div className="max-w-[1400px] mx-auto pt-20 px-8 pb-12 flex flex-col items-center justify-center min-h-[60vh]">
        <ICONS.Shield className="w-20 h-20 text-[#a7a7a7] opacity-20 mb-6" />
        <h2 className="text-2xl font-black text-white mono uppercase mb-4 tracking-tighter">No Safety Data Available</h2>
        <p className="text-sm text-[#a7a7a7] mb-8 text-center max-w-sm">Complete a reaction simulation in the Prediction Hub to generate detailed hazard analysis.</p>
        <button onClick={() => setActiveTab('predict')} className="bg-[#00ff94] text-[#05120d] px-8 py-3 rounded font-black text-[11px] uppercase tracking-widest transition-all hover:brightness-110 shadow-[0_0_20px_#00ff9444]">Return to Prediction Hub</button>
      </div>
    );
  }

  const { safety } = prediction;

  return (
    <div className="max-w-[1400px] mx-auto pt-20 px-8 pb-12 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
            <div className="p-3 bg-[#ff1493]/10 rounded-xl border border-[#ff1493]/20 shadow-[0_0_15px_#ff149322]">
                <ICONS.Shield className="w-8 h-8 text-[#ff1493]" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-white mono mb-1 uppercase tracking-tighter">Safety Protocol Archive</h1>
                <p className="text-[#a7a7a7] text-sm italic">GHS-compliant chemical hazard identification and risk mitigation mapping</p>
            </div>
        </div>
        <button onClick={() => setActiveTab('predict')} className="text-[10px] font-black text-[#a7a7a7] hover:text-[#00ff94] flex items-center gap-2 border border-white/10 px-4 py-2 rounded uppercase tracking-widest transition-all">
           <ICONS.External className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Risk Profile & Hazards */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
           <div className={`glass-card p-8 border-2 relative overflow-hidden transition-all ${safety.overallRisk === 'High' ? 'border-[#ff1493]/40 bg-[#ff1493]/5' : safety.overallRisk === 'Moderate' ? 'border-[#ffeb3b]/40 bg-[#ffeb3b]/5' : 'border-[#00ff94]/40 bg-[#00ff94]/5'}`}>
              <div className={`absolute top-0 right-0 p-6 text-4xl font-black mono uppercase tracking-tighter opacity-80 ${safety.overallRisk === 'High' ? 'text-[#ff1493]' : safety.overallRisk === 'Moderate' ? 'text-[#ffeb3b]' : 'text-[#00ff94]'}`}>
                {safety.overallRisk} RISK
              </div>
              <h3 className="text-xs font-black text-white mono uppercase mb-10 flex items-center gap-3">
                 <ICONS.Warning className="w-4 h-4 text-[#ff1493]" /> Active Hazard Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {safety.hazards.map((hazard, i) => (
                    <div key={i} className="p-6 bg-[#05120d] border border-white/5 rounded-2xl hover:border-[#ff1493]/30 transition-all group relative">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-black text-white uppercase tracking-tight">{hazard.type}</span>
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full border mono uppercase tracking-widest ${hazard.level === 'High' ? 'border-[#ff1493] text-[#ff1493] bg-[#ff1493]/5' : 'border-[#ffeb3b] text-[#ffeb3b] bg-[#ffeb3b]/5'}`}>{hazard.level}</span>
                       </div>
                       <p className="text-[11px] text-[#a7a7a7] leading-relaxed mb-6 opacity-80">{hazard.description}</p>
                       <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className={`h-full ${hazard.level === 'High' ? 'bg-[#ff1493]' : 'bg-[#ffeb3b]'}`} style={{ width: hazard.score.includes('%') ? hazard.score : `${hazard.score}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-white mono">{hazard.score}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Reagent Safety Data Sheets (Simplified) */}
           <div className="glass-card p-8 border-white/10 shadow-2xl bg-[#0a1f1a]/40">
              <h3 className="text-xs font-black text-[#00ff94] mono uppercase mb-8 flex items-center gap-3">
                 <ICONS.Flask className="w-4 h-4" /> Reagent Toxicity Profiles
              </h3>
              <div className="grid grid-cols-1 gap-6">
                 {safety.reagents.map((reagent, i) => (
                    <div key={i} className="p-6 bg-[#05120d] border border-white/10 rounded-2xl group hover:border-[#00ff94]/20 transition-all">
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{reagent.name}</h4>
                             <div className="flex gap-2">
                                <span className="text-[9px] font-black text-[#ff1493] mono uppercase bg-[#ff1493]/10 px-2 py-0.5 rounded border border-[#ff1493]/20">GHS: {reagent.hCodes}</span>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             {reagent.ppe.map((item, j) => (
                                <div key={j} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-black text-[#a7a7a7] uppercase tracking-widest flex items-center gap-2">
                                    <ICONS.Shield className="w-3 h-3 text-[#00ff94]" /> {item}
                                </div>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                             <span className="block text-[9px] font-black text-[#00ff94] uppercase mb-2 tracking-widest">Mandatory Precautions</span>
                             <p className="text-[11px] text-[#a7a7a7] leading-relaxed italic">"{reagent.precautions}"</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Emergency & Environmental Response */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="glass-card p-6 border-[#ff1493]/30 bg-[#ff1493]/5 shadow-[0_0_30px_#ff149311]">
              <h3 className="text-xs font-black text-[#ff1493] mono uppercase mb-8 flex items-center gap-3">
                 <ICONS.Warning className="w-4 h-4" /> Crisis Management
              </h3>
              <div className="space-y-4">
                 {[
                    { label: 'Dermal Response', val: safety.emergency.skin, icon: ICONS.Settings },
                    { label: 'Ocular Irrigation', val: safety.emergency.eye, icon: ICONS.Search },
                    { label: 'Respiratory Relief', val: safety.emergency.inhalation, icon: ICONS.Flask },
                    { label: 'Ingestion Treatment', val: safety.emergency.ingestion, icon: ICONS.Warning },
                 ].map((e, i) => (
                    <div key={i} className="p-5 bg-[#05120d] border border-white/5 rounded-2xl hover:border-[#ff1493]/30 transition-all">
                       <label className="flex items-center gap-2 text-[10px] text-[#ff1493] uppercase font-black tracking-widest mb-2">
                          <e.icon className="w-3 h-3" /> {e.label}
                       </label>
                       <p className="text-[11px] text-[#f5f5f5] leading-relaxed opacity-90">{e.val}</p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-6 border-[#00e5ff]/30 bg-[#00e5ff]/5">
              <h3 className="text-xs font-black text-[#00e5ff] mono uppercase mb-8 flex items-center gap-3">
                 <ICONS.Chart className="w-4 h-4" /> Scale-Up Safety Logistics
              </h3>
              <div className="space-y-4">
                 {safety.scaleUp.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 bg-[#05120d] border border-white/5 rounded-xl group hover:border-[#00e5ff]/30 transition-all">
                       <div className="p-1.5 bg-[#00e5ff]/10 rounded border border-[#00e5ff]/20">
                          <ICONS.Check className="w-3 h-3 text-[#00e5ff]" />
                       </div>
                       <span className="text-[11px] text-[#a7a7a7] leading-relaxed italic">{item}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-[#00ff94]/5 border border-[#00ff94]/20 rounded-3xl text-center shadow-inner group">
              <ICONS.Shield className="w-12 h-12 text-[#00ff94] mx-auto mb-4 opacity-50 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black text-[#00ff94] uppercase tracking-widest mb-1">Safety Clearance</p>
              <p className="text-[11px] text-[#a7a7a7] italic leading-relaxed">System-generated reports are intended for preliminary assessment only. Always consult internal EHS protocols before execution.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- View: History & Archive ---

const HistoryView: React.FC<{ 
  history: PredictionResult[]; 
  setActiveTab: (tab: string) => void;
  onSelect: (p: PredictionResult) => void;
  onDelete: (id: string) => void;
  loadingHistory: boolean;
}> = ({ history, setActiveTab, onSelect, onDelete, loadingHistory }) => {
  const [search, setSearch] = useState('');
  
  const filtered = history.filter(h => 
    h.overview.productName.toLowerCase().includes(search.toLowerCase()) || 
    h.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto pt-20 px-8 pb-12 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
            <div className="p-3 bg-[#00ff94]/10 rounded-xl border border-[#00ff94]/20">
                <ICONS.History className="w-8 h-8 text-[#00ff94]" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-white mono mb-1 uppercase tracking-tighter">Reaction Archive</h1>
                <p className="text-[#a7a7a7] text-sm italic">Local simulation dataset stored in browser storage</p>
            </div>
        </div>
        <button onClick={() => setActiveTab('predict')} className="text-[11px] font-black text-[#00ff94] hover:bg-[#00ff94]/10 flex items-center gap-2 border border-[#00ff94]/30 px-6 py-2.5 rounded uppercase tracking-widest transition-all">
           New Experiment
        </button>
      </div>

      <div className="relative mb-10 group">
         <ICONS.Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a7a7a7] group-focus-within:text-[#00ff94] transition-colors" />
         <input 
           type="text" 
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           placeholder="Filter cloud simulation archive by IUPAC name or ID..."
           className="w-full bg-[#0a1f1a] border border-white/10 rounded-xl px-14 py-4 text-sm focus:outline-none focus:border-[#00ff94] transition-all placeholder-[#a7a7a7]/40 shadow-xl"
         />
      </div>

      {loadingHistory ? (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00ff94]/20 border-t-[#00ff94] rounded-full animate-spin mb-6" />
            <p className="text-xs font-black mono text-[#00ff94] animate-pulse uppercase tracking-widest">Loading from Local Storage...</p>
        </div>
      ) : (
        <div className="space-y-4">
            {filtered.length > 0 ? filtered.map((item, i) => (
                <div key={item.id} className="glass-card p-6 border-white/10 hover:border-[#00ff94]/40 transition-all group bg-[#0a1f1a]/30 hover:bg-[#0a1f1a]/60 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-6">
                        <div className="w-16 h-16 rounded-xl bg-[#05120d] border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#00ff94]/30 transition-all">
                            <img 
                                src={`https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?smiles=${encodeURIComponent(item.overview.smiles)}&t=l`} 
                                className="w-full p-2 invert grayscale brightness-[2] group-hover:scale-110 transition-all duration-500" 
                                alt="Reaction" 
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-white mono group-hover:text-[#00ff94] transition-colors uppercase tracking-tight">{item.overview.productName}</h3>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-[10px] text-[#a7a7a7] mono tracking-widest font-black uppercase">#{item.id.slice(-8).toUpperCase()}</p>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <p className="text-[9px] text-[#a7a7a7] uppercase font-bold">{new Date(item.timestamp).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onDelete(item.id)} className="text-[#a7a7a7] hover:text-[#ff1493] p-3 hover:bg-[#ff1493]/5 rounded-full transition-all" title="Wipe Simulation"><ICONS.Delete className="w-5 h-5" /></button>
                    </div>
                </div>
                
                <div className="flex items-center gap-12 border-t border-white/5 pt-6">
                    <div className="text-center px-4">
                        <div className="text-[9px] font-black text-[#a7a7a7] uppercase mb-1 tracking-widest">Synthesized Yield</div>
                        <div className="text-2xl font-black text-[#00ff94] mono tracking-tighter">{item.overview.yield}%</div>
                    </div>
                    <div className="text-center border-l border-white/10 pl-12 pr-4 hidden sm:block">
                        <div className="text-[9px] font-black text-[#a7a7a7] uppercase mb-1 tracking-widest">Model Confidence</div>
                        <div className="text-2xl font-black text-[#00e5ff] mono tracking-tighter">{(item.overview.confidence * 100).toFixed(0)}%</div>
                    </div>
                    <div className="text-center border-l border-white/10 pl-12 pr-4 hidden md:block">
                        <div className="text-[9px] font-black text-[#a7a7a7] uppercase mb-1 tracking-widest">Mechanism</div>
                        <div className="text-sm font-black text-white mono uppercase tracking-widest">{item.overview.reactionType}</div>
                    </div>
                    <div className="flex-1" />
                    <div className="flex gap-3">
                        <button onClick={() => onSelect(item)} className="bg-[#00ff94] text-[#05120d] px-8 py-2.5 rounded text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_#00ff9444]"><ICONS.Play className="w-4 h-4" /> Expand Details</button>
                    </div>
                </div>
                </div>
            )) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-30 border border-dashed border-white/10 rounded-3xl bg-[#0a1f1a]/20">
                    <ICONS.Archive className="w-20 h-20 mb-6" />
                    <h3 className="text-2xl font-black mono uppercase tracking-widest">No Cloud Records</h3>
                    <p className="text-sm italic">Simulations will automatically appear here once analyzed.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

// --- Main App Logic ---

export default function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Fetch History from localStorage on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
        const saved = localStorage.getItem('autochem_history');
        if (saved) setHistory(JSON.parse(saved));
    } catch (e) {
        console.error("History load failed", e);
    } finally {
        setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (theme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const [formData, setFormData] = useState<PredictionRequest>({
    reactantA: { name: '', smiles: '' },
    reactantB: { name: '', smiles: '' },
    solvent: 'DMF',
    temperature: 80,
    catalyst: '',
    additives: '',
    pressure: 1,
    protectedGroups: '',
  });

  const handleInputChange = (field: string, value: any, subfield?: string) => {
    if (subfield) {
      setFormData(prev => ({
        ...prev,
        [field]: { ...((prev as any)[field]), [subfield]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reactantA.name) {
      setError("Molecular input for Reactant Alpha is required.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await predictReaction(formData);
      setPrediction(result);

      setHistory(prev => [result, ...prev].slice(0, 50));
      localStorage.setItem('autochem_history', JSON.stringify([result, ...history].slice(0, 50)));
      
    } catch (err: any) {
      setError(err.message || "Simulation engine failed to converge. Verify input structures.");
    } finally {
      setLoading(false);
    }
  };

  const deleteFromHistory = (id: string) => {
    try {
        const newHistory = history.filter(h => h.id !== id);
        setHistory(newHistory);
        localStorage.setItem('autochem_history', JSON.stringify(newHistory));
    } catch (e) {
        console.error("Delete failed", e);
    }
  };

  const selectFromHistory = (p: PredictionResult) => {
    setPrediction(p);
    setFormData(p.inputs);
    setActiveTab('predict');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const clearForm = () => {
    setFormData({
      reactantA: { name: '', smiles: '' },
      reactantB: { name: '', smiles: '' },
      solvent: 'DMF',
      temperature: 80,
      catalyst: '',
      additives: '',
      pressure: 1,
      protectedGroups: '',
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#05120d] text-[#f5f5f5] selection:bg-[#00ff94] selection:text-[#05120d] font-sans overflow-x-hidden">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="pb-24 pt-6">
        {activeTab === 'predict' && (
          <PredictionHub 
            formData={formData} 
            onInputChange={handleInputChange} 
            onPredict={handlePredict} 
            onClear={clearForm}
            loading={loading}
            prediction={prediction}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'mechanism' && (
           <MechanismView 
            prediction={prediction} 
            setActiveTab={setActiveTab} 
           />
        )}
        {activeTab === 'safety' && (
           <SafetyView 
            prediction={prediction} 
            setActiveTab={setActiveTab} 
           />
        )}
        {activeTab === 'optimize' && (
           <OptimizeView 
            prediction={prediction} 
            setActiveTab={setActiveTab} 
           />
        )}
        {activeTab === 'history' && (
           <HistoryView 
            history={history} 
            setActiveTab={setActiveTab} 
            onSelect={selectFromHistory}
            onDelete={deleteFromHistory}
            loadingHistory={loadingHistory}
           />
        )}
      </main>

      {/* Persistence Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-[#0a1f1a]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-6 z-50 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
         <div className="flex gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00ff94] animate-pulse shadow-[0_0_8px_#00ff94]" />
                <span className="text-[9px] font-black text-[#a7a7a7] uppercase mono tracking-widest">Simulation Engine: <span className="text-[#00ff94]">READY</span></span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse shadow-[0_0_8px_#00e5ff]" />
                <span className="text-[9px] font-black text-[#a7a7a7] uppercase mono tracking-widest">Local Storage: <span className="text-[#00e5ff]">ACTIVE</span></span>
            </div>
         </div>
         <div className="text-[10px] font-black text-[#a7a7a7] uppercase mono tracking-widest flex items-center gap-2">
            Autochem AI G4.2 <span className="opacity-20">|</span> <span className="text-[#00ff94]">{new Date().getFullYear()}</span>
         </div>
      </footer>

      {/* Floating System Actions */}
      <div className="fixed bottom-14 right-8 flex flex-col gap-4 z-40">
         <button onClick={() => setActiveTab('history')} className="w-12 h-12 bg-[#0a1f1a] border border-white/10 rounded-2xl flex items-center justify-center text-[#a7a7a7] hover:text-[#00ff94] hover:border-[#00ff94]/40 shadow-2xl transition-all active:scale-90 group relative" title="History">
            <ICONS.Archive className="w-5 h-5" />
            <div className="absolute right-full mr-4 bg-[#05120d] px-3 py-1.5 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Cloud History</div>
         </button>
         <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-12 h-12 bg-[#0a1f1a] border border-white/10 rounded-2xl flex items-center justify-center text-[#a7a7a7] hover:text-[#00ff94] hover:border-[#00ff94]/40 shadow-2xl transition-all active:scale-90 group relative" title="Scroll Up">
            <ICONS.Refresh className="w-5 h-5" />
            <div className="absolute right-full mr-4 bg-[#05120d] px-3 py-1.5 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Back to top</div>
         </button>
         <button className="w-12 h-12 bg-[#0a1f1a] border border-white/10 rounded-2xl flex items-center justify-center text-[#a7a7a7] hover:text-[#ff1493] hover:border-[#ff1493]/40 shadow-2xl transition-all active:scale-90 group relative" title="Export PDF">
            <ICONS.External className="w-5 h-5" />
            <div className="absolute right-full mr-4 bg-[#05120d] px-3 py-1.5 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Export Result</div>
         </button>
      </div>

      {/* System Error Notifications */}
      {error && (
         <div className="fixed top-20 right-8 z-[100] animate-in slide-in-from-right-10 duration-700">
            <div className="bg-[#ff1493] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-6 font-black mono text-xs border-2 border-[#ff1493]/50 relative overflow-hidden group">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white/20 animate-pulse" />
               <ICONS.Warning className="w-6 h-6 animate-bounce" />
               <div>
                   <p className="uppercase tracking-widest text-[9px] opacity-70 mb-1">System Error</p>
                   {error}
               </div>
               <button onClick={() => setError(null)} className="ml-4 hover:rotate-90 transition-transform p-2 bg-white/10 rounded-full"><ICONS.Delete className="w-4 h-4" /></button>
            </div>
         </div>
      )}
    </div>
  );
}

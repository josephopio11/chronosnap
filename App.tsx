import React, { useState, useEffect } from 'react';
import { Camera } from './components/Camera';
import { EraSelector } from './components/EraSelector';
import { Button } from './components/Button';
import { generateTimeTravelImage, editGeneratedImage } from './services/geminiService';
import { AppState, Era } from './types';
import { Download, RefreshCw, Wand2, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial landing effect
  useEffect(() => {
    // Check if API KEY is set
    if (!process.env.API_KEY) {
      setErrorMsg("Missing API Key. Please configure your environment.");
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleCapture = (imageData: string) => {
    setSourceImage(imageData);
    setAppState(AppState.ERA_SELECTION);
  };

  const handleEraSelect = async (era: Era) => {
    if (!sourceImage) return;
    
    setSelectedEra(era);
    setAppState(AppState.PROCESSING);
    setErrorMsg(null);

    try {
      const generatedImage = await generateTimeTravelImage(sourceImage, era.prompt);
      setResultImage(generatedImage);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setErrorMsg("Time machine malfunction! Failed to generate image. Please try again.");
      setAppState(AppState.ERA_SELECTION);
    }
  };

  const handleCustomEdit = async () => {
    if (!resultImage || !customPrompt.trim()) return;

    setIsProcessing(true);
    try {
      const newImage = await editGeneratedImage(resultImage, customPrompt);
      setResultImage(newImage);
      setCustomPrompt(''); // Clear prompt on success
    } catch (err) {
      console.error(err);
      alert("Failed to edit image. Try a different prompt.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetApp = () => {
    setSourceImage(null);
    setResultImage(null);
    setSelectedEra(null);
    setCustomPrompt('');
    setAppState(AppState.LANDING);
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `chronosnap-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Header */}
      <header className="p-6 flex items-center justify-between z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-black text-lg">C</div>
          <h1 className="text-xl font-bold tracking-tight">ChronoSnap</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 w-full">
        
        {/* LANDING STATE */}
        {appState === AppState.LANDING && (
          <div className="text-center max-w-2xl animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-[length:200%_auto] animate-gradient">
              Step Into History
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
              The world's first AI-powered time machine. Snap a photo and let our quantum engine transport you to any era in history.
            </p>
            <Button 
              onClick={() => setAppState(AppState.CAMERA)}
              className="text-lg px-10 py-4 shadow-[0_0_40px_rgba(6,182,212,0.4)]"
            >
              Start Time Travel
            </Button>
          </div>
        )}

        {/* CAMERA STATE */}
        {appState === AppState.CAMERA && (
          <Camera onCapture={handleCapture} />
        )}

        {/* ERA SELECTION STATE */}
        {appState === AppState.ERA_SELECTION && sourceImage && (
          <EraSelector 
            onSelect={handleEraSelect} 
            onBack={() => setAppState(AppState.CAMERA)}
            previewImage={sourceImage}
          />
        )}

        {/* PROCESSING STATE */}
        {appState === AppState.PROCESSING && (
          <div className="flex flex-col items-center justify-center text-center animate-pulse">
            <div className="relative w-48 h-48 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-cyan-400 animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-4 border-purple-500/30"></div>
              <div className="absolute inset-4 rounded-full border-b-4 border-purple-400 animate-spin-reverse"></div>
              <img 
                src={sourceImage || ''} 
                alt="Source" 
                className="absolute inset-8 rounded-full object-cover w-[calc(100%-4rem)] h-[calc(100%-4rem)] opacity-50" 
              />
            </div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">Traversing Wormhole...</h2>
            <p className="text-slate-400">Target Destination: {selectedEra?.name}</p>
          </div>
        )}

        {/* RESULT STATE */}
        {appState === AppState.RESULT && resultImage && (
          <div className="w-full max-w-6xl flex flex-col items-center animate-fade-in">
             
             {/* Main Result Display */}
             <div className="flex flex-col lg:flex-row gap-8 items-start w-full mb-8">
                
                {/* Image Container */}
                <div className="flex-1 w-full bg-black/50 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
                   <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden group">
                      <img 
                        src={resultImage} 
                        alt="Time Travel Result" 
                        className="w-full h-full object-contain bg-[#1e293b]"
                      />
                      <div className="scan-line pointer-events-none"></div>
                   </div>
                   <div className="mt-4 flex flex-wrap gap-4 justify-center">
                     <Button onClick={downloadImage} variant="secondary">
                       <Download className="w-5 h-5" /> Save Photo
                     </Button>
                     <Button onClick={() => setAppState(AppState.ERA_SELECTION)} variant="secondary">
                       <ArrowLeft className="w-5 h-5" /> Try Another Era
                     </Button>
                     <Button onClick={resetApp} variant="secondary">
                       <RefreshCw className="w-5 h-5" /> Start Over
                     </Button>
                   </div>
                </div>

                {/* Edit & Details Panel */}
                <div className="w-full lg:w-96 flex flex-col gap-6">
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-2">{selectedEra?.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{selectedEra?.description}</p>
                    <div className="h-px w-full bg-white/10 mb-4" />
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Original Identity</p>
                    <img src={sourceImage || ''} className="w-20 h-20 rounded-lg object-cover border border-slate-600" alt="Original" />
                  </div>

                  {/* Text Editing Feature */}
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                    <h3 className="text-lg font-bold text-cyan-400 mb-2 flex items-center gap-2">
                       <Wand2 className="w-5 h-5" />
                       Reality Distortion
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Not accurate enough? Use text commands to alter the timeline.
                    </p>
                    <div className="flex flex-col gap-3">
                      <input 
                        type="text"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="e.g., 'Add a monocle', 'Make it rainy'"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && handleCustomEdit()}
                      />
                      <Button 
                        onClick={handleCustomEdit} 
                        disabled={!customPrompt.trim()}
                        isLoading={isProcessing}
                        className="w-full"
                      >
                        Apply Edit
                      </Button>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* ERROR STATE */}
        {appState === AppState.ERROR && (
           <div className="text-center p-8 bg-red-500/10 border border-red-500/50 rounded-2xl max-w-md">
             <h2 className="text-2xl font-bold text-red-400 mb-4">System Failure</h2>
             <p className="text-red-200 mb-6">{errorMsg || "An unknown error occurred."}</p>
             <Button onClick={resetApp} variant="danger">Reboot System</Button>
           </div>
        )}

      </main>

      {/* Styles for animations defined in index.html, but adding custom spin reverse here if needed via arbitrary values or utility classes */}
      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s linear infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
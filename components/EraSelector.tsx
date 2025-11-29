import React from 'react';
import { Era, ERAS } from '../types';

interface EraSelectorProps {
  onSelect: (era: Era) => void;
  onBack: () => void;
  previewImage: string;
}

export const EraSelector: React.FC<EraSelectorProps> = ({ onSelect, onBack, previewImage }) => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 font-bold"
        >
          ← Retake Photo
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Select Your Destination
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ERAS.map((era) => (
          <div 
            key={era.id}
            onClick={() => onSelect(era)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:-translate-y-2"
          >
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-80 z-10" />
            
            <img 
              src={era.imagePlaceholder} 
              alt={era.name}
              className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {era.name}
              </h3>
              <p className="text-slate-300 text-sm">
                {era.description}
              </p>
            </div>
            
            {/* Selection Ring */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400 rounded-2xl transition-colors z-30" />
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-slate-500 text-sm">
        <p>Previewing with your photo:</p>
        <img 
            src={previewImage} 
            alt="Your preview" 
            className="w-16 h-16 rounded-full object-cover mx-auto mt-2 border-2 border-slate-700" 
        />
      </div>
    </div>
  );
};
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from './Button';
import { Camera as CameraIcon, Upload, RotateCcw } from 'lucide-react';

interface CameraProps {
  onCapture: (imageData: string) => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Unable to access camera. Please use upload instead.");
      console.error(err);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCanPlay = () => {
    setIsStreaming(true);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Mirror the context horizontally to match user expectation from webcam
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        stopCamera();
        onCapture(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        stopCamera();
        onCapture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="relative w-full aspect-[4/3] bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-700 mb-8 group">
        {!error ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onCanPlay={handleCanPlay}
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            Camera unavailable
          </div>
        )}
        
        {/* Overlay Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(56,189,248,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 pointer-events-none border-[1px] border-cyan-500/30 rounded-3xl"></div>
        
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex flex-wrap gap-4 justify-center w-full">
        {!error && (
          <Button 
            onClick={capturePhoto} 
            disabled={!isStreaming}
            className="w-full sm:w-auto"
          >
            <CameraIcon className="w-5 h-5" />
            Take Photo
          </Button>
        )}
        
        <div className="relative w-full sm:w-auto">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="secondary" className="w-full pointer-events-none">
            <Upload className="w-5 h-5" />
            Upload File
          </Button>
        </div>
        
        {error && (
             <Button variant="secondary" onClick={() => { setError(null); startCamera(); }}>
                <RotateCcw className="w-5 h-5" /> Retry Camera
             </Button>
        )}
      </div>
    </div>
  );
};
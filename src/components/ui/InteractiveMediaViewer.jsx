import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, CornerDownRight } from 'lucide-react';
import { Button } from './Button';

export const InteractiveMediaViewer = ({ 
   asset, 
   activeVersion, 
   feedbacks, 
   onAddFeedback, 
   selectedFeedbackId, 
   setSelectedFeedbackId 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // The specific file URL for the active version
  const currentFileUrl = asset.versions.find(v => v.v === activeVersion)?.fileUrl;

  const relevantFeedbacks = feedbacks.filter(fb => fb.targetAssetId === asset.id && fb.targetVersion === activeVersion);

  // Auto seek when a specific feedback is clicked from the chat
  useEffect(() => {
     if (selectedFeedbackId && asset.type === 'video' && videoRef.current) {
        const fb = relevantFeedbacks.find(f => f.id === selectedFeedbackId);
        if (fb && fb.time !== null) {
           videoRef.current.currentTime = fb.time;
        }
     }
  }, [selectedFeedbackId, asset.id, activeVersion]);

  const togglePlay = () => {
     if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
     } else {
        videoRef.current.pause();
        setIsPlaying(false);
     }
  };

  const handeTimeUpdate = () => {
     setCurrentTime(videoRef.current.currentTime);
     setDuration(videoRef.current.duration || 0);
  };

  const handleImageClick = (e) => {
     if (asset.type !== 'image') return;
     const rect = containerRef.current.getBoundingClientRect();
     const x = ((e.clientX - rect.left) / rect.width) * 100;
     const y = ((e.clientY - rect.top) / rect.height) * 100;
     
     // Trigger the parent to open the compose box securely
     onAddFeedback({ type: 'spatial', x, y, time: null });
  };

  const captureVideoTimestamp = () => {
     if (videoRef.current) videoRef.current.pause();
     setIsPlaying(false);
     onAddFeedback({ type: 'temporal', x: null, y: null, time: currentTime });
  };

  if (!currentFileUrl) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}>
      
      {/* Media Rendering Block */}
      <div 
         ref={containerRef}
         style={{ position: 'relative', maxWidth: '100%', maxHeight: '600px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', cursor: asset.type === 'image' ? 'crosshair' : 'default', display: 'flex', justifyContent: 'center' }}
         onClick={handleImageClick}
      >
        {asset.type === 'video' ? (
           <video 
              ref={videoRef}
              src={currentFileUrl} 
              onTimeUpdate={handeTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              style={{ maxHeight: '600px', width: '100%', objectFit: 'contain' }}
              controls={false} /* Custom controls below */
              onClick={togglePlay}
           />
        ) : (
           <img 
              src={currentFileUrl} 
              alt={asset.fileName} 
              style={{ maxHeight: '600px', maxWidth: '100%', objectFit: 'contain', display: 'block' }} 
              draggable={false}
           />
        )}

        {/* Spatial Pins (Images Only) */}
        {asset.type === 'image' && relevantFeedbacks.filter(fb => fb.type === 'spatial').map(fb => (
           <div 
              key={fb.id}
              onClick={(e) => { e.stopPropagation(); setSelectedFeedbackId(fb.id); }}
              style={{
                 position: 'absolute',
                 left: `${fb.x}%`,
                 top: `${fb.y}%`,
                 width: '24px', height: '24px',
                 backgroundColor: fb.status === 'open' ? 'var(--status-pending)' : 'var(--status-approved)',
                 border: '2px solid white',
                 borderRadius: '50%',
                 transform: 'translate(-50%, -50%)',
                 cursor: 'pointer',
                 boxShadow: selectedFeedbackId === fb.id ? '0 0 0 4px rgba(255,255,255,0.3)' : '0 2px 4px rgba(0,0,0,0.5)',
                 transition: 'all 0.2s',
                 zIndex: 10
              }}
           />
        ))}
      </div>

      {/* Frame.io Style Video Controls */}
      {asset.type === 'video' && (
         <div style={{ width: '100%', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
               <button onClick={togglePlay} style={{ background: 'var(--accent-purple)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '4px' }} />}
               </button>
               <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                  {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
               </div>
               <div style={{ flex: 1 }}></div>
               <Button variant="primary" onClick={captureVideoTimestamp} style={{ background: 'var(--accent-cyan)' }}>
                 <CornerDownRight size={16} /> Comment at {currentTime.toFixed(1)}s
               </Button>
            </div>

            {/* Custom Timestamp Timeline */}
            <div style={{ position: 'relative', width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', cursor: 'pointer' }} 
                 onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    const newTime = percent * duration;
                    if(videoRef.current) {
                        videoRef.current.currentTime = newTime;
                        setCurrentTime(newTime);
                    }
                 }}
            >
               <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--accent-purple)', borderRadius: '4px', width: `${(currentTime / duration) * 100}%`, transition: 'width 0.1s linear' }} />
               
               {/* Timeline Feedback Markers */}
               {duration > 0 && relevantFeedbacks.filter(fb => fb.type === 'temporal').map(fb => (
                  <div 
                     key={fb.id}
                     onClick={(e) => { e.stopPropagation(); setSelectedFeedbackId(fb.id); }}
                     style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${(fb.time / duration) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        width: '12px', height: '12px',
                        backgroundColor: fb.status === 'open' ? 'var(--status-pending)' : 'var(--status-approved)',
                        border: selectedFeedbackId === fb.id ? '2px solid white' : '1px solid black',
                        borderRadius: '50%',
                        zIndex: 5
                     }}
                  />
               ))}
            </div>
         </div>
      )}

      {/* Helper Text */}
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
         {asset.type === 'image' ? 'Click anywhere on the image to drop a spatial feedback pin.' : 'Play the video and tap the comment button to drop a timestamp marker.'}
      </div>
    </div>
  );
};

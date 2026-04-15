import React, { useRef, useState } from 'react';
import { UploadCloud, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './FileUpload.css';

export const FileUpload = ({ assets, setAssets }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (files) => {
    const fileArray = Array.from(files);
    const newAssets = fileArray.map(file => {
      const isVideo = file.type.startsWith('video/');
      return {
        id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name,
        type: isVideo ? 'video' : 'image',
        versions: [
           { v: 1, fileUrl: URL.createObjectURL(file), uploadedAt: new Date().toISOString() }
        ]
      };
    });
    setAssets(prev => [...prev, ...newAssets]);
  };

  const removeAsset = (id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const moveAsset = (index, direction) => {
    if (direction === 'left' && index > 0) {
      const newAssets = [...assets];
      [newAssets[index - 1], newAssets[index]] = [newAssets[index], newAssets[index - 1]];
      setAssets(newAssets);
    } else if (direction === 'right' && index < assets.length - 1) {
      const newAssets = [...assets];
      [newAssets[index + 1], newAssets[index]] = [newAssets[index], newAssets[index + 1]];
      setAssets(newAssets);
    }
  };

  return (
    <div className="file-upload-container">
      <div 
        className={`dropzone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <UploadCloud size={48} color={dragActive ? "var(--accent-cyan)" : "var(--text-secondary)"} style={{ margin: '0 auto' }} />
        <p className="dropzone-text">
          <span className="dropzone-highlight">Click to upload</span> or drag and drop native files here
        </p>
        <p className="dropzone-text" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Images and MP4 videos up to 50MB</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/mp4"
          className="hidden-input"
          onChange={handleChange}
        />
      </div>

      {assets.length > 0 && (
        <div className="asset-carousel">
          {assets.map((asset, index) => (
            <div key={asset.id} className="asset-preview">
              <button 
                className="asset-remove"
                onClick={(e) => { e.preventDefault(); removeAsset(asset.id); }}
                title="Remove Asset"
              >
                <X size={14} />
              </button>
              
              {asset.type === 'video' ? (
                <video src={asset.versions[asset.versions.length - 1].fileUrl} muted />
              ) : (
                <img src={asset.versions[asset.versions.length - 1].fileUrl} alt={asset.fileName} />
              )}
              
              <div className="asset-actions">
                <button 
                  className="action-btn" 
                  onClick={(e) => { e.preventDefault(); moveAsset(index, 'left'); }}
                  disabled={index === 0}
                  style={{ opacity: index === 0 ? 0.3 : 1 }}
                >
                  <ChevronLeft size={18} />
                </button>
                <span style={{ fontSize: '0.75rem', color: 'white', lineHeight: '1.2rem' }}>{index + 1}</span>
                <button 
                  className="action-btn" 
                  onClick={(e) => { e.preventDefault(); moveAsset(index, 'right'); }}
                  disabled={index === assets.length - 1}
                  style={{ opacity: index === assets.length - 1 ? 0.3 : 1 }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

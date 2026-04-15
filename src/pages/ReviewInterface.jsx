import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Textarea } from '../components/ui/Form';
import './Dashboard.css';

export const ReviewInterface = () => {
  const { id } = useParams();
  const { submissions, updateSubmissionStatus } = useAppContext();
  const navigate = useNavigate();
  const sub = submissions.find(s => s.id === id);
  
  // Track draft granular feedback by target ID (e.g. 'caption', 'notes', or 'asset-123')
  const [draftFeedback, setDraftFeedback] = useState({});

  if (!sub) return <div>Submission not found.</div>;

  const handleFeedbackChange = (target, value) => {
    setDraftFeedback(prev => ({ ...prev, [target]: value }));
  };

  const handleAction = (status) => {
    // Convert mapping object into an array of strictly populated feedback objects
    const newFeedbackItems = Object.entries(draftFeedback)
      .filter(([_, note]) => note.trim().length > 0)
      .map(([target, note]) => ({ target, note }));

    updateSubmissionStatus(id, status, newFeedbackItems);
    navigate('/agency');
  };

  // Helper to filter existing global feedback for a specific target
  const FeedBackHistory = ({ targetId }) => {
    const relevant = sub.feedback.filter(fb => fb.target === targetId);
    if (relevant.length === 0) return null;
    return (
      <div style={{ marginTop: '0.75rem', paddingLeft: '0.5rem', borderLeft: '2px solid var(--border-light)' }}>
        {relevant.map((fb, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--accent-purple)', fontSize: '0.8rem', fontWeight: 600 }}>{fb.author}</span>
            <p style={{ fontSize: '0.85rem' }}>{fb.note}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 300px)', gap: '2rem' }}>
      
      {/* Left Column: Structural Review Zone */}
      <div>
        <Button variant="outline" className="mb-4" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Pipeline
        </Button>

        <div className="submission-card-header" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 className="dashboard-title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{sub.title}</h1>
            <div className="submission-meta" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--accent-purple)' }}>@{sub.influencerName} • {sub.campaign}</span>
            </div>
            {sub.postingDate && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', background: 'var(--glass-bg)', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', display: 'inline-block', border: '1px solid var(--border-light)' }}>
                🗓️ Proposed: <strong>{new Date(sub.postingDate).toLocaleDateString()}</strong> at <strong>{sub.postingTime} {sub.postingTimezone}</strong>
              </div>
            )}
          </div>
          <Badge status={sub.status} />
        </div>

        {/* Assets Review block */}
        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Media Assets</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
          {sub.assets && sub.assets.map((asset, index) => (
            <Card key={asset.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
               <div style={{ width: '200px', height: '200px', borderRadius: '0.5rem', overflow: 'hidden', flexShrink: 0, backgroundColor: '#000' }}>
                 {asset.type === 'video' ? (
                   <video src={asset.fileUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                 ) : (
                   <img src={asset.fileUrl} alt={asset.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 )}
               </div>
               <div style={{ flex: 1 }}>
                 <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Asset #{index + 1} ({asset.fileName})</p>
                 <Textarea 
                   placeholder="Add feedback specifically for this asset..." 
                   value={draftFeedback[asset.id] || ''}
                   onChange={(e) => handleFeedbackChange(asset.id, e.target.value)}
                 />
                 <FeedBackHistory targetId={asset.id} />
               </div>
            </Card>
          ))}
        </div>

        {/* Copy Review block */}
        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Post Copy & Notes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Caption</p>
            <p style={{ fontSize: '1rem', marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
              {sub.caption}
            </p>
            <Textarea 
              placeholder="Request changes to the caption..." 
              value={draftFeedback['caption'] || ''}
              onChange={(e) => handleFeedbackChange('caption', e.target.value)}
            />
            <FeedBackHistory targetId="caption" />
          </Card>

          <Card>
             <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Additional Notes</p>
            <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
               {sub.notes}
            </p>
            <Textarea 
              placeholder="Respond directly to these notes..." 
              value={draftFeedback['notes'] || ''}
              onChange={(e) => handleFeedbackChange('notes', e.target.value)}
            />
            <FeedBackHistory targetId="notes" />
          </Card>

          {sub.postingDate && (
            <Card>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Posting Schedule</p>
              <div style={{ fontSize: '1rem', marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                🗓️ Proposed for <strong>{new Date(sub.postingDate).toLocaleDateString()}</strong> at <strong>{sub.postingTime} {sub.postingTimezone}</strong>
              </div>
              <Textarea 
                placeholder="Approve this timeframe or propose a different slot..." 
                value={draftFeedback['schedule'] || ''}
                onChange={(e) => handleFeedbackChange('schedule', e.target.value)}
              />
              <FeedBackHistory targetId="schedule" />
            </Card>
          )}
        </div>
      </div>

      {/* Right Column: Global Action Panel */}
      <div>
        <Card style={{ position: 'sticky', top: '100px' }}>
          <h3 className="dashboard-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Finalize Review</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
             Review feedback added to individual blocks will be attached when you commit a status below.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Button variant="primary" onClick={() => handleAction('Approved')} style={{ backgroundColor: 'var(--status-approved)' }}>
              <Check size={16} /> Approve Content
            </Button>
            <Button variant="secondary" onClick={() => handleAction('Changes Requested')}>
              <MessageSquare size={16} /> Request Revisions
            </Button>
            <Button variant="danger" onClick={() => handleAction('Rejected')}>
              <X size={16} /> Reject
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

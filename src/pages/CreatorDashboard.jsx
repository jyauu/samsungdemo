import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, MessageSquare, Activity, CheckCircle, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import './Dashboard.css';

export const CreatorDashboard = () => {
  const { submissions, campaigns } = useAppContext();
  const navigate = useNavigate();

  // In this mock, we assume the user is securely logged in as 'Daiki Shinomiya'
  const mySubmissions = submissions.filter(s => s.creatorName === 'Daiki Shinomiya');
  const [activeSubmissionViewId, setActiveSubmissionViewId] = useState(null);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title">My Archives</h1>
          <p className="dashboard-subtitle">Track your historical deliverables and feedback across NexGen Agency.</p>
        </div>
      </div>

      {!activeSubmissionViewId && (
        <div className="submission-list">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span>Submission</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          {mySubmissions.length === 0 ? <p style={{ padding: '1rem' }}>No historical submissions found in the archive.</p> : mySubmissions.map(sub => {
             const relatedCampaign = campaigns.find(c => c.id === sub.campaignId);
             return (
                <div 
                  key={sub.id} 
                  className="submission-list-row"
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-light)', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                  onClick={() => setActiveSubmissionViewId(sub.id)}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div>
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{sub.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-purple)' }}>{relatedCampaign ? relatedCampaign.title : 'Unknown Campaign'}</div>
                  </div>
                  <div><Badge status={sub.status} /></div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{new Date(sub.submittedAt).toLocaleDateString()}</div>
                </div>
             )
          })}
        </div>
      )}

      {activeSubmissionViewId && (() => {
         const sub = mySubmissions.find(s => s.id === activeSubmissionViewId);
         if (!sub) return null;
         const relatedCampaign = campaigns.find(c => c.id === sub.campaignId);

         return (
           <div className="submission-document animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
             <button onClick={() => setActiveSubmissionViewId(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               ← Back to Archives
             </button>
             
             <div style={{ padding: '0 1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                 <div>
                   <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>{sub.title}</h2>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--accent-purple)', fontSize: '1rem' }}>
                      <span>{relatedCampaign ? relatedCampaign.title : 'Unknown Campaign'}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>• {new Date(sub.submittedAt).toLocaleDateString()}</span>
                   </div>
                 </div>
                 <Badge status={sub.status} />
               </div>

               <div style={{ marginBottom: '3rem' }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                     {sub.caption}
                  </p>
               </div>

               {sub.feedback && sub.feedback.length > 0 && (
                 <div style={{ marginBottom: '2rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
                   <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Agency Feedback</h3>
                   {sub.feedback.map((fb, idx) => (
                     <div key={idx} style={{ marginBottom: idx === sub.feedback.length - 1 ? 0 : '1rem' }}>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{fb.author}</div>
                       <div style={{ fontSize: '0.95rem' }}>{fb.note}</div>
                     </div>
                   ))}
                 </div>
               )}

               <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem', display: 'flex', gap: '1rem' }}>
                 {sub.status === 'Approved' ? (
                   <Button variant="primary" onClick={() => navigate(`/analytics/${sub.id}`)} style={{ background: 'var(--accent-teal)' }}>
                     <Activity size={16} /> View Final Analytics
                   </Button>
                 ) : (
                   <>
                     <Button variant="secondary" onClick={() => alert('Feature incoming: view submitted raw assets')}>
                        {sub.assets && sub.assets.length} Assets
                     </Button>
                     <Button variant="primary" onClick={() => navigate(`/workspace/${sub.id}`)}>
                       <MessageSquare size={16} /> Open Workspace
                     </Button>
                   </>
                 )}
               </div>

             </div>
           </div>
         );
      })()}
    </div>
  );
};

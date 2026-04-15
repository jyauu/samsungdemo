import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ExternalLink, MessageSquare, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import './Dashboard.css';

export const InfluencerDashboard = () => {
  const { submissions } = useAppContext();
  const navigate = useNavigate();

  // Influencers only see their own (hardcoded to Daiki Shinomiya in mock)
  const mySubmissions = submissions.filter(s => s.influencerName === 'Daiki Shinomiya');

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Campaigns</h1>
          <p className="dashboard-subtitle">Track your content approvals and feedback.</p>
        </div>
        <Button onClick={() => navigate('/influencer/submit')}>
          <Plus size={18} /> New Submission
        </Button>
      </div>

      <div className="grid-list">
        {mySubmissions.map((sub) => (
          <Card key={sub.id} className="submission-card">
            <div className="submission-card-header">
              <div>
                <h3 className="submission-title">{sub.title}</h3>
                <div className="submission-meta">
                  <span>{sub.campaign}</span>
                  <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Badge status={sub.status} />
            </div>
            
            <p className="submission-desc">{sub.description}</p>
            
            {sub.feedback && sub.feedback.length > 0 && (
              <div className="feedback-section">
                {sub.feedback.slice(-1).map((fb, idx) => (
                  <div key={idx} className="feedback-item">
                    <div className="feedback-author">Latest Feedback from {fb.author}</div>
                    <div className="feedback-text">{fb.note}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="submission-actions" style={{ marginTop: '1.5rem' }}>
              {sub.status === 'Approved' ? (
                <Button variant="primary" fullWidth onClick={() => navigate(`/analytics/${sub.id}`)} style={{ background: 'var(--accent-teal)' }}>
                  <Activity size={16} /> View Analytics
                </Button>
              ) : (
                <>
                  <Button variant="secondary" fullWidth onClick={() => alert('Feature incoming: view submitted raw assets')}>
                     {sub.assets && sub.assets.length} Assets
                  </Button>
                  {sub.status.includes('Changes') && (
                    <Button variant="primary" fullWidth onClick={() => navigate(`/influencer/submit?revise=${sub.id}`)}>
                      <MessageSquare size={16} /> Revise
                    </Button>
                  )}
                </>
              )}
            </div>
          </Card>
        ))}
        {mySubmissions.length === 0 && (
          <p>No submissions found. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

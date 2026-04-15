import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, ClipboardCheck, Hash, AtSign } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const InviteGateway = () => {
  const { campaignId } = useParams();
  const { campaigns, login } = useAppContext();
  const navigate = useNavigate();

  const campaign = campaigns.find(c => c.id === campaignId);

  if (!campaign) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Campaign Not Found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>This invite link may be invalid or expired.</p>
        <Button variant="outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const handleStartSubmission = () => {
    login('creator');
    navigate(`/creator/submit/${campaignId}`);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>You've been invited!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          NexGen Agency has invited you to collaborate on <strong>{campaign.title}</strong>
        </p>
      </div>

      <Card style={{ marginBottom: '2rem', padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ClipboardCheck color="var(--accent-teal)" /> Campaign Brief
        </h2>
        
        <p style={{ fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          {campaign.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          {campaign.hashtags && (
            <div>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Hash size={14} /> Required Hashtags
              </h3>
              <p style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>{campaign.hashtags}</p>
            </div>
          )}
          {campaign.guidelines && (
            <div>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <AtSign size={14} /> Brand Accounts
              </h3>
              <p>{campaign.guidelines}</p>
            </div>
          )}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="primary" onClick={handleStartSubmission} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
          <Camera style={{ marginRight: '0.5rem' }} /> Log in to Submit Assets
        </Button>
      </div>
    </div>
  );
};

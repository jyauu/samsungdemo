import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Building2, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppContext } from '../context/AppContext';
import './RoleSelection.css';

export const AgencyLogin = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleAgencyLogin = () => {
    login('agency');
    navigate('/agency');
  };

  const handleCreatorArchiveLogin = () => {
    // In a real app, this would trigger an OAuth or Email magic link for the creator's history
    login('creator');
    navigate('/creator/archive');
  };

  return (
    <div className="role-selection-wrapper" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 className="hero-title">Welcome to NexGen</h1>
      <p className="hero-subtitle">
        The centralized workspace for managing influencer campaigns, approvals, and live analytics.
      </p>
      
      <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <div onClick={handleAgencyLogin}>
          <Card className="role-card agency" hoverable style={{ padding: '3rem 2rem', border: '1px solid var(--accent-purple)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="role-icon" style={{ marginBottom: '1.5rem' }}>
              <Building2 size={32} />
            </div>
            <h2 className="role-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', width: '100%', textAlign: 'center' }}>Agency Login</h2>
            <p className="role-desc" style={{ textAlign: 'center', width: '100%' }}>
              Access your active briefs, review pending deliverables, and track campaign performance.
            </p>
            <Button variant="primary" style={{ marginTop: '1.5rem' }}>Enter Workspace</Button>
          </Card>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Are you a Creator?</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          Please navigate to the specific <strong>invite link</strong> sent to your email by your agency to submit new campaign deliverables or acknowledge briefs.
        </p>
        <Button variant="outline" onClick={handleCreatorArchiveLogin}>
          <Camera size={16} style={{ marginRight: '0.5rem' }} /> Log in to view your past archives
        </Button>
      </div>
    </div>
  );
};

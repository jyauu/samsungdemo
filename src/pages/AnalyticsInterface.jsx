import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, TrendingUp, Users, Heart, MessageCircle, Bookmark, Share2, Activity, Play } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Form';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <Card style={{ flex: 1, minWidth: '150px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <div style={{ padding: '0.5rem', borderRadius: '8px', background: `var(--${colorClass}-bg)`, color: `var(--${colorClass})` }}>
        <Icon size={20} />
      </div>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</span>
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>{value}</div>
    {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{subtitle}</div>}
  </Card>
);

export const AnalyticsInterface = () => {
  const { id } = useParams();
  const { submissions, updateLiveLinks } = useAppContext();
  const navigate = useNavigate();
  
  const sub = submissions.find(s => s.id === id);

  const [linkInput, setLinkInput] = useState({
    tiktok: sub?.liveLinks?.tiktok || '',
    instagram: sub?.liveLinks?.instagram || ''
  });

  const [isEditing, setIsEditing] = useState(false);

  if (!sub) return <div>Submission not found.</div>;

  const handleSaveLinks = (e) => {
    e.preventDefault();
    if (!linkInput.tiktok && !linkInput.instagram) {
      alert('Please provide at least one link.');
      return;
    }
    updateLiveLinks(sub.id, linkInput);
    setIsEditing(false);
  };

  // State 1: Awaiting URLs or Editing
  if (!sub.liveLinks || isEditing) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Button variant="outline" className="mb-4" onClick={() => isEditing ? setIsEditing(false) : navigate(-1)} style={{ marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> {isEditing ? 'Cancel' : 'Back'}
        </Button>
        <h1 className="dashboard-title">Make it Live 🚀</h1>
        <p className="dashboard-subtitle" style={{ marginBottom: '2rem' }}>
          {isEditing ? "Update your published links below to regenerate the engagement analytics." : "This campaign has been approved! Paste the final published links below to map the engagement analytics dashboard."}
        </p>

        <Card>
          <form onSubmit={handleSaveLinks} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input 
              label="TikTok URL" 
              id="tiktok" 
              placeholder="https://tiktok.com/@user/video/123" 
              value={linkInput.tiktok}
              onChange={(e) => setLinkInput({ ...linkInput, tiktok: e.target.value })}
            />
            <Input 
              label="Instagram Reel URL" 
              id="instagram" 
              placeholder="https://instagram.com/reel/123" 
              value={linkInput.instagram}
              onChange={(e) => setLinkInput({ ...linkInput, instagram: e.target.value })}
            />
            <Button variant="primary" type="submit" fullWidth>
              <Save size={16} /> {isEditing ? 'Update Analytics' : 'Connect Analytics'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // State 2: Scraping in progress
  if (sub.isScraping) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4rem' }}>
        <div className="status-badge" style={{ animation: 'pulse 1.5s infinite', background: 'var(--accent-teal-bg)', color: 'var(--accent-teal)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <Activity size={32} />
        </div>
        <h2 style={{ marginBottom: '0.5rem' }}>Extracting Live Data...</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px' }}>
          Our headless server is currently navigating the source code to securely parse the live engagement metrics. This may take up to 10 seconds.
        </p>
      </div>
    );
  }

  // State 3: Live Analytics Rendering
  const analytics = sub.analytics || {};

  const renderPlatformSection = (platform, link, stats) => {
    if (!link || !stats) return null;

    let embedUrl = null;
    if (platform === 'tiktok') {
      const match = link.match(/video\/(\d+)/);
      if (match) embedUrl = `https://www.tiktok.com/embed/v2/${match[1]}`;
    } else if (platform === 'instagram') {
      const cleanLink = link.split('?')[0].replace(/\/$/, ""); 
      embedUrl = `https://www.instagram.com/p/${cleanLink.split('/').pop()}/embed/captioned/`;
    }

    const totalEngagements = (stats.likes || 0) + (stats.comments || 0) + (stats.saves || 0) + (stats.shares || 0);
    const erReach = (stats.views > 0) ? ((totalEngagements / stats.views) * 100).toFixed(2) : '0.00';
    const erAudience = (stats.followerCount > 0) ? ((totalEngagements / stats.followerCount) * 100).toFixed(2) : '0.00';

    return (
      <div style={{ flex: 1, minWidth: '350px', background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', textTransform: 'capitalize' }}>
          {platform === 'tiktok' ? <Play color="var(--accent-teal)" /> : <Heart color="var(--accent-purple)" />}
          {platform} Performance
        </h2>
        
        {embedUrl && (
          <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', height: '600px', position: 'relative', background: '#000', border: '1px solid var(--border-light)' }}>
            <iframe 
              src={embedUrl} 
              title={`${platform} embed`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              scrolling="no"
              allowtransparency="true"
            />
          </div>
        )}
        
        <Button 
          variant="outline" 
          fullWidth 
          style={{ marginBottom: '2rem' }}
          onClick={() => window.open(link, '_blank')}
        >
          View Original {platform === 'tiktok' ? 'TikTok' : 'Instagram Post'}
        </Button>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
          <StatCard title="Total Views" value={(stats.views || 0).toLocaleString()} icon={Play} colorClass="status-approved" />
          <StatCard title="ER (Reach)" value={`${erReach}%`} icon={TrendingUp} colorClass="accent-teal" subtitle="Engagements / Impressions" />
          <StatCard title="ER (Audience)" value={`${erAudience}%`} icon={Users} colorClass="accent-purple" subtitle="Engagements / Followers" />
        </div>

        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Engagement Breakdown
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <StatCard title="Likes" value={(stats.likes || 0).toLocaleString()} icon={Heart} colorClass="status-danger" />
          <StatCard title="Comments" value={(stats.comments || 0).toLocaleString()} icon={MessageCircle} colorClass="accent-teal" />
          <StatCard title="Saves" value={(stats.saves || 0).toLocaleString()} icon={Bookmark} colorClass="status-pending" />
          <StatCard title="Shares" value={(stats.shares || 0).toLocaleString()} icon={Share2} colorClass="accent-purple" />
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <Button variant="outline" className="mb-4" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back
      </Button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={24} color="var(--accent-teal)" /> Campaign Analytics
          </h1>
          <p className="dashboard-subtitle">{sub.title} • @{sub.creatorName}</p>
          <div style={{ fontSize: '0.65rem', opacity: 0.4, marginTop: '0.5rem' }}>Bld: {new Date().toLocaleTimeString()} (EST)</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {(sub.liveLinks && analytics.isMock !== false) ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              padding: '0.4rem 0.8rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#f87171',
              borderRadius: '2rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
              SIMULATED DATA
            </div>
          ) : analytics.isMock === false && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              padding: '0.4rem 0.8rem', 
              background: 'rgba(34, 197, 94, 0.1)', 
              color: '#4ade80',
              borderRadius: '2rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
              LIVE DATA
            </div>
          )}
          <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Links</Button>
        </div>
      </div>

      {analytics.isMock && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff9c4', borderRadius: '8px', border: '2px solid #fbc02d', color: '#000' }}>
          <div style={{ fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
            <Activity size={18} /> SYSTEM DIAGNOSTICS: SIMULATED MODE ACTIVE
          </div>
          <p style={{ marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 500 }}>
            The server could not verify your <code>APIFY_API_TOKEN</code>. Details detected by server:
          </p>
          <ul style={{ margin: '0 0 1rem 1.5rem', padding: 0 }}>
             <li><strong>Token Found:</strong> {analytics.debug?.tokenFound ? 'Yes (but invalid/too short)' : 'No (Server sees nothing)'}</li>
             <li><strong>Token Length:</strong> {analytics.debug?.tokenLength || 0} characters</li>
             <li><strong>Possible Key Mappings:</strong> {analytics.debug?.detectedApifyKeys?.join(', ') || 'None found'}</li>
          </ul>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>All Detected Keys:</span>
            {analytics.debug?.allEnvKeys?.length > 0 ? (
              analytics.debug.allEnvKeys.filter(k => k.length < 30).map(k => <code key={k} style={{ background: 'rgba(0,0,0,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.7rem' }}>{k}</code>)
            ) : (
              <span style={{ fontStyle: 'italic', opacity: 0.5 }}>None found</span>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'stretch' }}>
         {(!analytics.tiktok && !analytics.instagram) ? (
           <div style={{ width: '100%', padding: '4rem 2rem', textAlign: 'center', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
             <Activity size={48} color="var(--text-secondary)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
             <h3 style={{ marginBottom: '0.5rem' }}>No Live Data Extracted</h3>
             <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                We couldn't retrieve engagement metrics for these links. This usually happens if the links are private, expired, or the API is still calibrating.
             </p>
             <Button variant="secondary" onClick={() => setIsEditing(true)}>Update or Retry Links</Button>
           </div>
         ) : (
           <>
             {renderPlatformSection('tiktok', sub.liveLinks.tiktok, analytics.tiktok)}
             {renderPlatformSection('instagram', sub.liveLinks.instagram, analytics.instagram)}
           </>
         )}
      </div>
    </div>
  );
};

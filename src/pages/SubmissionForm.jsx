import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Send, ArrowLeft, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Form';
import { FileUpload } from '../components/ui/FileUpload';

// Helper hook to parse query strings
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const SubmissionForm = () => {
  const { campaignId } = useParams();
  const { addSubmission, submissions, updateSubmissionData, campaigns } = useAppContext();
  const navigate = useNavigate();
  const query = useQuery();
  const reviseId = query.get('revise');

  const activeCampaign = campaigns.find(c => c.id === campaignId);

  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    notes: '',
    postingDate: '',
    postingTime: '',
    postingTimezone: 'EST'
  });
  
  const [assets, setAssets] = useState([]);
  const [isRevision, setIsRevision] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (reviseId) {
      const existingSub = submissions.find(s => s.id === reviseId);
      if (existingSub) {
        setFormData({
          title: existingSub.title,
          caption: existingSub.caption || '',
          notes: existingSub.notes || '',
          postingDate: existingSub.postingDate || '',
          postingTime: existingSub.postingTime || '',
          postingTimezone: existingSub.postingTimezone || 'EST'
        });
        if (existingSub.assets) {
          setAssets(existingSub.assets);
        }
        setIsRevision(true);
      }
    }
  }, [reviseId, submissions]);

  if (!activeCampaign) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Invalid Campaign Link</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (assets.length === 0) {
      alert("Please upload at least one asset!");
      return;
    }
    
    if (isRevision) {
      updateSubmissionData(reviseId, { ...formData, assets, campaignId });
    } else {
      addSubmission({ ...formData, assets, campaignId });
    }
    setShowSuccess(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto', paddingBottom: '4rem' }}>
      <Button variant="outline" className="mb-4" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Cancel
      </Button>
      
      {showSuccess ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', marginTop: '4rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <Send size={32} color="var(--accent-purple)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: 'bold' }}>Sent Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            The agency has been notified and your content is now under review. You can close this window.
          </p>
          <Button variant="primary" onClick={() => navigate('/creator/archive')}>
            Go to my Archive
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
             <Button type="submit" variant="primary" style={{ padding: '0.4rem 1.2rem' }}>
               {isRevision ? 'Resubmit for Review' : 'Submit Deliverables'}
             </Button>
          </div>

          {/* Huge borderless title */}
          <input 
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Untitled Submission" 
            required 
            style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              border: 'none', 
              background: 'transparent', 
              color: 'var(--text-primary)', 
              outline: 'none',
              width: '100%',
              marginBottom: '1.5rem',
              fontFamily: 'inherit'
            }}
          />

          {/* Properties Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, auto) 1fr', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
             
             <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>Campaign</div>
             <div style={{ color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
               ↳ {activeCampaign.title}
             </div>

             <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>Posting Date</div>
             <input 
               type="date"
               id="postingDate"
               value={formData.postingDate} 
               onChange={handleChange} 
               required
               style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: 'auto', fontSize: '0.9rem', fontFamily: 'inherit' }}
             />

             <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>Posting Time</div>
             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
               <input 
                 type="text"
                 id="postingTime"
                 value={formData.postingTime} 
                 onChange={handleChange} 
                 placeholder="Empty (e.g. 14:30 or 'Morning')" 
                 style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '200px', fontSize: '0.9rem' }}
               />
               <select 
                 id="postingTimezone"
                 value={formData.postingTimezone}
                 onChange={handleChange}
                 style={{ border: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}
               >
                  <option value="EST">EST</option>
                  <option value="CST">CST</option>
                  <option value="MST">MST</option>
                  <option value="PST">PST</option>
                  <option value="UTC">UTC</option>
                  <option value="GMT">GMT</option>
               </select>
             </div>
          </div>

          {!isRevision && activeCampaign.hashtags && (
             <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '6px' }}>
                <Info size={14} color="var(--accent-cyan)" /> Mandatory tags: <span style={{ color: 'var(--accent-cyan)' }}>{activeCampaign.hashtags}</span>
             </div>
          )}

          {/* Files embedded organically */}
          <div style={{ marginBottom: '2rem' }}>
             <FileUpload assets={assets} setAssets={setAssets} />
          </div>

          {/* Caption / Content */}
          <textarea 
            id="caption"
            value={formData.caption} 
            onChange={e => {
              handleChange(e);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }} 
            placeholder="Draft your post caption here..." 
            required 
            style={{ 
              border: 'none', 
              background: 'transparent', 
              color: 'var(--text-primary)', 
              outline: 'none', 
              width: '100%', 
              minHeight: '150px', 
              fontSize: '1.1rem',
              lineHeight: '1.6',
              resize: 'none',
              fontFamily: 'inherit',
              marginBottom: '1rem'
            }}
          />

          {/* Notes */}
          <textarea 
            id="notes"
            value={formData.notes} 
            onChange={e => {
              handleChange(e);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }} 
            placeholder="Add context or notes for the agency reviewers (optional)..." 
            style={{ 
              border: 'none', 
              background: 'transparent', 
              color: 'var(--text-secondary)', 
              outline: 'none', 
              width: '100%', 
              minHeight: '100px', 
              fontSize: '0.95rem',
              lineHeight: '1.6',
              resize: 'none',
              fontFamily: 'inherit',
              borderTop: '1px dashed var(--border-light)',
              paddingTop: '2rem',
              marginTop: '1rem'
            }}
          />

        </form>
      )}
    </div>
  );
};

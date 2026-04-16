import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Activity, Plus, MailOpen, Edit3, ClipboardList, Send, X, UploadCloud, Archive } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Textarea } from '../components/ui/Form';
import './Dashboard.css';

export const AgencyDashboard = () => {
  const { campaigns, submissions, addCampaign, updateCampaign, archiveCampaign } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('existing');
  const [activeCampaignViewId, setActiveCampaignViewId] = useState(null);

  // Form State for creating a campaign
  const [campForm, setCampForm] = useState({
    title: '',
    description: '',
    hashtags: '',
    guidelines: ''
  });

  // State for tracking inline editing
  const [editingCampId, setEditingCampId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // State for tracking invite forms
  const [invitingCampId, setInvitingCampId] = useState(null);
  const [inviteFormData, setInviteFormData] = useState({ email: '', message: '' });

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    addCampaign(campForm);
    setCampForm({ title: '', description: '', hashtags: '', guidelines: '' });
    setActiveCampaignViewId(null);
    setActiveTab('existing');
  };

  const startEditing = (camp) => {
    setEditingCampId(camp.id);
    setEditFormData({ description: camp.description, hashtags: camp.hashtags, guidelines: camp.guidelines });
  };

  const saveEdit = (id) => {
    updateCampaign(id, editFormData);
    setEditingCampId(null);
  };

  const startInviting = (campId) => {
    setInvitingCampId(campId);
    setInviteFormData({ email: '', message: "We'd love for you to join our latest campaign!" });
  };

  const sendMockInvite = (e, campId) => {
    e.preventDefault();
    const encodedEmail = encodeURIComponent(inviteFormData.email);
    const encodedMsg = encodeURIComponent(inviteFormData.message);
    navigate(`/mock/email/${campId}?email=${encodedEmail}&msg=${encodedMsg}`);
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'Active');
  const completedCampaigns = campaigns.filter(c => c.status === 'Completed');
  const archivedCampaigns = campaigns.filter(c => c.status === 'Archived');

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title">Agency Workspace</h1>
          <p className="dashboard-subtitle">Manage campaigns, briefs, and creator deliverables.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
        <Button variant={activeTab === 'existing' ? 'primary' : 'outline'} onClick={() => setActiveTab('existing')}>
          <ClipboardList size={16} /> Active Campaigns
        </Button>
        <Button variant={activeTab === 'create' ? 'primary' : 'outline'} onClick={() => setActiveTab('create')}>
          <Plus size={16} /> Create Campaign
        </Button>
        <Button variant={activeTab === 'completed' ? 'primary' : 'outline'} onClick={() => setActiveTab('completed')}>
          <CheckCircle size={16} /> Completed
        </Button>
        <Button variant={activeTab === 'archived' ? 'primary' : 'outline'} onClick={() => setActiveTab('archived')}>
          <Archive size={16} /> Archived
        </Button>
      </div>

      {activeTab === 'create' && (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
          <form onSubmit={handleCreateCampaign} style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
              <Button type="submit" variant="primary" style={{ padding: '0.4rem 1.2rem' }}>
                Publish Campaign
              </Button>
            </div>

            {/* Huge borderless title */}
            <input 
              type="text"
              value={campForm.title} 
              onChange={e => setCampForm({...campForm, title: e.target.value})} 
              placeholder="Untitled Campaign" 
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
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, auto) 1fr', gap: '0.75rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
               
               <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>Hashtags</div>
               <input 
                 type="text"
                 value={campForm.hashtags} 
                 onChange={e => setCampForm({...campForm, hashtags: e.target.value})} 
                 placeholder="e.g. #NewGear (Optional)" 
                 style={{ border: 'none', background: 'transparent', color: 'var(--accent-purple)', outline: 'none', width: '100%', fontSize: '0.9rem' }}
               />

               <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>Brand Accounts</div>
               <input 
                 type="text"
                 value={campForm.guidelines} 
                 onChange={e => setCampForm({...campForm, guidelines: e.target.value})} 
                 placeholder="List any brand accounts that need to be tagged" 
                 style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.9rem' }}
               />
            </div>

            {/* Freeform Body (Brief Description) */}
            <textarea 
              value={campForm.description} 
              onChange={e => {
                setCampForm({...campForm, description: e.target.value});
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }} 
              placeholder="Campaign hooks...&#13;&#10;Key talking points...&#13;&#10;Visual mood board direction..." 
              required 
              style={{ 
                border: 'none', 
                background: 'transparent', 
                color: 'var(--text-primary)', 
                outline: 'none', 
                width: '100%', 
                minHeight: '300px', 
                fontSize: '1.1rem',
                lineHeight: '1.6',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />

            {/* Supplementary File Upload */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem', 
                marginTop: '1rem', 
                padding: '2rem', 
                border: '1px dashed var(--border-light)', 
                borderRadius: '8px', 
                color: 'var(--text-secondary)', 
                cursor: 'pointer',
                background: 'var(--glass-bg)',
                transition: 'background 0.2s',
              }} 
              onClick={() => alert('PDF Upload Dialog Triggered')}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
            >
               <UploadCloud size={20} />
               <span style={{ fontSize: '0.95rem' }}>Upload supplementary PDF brief</span>
            </div>

          </form>
        </div>
      )}

      {activeTab === 'existing' && !activeCampaignViewId && (
        <div className="campaign-list">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span>Campaign</span>
            <span>Status</span>
            <span>Deliverables</span>
          </div>
          {activeCampaigns.length === 0 ? <p style={{ padding: '1rem' }}>No active campaigns found.</p> : activeCampaigns.map(camp => {
             const campSubs = submissions.filter(s => s.campaignId === camp.id);
             return (
                <div 
                  key={camp.id} 
                  className="campaign-list-row"
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-light)', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                  onClick={() => setActiveCampaignViewId(camp.id)}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{camp.title}</div>
                  <div><Badge status={camp.status} /></div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{campSubs.length} submissions</div>
                </div>
             )
          })}
        </div>
      )}

      {activeCampaignViewId && (() => {
         const camp = campaigns.find(c => c.id === activeCampaignViewId);
         if (!camp) return null;
         const campSubs = submissions.filter(s => s.campaignId === camp.id);
         const isEditing = editingCampId === camp.id;
         const isInviting = invitingCampId === camp.id;

         return (
           <div className="campaign-document animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
             <button onClick={() => setActiveCampaignViewId(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               ← Back to Campaigns
             </button>
             
             {/* Document Body */}
             <div style={{ padding: '0 1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                 <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, lineHeight: 1.2 }}>{camp.title}</h2>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                   {!isEditing && (
                     <Button variant="outline" onClick={() => startEditing(camp)}><Edit3 size={16} /> Edit</Button>
                   )}
                   {!isInviting && (
                     <Button variant="secondary" onClick={() => startInviting(camp.id)}><MailOpen size={16} /> Invite</Button>
                   )}
                   {camp.status !== 'Archived' && (
                     <Button variant="outline" onClick={() => { archiveCampaign(camp.id); setActiveCampaignViewId(null); }} style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-light)' }}>
                       <Archive size={16} /> Archive
                     </Button>
                   )}
                 </div>
               </div>

               {isEditing ? (
                  <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--accent-purple)' }}>
                     <Textarea 
                        label="Edit Description"
                        value={editFormData.description} 
                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                     />
                     <Input 
                        label="Edit Hashtags"
                        value={editFormData.hashtags} 
                        onChange={(e) => setEditFormData({...editFormData, hashtags: e.target.value})}
                     />
                     <Textarea 
                        label="Edit Guidelines"
                        value={editFormData.guidelines} 
                        onChange={(e) => setEditFormData({...editFormData, guidelines: e.target.value})}
                     />
                     <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                       <Button variant="primary" onClick={() => saveEdit(camp.id)}>Save Changes</Button>
                       <Button variant="outline" onClick={() => setEditingCampId(null)}>Cancel</Button>
                     </div>
                  </div>
               ) : (
                  <div style={{ marginBottom: '3rem' }}>
                     <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                       {camp.description}
                     </p>
                     
                     <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {camp.hashtags && camp.hashtags.split(' ').map((tag, idx) => (
                           tag ? <span key={idx} style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.85rem', color: 'var(--accent-purple)' }}>{tag}</span> : null
                        ))}
                     </div>
                     
                     {camp.guidelines && (
                        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--border-light)' }}>
                          <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Guidelines:</strong>
                          <span style={{ fontSize: '0.95rem' }}>{camp.guidelines}</span>
                        </div>
                     )}
                  </div>
               )}

               {/* Invite Flow */}
               {isInviting && (
                  <div className="animate-fade-in" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--accent-cyan)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)' }}>Send Campaign Email Invitation</h4>
                        <button onClick={() => setInvitingCampId(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={18} /></button>
                     </div>
                     <form onSubmit={(e) => sendMockInvite(e, camp.id)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input 
                          label="Target Creator Email" 
                          type="email"
                          required
                          placeholder="creator@example.com"
                          value={inviteFormData.email}
                          onChange={(e) => setInviteFormData({...inviteFormData, email: e.target.value})}
                        />
                        <Textarea 
                          label="Personalized Message (Optional)" 
                          required
                          placeholder="Hey! Looking forward to collaborating on this."
                          value={inviteFormData.message}
                          onChange={(e) => setInviteFormData({...inviteFormData, message: e.target.value})}
                        />
                        <div style={{ alignSelf: 'flex-end', marginTop: '0.5rem' }}>
                           <Button variant="primary" type="submit" style={{ background: 'var(--accent-cyan)' }}>
                             <Send size={16} /> Send Email Invite
                           </Button>
                        </div>
                     </form>
                  </div>
               )}

                {/* Participants Summary Section */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem', marginBottom: '3rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Participants</h3>
                  {Array.from(new Set(campSubs.map(s => s.creatorName))).length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No creators assigned yet...</p>
                  ) : (
                    <div style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '12px' }}>
                      {Array.from(new Set(campSubs.map(s => s.creatorName))).map(creator => {
                        const creatorSubs = campSubs.filter(s => s.creatorName === creator);
                        const completed = creatorSubs.filter(s => s.status === 'Approved').length;
                        const total = creatorSubs.length;
                        const percent = total > 0 ? (completed / total) * 100 : 0;
                        
                        return (
                          <div key={creator} className="participant-row">
                            <span style={{ fontWeight: 600 }}>{creator}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="progress-container">
                                  <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                                </div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minWidth: '40px' }}>
                                  {completed}/{total}
                                </span>
                              </div>
                              <Badge status={percent === 100 ? 'Completed' : 'Active'} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Grouped Submissions Section */}
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Deliverables</h3>
                  {campSubs.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No submissions yet...</p>
                  ) : (
                    <div>
                      {Array.from(new Set(campSubs.map(s => s.creatorName))).map(creator => {
                        const creatorSubs = campSubs.filter(s => s.creatorName === creator);
                        return (
                          <div key={creator} className="creator-group">
                            <div className="creator-section-header">
                              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {creator}
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {creatorSubs.map(sub => (
                                <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                                   <div>
                                      <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        {sub.title} <Badge status={sub.status} />
                                      </strong>
                                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last updated {new Date(sub.submittedAt).toLocaleDateString()}</span>
                                   </div>
                                   <div>
                                      {sub.status === 'Approved' ? (
                                        <Button variant="secondary" onClick={() => navigate(`/analytics/${sub.id}`)}>
                                          <Activity size={14} /> Analytics
                                        </Button>
                                      ) : (
                                        <Button variant="primary" onClick={() => navigate(`/workspace/${sub.id}`)} style={{ fontSize: '0.85rem' }}>
                                          Workspace &rarr;
                                        </Button>
                                      )}
                                   </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>  </div>

             </div>
           </div>
         );
      })()}

      {activeTab === 'completed' && !activeCampaignViewId && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {completedCampaigns.length === 0 ? <p>No completed campaigns yet.</p> : completedCampaigns.map(camp => {
             const campSubs = submissions.filter(s => s.campaignId === camp.id && s.status === 'Approved');
             return (
               <Card key={camp.id}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{camp.title}</h3>
                  <Badge status={camp.status} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
                    {campSubs.length} Approved Deliverables
                  </p>
                  <Button variant="secondary" fullWidth onClick={() => setActiveCampaignViewId(camp.id)}>
                    View Campaign Overview
                  </Button>
               </Card>
             );
          })}
        </div>
      )}
      {activeTab === 'archived' && !activeCampaignViewId && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {archivedCampaigns.length === 0 ? <p>No archived campaigns found.</p> : archivedCampaigns.map(camp => {
             return (
               <Card key={camp.id} style={{ opacity: 0.7, cursor: 'pointer' }} onClick={() => setActiveCampaignViewId(camp.id)}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{camp.title}</h3>
                  <Badge status={camp.status} />
               </Card>
             );
          })}
        </div>
      )}
    </div>
  );
};

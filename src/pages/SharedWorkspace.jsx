import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, Circle, MapPin, Clock, UploadCloud, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea, Select } from '../components/ui/Form';
import { InteractiveMediaViewer } from '../components/ui/InteractiveMediaViewer';

export const SharedWorkspace = () => {
  const { id } = useParams();
  const { submissions, campaigns, role, addFeedback, toggleFeedbackStatus, uploadRevision, updateSubmissionStatus } = useAppContext();
  const navigate = useNavigate();
  
  const sub = submissions.find(s => s.id === id);
  const campaign = sub ? campaigns.find(c => c.id === sub.campaignId) : null;

  const [activeAssetId, setActiveAssetId] = useState(sub?.assets?.[0]?.id || null);
  const [activeVersionMap, setActiveVersionMap] = useState({});
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  
  // Compose form states
  const [draftNote, setDraftNote] = useState('');
  const [draftMarker, setDraftMarker] = useState(null); // { type, x, y, time }
  const [replyId, setReplyId] = useState(null);
  const [inputHeight, setInputHeight] = useState('40px');
  const [toast, setToast] = useState(null);

  const triggerMockEmail = (author, actionDesc) => {
     const msg = encodeURIComponent(`${author} ${actionDesc}`);
     setToast({ msg, campaignId: sub.campaignId });
     setTimeout(() => setToast(null), 8000); 
  };

  if (!sub) return <div style={{ padding: '2rem', textAlign: 'center' }}>Workspace not found.</div>;

  const activeAsset = sub.assets.find(a => a.id === activeAssetId) || sub.assets[0];
  const totalVersions = activeAsset?.versions?.length || 1;
  const currentViewVersion = activeVersionMap[activeAssetId] || totalVersions; // Defaults to latest

  // Delineation filtering
  const relevantFeedbacks = sub.feedback.filter(fb => fb.targetAssetId === activeAsset.id && fb.targetVersion === currentViewVersion);
  const rootFeedbacks = relevantFeedbacks.filter(fb => !fb.parentId);
  const getReplies = (parentId) => relevantFeedbacks.filter(fb => fb.parentId === parentId);

  const handleAssetSwitch = (assetId) => {
     setActiveAssetId(assetId);
     setDraftMarker(null);
     setSelectedFeedbackId(null);
  };

  const submitFeedback = () => {
     if (!draftNote.trim() && !draftMarker) return;
     
     const markerData = draftMarker || { type: 'general', x: null, y: null, time: null };
     
     addFeedback(sub.id, {
        targetAssetId: activeAsset.id,
        targetVersion: currentViewVersion,
        note: draftNote,
        parentId: replyId,
        ...markerData
     });
     
     triggerMockEmail(role === 'agency' ? 'Agency Reviewer' : 'Daiki Shinomiya', 'added a new comment inside your workspace.');

     setDraftNote('');
     setDraftMarker(null);
     setReplyId(null);
     setInputHeight('40px');
  };

  const handleStatusCommit = (status) => {
     updateSubmissionStatus(sub.id, status);
     triggerMockEmail(role === 'agency' ? 'Agency Reviewer' : 'Daiki Shinomiya', `officially updated the campaign status to: ${status}.`);
     
     if (status === 'Approved') {
        navigate(`/analytics/${sub.id}`);
     }
  };

  // Mock handling of file upload for revision
  const handleSimulatedFileUpload = () => {
     const dummyImageUrl = prompt("Enter a mock URL for the revised asset (or leave blank for placeholder):", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80");
     if (dummyImageUrl !== null) {
        uploadRevision(sub.id, activeAsset.id, dummyImageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80");
        setActiveVersionMap({ ...activeVersionMap, [activeAsset.id]: totalVersions + 1 });
        triggerMockEmail('Daiki Shinomiya', 'uploaded a brand new version of the asset for your review!');
     }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 400px)', gap: '2rem', height: 'calc(100vh - 100px)' }}>
      
      {/* Left Frame: Media Engine */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
               <Button variant="outline" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
                 <ArrowLeft size={16} /> Exit Workspace
               </Button>
               <h1 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {sub.title} 
                  <span style={{ fontSize: '0.8rem', background: 'var(--glass-bg)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--accent-purple)', color: 'var(--accent-purple)' }}>
                     {role === 'agency' ? `Reviewing @${sub.creatorName}` : `Campaign: ${campaign?.title}`}
                  </span>
               </h1>
            </div>
            
            {/* Version Toggler */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Viewing:</span>
               <Select 
                 value={currentViewVersion} 
                 onChange={(e) => setActiveVersionMap({ ...activeVersionMap, [activeAsset.id]: parseInt(e.target.value) })}
                 style={{ width: '120px' }}
               >
                  {activeAsset.versions.map(v => (
                     <option key={v.v} value={v.v}>Version {v.v} {v.v === totalVersions ? '(Latest)' : ''}</option>
                  ))}
               </Select>
            </div>
         </div>

         <div style={{ flex: 1, overflowY: 'auto' }}>
            <InteractiveMediaViewer 
               asset={activeAsset}
               activeVersion={currentViewVersion}
               feedbacks={sub.feedback}
               onAddFeedback={setDraftMarker}
               selectedFeedbackId={selectedFeedbackId}
               setSelectedFeedbackId={setSelectedFeedbackId}
            />
            
            {/* Asset Navigator Toolbar */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
               {sub.assets.map((a, i) => (
                  <div 
                     key={a.id} 
                     onClick={() => handleAssetSwitch(a.id)}
                     style={{
                        padding: '0.5rem 1rem', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        background: activeAssetId === a.id ? 'var(--accent-purple)' : 'transparent',
                        border: activeAssetId === a.id ? '1px solid transparent' : '1px solid var(--border-light)',
                        color: activeAssetId === a.id ? 'white' : 'var(--text-secondary)'
                     }}
                  >
                     Asset {i + 1}
                  </div>
               ))}
            </div>

            {/* Global Context Block */}
            <div style={{ marginTop: '2rem' }}>
               <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Caption Draft</h3>
               <p style={{ padding: '1rem', background: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.95rem' }}>
                  {sub.caption}
               </p>
            </div>
         </div>
      </div>

      {/* Right Frame: Asynchronous Chat & Status */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid var(--border-light)', paddingLeft: '2rem' }}>
         
         <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={18} /> Discussion Thread</h2>
         </div>

         {/* Chat Log */}
         <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {rootFeedbacks.length === 0 ? (
               <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>No feedback marked on this version yet.</p>
            ) : rootFeedbacks.map(fb => {
               const replies = getReplies(fb.id);
               const isSelf = fb.role === role;
               
               return (
                  <div key={fb.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: isSelf ? 'flex-end' : 'flex-start' }}>
                     {/* Root Message Bubble */}
                     <div 
                        onClick={() => setSelectedFeedbackId(fb.id)}
                        style={{ 
                           maxWidth: '85%',
                           padding: '1rem', 
                           borderRadius: '16px',
                           borderBottomLeftRadius: isSelf ? '16px' : '4px',
                           borderBottomRightRadius: isSelf ? '4px' : '16px',
                           background: isSelf ? 'var(--accent-purple)' : 'var(--bg-secondary)', 
                           color: isSelf ? 'white' : 'var(--text-primary)',
                           border: selectedFeedbackId === fb.id ? (isSelf ? '2px solid white' : '2px solid var(--accent-purple)') : '1px solid transparent',
                           cursor: 'pointer',
                           boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                     >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                           <strong style={{ fontSize: '0.75rem', opacity: 0.8, color: 'inherit' }}>
                              {isSelf ? 'You' : fb.author}
                           </strong>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleFeedbackStatus(sub.id, fb.id); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                title={fb.status === 'resolved' ? "Mark Open" : "Resolve Note"}
                              >
                                 {fb.status === 'resolved' ? <CheckCircle size={14} color={isSelf ? 'white' : 'var(--status-approved)'} /> : <Circle size={14} color={isSelf ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)'} />}
                              </button>
                           </div>
                        </div>
                        
                        {(fb.type === 'temporal' || fb.type === 'spatial') && (
                           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: isSelf ? 'rgba(0,0,0,0.2)' : 'var(--glass-bg)', padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                              {fb.type === 'temporal' ? <><Clock size={10} /> {fb.time.toFixed(1)}s</> : <><MapPin size={10} /> Pin</>}
                           </div>
                        )}

                        <p style={{ fontSize: '0.95rem', lineHeight: '1.4', margin: 0, textDecoration: fb.status === 'resolved' ? 'line-through' : 'none' }}>
                           {fb.note}
                        </p>
                     </div>

                     {/* Threaded Replies */}
                     {replies.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%', paddingLeft: isSelf ? '0' : '1.5rem', paddingRight: isSelf ? '1.5rem' : '0', alignItems: isSelf ? 'flex-end' : 'flex-start' }}>
                           {replies.map(r => {
                              const rIsSelf = r.role === role;
                              return (
                                 <div key={r.id} style={{
                                    maxWidth: '80%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '16px',
                                    borderBottomLeftRadius: rIsSelf ? '16px' : '4px',
                                    borderBottomRightRadius: rIsSelf ? '4px' : '16px',
                                    background: rIsSelf ? 'var(--accent-purple)' : 'var(--glass-bg)',
                                    color: rIsSelf ? 'white' : 'var(--text-primary)',
                                    fontSize: '0.85rem'
                                 }}>
                                    <strong style={{ fontSize: '0.7rem', opacity: 0.8, display: 'block', marginBottom: '0.2rem' }}>
                                       {rIsSelf ? 'You' : r.author}
                                    </strong>
                                    {r.note}
                                 </div>
                              );
                           })}
                        </div>
                     )}

                     {/* Reply Action */}
                     <div 
                        style={{ margin: isSelf ? '0 0.5rem' : '0 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.25rem' }} 
                        onClick={() => setReplyId(fb.id)}
                     >
                        Reply
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Compose Area */}
         <div style={{ paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {draftMarker && (
               <div style={{ fontSize: '0.8rem', background: 'var(--bg-secondary)', padding: '0.4rem 0.8rem', borderRadius: '16px', color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
                  {draftMarker.type === 'temporal' ? <><Clock size={12}/> {draftMarker.time.toFixed(1)}s</> : <><MapPin size={12}/> Spatial Pin</>}
                  <button onClick={() => setDraftMarker(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>×</button>
               </div>
            )}
            {replyId && (
               <div style={{ fontSize: '0.8rem', background: 'var(--bg-secondary)', padding: '0.4rem 0.8rem', borderRadius: '16px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
                  Replying to thread...
                  <button onClick={() => setReplyId(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
               </div>
            )}
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
               <Textarea 
                  value={draftNote} 
                  onChange={e => {
                     setDraftNote(e.target.value);
                     e.target.style.height = '40px'; 
                     const newHeight = Math.min(e.target.scrollHeight, 120);
                     setInputHeight(`${newHeight}px`);
                  }} 
                  placeholder={replyId ? "Type a reply..." : (draftMarker ? "Add note to marker..." : "Message...")}
                  style={{ height: inputHeight, background: 'transparent', border: 'none', padding: '0.5rem 1rem', resize: 'none', fontSize: '0.95rem', overflowY: inputHeight === '120px' ? 'auto' : 'hidden', boxSizing: 'border-box' }}
               />
               <button onClick={submitFeedback} style={{ background: 'var(--accent-purple)', color: 'white', border: 'none', width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Send size={16} style={{ marginLeft: '2px' }} />
               </button>
            </div>
         </div>

         {/* Action Resolutions */}
         <div style={{ paddingTop: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {role === 'agency' ? (
               <>
                  <Button variant="primary" style={{ background: 'var(--status-approved)' }} fullWidth onClick={() => handleStatusCommit('Approved')}>
                     Approve Deliverables
                  </Button>
                  <Button variant="outline" fullWidth onClick={() => handleStatusCommit('Changes Requested')}>
                     <CheckCircle style={{ marginRight: '0.5rem' }} size={16}/> Mark Changes Requested
                  </Button>
               </>
            ) : (
               <>
                  <Button variant="outline" fullWidth onClick={handleSimulatedFileUpload}>
                     <UploadCloud style={{ marginRight: '0.5rem' }} size={16} /> Upload New Version
                  </Button>
                  <Button variant="primary" style={{ background: 'var(--accent-cyan)' }} fullWidth onClick={() => handleStatusCommit('Pending')}>
                     Alert Agency to Re-Review
                  </Button>
               </>
            )}
         </div>

      </div>
      
      {/* Toast Notification */}
      {toast && (
         <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '0.8rem', minWidth: '300px', animation: 'fadeIn 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <strong style={{ fontSize: '0.9rem', color: 'var(--accent-purple)' }}>Mock Email Sent</strong>
               <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>×</button>
            </div>
            <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-primary)' }}>A notification was delivered.</p>
            <Button variant="outline" fullWidth onClick={() => navigate(`/mock/email/${toast.campaignId}?type=notification&msg=${toast.msg}`)}>
               View Inbox
            </Button>
         </div>
      )}
    </div>
  );
};

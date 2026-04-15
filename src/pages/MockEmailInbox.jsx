import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Building2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Helper for query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const MockEmailInbox = () => {
  const { campaignId } = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const { campaigns } = useAppContext();

  const email = query.get('email') || 'creator@example.com';
  const type = query.get('type') || 'invite';
  const customMessage = query.get('msg') || "We'd love for you to join our latest campaign!";
  
  const campaign = campaigns.find(c => c.id === campaignId) || {
    id: campaignId,
    title: 'Your Campaign'
  };

  const navigateToGateway = () => {
     navigate(`/invite/${campaignId}`);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#f3f4f6', zIndex: 9999, display: 'flex', flexDirection: 'column', color: '#1f2937' }}>
       {/* Mock Browser/Client Header */}
       <div style={{ background: '#ffffff', padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <ButtonMock onClick={() => navigate('/agency')}>
            <ArrowLeft size={16} /> Back to Agency OS
          </ButtonMock>
          <div style={{ flex: 1, textAlign: 'center', fontWeight: '600', color: '#6b7280', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
             <Mail size={16} /> Inbox Simulation Mode
          </div>
          <div style={{ width: '150px' }}></div>
       </div>

       {/* Email Body Container */}
       <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 1rem' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
             
             {/* Email Header */}
             <div style={{ background: '#09090b', color: 'white', padding: '2rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                   <Building2 size={40} color="#a855f7" />
                </div>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '500', fontFamily: "'Outfit', sans-serif" }}>NexGen Agency</h1>
             </div>

             {/* Email Content */}
             <div style={{ padding: '2.5rem' }}>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                   <strong>To:</strong> {email} <br/>
                   <strong>From:</strong> notifications@nexgen.agency <br/>
                   <strong>Subject:</strong> {type === 'invite' ? 'Campaign Invitation' : 'Workspace Activity'}: {campaign.title}
                </p>

                <p style={{ fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem', color: '#374151' }}>
                   Hi there,
                </p>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem', color: '#374151', fontStyle: 'italic', borderLeft: '3px solid #a855f7', paddingLeft: '1rem' }}>
                   "{customMessage}"
                </p>

                <p style={{ fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem', color: '#374151' }}>
                   {type === 'invite' 
                     ? <>You've been officially invited to submit your content drafts for the <strong>{campaign.title}</strong> campaign. Our team uses a unified workspace to review creatives, so please submit your assets and captions directly through your secure portal link below.</>
                     : <>There is new activity mapping to your <strong>{campaign.title}</strong> campaign workspace. Please log in below to review the recent changes or comments.</>}
                </p>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                   <button 
                     onClick={navigateToGateway}
                     style={{ 
                        background: '#06b6d4', 
                        color: 'white', 
                        padding: '1rem 2.5rem', 
                        borderRadius: '8px', 
                        border: 'none', 
                        fontSize: '1.1rem', 
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(6, 182, 212, 0.25)',
                        transition: 'transform 0.1s'
                     }}
                     onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                     onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                   >
                     Log in to Access Brief
                   </button>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center', margin: 0 }}>
                   If you cannot click the button, copy and paste this secure link into your browser:<br/>
                   <a href={`/invite/${campaignId}`} style={{ color: '#a855f7' }}>
                      {window.location.origin}/invite/{campaignId}
                   </a>
                </p>
             </div>

             {/* Email Footer */}
             <div style={{ background: '#f9fafb', padding: '1.5rem', textAlign: 'center', borderTop: '1px solid #f3f4f6' }}>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                   © 2026 NexGen Agency. All rights reserved.<br/>
                   You are receiving this because you are an active partner with our creative roster.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
};

// Simplified local button piece
const ButtonMock = ({ children, onClick }) => (
   <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>
      {children}
   </button>
);

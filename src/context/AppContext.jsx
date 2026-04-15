import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState(null); 
  
  const [campaigns, setCampaigns] = useState([
    {
      id: 'camp-1',
      title: 'Summer Vibes 2026',
      description: 'Showcase the new summer line at the beach. Focus on bright, energetic daytime shots.',
      hashtags: '#OceanBlue #SummerFlow',
      guidelines: 'Must tag @OceanBlue and co-author the Instagram post.',
      status: 'Active',
      createdAt: new Date(Date.now() - 600000000).toISOString()
    },
    {
      id: 'camp-2',
      title: 'Workout Gear Fall Promo',
      description: 'Showcase autumn workout gear outdoors in nature.',
      hashtags: '#FallFitness',
      guidelines: 'Must link the promo code in bio for 48 hours.',
      status: 'Completed',
      createdAt: new Date(Date.now() - 1728000000).toISOString()
    }
  ]);

  const [submissions, setSubmissions] = useState([
    {
      id: 'sub-1',
      title: 'Summer Launch Video - TikTok',
      caption: 'Get ready for the hottest drop of 2026! 🔥 Use code SUMMER20.',
      notes: 'Draft of the 30s TikTok video. Kept the intro snappy.',
      assets: [
        { 
          id: 'asset-1', 
          type: 'video', 
          fileName: 'summer-vlog.mp4',
          versions: [
             { v: 1, fileUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', uploadedAt: new Date(Date.now() - 86400000).toISOString() }
          ]
        }
      ],
      campaignId: 'camp-1',
      postingDate: '2026-06-15',
      postingTime: '10:00',
      postingTimezone: 'PST',
      creatorName: 'Daiki Shinomiya',
      status: 'Changes Requested',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      feedback: [
        {
          id: 'fb-101',
          author: 'Sarah (Agency)',
          role: 'agency',
          targetAssetId: 'asset-1',
          targetVersion: 1,
          type: 'temporal',
          time: 4.5,
          x: null, y: null,
          note: 'Can we cut this transition slightly earlier by half a second? It feels a bit slow here.',
          status: 'open',
          date: new Date(Date.now() - 40000000).toISOString()
        },
        {
          id: 'fb-101-reply1',
          parentId: 'fb-101',
          author: 'Daiki Shinomiya',
          role: 'creator',
          targetAssetId: 'asset-1',
          targetVersion: 1,
          type: 'general',
          x: null, y: null,
          time: null,
          note: 'Good call, I will snip the first 0.5s off the opening clip in Version 2.',
          status: 'open',
          date: new Date(Date.now() - 35000000).toISOString()
        }
      ]
    },
    {
      id: 'sub-2',
      title: 'Instagram Carousel Assets',
      caption: 'Walking on sunshine ☀️ New styles just dropped at @OceanBlue',
      notes: 'Photos from the beach shoot, retouched and formatted for IG 4:5.',
      assets: [
        { 
          id: 'asset-10', 
          type: 'image', 
          fileName: 'beach1.jpg',
          versions: [
             { v: 1, fileUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80', uploadedAt: new Date(Date.now() - 172800000).toISOString() }
          ]
        },
        { 
          id: 'asset-11', 
          type: 'image', 
          fileName: 'beach2.jpg',
          versions: [
             { v: 1, fileUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80', uploadedAt: new Date(Date.now() - 172800000).toISOString() },
             { v: 2, fileUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', uploadedAt: new Date(Date.now() - 86400000).toISOString() }
          ]
        }
      ],
      campaignId: 'camp-1',
      postingDate: '2026-06-20',
      postingTime: 'Afternoon',
      postingTimezone: 'EST',
      creatorName: 'Daiki Shinomiya',
      status: 'Pending', // Resubmitted
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      feedback: [
        {
          id: 'fb-102',
          author: 'Michael (Agency)',
          role: 'agency',
          targetAssetId: 'asset-11',
          targetVersion: 1,
          type: 'spatial',
          x: 45, y: 70,
          note: 'The logo on this shirt is slightly blurred, can we sharpen it in post?',
          status: 'resolved',
          date: new Date(Date.now() - 150000000).toISOString()
        },
        {
          id: 'fb-103',
          author: 'Daiki Shinomiya',
          role: 'creator',
          targetAssetId: 'asset-11',
          targetVersion: 2,
          type: 'general',
          x: null, y: null,
          note: 'I uploaded version 2. Sharpened the shirt logo exactly as requested!',
          status: 'open',
          date: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    }
  ]);

  const login = (selectedRole) => setRole(selectedRole);
  const logout = () => setRole(null);

  const addCampaign = (data) => {
    const newCamp = {
      id: `camp-${Date.now()}`,
      ...data,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    setCampaigns([newCamp, ...campaigns]);
    return newCamp.id;
  };

  const updateCampaign = (id, updatedData) => {
    setCampaigns(campaigns.map(camp => {
      if (camp.id === id) {
        return { ...camp, ...updatedData };
      }
      return camp;
    }));
  };

  const archiveCampaign = (id) => {
    setCampaigns(campaigns.map(camp => {
      if (camp.id === id) {
        return { ...camp, status: 'Archived' };
      }
      return camp;
    }));
  };

  const addSubmission = (data) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      ...data,
      creatorName: 'Daiki Shinomiya',
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      feedback: [],
      liveLinks: null,
      analytics: {}
    };
    setSubmissions([newSub, ...submissions]);
  };

  // Add specific granular feedback
  const addFeedback = (subId, feedbackBlock) => {
     setSubmissions(submissions.map(sub => {
        if (sub.id === subId) {
           const newFeedback = {
              id: `fb-${Date.now()}`,
              author: role === 'agency' ? 'Agency Reviewer' : 'Daiki Shinomiya',
              role: role,
              status: 'open',
              date: new Date().toISOString(),
              parentId: feedbackBlock.parentId || null,
              ...feedbackBlock
           };
           return { ...sub, feedback: [...sub.feedback, newFeedback] };
        }
        return sub;
     }));
  };

  // Resolve or reopen feedback
  const toggleFeedbackStatus = (subId, feedbackId) => {
     setSubmissions(submissions.map(sub => {
        if (sub.id === subId) {
           return {
              ...sub,
              feedback: sub.feedback.map(fb => fb.id === feedbackId ? { ...fb, status: fb.status === 'open' ? 'resolved' : 'open' } : fb)
           }
        }
        return sub;
     }));
  };

  const updateSubmissionStatus = (id, status) => {
    setSubmissions(submissions.map(sub => {
      if (sub.id === id) return { ...sub, status };
      return sub;
    }));
  };

  // New specific function for adding a new VERSION to an existing asset
  const uploadRevision = (subId, assetId, newFileUrl) => {
     setSubmissions(submissions.map(sub => {
       if (sub.id === subId) {
          const updatedAssets = sub.assets.map(asset => {
             if (asset.id === assetId) {
                const nextVersionNum = asset.versions.length + 1;
                return {
                   ...asset,
                   versions: [...asset.versions, { v: nextVersionNum, fileUrl: newFileUrl, uploadedAt: new Date().toISOString() }]
                }
             }
             return asset;
          });
          return { ...sub, assets: updatedAssets, status: 'Pending', submittedAt: new Date().toISOString() }; // Resets status
       }
       return sub;
     }));
  }

  const updateLiveLinks = async (id, links) => {
    setSubmissions(submissions.map(sub => {
      if (sub.id === id) {
        return { ...sub, liveLinks: links, isScraping: true };
      }
      return sub;
    }));

    let newAnalytics = { tiktok: null, instagram: null };

    try {
      if (links.tiktok) {
        const response = await fetch(`/api/scrape?url=${encodeURIComponent(links.tiktok)}`);
        if (response.ok) {
          newAnalytics.tiktok = await response.json();
        }
      }
      if (links.instagram) {
        const response = await fetch(`/api/scrape?url=${encodeURIComponent(links.instagram)}`);
        if (response.ok) {
          newAnalytics.instagram = await response.json();
        }
      }
    } catch (error) {
      console.error("Scraping failed:", error);
    }

    setSubmissions(prev => prev.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          isScraping: false,
          analytics: (newAnalytics.tiktok || newAnalytics.instagram) ? newAnalytics : sub.analytics 
        };
      }
      return sub;
    }));
  };

  return (
    <AppContext.Provider value={{ role, login, logout, submissions, campaigns, addCampaign, updateCampaign, archiveCampaign, addSubmission, updateSubmissionStatus, addFeedback, toggleFeedbackStatus, uploadRevision, updateLiveLinks }}>
      {children}
    </AppContext.Provider>
  );
};

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { AgencyLogin } from './pages/AgencyLogin';
import { CreatorDashboard } from './pages/CreatorDashboard';
import { SubmissionForm } from './pages/SubmissionForm';
import { AgencyDashboard } from './pages/AgencyDashboard';
import { SharedWorkspace } from './pages/SharedWorkspace';
import { AnalyticsInterface } from './pages/AnalyticsInterface';
import { InviteGateway } from './pages/InviteGateway';
import { MockEmailInbox } from './pages/MockEmailInbox';
import './index.css';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { role } = useAppContext();
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const SharedRoute = ({ children }) => {
  const { role } = useAppContext();
  if (!role) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Agency Login & Redirect Portal */}
        <Route index element={<AgencyLogin />} />
        
        {/* Magic Link / Email Gateway for Creators */}
        <Route path="invite/:campaignId" element={<InviteGateway />} />
        
        {/* Out of bounds visual mockup for the outbound email */}
        <Route path="mock/email/:campaignId" element={<MockEmailInbox />} />

        {/* Creator Routes */}
        <Route path="creator/archive" element={
          <ProtectedRoute allowedRole="creator">
            <CreatorDashboard />
          </ProtectedRoute>
        } />
        <Route path="creator/submit/:campaignId" element={
          <ProtectedRoute allowedRole="creator">
            <SubmissionForm />
          </ProtectedRoute>
        } />

        {/* Agency Routes */}
        <Route path="agency" element={
          <ProtectedRoute allowedRole="agency">
            <AgencyDashboard />
          </ProtectedRoute>
        } />

        {/* Shared Workspace Route */}
        <Route path="workspace/:id" element={
          <SharedRoute>
            <SharedWorkspace />
          </SharedRoute>
        } />

        {/* Shared Analytics Route */}
        <Route path="analytics/:id" element={
          <SharedRoute>
            <AnalyticsInterface />
          </SharedRoute>
        } />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

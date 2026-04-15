import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Building2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import './RoleSelection.css';

export const RoleSelection = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    login(role);
    if (role === 'influencer') {
      navigate('/influencer');
    } else {
      navigate('/agency');
    }
  };

  return (
    <div className="role-selection-wrapper">
      <h1 className="hero-title">Seamless Content Approvals</h1>
      <p className="hero-subtitle">
        Bridge the gap between creators and agencies. Submit, review, and approve campaigns in one unified aesthetic workspace.
      </p>
      
      <div className="role-cards">
        <div onClick={() => handleRoleSelect('influencer')}>
          <Card className="role-card influencer" hoverable>
            <div className="role-icon">
              <Camera size={24} />
            </div>
            <h2 className="role-title">I'm an Influencer</h2>
            <p className="role-desc">
              Submit your drafted content, view requested revisions, and get your campaign posts approved instantly.
            </p>
          </Card>
        </div>

        <div onClick={() => handleRoleSelect('agency')}>
          <Card className="role-card agency" hoverable>
            <div className="role-icon">
              <Building2 size={24} />
            </div>
            <h2 className="role-title">I'm an Agency</h2>
            <p className="role-desc">
              Review pending content from creators, provide actionable feedback, and finalize campaign deliverables.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

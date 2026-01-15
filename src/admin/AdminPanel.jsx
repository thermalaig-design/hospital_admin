import React, { useState } from 'react';
import { Shield, Users, Home as HomeIcon } from 'lucide-react';
import DirectoryMain from './pages/DirectoryMain';
import CommitteeMembersPage from './pages/CommitteeMembersPage';
import TrusteeMembersPage from './pages/TrusteeMembersPage';
import PatronMembersPage from './pages/PatronMembersPage';
import ElectedMembersPage from './pages/ElectedMembersPage';
import HospitalsPage from './pages/HospitalsPage';
import DoctorsPage from './pages/DoctorsPage';

const AdminPanel = ({ onNavigate }) => {
  const [currentView, setCurrentView] = useState('main');

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch(currentView) {
      case 'committee':
        return <CommitteeMembersPage onNavigate={handleNavigate} />;
      case 'trustees':
        return <TrusteeMembersPage onNavigate={handleNavigate} />;
      case 'patrons':
        return <PatronMembersPage onNavigate={handleNavigate} />;
      case 'elected':
        return <ElectedMembersPage onNavigate={handleNavigate} />;
      case 'hospitals':
        return <HospitalsPage onNavigate={handleNavigate} />;
      case 'doctors':
        return <DoctorsPage onNavigate={handleNavigate} />;
      default:
        return <DirectoryMain onNavigate={handleNavigate} onHomeNavigate={onNavigate} />;
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-600" />
          <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-indigo-600"
            title="Go to Home"
          >
            <HomeIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Render Current View */}
      {renderCurrentView()}
    </div>
  );
};

export default AdminPanel;


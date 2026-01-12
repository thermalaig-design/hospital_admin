import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import OTPVerification from './OTPVerification';
import Directory from './Directory';
import Profile from './Profile';
import Appointments from './Appointments';
import Reports from './Reports';
import Referral from './Referral';
import Notices from './Notices';
import HealthcareTrusteeDirectory from './HealthcareTrusteeDirectory';
import MemberDetails from './MemberDetails';
import CommitteeMembers from './CommitteeMembers';
import ProtectedRoute from './ProtectedRoute';

const HospitalTrusteeApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMember] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [previousScreen, setPreviousScreen] = useState(null);
  const [previousScreenName, setPreviousScreenName] = useState(null);

  // Appointment state
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    phone: '',
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });

  // Reference state
  const [referenceView, setReferenceView] = useState('menu'); // menu, addNew, history
  const [newReference, setNewReference] = useState({
    patientName: '',
    age: '',
    gender: '',
    phone: '',
    referredTo: '',
    condition: '',
    category: '',
    notes: ''
  });

  // Navigation handler - supports both route-based and state-based navigation
  const handleNavigate = (screen, data = null) => {
    if (screen === 'appointment' && !isMember) {
      alert('Only members can book appointments.');
      return;
    }
    if (screen === 'member-details' && data) {
      // Store the previous screen info
      setPreviousScreen(location.pathname);
      setPreviousScreenName(data.previousScreenName || location.pathname);
      setSelectedMember(data);
      // Store member data in sessionStorage for route access
      sessionStorage.setItem('selectedMember', JSON.stringify(data));
      sessionStorage.setItem('previousScreen', location.pathname);
      sessionStorage.setItem('previousScreenName', data.previousScreenName || location.pathname);
      navigate('/member-details');
    } else if (screen === 'committee-members' && data) {
      // Store the previous screen info for committee members
      setPreviousScreen(location.pathname);
      setPreviousScreenName(data.previousScreenName || location.pathname);
      setSelectedMember(data);
      // Store committee data in sessionStorage for route access
      sessionStorage.setItem('selectedMember', JSON.stringify(data));
      sessionStorage.setItem('previousScreen', location.pathname);
      sessionStorage.setItem('previousScreenName', data.previousScreenName || location.pathname);
      navigate('/committee-members');
    } else {
      // Map screen names to routes
      const routeMap = {
        'home': '/',
        'login': '/login',
        'profile': '/profile',
        'directory': '/directory',
        'healthcare-trustee-directory': '/healthcare-trustee-directory',
        'appointment': '/appointment',
        'reports': '/reports',
        'reference': '/reference',
        'notices': '/notices',
        'committee-members': '/committee-members'
      };
      const route = routeMap[screen] || '/';
      navigate(route);
    }
  };

  // Load member data from sessionStorage on mount if on member-details route
  useEffect(() => {
    if (location.pathname === '/member-details') {
      const storedMember = sessionStorage.getItem('selectedMember');
      const storedPreviousScreen = sessionStorage.getItem('previousScreen');
      const storedPreviousScreenName = sessionStorage.getItem('previousScreenName');
      
      if (storedMember && selectedMember === null) { // Only update if not already set
        try {
          const parsedMember = JSON.parse(storedMember);
          setSelectedMember(parsedMember);
        } catch (e) {
          console.error('Error parsing stored member:', e);
        }
      }
      if (storedPreviousScreen && previousScreen === null) { // Only update if not already set
        setPreviousScreen(storedPreviousScreen);
      }
      if (storedPreviousScreenName && previousScreenName === null) { // Only update if not already set
        setPreviousScreenName(storedPreviousScreenName);
      }
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps


  // Check if user should be on profile page
  const shouldShowProfile = () => {
    const user = localStorage.getItem('user');
    
    // If user exists in localStorage (just logged in) but no profile saved yet, show profile
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        const userKey = `userProfile_${parsedUser.Mobile || parsedUser.mobile || parsedUser.id || 'default'}`;
        const savedProfile = localStorage.getItem(userKey);
        
        // If no saved profile exists for this user, show profile page
        if (!savedProfile) {
          return true;
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        // If error parsing user, still show profile
        return true;
      }
    }
    
    return false;
  };

  return (
    <div className={`max-w-[430px] mx-auto bg-white shadow-2xl min-h-screen w-full ${
      (location.pathname === '/login' || location.pathname === '/otp-verification' || location.pathname === '/profile') ? 'overflow-hidden' : 'overflow-y-auto'
    }`}>
      <Routes>
        <Route 
          path="/login" 
          element={<Login />} 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home 
                onNavigate={handleNavigate}
                onLogout={() => {
                  localStorage.removeItem('isLoggedIn');
                  navigate('/login');
                }}
                isMember={isMember}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile 
                onNavigate={handleNavigate}
                onNavigateBack={() => navigate('/')}
                onProfileUpdate={() => {}}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/directory" 
          element={
            <ProtectedRoute>
              <HealthcareTrusteeDirectory 
                onNavigate={handleNavigate}
                onNavigateBack={() => navigate('/')}
                onLogout={() => {
                  localStorage.removeItem('isLoggedIn');
                  navigate('/login');
                }}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/healthcare-trustee-directory" 
          element={
            <ProtectedRoute>
              <HealthcareTrusteeDirectory 
                onNavigate={handleNavigate}
                onNavigateBack={() => navigate('/')}
                onLogout={() => {
                  localStorage.removeItem('isLoggedIn');
                  navigate('/login');
                }}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/appointment" 
          element={
            <ProtectedRoute>
              <Appointments 
                onNavigate={handleNavigate}
                appointmentForm={appointmentForm} 
                setAppointmentForm={setAppointmentForm} 
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Reports onNavigate={handleNavigate} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reference" 
          element={
            <ProtectedRoute>
              <Referral 
                onNavigate={handleNavigate}
                referenceView={referenceView} 
                setReferenceView={setReferenceView} 
                newReference={newReference} 
                setNewReference={setNewReference} 
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notices" 
          element={
            <ProtectedRoute>
              <Notices onNavigate={handleNavigate} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/member-details" 
          element={
            <ProtectedRoute>
              {selectedMember ? (
                <MemberDetails 
                  member={selectedMember}
                  onNavigateBack={() => {
                    // Navigate back to the specific directory tab, not just main directory
                    if (previousScreenName && (previousScreenName === 'healthcare' || previousScreenName === 'committee' || previousScreenName === 'trustee')) {
                      navigate('/healthcare-trustee-directory');
                      // Store the directory and tab to restore state
                      sessionStorage.setItem('restoreDirectory', previousScreenName);
                    } else if (previousScreenName && (previousScreenName === 'healthcare' || previousScreenName === 'trustees' || previousScreenName === 'patrons' || previousScreenName === 'committee' || previousScreenName === 'doctors' || previousScreenName === 'hospitals' || previousScreenName === 'elected')) {
                      navigate('/directory');
                      // Store the tab to restore state
                      sessionStorage.setItem('restoreDirectoryTab', previousScreenName);
                    } else {
                      const prevScreen = previousScreen || '/directory';
                      navigate(prevScreen);
                    }
                  }}
                  previousScreenName={previousScreenName}
                />
              ) : (
                <Navigate to="/directory" replace />
              )}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/committee-members" 
          element={
            <ProtectedRoute>
              {selectedMember ? (
                <CommitteeMembers 
                  committeeData={selectedMember}
                  onNavigateBack={() => {
                    // Navigate back to the specific directory tab, not just main directory
                    if (previousScreenName && (previousScreenName === 'healthcare' || previousScreenName === 'committee' || previousScreenName === 'trustee')) {
                      navigate('/healthcare-trustee-directory');
                      // Store the directory and tab to restore state
                      sessionStorage.setItem('restoreDirectory', previousScreenName);
                    } else {
                      const prevScreen = previousScreen || '/directory';
                      navigate(prevScreen);
                    }
                  }}
                  previousScreenName={previousScreenName}
                  onNavigate={handleNavigate}
                />
              ) : (
                <Navigate to="/directory" replace />
              )}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/otp-verification" 
          element={<OTPVerification />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default HospitalTrusteeApp;

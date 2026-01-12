import React, { useState, useEffect } from 'react';
import { User, Users, Clock, FileText, UserPlus, Bell, ChevronRight, LogOut, Heart, Shield, Plus, ArrowRight, Pill, ShoppingCart, Calendar, Stethoscope, Building2, Phone, QrCode, Monitor, Brain, Package, FileCheck, Search, Filter, MapPin, Star, HelpCircle, BookOpen, Video, Headphones, Menu, X, Home as HomeIcon, Settings, UserCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';

/* eslint-disable react-refresh/only-export-components */
const Home = ({ onNavigate, onLogout, isMember }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Load profile from Supabase first, then fallback to localStorage
    const loadProfile = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          const userId = parsedUser['Membership number'] || parsedUser.mobile || parsedUser.id;
          
          if (userId) {
            // Try to load from Supabase
            try {
              const response = await fetch('http://localhost:5001/api/profile', {
                headers: {
                  'user-id': userId
                }
              });
              
              const data = await response.json();
              if (data.success && data.profile) {
                // Map database fields to profile format
                const mappedProfile = {
                  name: data.profile.name || '',
                  profilePhotoUrl: data.profile.profile_photo_url || ''
                };
                setUserProfile(mappedProfile);
                return;
              }
            } catch (error) {
              console.error('Error loading from Supabase:', error);
            }
          }
          
          // Fallback to localStorage
          const userKey = `userProfile_${parsedUser.Mobile || parsedUser.mobile || parsedUser.id || 'default'}`;
          const savedProfile = localStorage.getItem(userKey);
          if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };
    
    loadProfile();
  }, []);
  // const recentNotices = [
  //   { id: 1, title: 'Free Cardiac Checkup', date: 'Dec 29, 2024', tag: 'Health Camp' },
  //   { id: 2, title: 'New Specialist Joined', date: 'Dec 28, 2024', tag: 'Hiring' },
  // ];

  const quickActions = [
    { id: 'directory', title: 'Directory', desc: 'Find Doctors & Hospitals', icon: Users, color: 'bg-blue-100', iconColor: 'text-blue-600', screen: 'directory' },
    { id: 'appointment', title: 'Book Appointment', desc: 'Schedule Doctor Visit', icon: Clock, color: 'bg-indigo-100', iconColor: 'text-indigo-600', screen: 'appointment', memberOnly: true },
    { id: 'reports', title: 'Reports', desc: 'Medical Test Results', icon: FileText, color: 'bg-orange-100', iconColor: 'text-orange-600', screen: 'reports' },
    { id: 'reference', title: 'Patient Referral', desc: 'Refer Patient to Doctor', icon: UserPlus, color: 'bg-teal-100', iconColor: 'text-teal-600', screen: 'reference' },
  ];

  const marqueeUpdates = [
    'Free Cardiac Checkup Camp on March 29, 2026',
    'New Specialist Dr. Neha Kapoor Joined',
    '24x7 Emergency Helpline: 1800-XXX-XXXX',
    'Tele Consultation Services Now Available',
    'Home Delivery of Medicines Available',
    'Free Health Camp at Main Hospital',
    'New MRI Machine Installed',
    'OPD Timings: 9 AM to 5 PM',
    'Emergency Services Available 24/7',
  ];

  // const services = [
  //   { id: 'opd-registration', title: 'OPD Self Registration', icon: QrCode, color: 'bg-purple-500' },
  //   { id: 'opd-appointment', title: 'OPD Appointment', icon: Calendar, color: 'bg-purple-500' },
  //   { id: 'medicines-received', title: 'Medicines Received', icon: Pill, color: 'bg-purple-500' },
  //   { id: 'teleconsultation', title: 'Tele Consultation', icon: Monitor, color: 'bg-purple-500' },
  //   { id: 'home-delivery', title: 'Home Delivery of Medicines', icon: ShoppingCart, color: 'bg-purple-500' },
  //   { id: 'tele-manas', title: 'Tele Manas', icon: Brain, color: 'bg-purple-500' },
  //   { id: 'e-medical-pass', title: 'e-Medical Pass', icon: FileCheck, color: 'bg-purple-500' },
  // ];

  // const enquiry = [
  //   { id: 'specialities', title: 'Availability of Specialities', icon: Stethoscope, color: 'bg-purple-500' },
  //   { id: 'lab-tests', title: 'Availability of Lab Tests', icon: Search, color: 'bg-purple-500' },
  //   { id: 'drugs', title: 'Availability of Drugs', icon: Pill, color: 'bg-purple-500' },
  //   { id: 'hcos', title: 'Empanelled HCOs Directory', icon: Building2, color: 'bg-purple-500' },
  //   { id: 'emergency-contacts', title: 'Emergency Contacts', icon: Phone, color: 'bg-purple-500' },
  //   { id: 'helpline', title: '24x7 Emergency Helpline', icon: Phone, color: 'bg-purple-500' },
  //   { id: 'health-info', title: 'Health Information', icon: Heart, color: 'bg-purple-500' },
  // ];

  // const userSupport = [
  //   { id: 'help-desk', title: 'HMIS Help Desk', icon: Headphones, color: 'bg-purple-500' },
  //   { id: 'videos', title: 'Videos', icon: Video, color: 'bg-purple-500' },
  //   { id: 'user-manuals', title: 'User Manuals', icon: BookOpen, color: 'bg-purple-500' },
  //   { id: 'handouts', title: 'Handouts', icon: FileText, color: 'bg-purple-500' },
  // ];

  return (
    <div className="bg-white min-h-screen relative">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
        <h1 className="text-lg font-bold text-gray-800">Home</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('profile')}
            className="p-1 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            {userProfile?.profilePhotoUrl ? (
              <img 
                src={userProfile.profilePhotoUrl} 
                alt="Profile" 
                className="h-8 w-8 rounded-lg object-cover border-2 border-indigo-200"
                onError={(e) => {
                  e.target.onerror = null;
                  if (userProfile?.name) {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            {userProfile?.name && !userProfile?.profilePhotoUrl ? (
              <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-xs font-bold border-2 border-indigo-200">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            ) : !userProfile?.profilePhotoUrl ? (
              <UserCircle className="h-7 w-7 text-gray-700" />
            ) : null}
          </button>
          <button 
            onClick={onLogout}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-5 w-5 text-gray-700" />
          </button>

        </div>
      </div>

      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={onNavigate}
        currentPage="home"
      />

      {/* Header Section - Premium VIP Design */}
      <div className="bg-gradient-to-br from-white to-gray-50 px-4 sm:px-6 pt-6 sm:pt-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg border-2 border-gray-100 flex-shrink-0">
            <img src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1767090787454.png?width=8000&height=8000&resize=contain" alt="Logo" className="h-12 w-12 sm:h-16 sm:w-16 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">Maharaja Agrasen Hospital</h1>
            <p className="text-gray-600 text-sm sm:text-base font-medium">Trustee & Patron Portal</p>
            {userProfile?.name && (
              <p className="text-indigo-600 text-xs sm:text-sm font-semibold mt-1 truncate">Welcome, {userProfile.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Single Marquee Updates */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white overflow-hidden relative shadow-md">
        <div className="py-2.5">
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
            {marqueeUpdates.map((update, index) => (
              <div key={index} className="flex items-center mx-6 sm:mx-8 flex-shrink-0">
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">{update}</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {marqueeUpdates.map((update, index) => (
              <div key={`dup-${index}`} className="flex items-center mx-6 sm:mx-8 flex-shrink-0">
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">{update}</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* Main Navigation Cards - Premium Design */}
      <div className="px-4 sm:px-6 mt-4 sm:mt-6 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.screen)}
              disabled={action.memberOnly && !isMember}
              className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-md border-2 border-gray-100 flex flex-col items-center text-center transition-all hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 active:scale-95 group relative overflow-hidden ${action.memberOnly && !isMember ? 'opacity-60' : ''}`}
            >
              <div className={`${action.color} p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                <action.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${action.iconColor}`} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-1 sm:mb-1.5">{action.title}</h3>
              <p className="text-gray-600 text-[10px] sm:text-xs font-medium leading-snug">{action.desc}</p>
              {action.memberOnly && !isMember && (
                <span className="absolute top-3 right-3 bg-gray-100 text-gray-400 p-1.5 rounded-full shadow-sm"><Shield className="h-3.5 w-3.5" /></span>
              )}
            </button>
          ))}
        </div>
      </div>

      
      {/* <div className="pb-20"></div>
      <div className="pb-20"></div> */}
      {/* Sponsored By Banner - Footer */}
      <div className="banner-container mt-6 w-full">
        <div className="banner-content bg-gradient-to-r from-indigo-800 to-indigo-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-indigo-700">
          <div className="flex items-center justify-between p-1 sm:p-2">
            {/* Left Side - Text Content */}
            <div className="flex-1 pr-4">
              {/* Decorative Line */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-indigo-300 flex-1"></div>
                <span className="text-indigo-200 text-[10px] sm:text-xs font-light tracking-widest">SPONSORED BY</span>
                <div className="h-px bg-gradient-to-r from-indigo-300 to-indigo-300 to-transparent flex-1"></div>
              </div>

              {/* Doctor Name */}
              <h2 className="text-lg sm:text-l md:text-3xl font-serif italic text-white leading-tight">
                Dr. Meena Subhash Gupta
              </h2>
            </div>

            {/* Right Side - 3D Realistic Image */}
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative group" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
              {/* Enhanced 3D Shadow Layers */}
              <div className="absolute inset-0 bg-black/30 rounded-2xl transform translate-x-3 translate-y-3 blur-md opacity-50" style={{ transform: 'translateZ(-10px)' }}></div>
              <div className="absolute inset-0 bg-black/15 rounded-2xl transform translate-x-2 translate-y-2 blur-lg opacity-70" style={{ transform: 'translateZ(-5px)' }}></div>
              <div className="absolute inset-0 bg-black/5 rounded-2xl transform translate-x-1 translate-y-1 blur-xl opacity-80" style={{ transform: 'translateZ(-2px)' }}></div>

              {/* Realistic 3D Image Container */}
              <div className="relative flex items-center justify-center overflow-visible transform transition-all duration-700 group-hover:scale-110" style={{ transformStyle: 'preserve-3d' }}>
                <div className="relative" style={{ transform: 'translateZ(40px) rotateX(10deg) rotateY(-8deg)' }}>
                  <img
                    src="./src/assets/president.png"
                    alt="Dr. Meena Subhash Gupta"
                    className="w-full h-full object-cover rounded-2xl shadow-2xl transform transition-all duration-700 group-hover:scale-105"
                    style={{
                      filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.5)) drop-shadow(0 8px 15px rgba(0,0,0,0.4)) drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(0,0,0,0.3)'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Realistic Lighting Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-black/30 pointer-events-none"></div>
                  {/* Fallback placeholder */}
                  <div className="text-center" style={{ display: 'none' }}>
                    <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-1" />
                    <p className="text-gray-400 text-[10px] sm:text-xs font-medium">Photo</p>
                  </div>
                </div>
              </div>

              {/* Enhanced 3D Light Effects */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-white/40 rounded-full blur-lg opacity-80" style={{ transform: 'translateZ(20px)' }}></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-white/20 rounded-full blur-md opacity-60" style={{ transform: 'translateZ(15px)' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full blur-xl opacity-50" style={{ transform: 'translateZ(25px) translateX(-50%) translateY(-50%)' }}></div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .banner-container {
          width: 100%;
          max-width: 100%;
          margin-top: 1.5rem;
        }
        
        .banner-content {
          width: 100%;
          box-sizing: border-box;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default Home;
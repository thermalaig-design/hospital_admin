import React, { useState } from 'react';
import { User, Users, Clock, FileText, UserPlus, Bell, ChevronRight, LogOut, Heart, Shield, Plus, ArrowRight, Pill, ShoppingCart, Calendar, Stethoscope, Building2, Phone, QrCode, Monitor, Brain, Package, FileCheck, Search, Filter, MapPin, Star, HelpCircle, BookOpen, Video, Headphones, Menu, X, Home as HomeIcon, Settings } from 'lucide-react';

const Notices = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const allNotices = [
    { 
      id: 2, 
      title: 'New Equipment Installation', 
      message: 'New MRI machines are being installed in the radiology department. Please expect some noise.',
      date: '2024-12-28', 
      priority: 'normal',
      icon: Building2,
      tag: 'Infrastructure'
    },
    { 
      id: 3, 
      title: 'Annual Health Camp', 
      message: 'Our annual free health camp will be organized on 5th Jan. Volunteers are requested to register.',
      date: '2024-12-25', 
      priority: 'normal',
      icon: Stethoscope,
      tag: 'Health Camp'
    },
    { 
      id: 4, 
      title: 'Holiday Notice', 
      message: 'The hospital administrative office will remain closed on 1st Jan for New Year.',
      date: '2024-12-24', 
      priority: 'low',
      icon: Bell,
      tag: 'Admin'
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-10 relative">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
        <h1 className="text-lg font-bold text-gray-800">Notice Board</h1>
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center text-indigo-600"
        >
          <HomeIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 top-[57px] w-72 h-[calc(100vh-57px)] bg-white shadow-2xl z-40 border-r border-gray-200 overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <img src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1767090787454.png?width=8000&height=8000&resize=contain" alt="Logo" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Trustee and Patron Portal</h2>
                <p className="text-xs text-gray-500">Maharaja Agarsen</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left font-medium text-gray-700">
              <HomeIcon className="h-5 w-5 text-gray-600" /> Home
            </button>
            <button onClick={() => onNavigate('directory')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left font-medium text-gray-700">
              <Users className="h-5 w-5 text-gray-600" /> Directory
            </button>
            <button onClick={() => onNavigate('appointment')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left font-medium text-gray-700">
              <Clock className="h-5 w-5 text-gray-600" /> Appointments
            </button>
            <button onClick={() => onNavigate('reports')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left font-medium text-gray-700">
              <FileText className="h-5 w-5 text-gray-600" /> Reports
            </button>
            <button onClick={() => onNavigate('reference')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left font-medium text-gray-700">
              <UserPlus className="h-5 w-5 text-gray-600" /> Referral
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white px-6 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
            <Bell className="h-12 w-12 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Important Updates</h1>
            <p className="text-gray-500 text-sm font-medium">Stay informed with latest news</p>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="px-6 py-4 space-y-4">
        {allNotices.map((notice) => (
          <div key={notice.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all border-l-4 border-l-indigo-600">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
                {notice.tag}
              </span>
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold">
                <Calendar className="h-3 w-3" />
                {notice.date}
              </div>
            </div>
            
            <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight">
              {notice.title}
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              {notice.message}
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
              <button className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline transition-all">
                Read Full Detail <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        {allNotices.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-300">
              <Bell className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-gray-800 font-bold">No new notices</h3>
            <p className="text-gray-500 text-sm mt-1">Check back later for updates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
import React from 'react';
import { Home as HomeIcon, Users, Clock, FileText, UserPlus, Pill, ChevronRight, LogOut, Menu, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, onNavigate, currentPage }) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'directory', label: 'Directory', icon: Users },
    { id: 'appointment', label: 'Appointments', icon: Clock },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'reference', label: 'Patient Referral', icon: UserPlus },
    { id: 'medicines-booking', label: 'Medicines', icon: Pill },
  ];

  return (
    <div className="absolute left-0 top-[57px] w-72 h-[calc(100vh-57px)] bg-white shadow-2xl z-40 border-r border-gray-200 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1767090787454.png?width=8000&height=8000&resize=contain" 
              alt="Logo" 
              className="h-10 w-10 object-contain" 
            />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Trustee and Patron Portal</h2>
            <p className="text-xs text-gray-500">Maharaja Agarsen</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
              currentPage === item.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <item.icon className={`h-5 w-5 ${currentPage === item.id ? 'text-indigo-600' : 'text-gray-600'}`} />
            <span className={`font-medium ${currentPage === item.id ? 'text-indigo-600' : 'text-gray-700'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
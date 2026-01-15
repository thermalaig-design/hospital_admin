import React from 'react';
import { Users, Star, Building2, Stethoscope, Award } from 'lucide-react';

const CategoryCard = ({ category, onClick }) => {
  const renderIcon = () => {
    switch(category.icon) {
      case 'Star': return <Star className={`h-6 w-6 ${category.iconColor}`} />;
      case 'Award': return <Award className={`h-6 w-6 ${category.iconColor}`} />;
      case 'Building2': return <Building2 className={`h-6 w-6 ${category.iconColor}`} />;
      case 'Stethoscope': return <Stethoscope className={`h-6 w-6 ${category.iconColor}`} />;
      default: return <Users className={`h-6 w-6 ${category.iconColor}`} />;
    }
  };

  return (
    <button
      onClick={() => onClick(category.id)}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 text-left group flex items-center"
    >
      <div className={`${category.color} p-4 rounded-xl group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
        {renderIcon()}
      </div>
      <div className="ml-4 flex-1">
        <h3 className="font-bold text-gray-800 text-lg leading-tight">{category.title}</h3>
        <p className="text-gray-600 text-base mt-1">{category.desc}</p>
      </div>
      <div className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full min-w-[36px] text-center ml-4">
        {category.count}
      </div>
    </button>
  );
};

export default CategoryCard;
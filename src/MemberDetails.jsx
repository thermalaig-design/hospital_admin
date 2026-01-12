import React from 'react';
import { User, Users, Stethoscope, Building2, Star, Award, ChevronLeft, Phone, Mail, MapPin, FileText, Clock } from 'lucide-react';

const MemberDetails = ({ member, onNavigateBack, previousScreenName }) => {
  // Get screen name for back button
  const getScreenName = () => {
    if (!previousScreenName) return 'Directory';
    
    // Handle both route paths and screen names
    const screenName = previousScreenName.replace(/^\//, ''); // Remove leading slash if present
    
    const screenNames = {
      'directory': 'Directory',
      '/directory': 'Directory',
      'healthcare-trustee-directory': 'Directory',
      '/healthcare-trustee-directory': 'Directory',
      'healthcare': 'Healthcare Directory',
      'trustees': 'Trustees',
      'patrons': 'Patrons',
      'committee': 'Committee',
      'doctors': 'Doctors',
      'hospitals': 'Hospitals',
      '/': 'Home'
    };
    
    return screenNames[previousScreenName] || screenNames[screenName] || 'Directory';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white px-6 pt-6 pb-4 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onNavigateBack}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 text-indigo-600"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">{getScreenName()}</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Member Details</h1>
          </div>
        </div>
      </div>

      {/* Member Details Card */}
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-100 p-4 rounded-2xl">
              {member.type && member.type.toLowerCase().includes('doctor') ? <Stethoscope className="h-8 w-8 text-indigo-600" /> : 
               member.type && member.type.toLowerCase().includes('committee') ? <Users className="h-8 w-8 text-indigo-600" /> : 
               member.type && (member.type.toLowerCase().includes('trustee') || member.type.toLowerCase().includes('patron')) ? <Star className="h-8 w-8 text-indigo-600" /> : 
               <User className="h-8 w-8 text-indigo-600" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{member.member_name_english || member.Name || 'N/A'}</h2>
              <p className="text-indigo-600 text-sm font-medium">{member.member_role || member.type || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Determine if this is a healthcare member (from opd_schedule) or committee member */}
            {(() => {
              const isHealthcareMember = member.isHealthcareMember || 
                                        !!member.consultant_name || 
                                        (member.original_id && member.original_id.toString().startsWith('DOC')) ||
                                        (member['S. No.'] && member['S. No.'].toString().startsWith('DOC'));
              const isCommitteeMember = member.isCommitteeMember || 
                                       (member.original_id && member.original_id.toString().startsWith('CM')) ||
                                       (member['S. No.'] && member['S. No.'].toString().startsWith('CM'));
              const isElectedMember = member.isElectedMember || 
                                     (member.elected_id !== undefined && member.elected_id !== null) ||
                                     (member.original_id && member.original_id.toString().startsWith('ELECT')) ||
                                     (member['S. No.'] && member['S. No.'].toString().startsWith('ELECT'));
              
              // Show elected member fields (merged with Members Table) - Show ALL fields from both tables
              if (isElectedMember) {
                return (
                  <>
                    {/* Members Table fields */}
                    {member['Membership number'] && member['Membership number'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Award className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Membership Number</p>
                          <p className="font-medium text-gray-800">{member['Membership number'] || member.membership_number}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Name'] && member['Name'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Name</p>
                          <p className="font-medium text-gray-800">{member['Name']}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Elected-specific fields */}
                    {member.position && member.position !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Award className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Position (Elected)</p>
                          <p className="font-medium text-gray-800">{member.position}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.location && member.location !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Location (Elected)</p>
                          <p className="font-medium text-gray-800">{member.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.type && member.type !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Type</p>
                          <p className="font-medium text-gray-800">{member.type}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Company Name'] && member['Company Name'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Building2 className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Company Name</p>
                          <p className="font-medium text-gray-800">{member['Company Name']}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Mobile'] && member['Mobile'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Mobile</p>
                          <a href={`tel:${member['Mobile'].replace(/\s+/g, '').split(',')[0]}`} className="font-medium text-indigo-600 hover:underline">
                            {member['Mobile']}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member['Email'] && member['Email'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Mail className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                          <a href={`mailto:${member['Email']}`} className="font-medium text-indigo-600 hover:underline">
                            {member['Email']}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member['Address Home'] && member['Address Home'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Address Home</p>
                          <p className="font-medium text-gray-800">{member['Address Home']}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Address Office'] && member['Address Office'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Address Office</p>
                          <p className="font-medium text-gray-800">{member['Address Office']}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Resident Landline'] && member['Resident Landline'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Resident Landline</p>
                          <a href={`tel:${member['Resident Landline'].replace(/\s+/g, '').split(',')[0]}`} className="font-medium text-indigo-600 hover:underline">
                            {member['Resident Landline']}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member['Office Landline'] && member['Office Landline'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Office Landline</p>
                          <a href={`tel:${member['Office Landline'].replace(/\s+/g, '').split(',')[0]}`} className="font-medium text-indigo-600 hover:underline">
                            {member['Office Landline']}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Display any other elected-specific fields */}
                    {Object.keys(member).filter(key => 
                      !['S. No.', 'Name', 'Mobile', 'Email', 'type', 'Membership number', 'isElectedMember', 
                        'previousScreenName', 'isHealthcareMember', 'isHospitalMember', 'isCommitteeMember',
                        'Company Name', 'Address Home', 'Address Office', 'Resident Landline', 'Office Landline',
                        'position', 'location', 'id', 'original_id', 'elected_id', 'membership_number_elected',
                        'is_merged_with_member', 'created_at'].includes(key) &&
                      member[key] !== null && member[key] !== undefined && member[key] !== '' && member[key] !== 'N/A'
                    ).map(key => (
                      <div key={key} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                          <p className="font-medium text-gray-800">{String(member[key])}</p>
                        </div>
                      </div>
                    ))}
                  </>
                );
              }
              
              // Show committee-specific fields if it's a committee member - Show ALL Supabase fields
              if (isCommitteeMember) {
                return (
                  <>
                    {member.member_name_english && member.member_name_english !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Member Name (English)</p>
                          <p className="font-medium text-gray-800">{member.member_name_english}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.member_name_hindi && member.member_name_hindi !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Member Name (Hindi)</p>
                          <p className="font-medium text-gray-800">{member.member_name_hindi}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.committee_name_english && member.committee_name_english !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Building2 className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Committee Name (English)</p>
                          <p className="font-medium text-gray-800">{member.committee_name_english}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.committee_name_hindi && member.committee_name_hindi !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Building2 className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Committee Name (Hindi)</p>
                          <p className="font-medium text-gray-800">{member.committee_name_hindi}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.member_role && member.member_role !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Award className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Role</p>
                          <p className="font-medium text-gray-800">{member.member_role}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.membership_number && member.membership_number !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Award className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Membership Number</p>
                          <p className="font-medium text-gray-800">{member.membership_number}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.member_id && member.member_id !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Member ID</p>
                          <p className="font-medium text-gray-800">{member.member_id}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.phone1 && member.phone1 !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone 1</p>
                          <a href={`tel:${member.phone1.replace(/\s+/g, '').split(',')[0]}`} className="font-medium text-indigo-600 hover:underline">
                            {member.phone1}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member.phone2 && member.phone2 !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone 2</p>
                          <a href={`tel:${member.phone2.replace(/\s+/g, '').split(',')[0]}`} className="font-medium text-indigo-600 hover:underline">
                            {member.phone2}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {(member.Mobile && member.Mobile !== 'N/A') && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Mobile</p>
                          <a href={`tel:${member.Mobile.replace(/\s+/g, '').split(',')[0]}`} className="font-medium text-indigo-600 hover:underline">
                            {member.Mobile}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member.Email && member.Email !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Mail className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                          <a href={`mailto:${member.Email}`} className="font-medium text-indigo-600 hover:underline">
                            {member.Email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member.address && member.address !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Address</p>
                          <p className="font-medium text-gray-800">{member.address}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Address Home'] && member['Address Home'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Address Home</p>
                          <p className="font-medium text-gray-800">{member['Address Home']}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Address Office'] && member['Address Office'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Address Office</p>
                          <p className="font-medium text-gray-800">{member['Address Office']}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.type && member.type !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Type</p>
                          <p className="font-medium text-gray-800">{member.type}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Display any other fields that might exist in Supabase */}
                    {Object.keys(member).filter(key => 
                      !['S. No.', 'Name', 'Mobile', 'Email', 'type', 'Membership number', 'isCommitteeMember', 
                        'previousScreenName', 'member_name_english', 'member_name_hindi', 'member_role', 
                        'committee_name_english', 'committee_name_hindi', 'phone1', 'phone2', 'address', 
                        'Address Home', 'Address Office', 'id', 'original_id'].includes(key) &&
                      member[key] !== null && member[key] !== undefined && member[key] !== '' && member[key] !== 'N/A'
                    ).map(key => (
                      <div key={key} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                          <p className="font-medium text-gray-800">{String(member[key])}</p>
                        </div>
                      </div>
                    ))}
                  </>
                );
              }
              
              // Show Members Table fields only if NOT a healthcare member, NOT a committee member, and NOT an elected member
              if (!isHealthcareMember && !isElectedMember) {
                return (
                  <>
                    {member['Membership number'] && member['Membership number'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Award className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Membership No</p>
                          <p className="font-medium text-gray-800">{member['Membership number']}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Name'] && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Name</p>
                          <p className="font-medium text-gray-800">{member['Name']}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Company Name'] && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Building2 className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Company</p>
                          <p className="font-medium text-gray-800">{member['Company Name']}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Address Home'] && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Address Home</p>
                          <p className="font-medium text-gray-800">{member['Address Home']}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Address Office'] && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Office Address</p>
                          <p className="font-medium text-gray-800">{member['Address Office']}</p>
                        </div>
                      </div>
                    )}
                    
                    {member['Mobile'] && member['Mobile'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Mobile</p>
                          <a href={`tel:${member['Mobile'].replace(/\s+/g, '').split(',')[0]}`} className="font-medium text-indigo-600 hover:underline">
                            {member['Mobile']}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member['Resident Landline'] && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Resident Landline</p>
                          <a href={`tel:${member['Resident Landline'].replace(/\s+/g, '').split(',')[0]}`} className="font-medium text-indigo-600 hover:underline">
                            {member['Resident Landline']}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member['Office Landline'] && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Office Landline</p>
                          <a href={`tel:${member['Office Landline'].replace(/\s+/g, '').split(',')[0]}`} className="font-medium text-indigo-600 hover:underline">
                            {member['Office Landline']}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member['Email'] && member['Email'] !== 'N/A' && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Mail className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                          <a href={`mailto:${member['Email']}`} className="font-medium text-indigo-600 hover:underline">
                            {member['Email']}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member.type && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Type</p>
                          <p className="font-medium text-gray-800">{member.type}</p>
                        </div>
                      </div>
                    )}
                  </>
                );
              }
              
              // Show healthcare-specific fields (from opd_schedule) only if this is a healthcare member
              return (
                <>
                  {member.consultant_name && member.consultant_name !== 'N/A' && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Consultant Name</p>
                        <p className="font-medium text-gray-800">{member.consultant_name}</p>
                      </div>
                    </div>
                  )}
                  
                  {member.department && member.department !== 'N/A' && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <Building2 className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Department</p>
                        <p className="font-medium text-gray-800">{member.department}</p>
                      </div>
                    </div>
                  )}
                  
                  {member.designation && member.designation !== 'N/A' && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Designation</p>
                        <p className="font-medium text-gray-800">{member.designation}</p>
                      </div>
                    </div>
                  )}
                  
                  {member.qualification && member.qualification !== 'N/A' && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <Award className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Qualification</p>
                        <p className="font-medium text-gray-800">{member.qualification}</p>
                      </div>
                    </div>
                  )}
                  
                  {member.unit && member.unit !== 'N/A' && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <Building2 className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Unit</p>
                        <p className="font-medium text-gray-800">{member.unit}</p>
                      </div>
                    </div>
                  )}
                  
                  {member.general_opd_days && member.general_opd_days !== 'N/A' && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">General OPD Days</p>
                        <p className="font-medium text-gray-800">{member.general_opd_days}</p>
                      </div>
                    </div>
                  )}
                  
                  {member.private_opd_days && member.private_opd_days !== 'N/A' && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Private OPD Days</p>
                        <p className="font-medium text-gray-800">{member.private_opd_days}</p>
                      </div>
                    </div>
                  )}
                  
                  {member['Mobile'] && member['Mobile'] !== 'N/A' && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Mobile</p>
                        <a href={`tel:${member['Mobile'].replace(/\s+/g, '').split(',')[0]}`} className="font-medium text-indigo-600 hover:underline">
                          {member['Mobile']}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {member.type && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Type</p>
                        <p className="font-medium text-gray-800">{member.type}</p>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
import { supabase } from '../config/supabase.js';

/**
 * Check if phone number exists in any table
 */
export const checkPhoneExists = async (phoneNumber) => {
  try {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    console.log(`🔍 Checking if phone ${cleanPhone} exists in database...`);
    
    // Create search patterns for different phone number formats
    const searchPatterns = [];
    
    // Add the clean phone number
    if (cleanPhone.length >= 5) searchPatterns.push(cleanPhone);
    
    // Add with country code if it's a 10-digit number
    if (cleanPhone.length === 10) {
      searchPatterns.push(`91${cleanPhone}`);
      searchPatterns.push(`+91${cleanPhone}`);
    }
    
    // Add without country code if it's a 12-digit number with 91 prefix
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      searchPatterns.push(cleanPhone.substring(2));
    }
    
    // Add without country code if it's a 13-digit number with +91 prefix
    if (cleanPhone.length === 13 && cleanPhone.startsWith('+91')) {
      searchPatterns.push(cleanPhone.substring(3));
    }
    
    // Remove duplicates
    const uniquePatterns = [...new Set(searchPatterns)];
    
    console.log('📱 Search patterns:', uniquePatterns);
    
    // Build search conditions for Members Table
    const conditions = [];
    uniquePatterns.forEach(pattern => {
      // Add exact pattern match for the Mobile field
      conditions.push(`Mobile.ilike.%${pattern}%`);
      
      // Also search for the pattern with common separators
      if (pattern.length === 10) {
        const formattedPatterns = [
          `${pattern.slice(0, 3)}-${pattern.slice(3, 6)}-${pattern.slice(6)}`,
          `${pattern.slice(0, 3)} ${pattern.slice(3, 6)} ${pattern.slice(6)}`,
          `(${pattern.slice(0, 3)}) ${pattern.slice(3, 6)}-${pattern.slice(6)}`,
          `${pattern.slice(0, 5)} ${pattern.slice(5)}`,
          `${pattern.slice(0, 4)} ${pattern.slice(4, 7)} ${pattern.slice(7)}`
        ];
        
        formattedPatterns.forEach(formatted => {
          conditions.push(`Mobile.ilike.%${formatted}%`);
        });
      }
    });
    
    const searchCondition = conditions.join(',');
    
    // Check in Members Table - SELECT ALL FIELDS
    const { data: memberData, error: memberError } = await supabase
      .from('Members Table')
      .select(`
        "S. No.",
        "Membership number",
        "Name",
        "Address Home",
        "Company Name",
        "Address Office",
        "Resident Landline",
        "Office Landline",
        "Mobile",
        "Email",
        type
      `)
      .or(searchCondition)
      .limit(1);
    
    if (memberError) {
      console.error('❌ Error querying Members Table:', memberError);
    }
    
    if (memberData && memberData.length > 0) {
      console.log('✅ Phone found in Members Table');
      console.log('📋 Full member data:', JSON.stringify(memberData[0], null, 2));
      
      const member = memberData[0];
      
      // Check if this member is also in elected_members table via membership_number
      let electedMemberData = null;
      if (member['Membership number']) {
        try {
          // Clean membership_number for matching
          const cleanMembership = String(member['Membership number']).trim();
          
          // Try exact match first
          let { data: electedMatch, error: electedError } = await supabase
            .from('elected_members')
            .select('*')
            .eq('membership_number', cleanMembership)
            .limit(1);
          
          // If no exact match, try case-insensitive search
          if ((!electedMatch || electedMatch.length === 0) && !electedError) {
            const { data: electedMatchIlike, error: electedErrorIlike } = await supabase
              .from('elected_members')
              .select('*')
              .ilike('membership_number', `%${cleanMembership}%`)
              .limit(1);
            
            if (!electedErrorIlike && electedMatchIlike && electedMatchIlike.length > 0) {
              electedMatch = electedMatchIlike;
              electedError = null;
            }
          }
          
          if (!electedError && electedMatch && electedMatch.length > 0) {
            electedMemberData = electedMatch[0];
            console.log(`✅ Member is also in elected_members table with membership_number ${member['Membership number']}`);
          }
        } catch (err) {
          console.warn('Could not check elected_members for member:', err);
        }
      }
      
      // Merge members table data with elected_members data if found
      const mergedUser = {
        // Base Members Table fields
        'S. No.': member['S. No.'],
        'Membership number': member['Membership number'],
        'Name': member['Name'],
        'Address Home': member['Address Home'],
        'Company Name': member['Company Name'],
        'Address Office': member['Address Office'],
        'Resident Landline': member['Resident Landline'],
        'Office Landline': member['Office Landline'],
        'Mobile': member['Mobile'],
        'Email': member['Email'],
        'type': member.type,
        position: member.position || null,
        
        // Add elected_members fields if found
        ...(electedMemberData && {
          position: electedMemberData.position || member.position || null,
          location: electedMemberData.location || null,
          elected_id: electedMemberData.id,
          is_elected_member: true,
          is_merged_with_elected: true
        }),
        
        // Normalized fields for easy access
        id: member['S. No.'],
        name: member['Name'],
        mobile: member['Mobile'],
        membership_number: member['Membership number']
      };
      
      return {
        exists: true,
        table: electedMemberData ? 'Members Table + elected_members' : 'Members Table',
        user: mergedUser
      };
    }
    
    // Note: elected_members table doesn't have phone field in the provided SQL
    // So we skip direct phone search in elected_members
    // Instead, we check elected_members via membership_number when found in Members Table (handled above)
    
    // Check in opd_schedule
    const opdConditions = [];
    uniquePatterns.forEach(pattern => {
      opdConditions.push(`mobile.ilike.%${pattern}%`);
    });
    
    const opdSearchCondition = opdConditions.join(',');
    
    const { data: opdData, error: _opdError } = await supabase
      .from('opd_schedule')
      .select('id, mobile, consultant_name, department, designation')
      .or(opdSearchCondition)
      .eq('is_active', true)
      .limit(1);
    
    if (opdData && opdData.length > 0) {
      console.log('✅ Phone found in opd_schedule');
      return {
        exists: true,
        table: 'opd_schedule',
        user: {
          id: opdData[0].id,
          name: opdData[0].consultant_name,
          mobile: opdData[0].mobile,
          type: 'Doctor',
          department: opdData[0].department,
          designation: opdData[0].designation
        }
      };
    }
    
    // Check in hospitals
    const hospitalConditions = [];
    uniquePatterns.forEach(pattern => {
      hospitalConditions.push(`contact_phone.ilike.%${pattern}%`);
    });
    
    const hospitalSearchCondition = hospitalConditions.join(',');
    
    const { data: hospitalData, error: _hospitalError } = await supabase
      .from('hospitals')
      .select('id, hospital_name, contact_phone, trust_name')
      .or(hospitalSearchCondition)
      .limit(1);
    
    if (hospitalData && hospitalData.length > 0) {
      console.log('✅ Phone found in hospitals');
      return {
        exists: true,
        table: 'hospitals',
        user: {
          id: hospitalData[0].id,
          name: hospitalData[0].hospital_name,
          mobile: hospitalData[0].contact_phone,
          type: 'Hospital',
          trust_name: hospitalData[0].trust_name
        }
      };
    }
    
    console.log('❌ Phone not found in any table');
    return {
      exists: false,
      table: null,
      user: null
    };
    
  } catch (error) {
    console.error('❌ Error checking phone existence:', error);
    throw error;
  }
};

/**
 * Validate phone number format
 */
const validatePhoneNumber = (phoneNumber) => {
  // Remove all non-digits
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number (10 digits)
  if (cleanPhone.length === 10) {
    return `+91${cleanPhone}`;
  }
  
  // Check if it already has country code
  if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    return `+${cleanPhone}`;
  }
  
  // Check if it already has + and country code
  if (phoneNumber.startsWith('+91') && cleanPhone.length === 12) {
    return phoneNumber;
  }
  
  throw new Error('Invalid phone number format. Must be 10 digits.');
};

/**
 * Initialize phone auth (check if phone exists in system)
 */
export const initializePhoneAuth = async (phoneNumber) => {
  try {
    // Check if phone exists in database
    const phoneCheck = await checkPhoneExists(phoneNumber);
    
    if (!phoneCheck.exists) {
      return {
        success: false,
        message: 'Phone number not registered in the system'
      };
    }
    
    // Validate and format phone number
    const formattedPhone = validatePhoneNumber(phoneNumber);
    
    console.log(`📱 Phone number verified in database: ${formattedPhone}`);
    
    return {
      success: true,
      message: 'Phone number verified in database',
      data: {
        phoneNumber: formattedPhone,
        user: phoneCheck.user
      }
    };
    
  } catch (error) {
    console.error('❌ Error checking phone number:', error);
    throw error;
  }
};
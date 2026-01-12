import { supabase } from '../config/supabase.js';

/**
 * Get all members by type
 */
export const getMembersByType = async (type) => {
  try {
    // Fetch all records of this type using batch fetching
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('Members Table')
        .select('*')
        .eq('type', type)
        .order('Name', { ascending: true })
        .range(from, from + batchSize - 1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        allData = [...allData, ...data];
        if (data.length < batchSize) {
          hasMore = false;
        } else {
          from += batchSize;
        }
      } else {
        hasMore = false;
      }
    }
    
    return allData;
  } catch (error) {
    console.error(`Error fetching ${type} members:`, error);
    throw error;
  }
};

/**
 * Search members by name or company
 */
export const searchMembers = async (searchQuery, type = null) => {
  try {
    let query = supabase
      .from('Members Table')
      .select('*');

    if (type) {
      query = query.eq('type', type);
    }

    if (searchQuery) {
      query = query.or(`Name.ilike.%${searchQuery}%,Company Name.ilike.%${searchQuery}%`);
    }

    query = query.order('Name', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error searching members:', error);
    throw error;
  }
};

/**
 * Get member by ID
 */
export const getMemberById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('Members Table')
      .select('*')
      .eq('S. No.', id)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching member by ID:', error);
    throw error;
  }
};

/**
 * Get all unique member types
 */
export const getMemberTypes = async () => {
  try {
    // Fetch all records to get all types (using batch fetching)
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('Members Table')
        .select('type')
        .not('type', 'is', null)
        .range(from, from + batchSize - 1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        allData = [...allData, ...data];
        if (data.length < batchSize) {
          hasMore = false;
        } else {
          from += batchSize;
        }
      } else {
        hasMore = false;
      }
    }
    
    const uniqueTypes = [...new Set(allData.map(item => item.type))];
    return uniqueTypes;
  } catch (error) {
    console.error('Error fetching member types:', error);
    throw error;
  }
};

/**
 * Get all members (for admin)
 */
export const getAllMembers = async () => {
  try {
    console.log('Fetching all members from Supabase...');
    console.log('Table name: "Members Table"');
    
    let allData = [];
    let from = 0;
    const batchSize = 50; // Reduced from 1000 to reduce load
    let hasMore = true;
    let error = null;

    // Fetch data in batches to get all records (Supabase has 1000 row limit by default)
    while (hasMore) {
      let { data, error: batchError } = await supabase
        .from('Members Table')
        .select('*')
        .order('Name', { ascending: true })
        .range(from, from + batchSize - 1);

      // If that fails with table not found error, try without quotes
      if (batchError && batchError.code === 'PGRST116') {
        console.log('Trying alternative table name...');
        const result = await supabase
          .from('members_table')
          .select('*')
          .order('Name', { ascending: true })
          .range(from, from + batchSize - 1);
        data = result.data;
        batchError = result.error;
      }

      if (batchError) {
        console.error('Supabase error:', batchError);
        console.error('Error code:', batchError.code);
        console.error('Error message:', batchError.message);
        error = batchError;
        break;
      }

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        console.log(`Fetched batch: ${data.length} members (Total so far: ${allData.length})`);
        
        // If we got less than batchSize, we've reached the end
        if (data.length < batchSize) {
          hasMore = false;
        } else {
          from += batchSize;
        }
      } else {
        hasMore = false;
      }
    }

    if (error) {
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      throw error;
    }
    
    console.log(`✅ Total fetched: ${allData.length} members from Members Table`);
    
    // Now fetch doctors from opd_schedule table
    let doctorsData = [];
    try {
      console.log('Fetching doctors from opd_schedule table...');
      
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;
      
      // Fetch data in batches to get all doctor records
      console.log('Attempting to fetch from opd_schedule table (getAllDoctors function)...');
      // First, let's check if the table exists by trying a simple count
      const { count: count2, error: countError2 } = await supabase
        .from('opd_schedule')
        .select('*', { count: 'exact', head: true });
          
      if (countError2) {
        console.error('Error checking opd_schedule table in getAllDoctors:', countError2);
        console.log('Trying alternative table name or checking if table exists in getAllDoctors...');
            
        // Try to list all tables to see what's available
        const { data: _tableData2, error: tableError2 } = await supabase.rpc('information_schema.tables');
        if (tableError2) {
          console.log('Could not list tables in getAllDoctors, proceeding with original query...');
        }
      } else {
        console.log(`opd_schedule table exists with ${count2} records in getAllDoctors (before filtering for active)`);
      }
          
      while (hasMore) {
        let { data, error, status } = await supabase
          .from('opd_schedule')
          .select('*')
          .eq('is_active', true) // Only fetch active doctors
          .order('consultant_name', { ascending: true })
          .range(from, from + batchSize - 1);
            
        console.log(`Supabase response status: ${status}`);
        if (error) {
          console.error('Supabase error details:', error);
          console.error('Supabase error code:', error.code);
          console.error('Supabase error message:', error.message);
          throw error;
        }

        if (error) {
          console.error('Error fetching doctors:', error);
          break;
        }

        if (data && data.length > 0) {
          // Transform doctor data to match the members table structure
          const transformedDoctors = data.map(doctor => ({
            'S. No.': `DOC${doctor.id}`,
            'Name': doctor.consultant_name,
            'Company Name': doctor.department,
            'Mobile': doctor.mobile,
            'Email': null, // No email in opd_schedule
            'type': 'Doctor',
            'specialization': doctor.designation,
            'qualification': doctor.qualification,
            'unit': doctor.unit,
            'senior_junior': doctor.senior_junior,
            'general_opd_days': doctor.general_opd_days,
            'private_opd_days': doctor.private_opd_days,
            'effective_from': doctor.effective_from,
            'notes': doctor.notes,
            'is_active': doctor.is_active,
            'created_at': doctor.created_at,
            'updated_at': doctor.updated_at,
            // Include original opd_schedule fields for reference
            'original_id': doctor.id,
            'department': doctor.department,
            'designation': doctor.designation,
            'consultant_name': doctor.consultant_name,
          }));
          
          doctorsData = [...doctorsData, ...transformedDoctors];
          console.log(`Fetched batch: ${data.length} doctors (Total so far: ${doctorsData.length})`);
          
          // If we got less than batchSize, we've reached the end
          if (data.length < batchSize) {
            hasMore = false;
          } else {
            from += batchSize;
          }
        } else {
          hasMore = false;
        }
      }
      
      console.log(`✅ Total fetched: ${doctorsData.length} doctors from opd_schedule table`);
    } catch (error) {
      console.error('Error fetching doctors from opd_schedule:', error);
    }
    
    // Fetch committee members data
    let committeeData = [];
    try {
      console.log('Fetching committee members from committee_members table...');
      
      let fromCommittee = 0;
      const batchSizeCommittee = 1000;
      let hasMoreCommittee = true;
      
      // Fetch data in batches to get all committee members
      while (hasMoreCommittee) {
        let { data, error } = await supabase
          .from('committee_members')
          .select('*')
          .order('member_name_english', { ascending: true })
          .range(fromCommittee, fromCommittee + batchSizeCommittee - 1);

        if (error) {
          console.error('Error fetching committee members:', error);
          throw error;
        }

        if (data && data.length > 0) {
          // Transform committee data to match the members table structure
          const transformedCommittee = data.map(committee => ({
            'S. No.': `CM${committee.id}`,
            'Name': committee.member_name_english,
            'Company Name': committee.committee_name_hindi,
            'Mobile': null, // No mobile in committee_members
            'Email': null, // No email in committee_members
            'type': committee.member_role,
            'committee_name_hindi': committee.committee_name_hindi,
            'member_name_english': committee.member_name_english,
            'member_role': committee.member_role,
            'created_at': committee.created_at,
            'updated_at': committee.updated_at,
            // Include original committee fields for reference
            'original_id': committee.id,
            'is_committee_member': true
          }));
          
          committeeData = [...committeeData, ...transformedCommittee];
          console.log(`Fetched batch: ${data.length} committee members (Total so far: ${committeeData.length})`);
          
          // If we got less than batchSize, we've reached the end
          if (data.length < batchSizeCommittee) {
            hasMoreCommittee = false;
          } else {
            fromCommittee += batchSizeCommittee;
          }
        } else {
          hasMoreCommittee = false;
        }
      }
      
      console.log(`✅ Total fetched: ${committeeData.length} committee members from committee_members table`);
    } catch (error) {
      console.error('Error fetching committee members:', error);
    }
    
    // Combine members, doctors, and committee data
    const combinedData = [...allData, ...doctorsData, ...committeeData];
    console.log(`✅ Combined total: ${combinedData.length} records (Members: ${allData.length}, Doctors: ${doctorsData.length}, Committee: ${committeeData.length})`);
    
    return combinedData;
  } catch (error) {
    console.error('Error fetching all members:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
};

/**
 * Get members page (pagination) from Members Table only
 * Returns { data: [...], count: totalCount }
 */
export const getMembersPage = async (page = 1, limit = 100) => {
  try {
    const p = Math.max(1, Number(page) || 1);
    const l = Math.max(1, Number(limit) || 100);
    const from = (p - 1) * l;
    const to = from + l - 1;

    // Get total count (head request)
    const { count, error: countErr } = await supabase
      .from('Members Table')
      .select('*', { count: 'exact', head: true });

    if (countErr) {
      console.warn('Could not get total count for Members Table:', countErr);
    }

    const { data, error } = await supabase
      .from('Members Table')
      .select('*')
      .order('Name', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('Error fetching members page:', error);
      throw error;
    }

    return { data: data || [], count: Number(count) || (data ? data.length : 0) };
  } catch (error) {
    console.error('Error in getMembersPage:', error);
    throw error;
  }
};

/**
 * Get a small preview/sample of members (limited) to speed up initial loads
 */
export const getMembersPreview = async (limit = 100) => {
  try {
    const l = Number(limit) || 100;
    // Fetch first `l` members from Members Table
    const { data: membersData, error: membersError } = await supabase
      .from('Members Table')
      .select('*')
      .order('Name', { ascending: true })
      .range(0, l - 1);

    if (membersError) {
      console.error('Error fetching members preview:', membersError);
      throw membersError;
    }

    // Fetch first `l` doctors
    let doctorsData = [];
    try {
      const { data: ddata, error: derror } = await supabase
        .from('opd_schedule')
        .select('*')
        .eq('is_active', true)
        .order('consultant_name', { ascending: true })
        .range(0, l - 1);
      if (derror) {
        console.warn('Could not fetch doctors preview:', derror);
      } else if (ddata) {
        doctorsData = ddata.map(doctor => ({
          'S. No.': `DOC${doctor.id}`,
          'Name': doctor.consultant_name,
          'Company Name': doctor.department,
          'Mobile': doctor.mobile,
          'Email': null,
          'type': 'Doctor',
          'specialization': doctor.designation,
          'original_id': doctor.id,
          'consultant_name': doctor.consultant_name
        }));
      }
    } catch (e) {
      console.warn('Error fetching doctors preview inner:', e);
    }

    // Fetch first `l` committee members
    let committeeData = [];
    try {
      const { data: cdata, error: cerror } = await supabase
        .from('committee_members')
        .select('*')
        .order('member_name_english', { ascending: true })
        .range(0, l - 1);
      if (cerror) {
        console.warn('Could not fetch committee preview:', cerror);
      } else if (cdata) {
        committeeData = cdata.map(committee => ({
          'S. No.': `CM${committee.id}`,
          'Name': committee.member_name_english,
          'Company Name': committee.committee_name_english || committee.committee_name_hindi,
          'Mobile': null,
          'Email': null,
          'type': committee.member_role,
          'committee_name_hindi': committee.committee_name_hindi,
          'committee_name_english': committee.committee_name_english,
          'original_id': committee.id
        }));
      }
    } catch (e) {
      console.warn('Error fetching committee preview inner:', e);
    }

    // Fetch first `l` hospitals
    let hospitalsData = [];
    try {
      const { data: hdata, error: herror } = await supabase
        .from('hospitals')
        .select('*')
        .eq('is_active', true)
        .order('hospital_name', { ascending: true })
        .range(0, l - 1);
      if (herror) {
        console.warn('Could not fetch hospitals preview:', herror);
      } else if (hdata) {
        hospitalsData = hdata.map(hospital => ({
          'S. No.': `HOSP${hospital.id}`,
          'Name': hospital.hospital_name,
          'Company Name': hospital.trust_name,
          'Mobile': hospital.contact_phone,
          'Email': hospital.contact_email,
          'type': 'Hospital',
          'hospital_name': hospital.hospital_name,
          'trust_name': hospital.trust_name,
          'hospital_type': hospital.hospital_type,
          'address': hospital.address,
          'city': hospital.city,
          'original_id': hospital.id
        }));
      }
    } catch (e) {
      console.warn('Error fetching hospitals preview inner:', e);
    }

    const combined = [ ...(membersData || []), ...doctorsData, ...committeeData, ...hospitalsData ];
    return combined;
  } catch (error) {
    console.error('Error in getMembersPreview:', error);
    throw error;
  }
};

/**
 * Get all doctors from opd_schedule
 */
export const getAllDoctors = async () => {
  try {
    console.log('Fetching all doctors from opd_schedule table...');
    
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;
    
    // Fetch data in batches to get all doctor records
    while (hasMore) {
      let { data, error } = await supabase
        .from('opd_schedule')
        .select('id, consultant_name, department, mobile, is_active, general_opd_days, private_opd_days, designation, qualification, unit, senior_junior')
        .eq('is_active', true) // Only fetch active doctors
        .order('consultant_name', { ascending: true })
        .range(from, from + batchSize - 1);

      if (error) {
        console.error('Error fetching doctors:', error);
        return []; // Return empty if table doesn't exist or error
      }

      if (data && data.length > 0) {
        // Transform doctor data to match the members table structure
        const transformedDoctors = data.map(doctor => ({
          'S. No.': `DOC${doctor.id}`,
          'Name': doctor.consultant_name,
          'Company Name': doctor.department,
          'Mobile': doctor.mobile,
          'Email': null, // No email in opd_schedule
          'type': 'Doctor',
          'specialization': doctor.designation,
          'qualification': doctor.qualification,
          'unit': doctor.unit,
          'senior_junior': doctor.senior_junior,
          'general_opd_days': doctor.general_opd_days,
          'private_opd_days': doctor.private_opd_days,
          'effective_from': doctor.effective_from,
          'notes': doctor.notes,
          'is_active': doctor.is_active,
          'created_at': doctor.created_at,
          'updated_at': doctor.updated_at,
          // Include original opd_schedule fields for reference
          'original_id': doctor.id,
          'department': doctor.department,
          'designation': doctor.designation,
          'consultant_name': doctor.consultant_name,
        }));
        
        allData = [...allData, ...transformedDoctors];
        console.log(`Fetched batch: ${data.length} doctors (Total so far: ${allData.length})`);
        
        // If we got less than batchSize, we've reached the end
        if (data.length < batchSize) {
          hasMore = false;
        } else {
          from += batchSize;
        }
      } else {
        hasMore = false;
      }
    }
    
    console.log(`✅ Total fetched: ${allData.length} doctors from opd_schedule table`);
    return allData;
  } catch (error) {
    console.error('Error fetching doctors from opd_schedule:', error);
    throw error;
  }
};

/**
 * Get all committee members
 */
export const getAllCommitteeMembers = async () => {
  try {
    console.log('Fetching all committee members from committee_members table...');
    
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;
    
    // Fetch data in batches to get all committee members
    while (hasMore) {
      let { data, error } = await supabase
        .from('committee_members')
        .select('*')
        .order('member_name_english', { ascending: true })
        .range(from, from + batchSize - 1);

      if (error) {
        console.error('Error fetching committee members:', error);
        throw error;
      }

      if (data && data.length > 0) {
        // Transform committee data to match the members table structure
        const transformedCommittee = data.map(committee => ({
          'S. No.': `CM${committee.id}`,
          'Name': committee.member_name_english,
          'Company Name': committee.committee_name_english || committee.committee_name_hindi,
          'Mobile': null, // No mobile in committee_members
          'Email': null, // No email in committee_members
          'type': committee.member_role,
          'committee_name_hindi': committee.committee_name_hindi,
          'committee_name_english': committee.committee_name_english,
          'member_name_english': committee.member_name_english,
          'member_role': committee.member_role,
          'created_at': committee.created_at,
          'updated_at': committee.updated_at,
          // Include original committee fields for reference
          'original_id': committee.id,
          'is_committee_member': true
        }));
        
        allData = [...allData, ...transformedCommittee];
        console.log(`Fetched batch: ${data.length} committee members (Total so far: ${allData.length})`);
        
        // If we got less than batchSize, we've reached the end
        if (data.length < batchSize) {
          hasMore = false;
        } else {
          from += batchSize;
        }
      } else {
        hasMore = false;
      }
    }
    
    console.log(`✅ Total fetched: ${allData.length} committee members from committee_members table`);
    return allData;
  } catch (error) {
    console.error('Error fetching committee members from committee_members:', error);
    throw error;
  }
};

/**
 * Get all hospitals from hospitals table
 */
export const getAllHospitals = async () => {
  try {
    console.log('Fetching all hospitals from hospitals table...');
    
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;
    
    // Fetch data in batches to get all hospital records
    while (hasMore) {
      let { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('is_active', true) // Only fetch active hospitals
        .order('hospital_name', { ascending: true })
        .range(from, from + batchSize - 1);

      if (error) {
        console.error('Error fetching hospitals:', error);
        throw error;
      }

      if (data && data.length > 0) {
        // Transform hospital data to match the expected structure
        const transformedHospitals = data.map(hospital => ({
          'S. No.': `HOSP${hospital.id}`,
          'Name': hospital.hospital_name,
          'Company Name': hospital.trust_name,
          'Mobile': hospital.contact_phone,
          'Email': hospital.contact_email,
          'type': 'Hospital',
          'hospital_name': hospital.hospital_name,
          'trust_name': hospital.trust_name,
          'hospital_type': hospital.hospital_type,
          'address': hospital.address,
          'city': hospital.city,
          'state': hospital.state,
          'pincode': hospital.pincode,
          'established_year': hospital.established_year,
          'bed_strength': hospital.bed_strength,
          'accreditation': hospital.accreditation,
          'facilities': hospital.facilities,
          'departments': hospital.departments,
          'contact_phone': hospital.contact_phone,
          'contact_email': hospital.contact_email,
          'is_active': hospital.is_active,
          'created_at': hospital.created_at,
          // Include original hospital fields for reference
          'original_id': hospital.id,
          'is_hospital': true
        }));
        
        allData = [...allData, ...transformedHospitals];
        console.log(`Fetched batch: ${data.length} hospitals (Total so far: ${allData.length})`);
        
        // If we got less than batchSize, we've reached the end
        if (data.length < batchSize) {
          hasMore = false;
        } else {
          from += batchSize;
        }
      } else {
        hasMore = false;
      }
    }
    
    console.log(`✅ Total fetched: ${allData.length} hospitals from hospitals table`);
    return allData;
  } catch (error) {
    console.error('Error fetching hospitals from hospitals table:', error);
    throw error;
  }
};

/**
 * Get all elected members from elected_members table and join with members table
 */
export const getAllElectedMembers = async () => {
  try {
    console.log('Fetching all elected members from elected_members table with members table join...');
    
    let allData = [];
    let from = 0;
    const batchSize = 50; // Reduced from 1000 to reduce load
    let hasMore = true;
    
    // Fetch data in batches to get all elected member records
    while (hasMore) {
      let { data: electedData, error } = await supabase
        .from('elected_members')
        .select('*')
        .order('id', { ascending: true })
        .range(from, from + batchSize - 1);

      if (error) {
        console.error('Error fetching elected members:', error);
        return []; // Return empty array if table doesn't exist or error
      }

      if (electedData && electedData.length > 0) {
        // Collect all unique membership numbers for batch query
        const membershipNumbers = [...new Set(electedData.map(e => e.membership_number).filter(Boolean).map(m => String(m).trim()))];
        
        // Query all matching members at once to reduce database calls
        let memberMap = new Map();
        if (membershipNumbers.length > 0) {
          try {
            let { data: allMembers, error } = await supabase
              .from('Members Table')
              .select('*')
              .in('Membership number', membershipNumbers);
            
            if (!error && allMembers) {
              allMembers.forEach(member => {
                const key = String(member['Membership number']).trim().toLowerCase();
                memberMap.set(key, member);
              });
            }
          } catch (err) {
            console.warn('Error fetching members for elected batch:', err);
          }
        }
        
        // For each elected member, merge with member data if found
        for (const electedMember of electedData) {
          let memberData = null;
          
          // Try to find matching member from the batch query
          if (electedMember.membership_number) {
            const cleanKey = String(electedMember.membership_number).trim().toLowerCase();
            memberData = memberMap.get(cleanKey);
            
            if (memberData) {
              console.log(`✅ Found matching member for elected member ${electedMember.id} with membership_number ${electedMember.membership_number}`);
            } else {
              console.warn(`⚠️ No matching member found for elected member ${electedMember.id} with membership_number "${electedMember.membership_number}"`);
            }
          } else {
            console.warn(`⚠️ Elected member ${electedMember.id} has no membership_number, cannot merge with Members Table`);
          }
          
          // Merge elected_members data with members table data
          const mergedMember = {
            // Base Members Table data (prioritized)
            'S. No.': memberData ? memberData['S. No.'] : `ELECT${electedMember.id}`,
            'Name': memberData ? memberData['Name'] : 'Elected Member',
            'Mobile': memberData ? memberData['Mobile'] : null,
            'Email': memberData ? memberData['Email'] : null,
            'type': memberData ? memberData.type : 'Elected Member',
            'Membership number': memberData ? memberData['Membership number'] : electedMember.membership_number,
            'Company Name': memberData ? memberData['Company Name'] : null,
            'Address Home': memberData ? memberData['Address Home'] : null,
            'Address Office': memberData ? memberData['Address Office'] : null,
            'Resident Landline': memberData ? memberData['Resident Landline'] : null,
            'Office Landline': memberData ? memberData['Office Landline'] : null,
            
            // Elected-specific fields from elected_members table
            'position': electedMember.position || null,
            'location': electedMember.location || null,
            
            // Include original elected_members fields for reference
            'original_id': electedMember.id,
            'elected_id': electedMember.id,
            'membership_number': electedMember.membership_number,
            'created_at': electedMember.created_at,
            'is_elected_member': true,
            'is_merged_with_member': !!memberData
          };
          
          allData.push(mergedMember);
        }
        
        console.log(`Fetched batch: ${electedData.length} elected members (Total so far: ${allData.length})`);
        
        // If we got less than batchSize, we've reached the end
        if (electedData.length < batchSize) {
          hasMore = false;
        } else {
          from += batchSize;
        }
      } else {
        hasMore = false;
      }
    }
    
    console.log(`✅ Total fetched: ${allData.length} elected members (merged with members table where applicable)`);
    return allData;
  } catch (error) {
    console.error('Error fetching elected members from elected_members table:', error);
    throw error;
  }
};



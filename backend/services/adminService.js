import { supabase } from '../config/supabase.js';

// ==================== MEMBERS TABLE CRUD ====================

export const getAllMembers = async () => {
  try {
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      let { data, error } = await supabase
        .from('Members Table')
        .select('*')
        .order('Name', { ascending: true })
        .range(from, from + batchSize - 1);

      if (error && error.code === 'PGRST116') {
        const result = await supabase
          .from('members_table')
          .select('*')
          .order('Name', { ascending: true })
          .range(from, from + batchSize - 1);
        data = result.data;
        error = result.error;
      }

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
    console.error('Error fetching all members:', error);
    throw error;
  }
};

export const getMemberById = async (id) => {
  try {
    // Try with "Members Table" first
    let { data, error } = await supabase
      .from('Members Table')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') {
      const result = await supabase
        .from('members_table')
        .select('*')
        .eq('id', id)
        .single();
      data = result.data;
      error = result.error;
    }

    // If not found by id, try by "S. No."
    if (!data || error) {
      const result2 = await supabase
        .from('Members Table')
        .select('*')
        .eq('"S. No."', id)
        .single();
      
      if (result2.error && result2.error.code === 'PGRST116') {
        // Try fallback table
        const result3 = await supabase
          .from('members_table')
          .select('*')
          .eq('"S. No."', id)
          .single();
        if (!result3.error) {
          data = result3.data;
          error = null;
        }
      } else if (!result2.error) {
        data = result2.data;
        error = null;
      }
    }

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching member by ID:', error);
    throw error;
  }
};

export const createMember = async (memberData) => {
  try {
    // Remove S. No. from user-provided data to prevent conflicts
    const { 'S. No.': _SNo, ...cleanMemberData } = memberData;
    
    // Generate next S. No.
    let { data: maxData, error: maxError } = await supabase
      .from('Members Table')
      .select('"S. No."')
      .order('"S. No."', { ascending: false })
      .limit(1);

    if (maxError && maxError.code === 'PGRST116') {
      const result = await supabase
        .from('members_table')
        .select('"S. No."')
        .order('"S. No."', { ascending: false })
        .limit(1);
      maxData = result.data;
      maxError = result.error;
    }

    if (maxError) throw maxError;

    const nextSNo = maxData && maxData.length > 0 ? maxData[0]['S. No.'] + 1 : 1;
    cleanMemberData['S. No.'] = nextSNo;

    let { data, error } = await supabase
      .from('Members Table')
      .insert([cleanMemberData])
      .select()
      .single();

    if (error && error.code === 'PGRST116') {
      const result = await supabase
        .from('members_table')
        .insert([cleanMemberData])
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
};

export const updateMember = async (id, memberData) => {
  try {
    // Remove S. No. from user-provided data to prevent conflicts
    const { 'S. No.': _SNo, ...cleanMemberData } = memberData;
    
    // Try updating by id first
    let { data, error } = await supabase
      .from('Members Table')
      .update(cleanMemberData)
      .eq('id', id)
      .select()
      .single();

    if (error && error.code === 'PGRST116') {
      const result = await supabase
        .from('members_table')
        .update(cleanMemberData)
        .eq('id', id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    // If not found by id, try by "S. No."
    if (!data || error) {
      const result2 = await supabase
        .from('Members Table')
        .update(cleanMemberData)
        .eq('"S. No."', id)
        .select()
        .single();
      
      if (result2.error && result2.error.code === 'PGRST116') {
        // Try fallback table
        const result3 = await supabase
          .from('members_table')
          .update(cleanMemberData)
          .eq('"S. No."', id)
          .select()
          .single();
        if (!result3.error) {
          data = result3.data;
          error = null;
        }
      } else if (!result2.error) {
        data = result2.data;
        error = null;
      }
    }

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

export const deleteMember = async (id) => {
  try {
    // Try deleting by id first
    let { error } = await supabase
      .from('Members Table')
      .delete()
      .eq('id', id);

    if (error && error.code === 'PGRST116') {
      const result = await supabase
        .from('members_table')
        .delete()
        .eq('id', id);
      error = result.error;
      if (!error) return true;
    }

    // If not found by id, try by "S. No."
    if (error) {
      const result2 = await supabase
        .from('Members Table')
        .delete()
        .eq('"S. No."', id);
      
      if (result2.error && result2.error.code === 'PGRST116') {
        // Try fallback table
        const result3 = await supabase
          .from('members_table')
          .delete()
          .eq('"S. No."', id);
        if (!result3.error) return true;
      } else if (!result2.error) {
        return true;
      }
    }

    if (error && error.code !== 'PGRST116') throw error;
    return true;
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

// ==================== HOSPITALS TABLE CRUD ====================

export const getAllHospitals = async () => {
  try {
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('hospital_name', { ascending: true })
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
    console.error('Error fetching all hospitals:', error);
    throw error;
  }
};

export const getHospitalById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching hospital by ID:', error);
    throw error;
  }
};

export const createHospital = async (hospitalData) => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .insert([hospitalData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating hospital:', error);
    throw error;
  }
};

export const updateHospital = async (id, hospitalData) => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .update(hospitalData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating hospital:', error);
    throw error;
  }
};

export const deleteHospital = async (id) => {
  try {
    const { error } = await supabase
      .from('hospitals')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting hospital:', error);
    throw error;
  }
};

// ==================== ELECTED MEMBERS TABLE CRUD ====================

export const getAllElectedMembers = async () => {
  try {
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('elected_members')
        .select('*')
        .order('id', { ascending: true })
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
    console.error('Error fetching all elected members:', error);
    throw error;
  }
};

export const getElectedMemberById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('elected_members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching elected member by ID:', error);
    throw error;
  }
};

export const createElectedMember = async (electedData) => {
  try {
    const { data, error } = await supabase
      .from('elected_members')
      .insert([electedData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating elected member:', error);
    throw error;
  }
};

export const updateElectedMember = async (id, electedData) => {
  try {
    const { data, error } = await supabase
      .from('elected_members')
      .update(electedData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating elected member:', error);
    throw error;
  }
};

export const deleteElectedMember = async (id) => {
  try {
    const { error } = await supabase
      .from('elected_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting elected member:', error);
    throw error;
  }
};

// ==================== COMMITTEE MEMBERS TABLE CRUD ====================

export const getAllCommitteeMembers = async () => {
  try {
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('committee_members')
        .select('*')
        .order('id', { ascending: true })
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
    console.error('Error fetching all committee members:', error);
    throw error;
  }
};

export const getCommitteeMemberById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('committee_members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching committee member by ID:', error);
    throw error;
  }
};

export const createCommitteeMember = async (committeeData) => {
  try {
    const { data, error } = await supabase
      .from('committee_members')
      .insert([committeeData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating committee member:', error);
    throw error;
  }
};

export const updateCommitteeMember = async (id, committeeData) => {
  try {
    const { data, error } = await supabase
      .from('committee_members')
      .update(committeeData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating committee member:', error);
    throw error;
  }
};

export const deleteCommitteeMember = async (id) => {
  try {
    const { error } = await supabase
      .from('committee_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting committee member:', error);
    throw error;
  }
};

// ==================== DOCTORS (OPD_SCHEDULE) TABLE CRUD ====================

export const getAllDoctors = async () => {
  try {
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('opd_schedule')
        .select('*')
        .order('consultant_name', { ascending: true })
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
    console.error('Error fetching all doctors:', error);
    throw error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('opd_schedule')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching doctor by ID:', error);
    throw error;
  }
};

export const createDoctor = async (doctorData) => {
  try {
    const { data, error } = await supabase
      .from('opd_schedule')
      .insert([doctorData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

export const updateDoctor = async (id, doctorData) => {
  try {
    const { data, error } = await supabase
      .from('opd_schedule')
      .update(doctorData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const { error } = await supabase
      .from('opd_schedule')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
};


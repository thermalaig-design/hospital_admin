import { getMemberTypes, getAllHospitals, getAllElectedMembers, getAllCommitteeMembers, getMembersPage } from './api';

const CACHE_KEY = 'directory_data_cache';
const CACHE_TIMESTAMP_KEY = 'directory_cache_timestamp';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function fetchDirectoryData() {
  try {
    console.log('Pre-loading directory data after login...');

    // Fetch first page of members (for initial display)
    const itemsPerPage = 20;
    const promises = [
      getMembersPage(1, itemsPerPage * 2),
      getAllHospitals(),
      getAllElectedMembers(),
      getAllCommitteeMembers(),
      getMemberTypes()
    ];

    const [membersRes, hospitalsRes, electedRes, committeeRes, typesRes] = await Promise.all(promises);

    const cacheData = {
      allMembers: membersRes?.data || [],
      hospitals: hospitalsRes?.data || [],
      electedMembers: electedRes?.data || [],
      committeeMembers: committeeRes?.data || [],
      memberTypes: typesRes?.data || [],
      totalMembersCount: membersRes?.count ?? null
    };

    // Store in sessionStorage for Directory component to use
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    sessionStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());

    console.log('✅ Directory data pre-loaded and cached');
    return cacheData;
  } catch (error) {
    console.error('❌ Error pre-loading directory data:', error);
    throw error;
  }
}
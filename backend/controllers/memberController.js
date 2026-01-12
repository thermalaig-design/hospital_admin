import * as memberService from '../services/memberService.js';

/**
 * Get members by type
 */
export const getMembersByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const members = await memberService.getMembersByType(type);
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search members
 */
export const searchMembers = async (req, res, next) => {
  try {
    const { query, type } = req.query;
    const members = await memberService.searchMembers(query, type);
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get member by ID
 */
export const getMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await memberService.getMemberById(id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all member types
 */
export const getMemberTypes = async (req, res, next) => {
  try {
    const types = await memberService.getMemberTypes();
    
    res.status(200).json({
      success: true,
      count: types.length,
      data: types
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all members
 */
export const getAllMembers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    // If pagination params are provided, return a paginated subset
    if (page || limit) {
      const pageNum = Number(page) || 1;
      const pageSize = Number(limit) || 100;
      console.log(`API: Getting members page ${pageNum} size ${pageSize}`);
      const result = await memberService.getMembersPage(pageNum, pageSize);
      return res.status(200).json({
        success: true,
        count: result.count,
        data: result.data
      });
    }

    console.log('API: Getting all members...');
    const members = await memberService.getAllMembers();
    console.log(`API: Returning ${members.length} members`);

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('API Error in getAllMembers:', error);
    next(error);
  }
}

/**
 * Get all doctors from opd_schedule
 */
export const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await memberService.getAllDoctors();
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a preview/sample of members
 */
export const getMembersPreview = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const members = await memberService.getMembersPreview(limit || 100);

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('API Error in getMembersPreview:', error);
    next(error);
  }
};

/**
 * Get all committee members
 */
export const getAllCommitteeMembers = async (req, res, next) => {
  try {
    const committee = await memberService.getAllCommitteeMembers();
    
    res.status(200).json({
      success: true,
      count: committee.length,
      data: committee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all hospitals
 */
export const getAllHospitals = async (req, res, next) => {
  try {
    const hospitals = await memberService.getAllHospitals();
    
    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all elected members
 */
export const getAllElectedMembers = async (req, res, next) => {
  try {
    const electedMembers = await memberService.getAllElectedMembers();
    
    res.status(200).json({
      success: true,
      count: electedMembers.length,
      data: electedMembers
    });
  } catch (error) {
    next(error);
  }
};



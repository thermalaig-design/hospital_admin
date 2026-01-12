import express from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase.js';
import { getUserUUID } from '../services/userService.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for profile pictures
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WEBP allowed.'));
    }
  }
});

// Get user profile
router.get('/', async (req, res) => {
  try {
    const userIdHeader = req.headers['user-id'];
    if (!userIdHeader) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Get UUID for user
    const userUUID = await getUserUUID(userIdHeader, userIdHeader);
    const dbUserId = userUUID || userIdHeader;

    // Try to find by user_identifier first (for backward compatibility)
    let { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_identifier', userIdHeader)
      .single();

    // If not found by identifier, try by user_id
    if (error && error.code === 'PGRST116') {
      const { data, error: error2 } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', dbUserId)
        .single();
      
      profile = data;
      error = error2;
    }

    if (error && error.code !== 'PGRST116') {
      console.error('Fetch error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }

    res.json({
      success: true,
      profile: profile || null
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Save/Update user profile
router.post('/save', upload.single('profilePhoto'), async (req, res) => {
  try {
    const userIdHeader = req.headers['user-id'];
    if (!userIdHeader) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Get UUID for user
    const userUUID = await getUserUUID(userIdHeader, userIdHeader);
    const dbUserId = userUUID || userIdHeader;

    const profileData = JSON.parse(req.body.profileData || '{}');
    const profilePhotoFile = req.file;

    let profilePhotoUrl = profileData.profilePhotoUrl || '';

    // Upload profile picture if provided
    if (profilePhotoFile) {
      const fileName = `profiles/${dbUserId}/${Date.now()}_${profilePhotoFile.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, profilePhotoFile.buffer, {
          contentType: profilePhotoFile.mimetype,
          upsert: true
        });

      if (uploadError) {
        console.error('Profile photo upload error:', uploadError);
        return res.status(500).json({ success: false, message: 'Failed to upload profile photo' });
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      profilePhotoUrl = urlData.publicUrl;
    }

    // Prepare profile data for database
    const dbProfileData = {
      user_id: dbUserId,
      user_identifier: userIdHeader,
      name: profileData.name || null,
      role: profileData.role || null,
      member_id: profileData.memberId || null,
      mobile: profileData.mobile || null,
      email: profileData.email || null,
      address_home: profileData.addressHome || null,
      address_office: profileData.addressOffice || null,
      company_name: profileData.companyName || null,
      resident_landline: profileData.residentLandline || null,
      office_landline: profileData.officeLandline || null,
      gender: profileData.gender || null,
      marital_status: profileData.maritalStatus || null,
      nationality: profileData.nationality || null,
      aadhaar_id: profileData.aadhaarId || null,
      blood_group: profileData.bloodGroup || null,
      dob: profileData.dob || null,
      emergency_contact_name: profileData.emergencyContactName || null,
      emergency_contact_number: profileData.emergencyContactNumber || null,
      profile_photo_url: profilePhotoUrl || null,
      spouse_name: profileData.spouseName || null,
      spouse_contact_number: profileData.spouseContactNumber || null,
      children_count: profileData.childrenCount ? parseInt(profileData.childrenCount) : null,
      facebook: profileData.facebook || null,
      twitter: profileData.twitter || null,
      instagram: profileData.instagram || null,
      linkedin: profileData.linkedin || null,
      whatsapp: profileData.whatsapp || null,
      family_members: profileData.familyMembers ? JSON.stringify(profileData.familyMembers) : null,
      position: profileData.position || null,
      location: profileData.location || null,
      is_elected_member: profileData.isElectedMember || false
    };

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_identifier', userIdHeader)
      .single();

    let result;
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update(dbProfileData)
        .eq('user_identifier', userIdHeader)
        .select()
        .single();

      result = { data, error };
    } else {
      // Insert new profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(dbProfileData)
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      console.error('DB error:', result.error);
      return res.status(500).json({ success: false, message: 'Failed to save profile' });
    }

    res.json({
      success: true,
      message: 'Profile saved successfully',
      profile: result.data
    });

  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;


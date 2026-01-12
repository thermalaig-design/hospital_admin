-- SQL code for saving/updating user profile data in Supabase
-- This handles both INSERT (new profile) and UPDATE (existing profile) operations

-- First, ensure the user_profiles table exists (run create_user_profiles_table.sql first)

-- Example INSERT statement for new profile (when profile doesn't exist)
INSERT INTO public.user_profiles (
  user_id,
  user_identifier,
  name,
  role,
  member_id,
  mobile,
  email,
  address_home,
  address_office,
  company_name,
  resident_landline,
  office_landline,
  gender,
  marital_status,
  nationality,
  aadhaar_id,
  blood_group,
  dob,
  emergency_contact_name,
  emergency_contact_number,
  profile_photo_url,
  spouse_name,
  spouse_contact_number,
  children_count,
  facebook,
  twitter,
  instagram,
  linkedin,
  whatsapp,
  family_members,
  position,
  location,
  is_elected_member,
  created_at,
  updated_at
) VALUES (
  'user-uuid-here', -- Replace with actual user UUID
  'membership-number-or-phone', -- User identifier for lookup
  'John Doe', -- name
  'Trustee', -- role
  'MAH-2024-1234', -- member_id
  '9876543210', -- mobile
  'john@example.com', -- email
  '123 Main St, City', -- address_home
  '456 Office St, City', -- address_office
  'ABC Company', -- company_name
  '011-12345678', -- resident_landline
  '011-87654321', -- office_landline
  'Male', -- gender
  'Married', -- marital_status
  'Indian', -- nationality
  '123456789012', -- aadhaar_id
  'O+', -- blood_group
  '1990-01-01', -- dob
  'Jane Doe', -- emergency_contact_name
  '9876543211', -- emergency_contact_number
  'https://supabase-url/profiles/photo.jpg', -- profile_photo_url
  'Jane Doe', -- spouse_name
  '9876543212', -- spouse_contact_number
  2, -- children_count
  'https://facebook.com/johndoe', -- facebook
  'https://twitter.com/johndoe', -- twitter
  'https://instagram.com/johndoe', -- instagram
  'https://linkedin.com/in/johndoe', -- linkedin
  'https://wa.me/9876543210', -- whatsapp
  '[{"name":"Child1","relation":"Son","age":"15","bloodGroup":"O+","contactNo":"9876543213"}]', -- family_members (JSON)
  'President', -- position (for elected members)
  'Delhi', -- location (for elected members)
  false, -- is_elected_member
  NOW(), -- created_at
  NOW() -- updated_at
) ON CONFLICT (user_identifier) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  member_id = EXCLUDED.member_id,
  mobile = EXCLUDED.mobile,
  email = EXCLUDED.email,
  address_home = EXCLUDED.address_home,
  address_office = EXCLUDED.address_office,
  company_name = EXCLUDED.company_name,
  resident_landline = EXCLUDED.resident_landline,
  office_landline = EXCLUDED.office_landline,
  gender = EXCLUDED.gender,
  marital_status = EXCLUDED.marital_status,
  nationality = EXCLUDED.nationality,
  aadhaar_id = EXCLUDED.aadhaar_id,
  blood_group = EXCLUDED.blood_group,
  dob = EXCLUDED.dob,
  emergency_contact_name = EXCLUDED.emergency_contact_name,
  emergency_contact_number = EXCLUDED.emergency_contact_number,
  profile_photo_url = EXCLUDED.profile_photo_url,
  spouse_name = EXCLUDED.spouse_name,
  spouse_contact_number = EXCLUDED.spouse_contact_number,
  children_count = EXCLUDED.children_count,
  facebook = EXCLUDED.facebook,
  twitter = EXCLUDED.twitter,
  instagram = EXCLUDED.instagram,
  linkedin = EXCLUDED.linkedin,
  whatsapp = EXCLUDED.whatsapp,
  family_members = EXCLUDED.family_members,
  position = EXCLUDED.position,
  location = EXCLUDED.location,
  is_elected_member = EXCLUDED.is_elected_member,
  updated_at = NOW();

-- Alternative: UPDATE statement for existing profile (when profile exists)
-- Use this if you know the profile already exists
UPDATE public.user_profiles SET
  name = 'John Doe',
  role = 'Trustee',
  member_id = 'MAH-2024-1234',
  mobile = '9876543210',
  email = 'john@example.com',
  address_home = '123 Main St, City',
  address_office = '456 Office St, City',
  company_name = 'ABC Company',
  resident_landline = '011-12345678',
  office_landline = '011-87654321',
  gender = 'Male',
  marital_status = 'Married',
  nationality = 'Indian',
  aadhaar_id = '123456789012',
  blood_group = 'O+',
  dob = '1990-01-01',
  emergency_contact_name = 'Jane Doe',
  emergency_contact_number = '9876543211',
  profile_photo_url = 'https://supabase-url/profiles/photo.jpg',
  spouse_name = 'Jane Doe',
  spouse_contact_number = '9876543212',
  children_count = 2,
  facebook = 'https://facebook.com/johndoe',
  twitter = 'https://twitter.com/johndoe',
  instagram = 'https://instagram.com/johndoe',
  linkedin = 'https://linkedin.com/in/johndoe',
  whatsapp = 'https://wa.me/9876543210',
  family_members = '[{"name":"Child1","relation":"Son","age":"15","bloodGroup":"O+","contactNo":"9876543213"}]',
  position = 'President',
  location = 'Delhi',
  is_elected_member = false,
  updated_at = NOW()
WHERE user_identifier = 'membership-number-or-phone'; -- Replace with actual user identifier

-- Note: The backend code automatically handles INSERT vs UPDATE based on whether profile exists
-- The ON CONFLICT clause in the INSERT handles updates for existing profiles
-- Add the missing is_active column to the hospitals table if it doesn't exist
ALTER TABLE public.hospitals 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Insert some sample hospital data to test the functionality
INSERT INTO public.hospitals (
    hospital_name,
    trust_name,
    hospital_type,
    address,
    city,
    state,
    pincode,
    established_year,
    bed_strength,
    accreditation,
    facilities,
    departments,
    contact_phone,
    contact_email,
    is_active
) VALUES 
(
    'AIIMS New Delhi',
    'Indian Council of Medical Research',
    'Government Medical College & Hospital',
    'Sarai, Akbarpur, New Delhi',
    'New Delhi',
    'Delhi',
    '110029',
    1956,
    2500,
    'NABH, JCI',
    'Emergency, ICU, Operation Theater, Diagnostic Center',
    'Cardiology, Neurology, Orthopedics, Oncology, Pediatrics',
    '+91-11-26588500',
    'director@aiims.edu',
    true
),
(
    'Fortis Memorial Research Institute',
    'Fortis Healthcare Limited',
    'Multi-Specialty Hospital',
    'Sector 15, Gurugram',
    'Gurugram',
    'Haryana',
    '122001',
    2008,
    380,
    'NABH, JCI',
    'Advanced Cardiac Care, Cancer Treatment, Organ Transplant',
    'Cardiology, Oncology, Nephrology, Orthopedics, Neurology',
    '+91-124-4141414',
    'enquiry@fortishealthcare.com',
    true
),
(
    'Medanta - The Medicity',
    'Medanta Foundation',
    'Multi-Specialty Hospital',
    'Sector 38, Gurugram',
    'Gurugram',
    'Haryana',
    '122001',
    2009,
    1250,
    'JCI, NABH',
    'Heart Institute, Cancer Institute, Institute of Robotic Surgery',
    'Cardiology, Oncology, Orthopedics, Neurosciences, Organ Transplant',
    '+91-124-4141414',
    'info@medanta.org',
    true
),
(
    'Apollo Hospitals',
    'Apollo Hospitals Enterprise Limited',
    'Multi-Specialty Hospital',
    'Block A, Sector 4, Panchshil Park, Nehru Place',
    'New Delhi',
    'Delhi',
    '110019',
    1983,
    550,
    'JCI, NABH',
    'Advanced Cardiac Care, Cancer Treatment, Emergency Services',
    'Cardiology, Oncology, Orthopedics, Gastroenterology, Pulmonology',
    '+91-11-26124455',
    'info@apollohospitals.com',
    true
),
(
    'Max Super Speciality Hospital',
    'Max Healthcare Institute Limited',
    'Super Speciality Hospital',
    '1, Block A, Saket, New Delhi',
    'New Delhi',
    'Delhi',
    '110017',
    2007,
    320,
    'NABH',
    'Cardiac Sciences, Oncology, Orthopedics, Critical Care',
    'Cardiology, Oncology, Orthopedics, Neurology, Nephrology',
    '+91-11-26515000',
    'enquiry@maxhealthcare.in',
    true
);

-- Verify the data was inserted
SELECT * FROM public.hospitals ORDER BY hospital_name;
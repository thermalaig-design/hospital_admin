# Patient Referral Backend Setup Instructions

## 📋 Overview
Complete backend setup for Patient Referral functionality with Supabase database, email notifications, and real-time updates.

## 🗄️ Database Setup

### Step 1: Create Referrals Table
Run the SQL file in Supabase SQL Editor:
```bash
backend/create_referrals_table.sql
```

This creates:
- `referrals` table with all required fields
- Indexes for performance
- Row Level Security (RLS) policies
- Auto-update trigger for `updated_at` timestamp

### Step 2: Add Additional RLS Policies
Run the SQL file:
```bash
backend/add_referrals_rls_policy.sql
```

This adds:
- Service role access for admin operations
- User count access for limit checking

## 🔧 Backend Setup

### Step 3: Install Dependencies (if not already installed)
```bash
cd backend
npm install
```

### Step 4: Environment Variables
Make sure these are set in `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@hospital.com  # Optional: where referral emails will be sent
```

### Step 5: Start Backend Server
```bash
npm start
# or
node server.js
```

The referral routes are already added to `server.js`:
- POST `/api/referrals` - Create referral
- GET `/api/referrals/my-referrals` - Get user's referrals
- GET `/api/referrals/counts` - Get referral counts
- GET `/api/referrals/all` - Get all referrals (admin)
- PATCH `/api/referrals/:id/status` - Update status (admin)

## ✅ Features Implemented

### 1. **Database Storage**
- All referrals stored in Supabase `referrals` table
- Real-time data sync
- Automatic timestamps

### 2. **Referral Limits**
- Maximum 4 referrals per user (2 General + 2 EWS)
- Real-time limit checking
- Form disabled when limit reached

### 3. **Email Notifications**
- Automatic email sent when referral is created
- Email includes all patient and referral details
- Sent to admin email address

### 4. **Doctor Integration**
- Fetches doctors from `opd_schedule` table
- Shows doctor name, specialization, and department
- Real-time doctor list updates

### 5. **Real-time Updates**
- Referral history updates immediately after submission
- Counts update in real-time
- No page refresh needed

### 6. **Form Validation**
- Category selection required
- All required fields validated
- Limit checking before submission

## 📝 API Endpoints

### Create Referral
```javascript
POST /api/referrals
Headers: {
  'user-id': 'user-mobile-or-id',
  'user': JSON.stringify(userObject)
}
Body: {
  patientName: string (required),
  patientAge: number (optional),
  patientGender: string (optional),
  patientPhone: string (required),
  category: 'General' | 'EWS' (required),
  referredToDoctor: string (required),
  doctorId: number (optional),
  department: string (optional),
  medicalCondition: string (required),
  notes: string (optional)
}
```

### Get User Referrals
```javascript
GET /api/referrals/my-referrals
Headers: {
  'user-id': 'user-mobile-or-id'
}
```

### Get Referral Counts
```javascript
GET /api/referrals/counts
Headers: {
  'user-id': 'user-mobile-or-id'
}
Response: {
  success: true,
  counts: {
    generalCount: number,
    ewsCount: number,
    total: number
  }
}
```

## 🎨 Frontend Features

### Form Fields (Simplified)
- Patient Name (required)
- Age (optional)
- Gender (optional)
- Phone Number (required)
- Category: General or EWS (required)
- Refer To Doctor (required - dropdown from database)
- Medical Condition (required)
- Notes (optional)

### Real-time Display
- Reference counts update automatically
- History shows immediately after submission
- Loading states during API calls
- Error handling with user-friendly messages

## 🔒 Security

- Row Level Security (RLS) enabled
- Users can only see their own referrals
- Admin can see all referrals
- Input validation on backend
- SQL injection protection via Supabase

## 📧 Email Template

Email includes:
- Referral ID
- Referrer details
- Patient details
- Doctor details
- Medical condition
- Notes (if any)
- Action required section

## 🚀 Testing

1. **Test Referral Creation:**
   - Fill form with valid data
   - Submit referral
   - Check email received
   - Verify data in Supabase

2. **Test Limits:**
   - Create 2 General referrals
   - Try to create 3rd General - should fail
   - Create 2 EWS referrals
   - Try to create 5th referral - should fail

3. **Test Real-time Updates:**
   - Submit referral
   - Check history updates immediately
   - Check counts update immediately

## 🐛 Troubleshooting

### Email not sending?
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify email service is enabled
- Check backend logs for email errors

### Referrals not saving?
- Check Supabase RLS policies
- Verify user-id header is being sent
- Check backend logs for errors

### Doctors not loading?
- Verify `opd_schedule` table exists
- Check API endpoint `/api/doctors` works
- Verify doctors have `is_active = true`

## 📚 Files Created/Modified

### New Files:
- `backend/create_referrals_table.sql`
- `backend/add_referrals_rls_policy.sql`
- `backend/routes/referralRoutes.js`
- `backend/controllers/referralController.js`
- `backend/services/referralService.js`

### Modified Files:
- `backend/server.js` - Added referral routes
- `backend/services/emailService.js` - Added referral email function
- `src/services/api.js` - Added referral API functions
- `src/Referral.jsx` - Complete rewrite with backend integration

## ✨ Next Steps

1. Run SQL files in Supabase
2. Test referral creation
3. Verify email notifications
4. Test limit enforcement
5. Deploy to production

---

**Note:** Make sure Supabase connection is configured in `backend/config/supabase.js`


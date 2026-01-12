# Supabase Row Level Security (RLS) Fix

Agar aapko data nahi dikh raha, to yeh RLS policy issue hai.

## Solution:

### Step 1: Supabase Dashboard mein jao
1. https://app.supabase.com par login karo
2. Apna project select karo

### Step 2: Table Editor mein jao
1. Left sidebar mein "Table Editor" click karo
2. "Members Table" select karo

### Step 3: RLS Policies check karo
1. Table ke upar "Policies" tab click karo
2. Agar "RLS is enabled" dikh raha hai aur koi policy nahi hai, to policy add karni hogi

### Step 4: Policy add karo (agar nahi hai)
1. "New Policy" button click karo
2. "Create a policy from scratch" select karo
3. Policy name: `Allow public read access`
4. Allowed operation: `SELECT`
5. Policy definition: 
   ```sql
   true
   ```
   Ya phir:
   ```sql
   (true)
   ```
6. "Review" click karo
7. "Save policy" click karo

### Alternative: RLS disable karo (temporary, testing ke liye)
1. Table Editor → "Members Table"
2. Settings icon (gear) click karo
3. "Disable RLS" toggle karo (sirf testing ke liye, production mein mat karo)

### Step 5: Verify
Test script run karo:
```powershell
cd backend
node test-supabase.js
```

Agar ab data dikh raha hai, to problem solve ho gayi!


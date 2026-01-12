import { supabase } from './config/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', process.env.SUPABASE_URL);
  console.log('Key:', process.env.SUPABASE_ANON_KEY ? 'Set (hidden)' : 'NOT SET');
  
  try {
    // Test different possible table names
    const possibleTableNames = [
      'Members Table',
      '"Members Table"',
      'members_table',
      'Members_Table',
      'members',
      'Members'
    ];
    
    console.log('\n🔍 Testing different table names...\n');
    
    for (const tableName of possibleTableNames) {
      console.log(`Testing table: ${tableName}`);
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`  ❌ Table "${tableName}" does not exist\n`);
        } else {
          console.log(`  ⚠️  Error: ${error.message} (code: ${error.code})\n`);
        }
      } else {
        console.log(`  ✅ Table "${tableName}" exists!`);
        console.log(`  📊 Records found: ${data?.length || 0}`);
        if (data && data.length > 0) {
          console.log('  📝 Sample record keys:', Object.keys(data[0]).join(', '));
          console.log('  📄 Sample data:', JSON.stringify(data[0], null, 2));
        }
        console.log('');
        break; // Found the correct table
      }
    }
    
    // Also try to get all data without limit
    console.log('\n📋 Fetching all data from "Members Table"...');
    const { data: allData, error: allError, count } = await supabase
      .from('Members Table')
      .select('*', { count: 'exact' });
    
    if (allError) {
      console.error('❌ Error fetching all:', allError);
      if (allError.code === '42501') {
        console.error('⚠️  PERMISSION DENIED - Row Level Security (RLS) is blocking access!');
        console.error('💡 Solution: Go to Supabase Dashboard → Authentication → Policies');
        console.error('   and create a policy to allow SELECT for anon users');
      }
    } else {
      console.log(`✅ Total records: ${allData?.length || 0}`);
      console.log(`📊 Count query result: ${count}`);
      if (allData && allData.length > 0) {
        console.log('First record:', JSON.stringify(allData[0], null, 2));
      } else if (count && count > 0) {
        console.log(`⚠️  WARNING: Count shows ${count} records but data is empty!`);
        console.log('   This usually means RLS policies are blocking the data.');
      }
    }
    
    // Test with count only
    console.log('\n🔢 Testing count query...');
    const { count: recordCount, error: countError } = await supabase
      .from('Members Table')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Count error:', countError);
    } else {
      console.log(`📊 Total records in table: ${recordCount}`);
      if (recordCount > 0 && (!allData || allData.length === 0)) {
        console.log('⚠️  RLS POLICY ISSUE: Records exist but are blocked by Row Level Security!');
      }
    }
    
  } catch (err) {
    console.error('❌ Exception:', err.message);
    console.error(err.stack);
  }
}

testConnection();


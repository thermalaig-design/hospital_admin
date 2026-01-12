import { supabase } from './config/supabase.js';

console.log('Testing hospitals table in Supabase...');

async function testHospitalsTable() {
  try {
    console.log('🔍 Testing hospitals table existence...');
    
    // First, try to get a count of hospitals
    const { count, error: countError } = await supabase
      .from('hospitals')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Error checking hospitals table:', countError.message);
      console.log('Details:', countError);
      return;
    }

    console.log(`✅ Hospitals table exists! Total records: ${count}`);

    // Fetch a sample of hospitals
    const { data: sampleData, error: sampleError } = await supabase
      .from('hospitals')
      .select('*')
      .limit(5);

    if (sampleError) {
      console.log('❌ Error fetching sample hospitals:', sampleError.message);
      return;
    }

    console.log('📝 Sample hospitals data:');
    console.log(sampleData);

    // Now test the actual query we use in our service
    console.log('\n🔍 Testing the same query as in our service...');
    const { data: serviceData, error: serviceError } = await supabase
      .from('hospitals')
      .select('*')
      .eq('is_active', true)
      .order('hospital_name', { ascending: true })
      .limit(10);

    if (serviceError) {
      console.log('❌ Error with service query:', serviceError.message);
      return;
    }

    console.log(`✅ Service query successful! Active hospitals: ${serviceData.length}`);
    if (serviceData.length > 0) {
      console.log('Sample active hospital:', serviceData[0]);
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

testHospitalsTable();
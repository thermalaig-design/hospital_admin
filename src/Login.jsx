import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkPhoneNumber } from './services/authService';

function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckPhone = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔍 Checking phone number:', phoneNumber);
      
      // Check if phone exists in backend
      const checkResult = await checkPhoneNumber(phoneNumber);
      
      console.log('📞 API Response:', checkResult);
      
      if (!checkResult.success) {
        setError(checkResult.message);
        setLoading(false);
        return;
      }

      // Log the user data received
      console.log('✅ User found in database:');
      console.log('📋 User Details:', JSON.stringify(checkResult.data.user, null, 2));
      console.log('🏥 User Type:', checkResult.data.user.type);
      console.log('📱 Mobile:', checkResult.data.user.mobile);
      console.log('👤 Name:', checkResult.data.user.name);
      console.log('🆔 ID:', checkResult.data.user.id);
      
      // Navigate to OTP verification screen with user data
      navigate('/otp-verification', {
        state: {
          user: checkResult.data.user,
          phoneNumber: phoneNumber
        }
      });
      
    } catch (error) {
      console.error('❌ Error checking phone:', error);
      setError('Failed to verify phone number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
        {/* Hospital Logo and Header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 flex justify-center">
            <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100">
              <img 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1767090787454.png?width=8000&height=8000&resize=contain" 
                alt="Maharaja Agrasen Hospital Logo" 
                className="h-20 w-20 object-contain" 
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">MAHARAJA AGRASEN HOSPITAL</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto mt-3 mb-4 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Welcome Back!</h2>
          <p className="text-gray-500 text-sm mt-3">Please enter your phone number to continue</p>
        </div>
        
        <form onSubmit={handleCheckPhone} className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              required
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-700 text-base font-medium">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
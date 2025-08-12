// RAW SQL password fix test - ULTIMATE SOLUTION
async function testRawPasswordFix() {
  try {
    console.log('🔐 Testing RAW SQL password fix (ULTIMATE SOLUTION)...');
    
    const response = await fetch('https://qart-nfc-production.vercel.app/api/raw-password-fix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📊 Status:', response.status);
    console.log('📋 Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('📄 Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n🎉 PASSWORD FIX SUCCESSFUL!');
      console.log('✅ You can now login with:');
      console.log('   Admin: admin@qart.app / admin123');
      console.log('   Demo:  demo@qart.app / demo123');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testRawPasswordFix();
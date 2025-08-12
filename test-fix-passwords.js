// Fix passwords test
async function testPasswordFix() {
  try {
    console.log('🔐 Testing password fix...');
    
    const response = await fetch('https://qart-nfc-production.vercel.app/api/fix-passwords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📊 Status:', response.status);
    console.log('📋 Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('📄 Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testPasswordFix();
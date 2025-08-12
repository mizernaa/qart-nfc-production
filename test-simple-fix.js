// Simple password fix test
async function testSimplePasswordFix() {
  try {
    console.log('🔐 Testing SIMPLE password fix (final solution)...');
    
    const response = await fetch('https://qart-nfc-production.vercel.app/api/simple-password-fix', {
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

testSimplePasswordFix();
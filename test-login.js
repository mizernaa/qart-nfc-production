// Using built-in fetch (Node.js 18+)

async function testLogin() {
  try {
    console.log('🔧 Testing Vercel production login...');
    
    const response = await fetch('https://qart-nfc-production.vercel.app/api/auth/simple-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@qart.app',
        password: 'admin123'
      })
    });
    
    console.log('📊 Status:', response.status);
    console.log('📋 Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('📄 Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testLogin();
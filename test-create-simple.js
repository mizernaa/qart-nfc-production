// Create simple users - FINAL SOLUTION
async function testCreateSimpleUsers() {
  try {
    console.log('👤 Testing create simple users (FINAL SOLUTION)...');
    
    const response = await fetch('https://qart-nfc-production.vercel.app/api/create-simple-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📊 Status:', response.status);
    console.log('📋 Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('📄 Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.tests.adminLogin && data.tests.demoLogin) {
      console.log('\n🎉🎉🎉 SUCCESS! LOGIN IS NOW WORKING! 🎉🎉🎉');
      console.log('✅ You can now login with:');
      console.log('   Admin: admin@qart.app / admin123');
      console.log('   Demo:  demo@qart.app / demo123');
      console.log('\n🚀 Go to: https://qart-nfc-production.vercel.app/login');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testCreateSimpleUsers();
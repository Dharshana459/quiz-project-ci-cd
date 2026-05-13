const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'admin@quiz.com',
      password: 'admin123'
    });
    console.log('✅ Login Successful!');
    console.log('User Role:', res.data.role);
    console.log('Token Received:', !!res.data.token);
    
    const statsRes = await axios.get('http://localhost:5001/api/scores/stats', {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    console.log('✅ Admin Stats Fetched!');
    console.log('Total Quizzes:', statsRes.data.totalQuizzes);
  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
  }
}

testLogin();

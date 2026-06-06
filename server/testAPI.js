async function runTests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('--- Testing POST /api/register ---');
  try {
    const regRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password123' })
    });
    const regData = await regRes.json();
    console.log('Register response:', regData);
  } catch (e) {
    console.log('Register error:', e.message);
  }

  console.log('\n--- Testing POST /api/login ---');
  try {
    const logRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
    });
    const logData = await logRes.json();
    console.log('Login response:', logData);
  } catch (e) {
    console.log('Login error:', e.message);
  }

  console.log('\n--- Testing GET /api/users ---');
  let users = [];
  try {
    const usersRes = await fetch(`${baseUrl}/users`);
    users = await usersRes.json();
    console.log(`Total users: ${users.length}`);
    console.log('Example user:', users[0]);
  } catch (e) {
    console.log('Get users error:', e.message);
  }

  if (users.length > 0) {
    const firstUserId = users[0].id;
    console.log(`\n--- Testing GET /api/users/${firstUserId} ---`);
    try {
      const userRes = await fetch(`${baseUrl}/users/${firstUserId}`);
      const userData = await userRes.json();
      console.log('User response:', userData);
    } catch (e) {
      console.log('Get user error:', e.message);
    }
  }
}

runTests();

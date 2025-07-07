// Test approve user API
const API_URL = 'http://localhost:8000';

async function testApproveUser() {
  console.log('Testing approve user API...');
  
  try {
    // First, get all users to see which ones need approval
    const usersResponse = await fetch(`${API_URL}/users`);
    const users = await usersResponse.json();
    console.log('Current users:', users);
    
    // Find a user that needs approval
    const userToApprove = users.find(user => !user.isApproved);
    
    if (!userToApprove) {
      console.log('No users need approval');
      return;
    }
    
    console.log('Approving user:', userToApprove);
    
    // Approve the user (you'll need to add auth token here)
    const approveResponse = await fetch(`${API_URL}/users/${userToApprove.id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });
    
    if (approveResponse.ok) {
      const result = await approveResponse.json();
      console.log('✅ User approved successfully:', result);
    } else {
      const error = await approveResponse.text();
      console.log('❌ Approve failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testApproveUser(); 
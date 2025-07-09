// Test script để kiểm tra logic hiển thị nút "Tạo giải đấu"
console.log('=== Test Logic Hiển thị Nút "Tạo giải đấu" ===');

// Test case 1: User là admin
const adminUser = {
  id: 1,
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  isApproved: true
};

const isAdmin = adminUser?.role === 'admin';
const isOrganizer = adminUser?.role === 'organizer';
const shouldShowCreateButton = (isOrganizer || isAdmin);

console.log('Test 1 - Admin User:');
console.log('- Role:', adminUser.role);
console.log('- isAdmin:', isAdmin);
console.log('- isOrganizer:', isOrganizer);
console.log('- Should show create button:', shouldShowCreateButton);
console.log('✅ Kết quả mong đợi: true');

// Test case 2: User là organizer
const organizerUser = {
  id: 2,
  email: 'organizer@example.com',
  firstName: 'Organizer',
  lastName: 'User',
  role: 'organizer',
  isApproved: true
};

const isAdmin2 = organizerUser?.role === 'admin';
const isOrganizer2 = organizerUser?.role === 'organizer';
const shouldShowCreateButton2 = (isOrganizer2 || isAdmin2);

console.log('\nTest 2 - Organizer User:');
console.log('- Role:', organizerUser.role);
console.log('- isAdmin:', isAdmin2);
console.log('- isOrganizer:', isOrganizer2);
console.log('- Should show create button:', shouldShowCreateButton2);
console.log('✅ Kết quả mong đợi: true');

// Test case 3: User là athlete
const athleteUser = {
  id: 3,
  email: 'athlete@example.com',
  firstName: 'Athlete',
  lastName: 'User',
  role: 'athlete',
  isApproved: true
};

const isAdmin3 = athleteUser?.role === 'admin';
const isOrganizer3 = athleteUser?.role === 'organizer';
const shouldShowCreateButton3 = (isOrganizer3 || isAdmin3);

console.log('\nTest 3 - Athlete User:');
console.log('- Role:', athleteUser.role);
console.log('- isAdmin:', isAdmin3);
console.log('- isOrganizer:', isOrganizer3);
console.log('- Should show create button:', shouldShowCreateButton3);
console.log('✅ Kết quả mong đợi: false');

// Test case 4: User là guest
const guestUser = {
  id: 4,
  email: 'guest@example.com',
  firstName: 'Guest',
  lastName: 'User',
  role: 'guest',
  isApproved: true
};

const isAdmin4 = guestUser?.role === 'admin';
const isOrganizer4 = guestUser?.role === 'organizer';
const shouldShowCreateButton4 = (isOrganizer4 || isAdmin4);

console.log('\nTest 4 - Guest User:');
console.log('- Role:', guestUser.role);
console.log('- isAdmin:', isAdmin4);
console.log('- isOrganizer:', isOrganizer4);
console.log('- Should show create button:', shouldShowCreateButton4);
console.log('✅ Kết quả mong đợi: false');

console.log('\n=== Kết luận ===');
console.log('Nút "Tạo giải đấu" sẽ hiển thị cho:');
console.log('- Admin (role: admin)');
console.log('- Organizer (role: organizer)');
console.log('Nút "Tạo giải đấu" sẽ KHÔNG hiển thị cho:');
console.log('- Athlete (role: athlete)');
console.log('- Guest (role: guest)'); 
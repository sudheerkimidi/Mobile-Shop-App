// ═══════════════════════════════════════════════════════════
// TEST FILE — Run this to check if MongoDB connects correctly
// Command: node testconnection.js
// ═══════════════════════════════════════════════════════════

require('dotenv').config();

console.log('\n=== MONGODB CONNECTION TEST ===');
console.log('Node version:', process.version);
console.log('');

// Step 1: Check if .env loaded
if (!process.env.MONGODB_URI) {
  console.log('❌ PROBLEM: MONGODB_URI is UNDEFINED');
  console.log('');
  console.log('This means ONE of these is wrong:');
  console.log('  1. Your .env file does not exist in backend folder');
  console.log('  2. Your .env file has wrong name (like .env.txt or env)');
  console.log('  3. You are running this from wrong folder');
  console.log('');
  console.log('HOW TO FIX:');
  console.log('  1. Make sure you are IN the backend folder');
  console.log('  2. Check the file is named exactly: .env (with dot, no extension)');
  console.log('  3. Open .env and verify MONGODB_URI line has your real URI');
  process.exit(1);
}

console.log('✅ .env file loaded correctly');
console.log('✅ MONGODB_URI is set (starts with:', process.env.MONGODB_URI.substring(0, 25) + '...)');
console.log('');
console.log('Now testing actual MongoDB connection...');
console.log('(This may take 5-10 seconds)');
console.log('');

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('✅ SUCCESS! MongoDB connected!');
    console.log('✅ Your .env and MongoDB are working correctly');
    console.log('');
    console.log('You can now run: node server.js');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB connection FAILED');
    console.log('Error:', err.message);
    console.log('');

    if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.log('━━━ PROBLEM: Wrong username or password ━━━');
      console.log('Your MongoDB username or password in MONGODB_URI is wrong.');
      console.log('');
      console.log('FIX STEPS:');
      console.log('  1. Go to https://cloud.mongodb.com');
      console.log('  2. Left menu → Database Access');
      console.log('  3. Click EDIT on your user');
      console.log('  4. Click "Edit Password"');
      console.log('  5. Type a NEW simple password: Shop12345');
      console.log('     USE ONLY letters and numbers - NO special characters!');
      console.log('  6. Click "Update User"');
      console.log('  7. Update your .env MONGODB_URI with the new password');
      console.log('  8. Run: node testconnection.js again');
    }
    else if (err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
      console.log('━━━ PROBLEM: Cannot reach MongoDB Atlas ━━━');
      console.log('Your connection string hostname is wrong OR Network Access is blocked.');
      console.log('');
      console.log('FIX STEPS:');
      console.log('  1. Go to https://cloud.mongodb.com');
      console.log('  2. Left menu → Network Access');
      console.log('  3. Delete ALL existing entries');
      console.log('  4. Click "Add IP Address"');
      console.log('  5. Click "Allow Access from Anywhere" → Confirm');
      console.log('  6. Wait 2 minutes');
      console.log('  7. Go to your cluster → Connect → Drivers');
      console.log('  8. COPY the fresh connection string');
      console.log('  9. Update MONGODB_URI in .env with the fresh string');
      console.log(' 10. Add /mobileshop before the ? in the URI');
    }
    else if (err.message.includes('undefined') || err.message.includes('must be a string')) {
      console.log('━━━ PROBLEM: MONGODB_URI is empty or undefined ━━━');
      console.log('The .env file exists but MONGODB_URI has no value.');
      console.log('');
      console.log('FIX: Open .env and make sure line 2 looks like:');
      console.log('MONGODB_URI=mongodb+srv://shopuser:password@cluster0.xxxxx.mongodb.net/mobileshop?retryWrites=true&w=majority');
      console.log('NO spaces, NO quotes around the value!');
    }
    else {
      console.log('Unrecognized error. Copy the error above and share it for help.');
    }
    process.exit(1);
  });

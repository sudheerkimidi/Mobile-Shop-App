// ═══════════════════════════════════════════════════════════
// ENV CHECKER — Run this FIRST before anything else
// Command: node checkenv.js
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('\n=== .ENV FILE CHECKER ===\n');

// Check 1: Are we in the right folder?
const currentDir = process.cwd();
console.log('You are running from:', currentDir);

const isInBackend = currentDir.includes('backend');
if (isInBackend) {
  console.log('✅ You are in the backend folder — correct!');
} else {
  console.log('❌ WARNING: You may not be in the backend folder!');
  console.log('   Run: cd C:\\Users\\admin\\Desktop\\mobile-shop\\backend');
  console.log('   Then run: node checkenv.js again');
}

console.log('');

// Check 2: Does .env file exist?
const envPath = path.join(currentDir, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env file EXISTS in this folder');
} else {
  console.log('❌ .env file NOT FOUND in this folder!');
  console.log('');
  console.log('You need to create .env file.');
  console.log('In VS Code:');
  console.log('  1. Make sure you opened the BACKEND folder');
  console.log('  2. New File → name it exactly: .env');
  console.log('  3. Paste the contents (see instructions)');
  console.log('  4. Save with Ctrl+S');
  process.exit(1);
}

console.log('');

// Check 3: Read and validate .env contents
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n').filter(l => l.trim() && !l.startsWith('#'));

console.log('=== .ENV FILE CONTENTS CHECK ===\n');

const required = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME',
                  'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'HUGGINGFACE_TOKEN'];

let allGood = true;

for (const key of required) {
  const line = lines.find(l => l.startsWith(key + '='));
  if (!line) {
    console.log(`❌ MISSING: ${key} not found in .env`);
    allGood = false;
    continue;
  }
  
  const value = line.split('=').slice(1).join('=').trim();
  
  if (!value) {
    console.log(`❌ EMPTY: ${key} has no value`);
    allGood = false;
    continue;
  }

  // Special checks
  if (key === 'MONGODB_URI') {
    if (value.includes('YOUR_PASSWORD') || value.includes('YOUR_USERNAME') || value.includes('xxxxx')) {
      console.log(`❌ NOT REPLACED: ${key} still has placeholder text!`);
      console.log(`   Current value starts with: ${value.substring(0, 40)}...`);
      console.log(`   You must replace YOUR_PASSWORD with your real password`);
      allGood = false;
    } else if (!value.startsWith('mongodb+srv://')) {
      console.log(`❌ WRONG FORMAT: ${key} should start with mongodb+srv://`);
      allGood = false;
    } else if (value.includes(' ')) {
      console.log(`❌ HAS SPACES: ${key} has spaces in it — remove all spaces`);
      allGood = false;
    } else {
      console.log(`✅ ${key} = ${value.substring(0, 30)}... (looks correct)`);
    }
  }
  else if (key === 'HUGGINGFACE_TOKEN') {
    if (value.includes('your_token') || value === 'hf_your_token_here') {
      console.log(`⚠️  NOT SET: ${key} still has placeholder — visual search won't work`);
    } else if (!value.startsWith('hf_')) {
      console.log(`⚠️  ${key} should start with hf_ — check your Hugging Face token`);
    } else {
      console.log(`✅ ${key} = ${value.substring(0, 10)}... (looks correct)`);
    }
  }
  else if (key === 'CLOUDINARY_CLOUD_NAME') {
    if (value.includes('your_cloud') || value.includes('from_cloudinary')) {
      console.log(`⚠️  NOT SET: ${key} still has placeholder — image upload won't work`);
    } else {
      console.log(`✅ ${key} = ${value} (set)`);
    }
  }
  else {
    const display = value.length > 20 ? value.substring(0, 20) + '...' : value;
    console.log(`✅ ${key} = ${display}`);
  }
}

console.log('');
if (allGood) {
  console.log('✅ All required values are set!');
  console.log('Now run: node testconnection.js');
} else {
  console.log('❌ Fix the issues above, then run: node checkenv.js again');
}
console.log('');

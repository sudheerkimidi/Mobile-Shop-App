# COMPLETE STEP-BY-STEP GUIDE
# Mobile Shop Inventory Manager — Windows PC
# Every step explained. Every error prevented.
# Follow EXACTLY in order. Do not skip any step.

════════════════════════════════════════════════════════
BEFORE YOU START — READ THIS ONCE
════════════════════════════════════════════════════════

What you are building:
A website where you can manage phone cases and pouches.
- Search by phone model name
- Upload customer phone photo to find matching cases
- See exactly which shelf the case is on
- Access from any phone or computer

This guide assumes you are using WINDOWS computer.
Total time: about 6-7 hours spread over 2-3 days.

════════════════════════════════════════════════════════
PHASE 1 — CREATE 5 FREE ACCOUNTS
════════════════════════════════════════════════════════
Do all 5 in one sitting. Save all passwords in a notepad file.

────────────────────────────────────────────────────────
STEP 1 — MongoDB Atlas (Your Database — stores all data)
────────────────────────────────────────────────────────
What this does: Stores all your shop products, users, and data.

1. Open Chrome browser
2. Go to: https://cloud.mongodb.com
3. Click "Try Free" (green button, top right)
4. Fill in: First name, Last name, Email, Password
   → Write down this email and password in Notepad
5. Click "Create your Atlas account"
6. Check your email → click the verification link
7. After verifying, log back in to https://cloud.mongodb.com

Now create your database cluster:
8. You will see "Deploy your cluster" screen
9. Select "M0" (the FREE option — $0/month)
10. Provider: AWS
11. Region: Mumbai (ap-south-1)
12. Cluster Name: Cluster0 (leave as default)
13. Click "Create Deployment" (green button)
14. WAIT 3 minutes — you will see a loading spinner

Now create a database user:
15. A popup appears "Connect to Cluster0"
16. Username: shopuser
17. Password: click "Autogenerate Secure Password"
18. A password appears — COPY IT and save in Notepad immediately
    Example: Abc123xyz789 (yours will be different)
19. Click "Create Database User"
20. Click "Choose a connection method"
21. Click "Drivers"
22. Driver: Node.js, Version: 6.7 or later
23. You will see a connection string like:
    mongodb+srv://shopuser:YOUR_PASSWORD@cluster0.deg6fg1.mongodb.net/?appName=Cluster0
24. COPY the entire connection string → save in Notepad
25. Click "Done"

Now allow all IP addresses to connect:
26. Left menu → click "Network Access"
27. Click "Add IP Address" (green button)
28. Click "Allow Access from Anywhere"
29. Click "Confirm"
30. Wait 1 minute until status shows "Active"

✓ CHECKPOINT: You have a MongoDB connection string saved in Notepad.
It looks like: mongodb+srv://shopuser:PASSWORD@cluster0.XXXXX.mongodb.net/...

────────────────────────────────────────────────────────
STEP 2 — Cloudinary (Stores product photos)
────────────────────────────────────────────────────────
What this does: Saves all product photos online for free.

1. Go to: https://cloudinary.com
2. Click "Sign up for free" (top right)
3. Fill in your details
4. Select plan: Free (25GB storage)
5. Verify your email
6. Log in → you see the Dashboard
7. You will see three values at the top of the dashboard:
   - Cloud Name: (looks like dab12cde3)
   - API Key: (a long number like 123456789012345)
   - API Secret: (a long string — click "eye" icon to reveal)
8. COPY all three values → save in Notepad

✓ CHECKPOINT: You have Cloud Name, API Key, API Secret saved.

────────────────────────────────────────────────────────
STEP 3 — Hugging Face (Free AI for visual search)
────────────────────────────────────────────────────────
What this does: AI that matches customer phone photos to cases.

1. Go to: https://huggingface.co
2. Click "Sign Up"
3. Fill in Username, Email, Password
4. Verify your email
5. Log in
6. Click your profile picture (top right corner)
7. Click "Settings"
8. Left sidebar → click "Access Tokens"
9. Click "New token"
10. Name: shop-token
11. Role: Read
12. Click "Generate a token"
13. A token appears starting with "hf_"
    Example: hf_AbCdEfGhIjKlMnOpQr
14. COPY it immediately → save in Notepad
    WARNING: You cannot see this token again after closing!

✓ CHECKPOINT: You have a token starting with "hf_" saved in Notepad.

────────────────────────────────────────────────────────
STEP 4 — GitHub (Stores your code online)
────────────────────────────────────────────────────────
What this does: Keeps your code saved online. Needed for deployment.

1. Go to: https://github.com
2. Click "Sign up"
3. Enter your email → Continue
4. Create a password → Continue
5. Enter a username (e.g. sudheer-shop)
6. Complete the puzzle verification
7. Check email → click verify link
8. On "Welcome to GitHub" — select: "Just me", "Student/Hobbyist"
9. Choose Free plan

✓ CHECKPOINT: You can log in to github.com and see your profile.

────────────────────────────────────────────────────────
STEP 5 — Railway (Hosts your backend server — free)
────────────────────────────────────────────────────────
What this does: Runs your backend server 24/7 online for free.

1. Go to: https://railway.app
2. Click "Login" → "Login with GitHub"
3. GitHub asks permission → click "Authorize railway-app"
4. You are now logged into Railway

✓ CHECKPOINT: You see Railway dashboard after logging in with GitHub.

────────────────────────────────────────────────────────
STEP 6 — Vercel (Hosts your website — free)
────────────────────────────────────────────────────────
What this does: Makes your website accessible at a public URL.

1. Go to: https://vercel.com
2. Click "Sign Up"
3. Click "Continue with GitHub"
4. GitHub asks permission → click "Authorize Vercel"
5. Select "Hobby" (free plan)
6. You are now logged into Vercel

✓ CHECKPOINT: You see Vercel dashboard.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR NOTEPAD SHOULD NOW HAVE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MongoDB URI: mongodb+srv://shopuser:PASSWORD@cluster0.XXXXX.mongodb.net/...
Cloudinary Cloud Name: dxxxxxxxx
Cloudinary API Key: 123456789012345
Cloudinary API Secret: AbCdEfGhIjKlMnOpQr
Hugging Face Token: hf_AbCdEfGhIjKlMnOpQr
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

════════════════════════════════════════════════════════
PHASE 2 — INSTALL SOFTWARE ON YOUR COMPUTER
════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
STEP 7 — Install Node.js (runs your code)
────────────────────────────────────────────────────────
What this does: Allows your computer to run JavaScript code.

1. Go to: https://nodejs.org
2. You see TWO buttons. Click the LEFT button "LTS" (the green one)
   It says something like "20.x.x LTS Recommended For Most Users"
3. A file downloads: node-v20.x.x-x64.msi
4. Double-click that downloaded file
5. Click Next → Next → Next → Install
6. Click Finish
7. RESTART your computer now

After restarting:
8. Press Windows key → type "cmd" → press Enter
   (This opens Command Prompt — a black window)
9. Type exactly: node --version
10. Press Enter
11. You should see: v20.x.x (any version starting with v18 or higher is fine)
12. Type exactly: npm --version
13. Press Enter
14. You should see: 9.x.x or 10.x.x

⚠️ IF YOU SEE "node is not recognized":
   Node.js did not install correctly.
   Fix: Restart your computer and try step 8-11 again.
   If still fails: Uninstall Node.js from Control Panel and reinstall.

✓ CHECKPOINT: Both "node --version" and "npm --version" show numbers.

────────────────────────────────────────────────────────
STEP 8 — Install VS Code (code editor — where you write code)
────────────────────────────────────────────────────────
What this does: Software to open and edit your code files.

1. Go to: https://code.visualstudio.com
2. Click the big blue "Download for Windows" button
3. A file downloads: VSCodeSetup-x64-x.x.x.exe
4. Double-click the downloaded file
5. Accept the agreement → click Next
6. IMPORTANT: On "Select Additional Tasks" screen:
   ✅ Check "Add to PATH" (if you see this option)
   ✅ Check "Open with Code" for files and folders
7. Click Next → Install → Finish
8. VS Code opens automatically

✓ CHECKPOINT: VS Code opens and you see a welcome screen.

────────────────────────────────────────────────────────
STEP 9 — Install Git (for uploading code to GitHub)
────────────────────────────────────────────────────────
What this does: Lets you send your code to GitHub for deployment.

1. Go to: https://git-scm.com/download/win
2. Click "64-bit Git for Windows Setup"
3. File downloads: Git-x.x.x-64-bit.exe
4. Double-click it → click Next on EVERY screen (all defaults are correct)
5. Click Install → Finish
6. Open Command Prompt (Windows key → type cmd → Enter)
7. Type: git --version
8. You should see: git version 2.x.x

⚠️ IF "git is not recognized":
   Restart your computer → try again

✓ CHECKPOINT: "git --version" shows a version number.

════════════════════════════════════════════════════════
PHASE 3 — SET UP YOUR PROJECT FILES
════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
STEP 10 — Extract the ZIP file
────────────────────────────────────────────────────────
What this does: Gets all the code files onto your computer.

1. Find the file you downloaded: mobile-shop-complete.zip
2. Right-click it → "Extract All"
3. Choose location: C:\Users\YourName\Desktop
   (Replace YourName with your actual Windows username)
4. Click "Extract"
5. A folder appears on Desktop: mobile-shop
6. Open it — you should see two folders inside: backend and frontend

✓ CHECKPOINT: On your Desktop you have a "mobile-shop" folder containing
  "backend" folder and "frontend" folder.

────────────────────────────────────────────────────────
STEP 11 — Create the .env file (YOUR MOST IMPORTANT STEP)
────────────────────────────────────────────────────────
What this does: Tells the backend your secret passwords and API keys.
This is the file where MOST errors happen. Follow EVERY sub-step carefully.

1. Open VS Code
2. Click "File" → "Open Folder"
3. Navigate to Desktop → mobile-shop → backend
4. Click "Select Folder"
5. VS Code opens showing the backend folder contents on the left

Now create the .env file:
6. In VS Code, left panel — you see the files listed
7. Click the "New File" icon (paper with + sign) at top of the file list
8. Type exactly: .env
   (starts with a dot, NO extension, just .env)
9. Press Enter
10. The file opens in the editor (it will be empty)

Now paste these contents into the empty .env file:
───────────────────────────────────────────────
PORT=5000
MONGODB_URI=REPLACE_THIS_WITH_YOUR_MONGODB_URI
JWT_SECRET=myshop_super_secret_key_sudheer_1234567890_abcdefgh
CLOUDINARY_CLOUD_NAME=REPLACE_WITH_YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=REPLACE_WITH_YOUR_API_KEY
CLOUDINARY_API_SECRET=REPLACE_WITH_YOUR_API_SECRET
HUGGINGFACE_TOKEN=REPLACE_WITH_YOUR_HF_TOKEN
FRONTEND_URL=http://localhost:3000
───────────────────────────────────────────────

Now replace each "REPLACE_THIS" with your actual values from Notepad:

LINE 2 — MONGODB_URI:
Replace the entire value with your MongoDB connection string from Notepad.
BUT — you must ADD the database name to it.
Your string from Atlas: mongodb+srv://shopuser:PASS@cluster0.XXXXX.mongodb.net/?appName=Cluster0
Change it to:           mongodb+srv://shopuser:PASS@cluster0.XXXXX.mongodb.net/mobileshop?retryWrites=true&w=majority
(Add "mobileshop" after the "/" before "?" — this creates your database)

LINE 4 — CLOUDINARY_CLOUD_NAME:
Replace with your Cloud Name from Cloudinary dashboard
Example: CLOUDINARY_CLOUD_NAME=dab12cde3

LINE 5 — CLOUDINARY_API_KEY:
Replace with your API Key number
Example: CLOUDINARY_API_KEY=123456789012345

LINE 6 — CLOUDINARY_API_SECRET:
Replace with your API Secret
Example: CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQr123456

LINE 7 — HUGGINGFACE_TOKEN:
Replace with your hf_ token
Example: HUGGINGFACE_TOKEN=hf_AbCdEfGhIjKlMnOpQr

11. Press Ctrl+S to save the file

⚠️ COMMON MISTAKES THAT CAUSE ERRORS:
   ✗ Spaces around the = sign: PORT = 5000  ← WRONG
   ✓ No spaces: PORT=5000  ← CORRECT
   ✗ Quotes around values: MONGODB_URI="mongodb+..."  ← WRONG
   ✓ No quotes: MONGODB_URI=mongodb+...  ← CORRECT
   ✗ YOUR_PASSWORD still in the URI — you must replace it!
   ✗ Missing "mobileshop" in the database URI

✓ CHECKPOINT: Your .env file has 8 lines. No line says "REPLACE_THIS" anymore.
  Every value is your real value from your Notepad.

────────────────────────────────────────────────────────
STEP 12 — Install backend packages
────────────────────────────────────────────────────────
What this does: Downloads all the code libraries the backend needs to work.

1. In VS Code → top menu → Terminal → New Terminal
   (A black panel opens at the bottom of VS Code)
2. You should see something like:
   C:\Users\admin\Desktop\mobile-shop\backend>
   If you see "frontend" instead of "backend" — type:
   cd C:\Users\admin\Desktop\mobile-shop\backend
   and press Enter
3. Type exactly: npm install
4. Press Enter
5. You see lots of text scrolling — this is normal
6. Wait 2-3 minutes until it stops
7. You will see: "added XXX packages" at the end
8. A new folder called "node_modules" appears in the file list

⚠️ IF YOU SEE ERRORS in red:
   Error "EACCES" or "permission denied":
   Fix: Close VS Code → Right-click VS Code icon → "Run as Administrator" → repeat step

   Error "npm : command not found":
   Fix: Node.js not installed correctly. Redo Step 7.

✓ CHECKPOINT: You see "added XXX packages" message and node_modules folder exists.

────────────────────────────────────────────────────────
STEP 13 — Install frontend packages
────────────────────────────────────────────────────────
What this does: Downloads all the code libraries the website needs.

1. In the same VS Code terminal, type:
   cd ..\frontend
   Press Enter
2. You should now see the path ends with "frontend"
3. Type exactly: npm install
4. Press Enter
5. Wait 3-5 minutes — React has many packages
6. You will see "added XXX packages" when done

⚠️ IF YOU SEE "npm WARN deprecated":
   This is just a warning — NOT an error. Ignore it. Continue.

⚠️ IF YOU SEE "npm ERR!" in red:
   Type: npm install --legacy-peer-deps
   Press Enter — this fixes most npm errors

Now create the frontend .env file:
7. In VS Code → File → Open Folder
8. Navigate to: Desktop → mobile-shop → frontend
9. Click "Select Folder"
10. Create new file named: .env
11. Paste this single line:
    REACT_APP_API_URL=http://localhost:5000/api
12. Press Ctrl+S to save

✓ CHECKPOINT: "added XXX packages" shown. frontend/.env file exists with one line.

════════════════════════════════════════════════════════
PHASE 4 — START AND TEST ON YOUR COMPUTER
════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
STEP 14 — Start the backend server
────────────────────────────────────────────────────────
What this does: Starts the server that handles all data and login.

1. In VS Code → Terminal → New Terminal
2. Type: cd C:\Users\admin\Desktop\mobile-shop\backend
   (Replace "admin" with your actual Windows username)
3. Press Enter
4. Type: node server.js
5. Press Enter

✓ SUCCESS looks like this:
   🚀 Server running on port 5000
   ✅ MongoDB connected

KEEP THIS TERMINAL OPEN. Do not close it.

════════════════════════════════════════════
IF YOU SEE AN ERROR — find your exact error below:
════════════════════════════════════════════

ERROR A: "Cannot find module './routes/auth.js'"
──────────────────────────────────────────────────
Cause: The routes folder files are missing or you are in wrong folder.
Fix:
1. Check you are in the backend folder:
   The terminal line should show: mobile-shop\backend>
2. If not, type: cd C:\Users\admin\Desktop\mobile-shop\backend
3. Type: dir
   You should see: server.js, package.json, .env, node_modules folder, routes folder
4. Type: dir routes
   You should see: auth.js, products.js, search.js
5. If routes folder is empty — you need to re-extract the ZIP file (redo Step 10)

ERROR B: "MongoServerError: Authentication failed"
────────────────────────────────────────────────────
Cause: Wrong username or password in your MONGODB_URI.
Fix:
1. Go to https://cloud.mongodb.com
2. Left menu → Database Access
3. Find your user → click EDIT
4. Click "Edit Password" → type a NEW simple password
   Use only letters and numbers. Example: Shop12345
   NO special characters like @ # $ % ! in the password
5. Click "Update User"
6. Open your backend .env file
7. Update the password part of MONGODB_URI
8. Save .env
9. In terminal press Ctrl+C to stop server
10. Type: node server.js  → press Enter

ERROR C: "MongoNetworkError: connection timed out" or "ECONNREFUSED"
──────────────────────────────────────────────────────────────────────
Cause: Network Access not allowing your IP.
Fix:
1. Go to https://cloud.mongodb.com
2. Left menu → Network Access
3. If you see an IP address there that is NOT 0.0.0.0/0:
   Click DELETE on that entry
4. Click "Add IP Address"
5. Click "Allow Access from Anywhere"
6. Click "Confirm"
7. Wait 2 minutes → try node server.js again

ERROR D: "Cannot find module 'express'" or any other module
─────────────────────────────────────────────────────────────
Cause: npm install was not run or failed.
Fix:
1. Make sure you are in backend folder
2. Type: npm install
3. Wait for it to finish
4. Type: node server.js

ERROR E: "Port 5000 is already in use"
────────────────────────────────────────
Cause: Another program is using port 5000.
Fix:
1. Open Task Manager (Ctrl+Shift+Esc)
2. Find any "node" process → End Task
3. Try: node server.js again
OR
1. Open .env file
2. Change PORT=5000 to PORT=5001
3. Also change frontend .env: REACT_APP_API_URL=http://localhost:5001/api
4. Save both files → try again

────────────────────────────────────────────────────────
STEP 15 — Start the frontend website
────────────────────────────────────────────────────────
What this does: Opens your website in the browser.

IMPORTANT: Keep the backend terminal from Step 14 open.
Open a SECOND terminal:

1. In VS Code → Terminal → New Terminal
   (A second terminal tab appears)
2. Type: cd C:\Users\admin\Desktop\mobile-shop\frontend
3. Press Enter
4. Type: npm start
5. Press Enter
6. Wait 30-60 seconds
7. Browser opens automatically showing your website
8. You see a login page with "ShopManager" title

⚠️ IF BROWSER DOES NOT OPEN AUTOMATICALLY:
   Open Chrome → go to: http://localhost:3000
   You should see the login page.

⚠️ IF YOU SEE "Module not found" error in terminal:
   Type: npm install --legacy-peer-deps
   Wait → then type: npm start

✓ CHECKPOINT: You see the ShopManager login page in your browser.

────────────────────────────────────────────────────────
STEP 16 — Create your admin account (Register page)
────────────────────────────────────────────────────────
What this does: Creates your first account which becomes admin automatically.

The login page does NOT show a Register button visibly on all screens.

TO GET TO REGISTER PAGE — do ONE of these:
Option A: In browser address bar type: http://localhost:3000/register
Option B: On the login page, scroll DOWN — you will see
          "New shop? Create account" link at the bottom

On the Register page:
1. Your Name: enter your name (example: Sudheer)
2. Email: enter your email
3. Password: enter a password (minimum 6 characters)
   WRITE DOWN this password — you will need it to login
4. Shop Name: enter your shop name (example: Raja Mobile Shop)
5. Shop Location: enter your address
6. Phone Number: optional
7. Click "Create Account"
8. You see message: "Admin account created successfully. You can login now."
   (This appears because you are the FIRST user — you are automatically admin)
9. Click "Sign In" or go to: http://localhost:3000/login
10. Enter your email and password
11. Click "Sign In"
12. You see your Dashboard! ✅

⚠️ IF YOU SEE "Account not yet approved":
   This means you tried to register a SECOND account while logged out.
   Fix: Login with your FIRST account (admin) → go to /admin → approve yourself
   OR: Clear browser data and register fresh

✓ CHECKPOINT: You are logged in and see your Dashboard with shop name displayed.

════════════════════════════════════════════════════════
PHASE 5 — ADD PRODUCTS AND TEST EVERYTHING
════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
STEP 17 — Add your first phone pouch/case
────────────────────────────────────────────────────────
1. In the navbar at top, click "+" Add Product
   OR go to: http://localhost:3000/add-product
2. Fill in these details:
   Product Name: Samsung A12 Flip Cover Black
   Device Model: Samsung Galaxy A12
   Category: Phone Case (select from dropdown)
   Case Type: Flip Cover (select from dropdown)
   Design Style: Normal (select from dropdown)
   Brand: Local
   Color: Black
   Price: 150
   Quantity: 10
   Shelf Location: Shelf 1 Box 1
   Tags: samsung,a12,flip,black
3. Photos: Click the photo area → select any photo from your computer
   (Can be any phone case photo for testing)
4. Click "Add Product" button
5. You see: "Product added successfully!"
6. You are taken to Inventory page showing your product

✓ CHECKPOINT: Product appears in Inventory with photo, price, and shelf location.

────────────────────────────────────────────────────────
STEP 18 — Add 4 more products (needed for search testing)
────────────────────────────────────────────────────────
Add these one by one using the same steps as Step 17:

Product 2:
  Name: iPhone 13 Transparent Case
  Device Model: iPhone 13
  Case Type: Transparent
  Price: 200, Quantity: 8, Shelf: Shelf 1 Box 2

Product 3:
  Name: Redmi Note 10 Leather Pouch Brown
  Device Model: Redmi Note 10
  Category: Phone Pouch
  Case Type: Leather
  Price: 120, Quantity: 5, Shelf: Counter Box 2

Product 4:
  Name: Vivo Y21 Silicon Cover Pink Ladies
  Device Model: Vivo Y21
  Case Type: Silicon, Design Style: Ladies Design
  Price: 100, Quantity: 15, Shelf: Shelf 2 Box 1

Product 5:
  Name: OnePlus Nord Hard Back Case Blue
  Device Model: OnePlus Nord
  Case Type: Hard Back
  Price: 180, Quantity: 6, Shelf: Shelf 2 Box 3

✓ CHECKPOINT: Inventory page shows 5 products.

────────────────────────────────────────────────────────
STEP 19 — Test Text Search (most important feature)
────────────────────────────────────────────────────────
1. Click "Search" in the navbar
2. Type in the search box: Samsung A12
3. Press Enter or click Search button
4. Result shows: Samsung A12 Flip Cover Black
   With photo, price ₹150, shelf location "Shelf 1 Box 1"

Test 2:
5. Clear the search → type: iphone
6. Result shows: iPhone 13 Transparent Case

Test 3:
7. Clear → type: redmi note 10 pouch
8. Result shows: Redmi Note 10 Leather Pouch Brown

Test 4 (filter test):
9. Clear search → select "Ladies Design" from filter dropdown
10. Click Search
11. Shows: Vivo Y21 Silicon Cover Pink Ladies

✓ CHECKPOINT: Search finds correct products in under 2 seconds.

────────────────────────────────────────────────────────
STEP 20 — Test Visual Search (AI feature)
────────────────────────────────────────────────────────
IMPORTANT: This feature only works if you added products WITH PHOTOS in Step 17-18.
Also wait 2 minutes after adding products before testing visual search.

1. Click "📷 Visual" in the navbar
2. You see the Visual Search page
3. Click "Choose Photo"
4. Select a photo of a phone from your computer
   (Download any phone image from Google if needed)
5. You see the photo preview
6. Click "Find Matching Cases"
7. Wait 10-30 seconds (AI is working — this is normal)
8. Results appear with match percentage

⚠️ IF "AI service temporarily unavailable":
   The Hugging Face model is loading (takes 20-30 seconds first time).
   Wait 30 seconds → click "Find Matching Cases" again.
   This is normal for free tier.

⚠️ IF "No matches found":
   Make sure products have photos uploaded.
   Wait 3 minutes after adding products.
   Try again.

✓ CHECKPOINT: Visual search returns results with match % shown on each product card.

════════════════════════════════════════════════════════
PHASE 6 — DEPLOY ONLINE (Make website accessible everywhere)
════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
STEP 21 — Upload code to GitHub
────────────────────────────────────────────────────────
1. Open VS Code → Terminal → New Terminal
2. Type: cd C:\Users\admin\Desktop\mobile-shop
   (Go to the main folder — NOT backend or frontend)
3. Press Enter
4. Run these commands ONE BY ONE (press Enter after each):

   git init

   git add .

   git commit -m "my shop app"

5. Now go to https://github.com in browser
6. Click the "+" icon (top right) → "New repository"
7. Repository name: mobile-shop-app
8. Keep "Public" selected
9. DO NOT check "Add README file"
10. Click "Create repository"
11. GitHub shows commands. Copy and run these in your terminal:

    git remote add origin https://github.com/YOURNAME/mobile-shop-app.git
    git branch -M main
    git push -u origin main

12. It asks for GitHub username and password:
    Username: your GitHub username
    Password: use a Personal Access Token (NOT your GitHub password)
    
    To create a token:
    a. GitHub → profile picture → Settings
    b. Left menu (scroll to bottom) → Developer settings
    c. Personal access tokens → Tokens (classic)
    d. Generate new token (classic)
    e. Note: shop-deploy
    f. Expiration: 90 days
    g. Check "repo" checkbox
    h. Click "Generate token"
    i. COPY the token → use it as password in terminal

✓ CHECKPOINT: Go to github.com/YOURNAME/mobile-shop-app — you see all your files there.

────────────────────────────────────────────────────────
STEP 22 — Deploy backend to Railway
────────────────────────────────────────────────────────
1. Go to https://railway.app
2. Click "New Project"
3. Click "Deploy from GitHub repo"
4. Select "mobile-shop-app"
5. Click "Add variables" or go to the "Variables" tab
6. Add each variable by clicking "+ New Variable":

   PORT              = 5000
   MONGODB_URI       = (paste your full MongoDB URI from Notepad)
   JWT_SECRET        = myshop_super_secret_key_sudheer_1234567890_abcdefgh
   CLOUDINARY_CLOUD_NAME = (your cloud name)
   CLOUDINARY_API_KEY    = (your api key)
   CLOUDINARY_API_SECRET = (your api secret)
   HUGGINGFACE_TOKEN     = (your hf_ token)
   FRONTEND_URL      = https://placeholder.vercel.app

7. Go to "Settings" tab → find "Root Directory"
8. Type: backend
9. Click "Deploy" or it deploys automatically
10. Wait 3-5 minutes
11. Go to "Deployments" tab → click your deployment
12. You see a URL like: https://mobile-shop-app-production.up.railway.app
13. COPY this URL → save in Notepad as "Railway URL"

Test it:
14. Open new browser tab → paste your Railway URL
15. You should see: {"status":"running","message":"Mobile Shop API is running"}
    If you see this → backend is LIVE ✅

⚠️ IF RAILWAY DEPLOYMENT FAILS:
   Check the logs (click on the deployment → View Logs)
   Most common fix: Make sure Root Directory is set to "backend"

────────────────────────────────────────────────────────
STEP 23 — Deploy frontend to Vercel
────────────────────────────────────────────────────────
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Find "mobile-shop-app" → click "Import"
4. IMPORTANT settings:
   Framework Preset: Create React App
   Root Directory: Click "Edit" → type: frontend → click "Continue"
5. Expand "Environment Variables" section
6. Add this variable:
   Name: REACT_APP_API_URL
   Value: https://YOUR-RAILWAY-URL.up.railway.app/api
   (Use your actual Railway URL from Step 22 + /api at the end)
7. Click "Deploy"
8. Wait 3-4 minutes
9. You see "Congratulations!" screen
10. Your website URL is shown: https://mobile-shop-app-xxxx.vercel.app
11. COPY this URL → save as "Vercel URL"

────────────────────────────────────────────────────────
STEP 24 — Update Railway with your Vercel URL
────────────────────────────────────────────────────────
1. Go to Railway → your project → Variables tab
2. Find FRONTEND_URL
3. Change its value to your Vercel URL:
   https://mobile-shop-app-xxxx.vercel.app
4. Railway automatically redeploys (takes 1-2 min)

════════════════════════════════════════════════════════
PHASE 7 — FINAL TEST (Customer phone pouch search)
════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
STEP 25 — Complete test from start to finish
────────────────────────────────────────────────────────
Open your VERCEL URL in your phone browser.

TEST 1 — Register on the live site:
1. Go to your Vercel URL + /register
   Example: https://mobile-shop-app.vercel.app/register
2. Create a new account with your details
3. Login with those details
4. See your Dashboard ✅

TEST 2 — Add a phone pouch:
1. Click "+ Add Product"
2. Name: Redmi Note 10 Leather Pouch Brown
3. Device Model: Redmi Note 10
4. Category: Phone Pouch, Case Type: Leather
5. Price: 120, Quantity: 5
6. Shelf Location: Counter Box 2
7. Upload a photo
8. Click "Add Product" → success ✅

TEST 3 — Customer search test:
Customer says: "Do you have a case for Redmi Note 10?"
1. Click "Search" in navbar
2. Type: Redmi Note 10
3. Press Enter
4. See: Redmi Note 10 Leather Pouch Brown
5. See: price ₹120, location "Counter Box 2"
6. You know exactly where to find it in your shop ✅

TEST 4 — Visual search test:
Customer shows their phone, you don't know the model:
1. Click "📷 Visual" in navbar
2. Upload a photo of the phone
3. Click "Find Matching Cases"
4. See matching products with % similarity ✅

YOUR WEBSITE IS NOW FULLY WORKING AND LIVE!
Share your Vercel URL with anyone — works on any phone, anytime.

════════════════════════════════════════════════════════
COMPLETE ERROR REFERENCE — Every error with exact fix
════════════════════════════════════════════════════════

BACKEND ERRORS (when running node server.js):
─────────────────────────────────────────────
"Cannot find module './routes/auth.js'"
→ Files missing. Re-extract ZIP. Confirm routes folder has auth.js, products.js, search.js

"Authentication failed"
→ Wrong MongoDB password. Reset password in Atlas (no special characters). Update .env.

"Connection timed out"
→ Network Access not set. Atlas → Network Access → Allow from Anywhere (0.0.0.0/0)

"Cannot find module 'express'"
→ Run: npm install in the backend folder

"Port already in use"
→ Change PORT=5001 in .env. Change frontend .env to http://localhost:5001/api

FRONTEND ERRORS (when running npm start):
──────────────────────────────────────────
"Module not found: react-router-dom"
→ Run: npm install --legacy-peer-deps in frontend folder

Blank white page in browser:
→ Press F12 → Console tab → read the error → share it for help

"Network Error" when trying to login:
→ Backend server not running. Go to backend terminal → node server.js
→ OR wrong REACT_APP_API_URL in frontend .env

LOGIN/REGISTER ERRORS:
───────────────────────
Cannot find register page:
→ Go directly to: http://localhost:3000/register

"Account not yet approved":
→ Login as admin → go to /admin → approve the account

IMAGE UPLOAD ERRORS:
──────────────────────
"Cloudinary error" or image not saving:
→ Check all 3 Cloudinary values in .env are correct (no spaces, no quotes)

VISUAL SEARCH ERRORS:
───────────────────────
"AI service temporarily unavailable":
→ Wait 30 seconds → try again (Hugging Face is loading)

"No matches found":
→ Add products WITH photos first. Wait 2 minutes. Then search.

════════════════════════════════════════════════════════
EVERYTHING IS FREE — COST = ₹0
════════════════════════════════════════════════════════
MongoDB Atlas    FREE (512MB storage — holds 50,000+ products)
Cloudinary       FREE (25GB image storage — holds thousands of photos)
Railway          FREE ($5 credit/month — enough for small shop)
Vercel           FREE forever
GitHub           FREE forever
Hugging Face AI  FREE forever
Node.js & React  FREE forever (open source)

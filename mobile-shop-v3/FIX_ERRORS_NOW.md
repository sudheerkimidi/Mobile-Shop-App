# FIX YOUR 3 ERRORS — Complete Solution
# Read this fully before doing anything

════════════════════════════════════════════════════════════
WHAT YOUR 3 ERROR SCREENSHOTS MEAN
════════════════════════════════════════════════════════════

ERROR 1 (Image 1): "uri parameter must be a string, got undefined"
→ Meaning: MONGODB_URI is not being read from your .env file at all.
→ Cause: .env file is in wrong place, OR named wrong, OR .env content is wrong.

ERROR 2 (Image 2): "bad auth: authentication failed"  
→ Meaning: .env is loading but username or password is WRONG.
→ Cause: Wrong password in MONGODB_URI, OR special characters in password.

ERROR 3 (Image 3): "connect ECONNREFUSED 127.0.0.1:27017"
→ Meaning: MongoDB is trying to connect to YOUR computer instead of Atlas.
→ Cause: MONGODB_URI is not set so mongoose defaults to localhost.
→ This is the SAME problem as Error 1 — .env not loading.

════════════════════════════════════════════════════════════
ALL 3 ERRORS HAVE THE SAME ROOT CAUSE:
Your .env file is not being read correctly.
════════════════════════════════════════════════════════════

FOLLOW THESE STEPS IN EXACT ORDER:

────────────────────────────────────────────────────────────
STEP A — Delete everything and start fresh with the new ZIP
────────────────────────────────────────────────────────────
1. Find your old folder: C:\Users\admin\mobile-shop-platform
2. DELETE it completely (right-click → Delete)
3. Find the NEW ZIP file: mobile-shop-FIXED-V2.zip
4. Right-click → "Extract All"
5. Extract to: C:\Users\admin\Desktop
6. You now have folder: C:\Users\admin\Desktop\mobile-shop
7. Open VS Code
8. File → Open Folder → select the "backend" folder inside mobile-shop
9. VS Code shows backend files on the left panel

────────────────────────────────────────────────────────────
STEP B — Create .env file CORRECTLY (most important step)
────────────────────────────────────────────────────────────

CRITICAL RULE: The .env file must be INSIDE the backend folder.
Not inside mobile-shop. Not on Desktop. INSIDE backend.

Path must be: C:\Users\admin\Desktop\mobile-shop\backend\.env

How to create it in VS Code:
1. Look at the left panel in VS Code — you see files listed
2. Right-click on empty space in the left panel
3. Click "New File"
4. Type: .env
5. Press Enter
6. The file opens (it will be empty and show on left panel)

Now type these lines EXACTLY (no spaces around =, no quotes):

PORT=5000
MONGODB_URI=mongodb+srv://shopuser:YOUR_ATLAS_PASSWORD@cluster0.deg6fg1.mongodb.net/mobileshop?retryWrites=true&w=majority
JWT_SECRET=myshopsecretkey1234567890abcdefghijklmnop
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
HUGGINGFACE_TOKEN=hf_your_token
FRONTEND_URL=http://localhost:3000

REPLACE "YOUR_ATLAS_PASSWORD" with your real password.
REPLACE "deg6fg1" with YOUR actual cluster ID from Atlas.

7. Press Ctrl+S to save

HOW TO GET YOUR EXACT MONGODB URI FROM ATLAS:
1. Go to https://cloud.mongodb.com
2. Click your cluster "Cluster0"  
3. Click "Connect" button
4. Click "Drivers"
5. Select Driver: Node.js
6. You see the connection string — COPY THE ENTIRE STRING
7. It looks like:
   mongodb+srv://shopuser:<password>@cluster0.deg6fg1.mongodb.net/?appName=Cluster0
8. Replace <password> with your actual password
9. Add "mobileshop" after the "/" and before "?":
   mongodb+srv://shopuser:actualpassword@cluster0.deg6fg1.mongodb.net/mobileshop?retryWrites=true&w=majority
10. Paste this as your MONGODB_URI in .env

PASSWORD RULES (VERY IMPORTANT):
✅ Use ONLY letters and numbers: Shop12345
❌ Do NOT use: @ # $ % ! & * ( ) spaces
If your password has any of these → reset it to a simple one

HOW TO RESET MONGODB PASSWORD:
1. Atlas → Database Access → click EDIT on your user
2. Click "Edit Password"
3. Type new password: Shop12345
4. Click "Update User" 
5. Wait 30 seconds
6. Update .env with new password

────────────────────────────────────────────────────────────
STEP C — Run the diagnostic tools (included in the new ZIP)
────────────────────────────────────────────────────────────

Open Command Prompt:
Press Windows key → type "cmd" → Enter

Go to your backend folder:
cd C:\Users\admin\Desktop\mobile-shop\backend

Run ENV checker first:
node checkenv.js

READ the output. It will tell you exactly what is wrong.

If all items show ✅, run the connection test:
node testconnection.js

READ the output. It will tell you exactly what to fix.

If both show ✅ SUCCESS, start the server:
node server.js

You should see:
  🚀 Server running on port 5000
  ✅ MongoDB connected successfully!

────────────────────────────────────────────────────────────
STEP D — If MongoDB STILL fails — use this alternate approach
────────────────────────────────────────────────────────────

If you tried everything and MongoDB Atlas still won't connect,
use this completely free alternative: MongoDB with direct password in URI

Create a new database user in Atlas with these EXACT settings:
1. Database Access → Add New Database User
2. Authentication Method: Password
3. Username: admin
4. Password: Admin1234  (exactly this — simple, no special chars)
5. Database User Privileges: Atlas Admin
6. Click "Add User"

Then your MONGODB_URI becomes:
MONGODB_URI=mongodb+srv://admin:Admin1234@cluster0.YOURCLUSTERID.mongodb.net/mobileshop?retryWrites=true&w=majority

Replace YOURCLUSTERID with your actual cluster ID from Atlas connect screen.

════════════════════════════════════════════════════════════
COMPLETE .ENV FILE EXAMPLE (fill in your real values)
════════════════════════════════════════════════════════════

Copy this exactly into your .env file, replacing values:

PORT=5000
MONGODB_URI=mongodb+srv://admin:Admin1234@cluster0.YOURCLUSTERID.mongodb.net/mobileshop?retryWrites=true&w=majority
JWT_SECRET=myshopsecretkey1234567890abcdefghijklmnop
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_number_here
CLOUDINARY_API_SECRET=your_api_secret_here
HUGGINGFACE_TOKEN=hf_your_token_here
FRONTEND_URL=http://localhost:3000

Replace:
- YOURCLUSTERID → from Atlas connect screen (e.g. deg6fg1)
- your_cloud_name_here → from Cloudinary dashboard
- your_api_key_number_here → from Cloudinary dashboard
- your_api_secret_here → from Cloudinary dashboard
- hf_your_token_here → from Hugging Face settings

════════════════════════════════════════════════════════════
VERIFY NETWORK ACCESS IN ATLAS
════════════════════════════════════════════════════════════

This MUST be done or Error 3 keeps coming:
1. https://cloud.mongodb.com → Network Access (left menu)
2. DELETE all existing entries
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere"
5. Click "Confirm"
6. Wait 2 minutes for it to activate (status shows "Active")

════════════════════════════════════════════════════════════
AFTER SERVER STARTS — NEXT STEPS
════════════════════════════════════════════════════════════

Once you see:
  🚀 Server running on port 5000
  ✅ MongoDB connected successfully!

Keep that terminal OPEN and open a NEW terminal:
  cd C:\Users\admin\Desktop\mobile-shop\frontend
  npm install
  npm start

Browser opens at http://localhost:3000
Go to http://localhost:3000/register
Create your first account → login → your app is working!

════════════════════════════════════════════════════════════

# 🚀 Quick Start Guide - OTP Verification System

## ✅ Setup Complete!

Your OTP verification system is now ready to use. Follow these simple steps:

## Step 1: Start the Backend Server

Open a new terminal and run:

```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:3000
📝 API Endpoints:
   POST /api/send-otp
   POST /api/verify-otp
   POST /api/resend-otp
   GET  /api/health
```

## Step 2: Open the Website

Open `index.html` in your browser or run:

```bash
# PowerShell
Invoke-Item index.html

# Or just double-click index.html
```

## Step 3: Test the OTP Flow

1. Click **"Enquiry Now"** button
2. Enter a 10-digit phone number (starting with 6-9)
3. Click **"Send OTP"**
4. Check the **server console** for the generated OTP
5. Enter the 6-digit OTP
6. Click **"Verify OTP"**
7. **Fill out the enquiry form** with your details:
   - Name
   - Email
   - Answer quick questions (optional)
8. Click **"Submit Enquiry!!!"**
9. Success! ✅

## 📱 SMS Integration (Optional)

Currently, OTPs are only logged to the console for testing. To send real SMS:

### Option 1: Fast2SMS (India - Easy & Free)

1. Sign up at https://www.fast2sms.com
2. Get free SMS credits
3. Copy your API Key
4. Update `server.js` line 36:

```javascript
// Uncomment and add your API key:
const axios = require('axios');
const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
    variables_values: otp,
    route: 'otp',
    numbers: phoneNumber.replace('+91', '')
}, {
    headers: {
        'authorization': 'YOUR_FAST2SMS_API_KEY'
    }
});
```

5. Install axios: `npm install axios`

### Option 2: Twilio (International)

1. Sign up at https://www.twilio.com
2. Get $15 free credit
3. Update `server.js` with Twilio code (already commented in file)
4. Install: `npm install twilio`

### Option 3: MSG91 (India - Professional)

1. Sign up at https://msg91.com
2. Create OTP template
3. Update `server.js` with MSG91 code
4. Install: `npm install axios`

## 🎯 Testing Tips

**For Development:**
- OTP is printed in server console
- Check console output after clicking "Send OTP"
- OTP expires in 5 minutes
- Maximum 3 verification attempts
- Wait 60 seconds between resend requests

**Valid Phone Numbers:**
- Must start with 6, 7, 8, or 9
- Must be exactly 10 digits
- Example: 9876543210, 8765432109

## 🔍 Troubleshooting

### "Network error" message:
1. Make sure server is running: `npm start`
2. Check server URL in index.html (line 1708): `http://localhost:3000/api`
3. Browser console for detailed errors (F12)

### OTP not received in console:
1. Check server terminal for logs
2. Look for: `📱 Sending OTP 123456 to +919876543210`

### CORS errors:
- Server has CORS enabled by default
- If issues persist, check browser console

### Can't verify OTP:
1. Copy OTP from server console
2. Make sure OTP hasn't expired (5 minutes)
3. Check you haven't exceeded 3 attempts

## 📂 Project Structure

```
landing_website/
├── index.html          # Frontend with OTP form
├── server.js           # Backend API server
├── package.json        # Node.js dependencies
├── README_OTP.md       # Detailed documentation
├── QUICKSTART.md       # This file
└── .env.example        # Environment variables template
```

## 🚀 Deployment

### Deploy Backend to Production:

**Option 1: Heroku (Free)**
```bash
# Install Heroku CLI
heroku create your-app-name
git push heroku main
heroku ps:scale web=1
```

**Option 2: Railway (Free, Easy)**
1. Go to https://railway.app
2. Connect GitHub repo
3. Deploy automatically

**Option 3: DigitalOcean/AWS**
1. Create a server
2. Install Node.js
3. Clone repo
4. Run: `npm install && npm start`
5. Use PM2 for process management

### Update Frontend:
After deploying backend, update `index.html` line 1708:

```javascript
const API_URL = 'https://your-backend-url.com/api';
```

## 📊 Features Implemented

✅ Secure OTP generation (crypto.randomInt)
✅ 5-minute expiration
✅ 3 verification attempts
✅ Rate limiting (60s between requests)
✅ Automatic cleanup
✅ Beautiful modal UI
✅ Loading states
✅ Error handling
✅ Resend functionality
✅ Auto-focus OTP inputs
✅ Paste OTP support

## 📞 Need Help?

1. Check `README_OTP.md` for detailed docs
2. Review server console logs
3. Check browser console (F12)
4. Verify phone number format

## 🎉 You're All Set!

Your OTP verification system is production-ready. Just add SMS integration for real-world use!

---

**Server running?** ✓ Check terminal
**Website open?** ✓ Click index.html  
**OTP in console?** ✓ Check server logs
**Ready to go!** 🚀

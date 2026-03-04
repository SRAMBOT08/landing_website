# OTP Verification System

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your SMS provider credentials:

```bash
cp .env.example .env
```

### 3. Choose and Configure SMS Provider

#### Option A: Twilio (Recommended for International)

1. Sign up at https://www.twilio.com
2. Get your Account SID and Auth Token
3. Buy a phone number
4. Update `.env` with Twilio credentials

#### Option B: MSG91 (Good for India)

1. Sign up at https://msg91.com
2. Get your Auth Key
3. Create an OTP template
4. Update `.env` with MSG91 credentials

#### Option C: Fast2SMS (India Only)

1. Sign up at https://www.fast2sms.com
2. Get your API Key
3. Update `.env` with Fast2SMS credentials

### 4. Update server.js with SMS Integration

Uncomment and configure the SMS provider section in `server.js` based on your choice.

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start at `http://localhost:3000`

## API Endpoints

### Send OTP
```
POST /api/send-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

### Verify OTP
```
POST /api/verify-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

### Resend OTP
```
POST /api/resend-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP resent successfully"
}
```

## Features

- ✅ Secure OTP generation using crypto module
- ✅ 5-minute OTP expiry
- ✅ Maximum 3 verification attempts
- ✅ Rate limiting (1 minute between OTP requests)
- ✅ Automatic cleanup of expired OTPs
- ✅ CORS enabled for frontend integration
- ✅ Support for multiple SMS providers

## Testing

For development/testing, the OTP is logged to the console. Check the server logs to see the generated OTP.

In production, remove console.log statements and implement proper logging.

## Production Considerations

1. **Use Redis** instead of in-memory Map for OTP storage
2. **Add rate limiting** middleware (express-rate-limit)
3. **Implement proper logging** (Winston, Morgan)
4. **Add request validation** (express-validator)
5. **Use environment-based configuration**
6. **Add HTTPS/SSL** for secure communication
7. **Implement user database** to store verified phone numbers
8. **Add monitoring** (PM2, New Relic)
9. **Set up SMS delivery tracking**
10. **Implement backup SMS provider** for failover

## Security Best Practices

- Never expose OTPs in API responses
- Use HTTPS in production
- Implement rate limiting
- Add IP-based restrictions if needed
- Log all OTP operations for audit
- Monitor for suspicious patterns
- Use strong random number generation
- Implement CAPTCHA for additional security

## Deployment

### Option 1: Traditional Server (VPS, AWS EC2)
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "otp-server"
pm2 save
pm2 startup
```

### Option 2: Serverless (AWS Lambda, Vercel, Netlify)
- Create separate functions for each endpoint
- Use AWS DynamoDB or MongoDB Atlas for OTP storage

### Option 3: Docker
```bash
docker build -t otp-server .
docker run -p 3000:3000 otp-server
```

## Troubleshooting

**OTP not received:**
- Check SMS provider credentials
- Verify phone number format
- Check SMS provider balance
- Review server logs for errors

**OTP expired:**
- Default expiry is 5 minutes
- Adjust OTP_EXPIRY_TIME in server.js if needed

**Rate limiting issues:**
- Wait 60 seconds between OTP requests
- Clear cache if testing repeatedly

## Support

For issues or questions, check:
- Server console logs
- SMS provider dashboard
- Network/CORS issues in browser console

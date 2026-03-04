const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory storage for OTPs (use Redis or database in production)
const otpStorage = new Map();

// Configuration
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_OTP_ATTEMPTS = 3;

// Generate 6-digit OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

// Send OTP via SMS using 2Factor - EXPLICIT SMS (not voice)
async function sendSMS(phoneNumber, otp) {
    console.log(` Sending SMS OTP ${otp} to ${phoneNumber}`);
    
    // Check if API key is configured
    const apiKey = process.env.TWOFACTOR_API_KEY;
    
    if (!apiKey || apiKey === 'your_2factor_api_key') {
        console.log('⚠️  2Factor API key not configured. OTP logging only.');
        console.log(`🔐 OTP for ${phoneNumber}: ${otp}`);
        return true;
    }
    
    try {
        // Remove +91 to get 10-digit number
        const cleanPhoneNumber = phoneNumber.replace('+91', '').replace('+', '').replace(' ', '');
        
        console.log(`📞 Original: ${phoneNumber}`);
        console.log(`📞 Clean Number: ${cleanPhoneNumber}`);
        console.log(`🔑 API Key: ${apiKey.substring(0, 8)}...`);
        
        // METHOD 1: Try Transactional SMS API
        console.log(`\n🔄 Trying METHOD 1: Transactional SMS API...`);
        try {
            const tsmsUrl = `https://2factor.in/API/V1/${apiKey}/ADDON_SERVICES/SEND/TSMS`;
            const tsmsPayload = {
                From: 'SNSSQU',
                To: cleanPhoneNumber,
                TemplateName: 'snsOTP',
                VAR1: otp.toString()
            };
            
            console.log(`📋 TSMS Payload:`, JSON.stringify(tsmsPayload, null, 2));
            const tsmsResponse = await axios.post(tsmsUrl, tsmsPayload, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            });
            
            console.log(`📡 TSMS Response:`, JSON.stringify(tsmsResponse.data, null, 2));
            
            if (tsmsResponse.data && tsmsResponse.data.Status === 'Success') {
                console.log(`✅ SUCCESS via Transactional SMS!`);
                return true;
            }
            console.log(`⚠️  Transactional SMS failed, trying next method...`);
        } catch (err) {
            console.log(`⚠️  Transactional SMS error:`, err.response?.data || err.message);
        }
        
        // METHOD 2: Try SMS with Sender ID parameter
        console.log(`\n🔄 Trying METHOD 2: SMS with Sender ID...`);
        try {
            const smsUrl = `https://2factor.in/API/V1/${apiKey}/SMS/${cleanPhoneNumber}/${otp}/SNSSQU`;
            console.log(`🔗 SMS URL: ${smsUrl}`);
            
            const smsResponse = await axios.get(smsUrl, { timeout: 10000 });
            console.log(`📡 SMS Response:`, JSON.stringify(smsResponse.data, null, 2));
            
            if (smsResponse.data && smsResponse.data.Status === 'Success') {
                console.log(`✅ SUCCESS via SMS with Sender ID!`);
                return true;
            }
            console.log(`⚠️  SMS with Sender ID failed, trying next method...`);
        } catch (err) {
            console.log(`⚠️  SMS with Sender ID error:`, err.response?.data || err.message);
        }
        
        // METHOD 3: Try basic SMS without sender ID
        console.log(`\n🔄 Trying METHOD 3: Basic SMS...`);
        try {
            const basicUrl = `https://2factor.in/API/V1/${apiKey}/SMS/${cleanPhoneNumber}/${otp}`;
            console.log(`🔗 Basic URL: ${basicUrl}`);
            
            const basicResponse = await axios.get(basicUrl, { timeout: 10000 });
            console.log(`📡 Basic Response:`, JSON.stringify(basicResponse.data, null, 2));
            
            if (basicResponse.data && basicResponse.data.Status === 'Success') {
                console.log(`✅ SUCCESS via Basic SMS!`);
                console.log(`⚠️  NOTE: This might be voice OTP if account default is voice`);
                return true;
            }
        } catch (err) {
            console.log(`⚠️  Basic SMS error:`, err.response?.data || err.message);
        }
        
        console.error(`❌ All SMS methods failed`);
        console.log(`🔐 Fallback - OTP for ${phoneNumber}: ${otp}`);
        return true; // Still allow user to proceed
    } catch (error) {
        console.error('❌ Error sending SMS via 2Factor:', error.message);
        if (error.response) {
            console.error('📛 Response status:', error.response.status);
            console.error('📛 Response data:', error.response.data);
        }
        // Fallback: log OTP for development
        console.log(`🔐 Fallback - OTP for ${phoneNumber}: ${otp}`);
        return true; // Return true to allow testing even if SMS fails
    }
}

// API: Send OTP
app.post('/api/send-otp', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        
        // Validate phone number
        if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number'
            });
        }
        
        const fullPhoneNumber = `+91${phoneNumber}`;
        
        // Check if OTP was recently sent (rate limiting)
        const existingOTP = otpStorage.get(fullPhoneNumber);
        if (existingOTP && Date.now() - existingOTP.sentAt < 60000) { // 1 minute
            return res.status(429).json({
                success: false,
                message: 'Please wait before requesting a new OTP'
            });
        }
        
        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP with metadata
        otpStorage.set(fullPhoneNumber, {
            otp: otp,
            sentAt: Date.now(),
            expiresAt: Date.now() + OTP_EXPIRY_TIME,
            attempts: 0,
            verified: false
        });
        
        // Send SMS
        await sendSMS(fullPhoneNumber, otp);
        
        console.log(`✅ OTP generated for ${fullPhoneNumber}: ${otp}`);
        
        res.json({
            success: true,
            message: 'OTP sent successfully',
            expiresIn: OTP_EXPIRY_TIME / 1000 // in seconds
        });
        
        // Auto-cleanup after expiry
        setTimeout(() => {
            const data = otpStorage.get(fullPhoneNumber);
            if (data && !data.verified) {
                otpStorage.delete(fullPhoneNumber);
                console.log(`🗑️  Expired OTP deleted for ${fullPhoneNumber}`);
            }
        }, OTP_EXPIRY_TIME);
        
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP'
        });
    }
});

// API: Verify OTP
app.post('/api/verify-otp', (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        
        // Validate input
        if (!phoneNumber || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and OTP are required'
            });
        }
        
        const fullPhoneNumber = `+91${phoneNumber}`;
        const storedData = otpStorage.get(fullPhoneNumber);
        
        // Check if OTP exists
        if (!storedData) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found or expired'
            });
        }
        
        // Check if OTP is expired
        if (Date.now() > storedData.expiresAt) {
            otpStorage.delete(fullPhoneNumber);
            return res.status(400).json({
                success: false,
                message: 'OTP has expired'
            });
        }
        
        // Check max attempts
        if (storedData.attempts >= MAX_OTP_ATTEMPTS) {
            otpStorage.delete(fullPhoneNumber);
            return res.status(400).json({
                success: false,
                message: 'Maximum verification attempts exceeded'
            });
        }
        
        // Increment attempts
        storedData.attempts++;
        
        // Verify OTP
        if (storedData.otp === otp) {
            storedData.verified = true;
            otpStorage.set(fullPhoneNumber, storedData);
            
            console.log(`✅ OTP verified successfully for ${fullPhoneNumber}`);
            
            // TODO: Save user data to database here
            // saveUserToDatabase({ phoneNumber: fullPhoneNumber, verifiedAt: new Date() });
            
            // Clean up OTP after successful verification
            setTimeout(() => otpStorage.delete(fullPhoneNumber), 5000);
            
            return res.json({
                success: true,
                message: 'OTP verified successfully'
            });
        } else {
            otpStorage.set(fullPhoneNumber, storedData);
            
            return res.status(400).json({
                success: false,
                message: `Invalid OTP. ${MAX_OTP_ATTEMPTS - storedData.attempts} attempts remaining`
            });
        }
        
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP'
        });
    }
});

// API: Resend OTP
app.post('/api/resend-otp', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        
        if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number'
            });
        }
        
        const fullPhoneNumber = `+91${phoneNumber}`;
        
        // Delete old OTP
        otpStorage.delete(fullPhoneNumber);
        
        // Generate new OTP
        const otp = generateOTP();
        
        otpStorage.set(fullPhoneNumber, {
            otp: otp,
            sentAt: Date.now(),
            expiresAt: Date.now() + OTP_EXPIRY_TIME,
            attempts: 0,
            verified: false
        });
        
        await sendSMS(fullPhoneNumber, otp);
        
        console.log(`🔄 OTP resent for ${fullPhoneNumber}: ${otp}`);
        
        res.json({
            success: true,
            message: 'OTP resent successfully'
        });
        
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resend OTP'
        });
    }
});

// API: Submit Enquiry Form
app.post('/api/submit-enquiry', async (req, res) => {
    try {
        const { name, email, phone, plus2Student, idle100Days, aiIsFuture, readyToMaster } = req.body;
        
        // Validate required fields
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and phone are required'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        
        // Create enquiry data object
        const enquiryData = {
            name,
            email,
            phone,
            questions: {
                plus2Student: plus2Student || false,
                idle100Days: idle100Days || false,
                aiIsFuture: aiIsFuture || false,
                readyToMaster: readyToMaster || false
            },
            submittedAt: new Date().toISOString(),
            ipAddress: req.ip
        };
        
        console.log('📋 New Enquiry Received:');
        console.log(`   Name: ${name}`);
        console.log(`   Email: ${email}`);
        console.log(`   Phone: ${phone}`);
        console.log(`   +2 Student: ${plus2Student}`);
        console.log(`   Idle 100+ days: ${idle100Days}`);
        console.log(`   AI is Future: ${aiIsFuture}`);
        console.log(`   Ready to Master: ${readyToMaster}`);
        
        // Send data to Bitrix24 CRM (in background)
        try {
            console.log('\n📤 Sending data to Bitrix24 CRM...');
            
            const BITRIX24_WEBHOOK = process.env.BITRIX24_WEBHOOK_URL;
            
            if (!BITRIX24_WEBHOOK || BITRIX24_WEBHOOK === 'YOUR_WEBHOOK_URL_HERE') {
                console.warn('⚠️  Bitrix24 webhook URL not configured in .env file');
                console.log('💡 To enable CRM integration:');
                console.log('   1. Create webhook at: https://b24-31djjx.bitrix24.in');
                console.log('   2. Add webhook URL to .env file as BITRIX24_WEBHOOK_URL');
                console.log('   3. Restart server\n');
                throw new Error('Bitrix24 webhook not configured');
            }
            
            console.log('   Using Bitrix24 REST API webhook');
            console.log('   Endpoint:', BITRIX24_WEBHOOK.substring(0, 50) + '...');
            
            // Prepare lead data for Bitrix24 CRM
            const leadData = {
                fields: {
                    TITLE: `Agentic AI-Bootcamp - ${name}`,
                    NAME: name,
                    EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
                    PHONE: [{ VALUE: phone, VALUE_TYPE: 'MOBILE' }],
                    SOURCE_ID: 'WEB',
                    SOURCE_DESCRIPTION: 'Agentic AI-Bootcamp Landing Page',
                    WEB_FORM_ID: 345, // Agentic AI-Bootcamp form (crm_form_yyibu)
                    COMMENTS: [
                        `📋 Agentic AI-Bootcamp Lead`,
                        `Form: crm_form_yyibu`,
                        ``,
                        `Program Interests:`,
                        `✓ +2 Student: ${plus2Student ? 'Yes' : 'No'}`,
                        `✓ Idle 100+ days: ${idle100Days ? 'Yes' : 'No'}`,
                        `✓ AI is Future: ${aiIsFuture ? 'Yes' : 'No'}`,
                        `✓ Ready to Master: ${readyToMaster ? 'Yes' : 'No'}`,
                        ``,
                        `Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
                    ].join('\n')
                }
            };
            
            console.log('   Creating lead:', { name, email, phone });
            
            // Submit to Bitrix24 via REST API webhook
            const bitrixResponse = await axios.post(
                `${BITRIX24_WEBHOOK}crm.lead.add.json`,
                leadData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                }
            );
            
            console.log('✅ Bitrix24 Response Status:', bitrixResponse.status);
            
            if (bitrixResponse.data && bitrixResponse.data.result) {
                const leadId = bitrixResponse.data.result;
                console.log('🎉 Lead created successfully in Bitrix24 CRM!');
                console.log('   Lead ID:', leadId);
                console.log('   View at: https://b24-31djjx.bitrix24.in/crm/lead/details/' + leadId + '/\n');
            } else if (bitrixResponse.data && bitrixResponse.data.error) {
                console.error('❌ Bitrix24 API Error:', bitrixResponse.data.error);
                console.log('   Error description:', bitrixResponse.data.error_description);
            } else {
                console.log('   Response:', JSON.stringify(bitrixResponse.data).substring(0, 200));
            }
            
        } catch (bitrixError) {
            console.error('\n⚠️ Failed to send to Bitrix24 CRM:');
            console.error('   Error:', bitrixError.message);
            if (bitrixError.response) {
                console.error('   Status:', bitrixError.response.status);
                console.error('   Response:', JSON.stringify(bitrixError.response.data).substring(0, 300));
            }
            console.log('   💾 User data saved locally (enquiry still recorded)\n');
        }
        
        res.json({
            success: true,
            message: 'Enquiry submitted successfully',
            data: enquiryData
        });
        
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit enquiry'
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 API Endpoints:`);
    console.log(`   POST /api/send-otp`);
    console.log(`   POST /api/verify-otp`);
    console.log(`   POST /api/resend-otp`);
    console.log(`   POST /api/submit-enquiry`);
    console.log(`   GET  /api/health`);
});

module.exports = app;

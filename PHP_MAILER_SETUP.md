# PHP Mailer Email Automation Setup

## 📋 Requirements
- Web hosting with PHP support (not for local testing)
- Gmail account
- PHPMailer library

## 🚀 Installation Steps

### Step 1: Download PHPMailer
1. Go to: https://github.com/PHPMailer/PHPMailer/releases
2. Download the latest release (ZIP file)
3. Extract the ZIP file
4. Copy the `PHPMailer` folder (containing src/ folder) to your project root:
   ```
   landing_website/
   ├── PHPMailer/
   │   └── src/
   │       ├── PHPMailer.php
   │       ├── SMTP.php
   │       └── Exception.php
   ├── send-email.php
   └── index.html
   ```

### Step 2: Get Gmail App Password
1. Go to your Google Account: https://myaccount.google.com
2. Click "Security" (left sidebar)
3. Enable "2-Step Verification" if not already enabled
4. Search for "App passwords" in the search bar
5. Click "App passwords"
6. Select:
   - App: "Mail"
   - Device: "Other" (type: "SNS Website")
7. Click "Generate"
8. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
9. **IMPORTANT:** Remove spaces, use as: `abcdefghijklmnop`

### Step 3: Configure send-email.php
Open `send-email.php` and update these lines:

```php
$GMAIL_EMAIL = 'your-email@gmail.com';  // Your Gmail address
$GMAIL_APP_PASSWORD = 'abcdefghijklmnop';  // The 16-char password from Step 2
$ADMIN_EMAIL = 'admin@snsinstitutions.com';  // Where you want to receive enquiries
```

### Step 4: Upload to Server
Upload these files to your web hosting:
- `index.html`
- `send-email.php`
- `PHPMailer/` folder
- All other website files (css, js, img folders)

### Step 5: Test
1. Visit your website URL
2. Click "Enquiry Now"
3. Fill the form and submit
4. Check:
   - Admin email receives the enquiry
   - User receives confirmation email

## 🔧 Alternative: Using Composer (Advanced)

If your server has Composer installed:

```bash
composer require phpmailer/phpmailer
```

Then update `send-email.php` line 6:
```php
require 'vendor/autoload.php';
```

And comment out lines 11-13.

## ⚠️ Important Notes

1. **Will NOT work locally** - PHP requires a server
2. **Use App Password, NOT your Gmail password**
3. **Enable 2-Step Verification** in Gmail first
4. **Check spam folder** if emails don't arrive
5. **Gmail limit:** 500 emails/day on free accounts

## 🧪 Testing Locally (Optional)

To test on your computer before uploading:

1. Install XAMPP/WAMP/MAMP
2. Place project in `htdocs/` folder
3. Start Apache server
4. Visit: `http://localhost/landing_website/`

## 📧 What Happens When Form Submits

1. User fills form
2. PHP receives data
3. **Email 1:** Sent to admin@snsinstitutions.com with enquiry details
4. **Email 2:** Auto-reply sent to user's email
5. Success message shown in modal

## 🐛 Troubleshooting

**Problem:** "Email could not be sent"
- Check Gmail App Password is correct (no spaces)
- Verify 2-Step Verification is enabled
- Check server has internet connection

**Problem:** Emails go to spam
- Add your domain to SPF records
- Use a professional email instead of Gmail for production

**Problem:** Form doesn't submit
- Check PHP is enabled on server
- Verify file path to PHPMailer is correct
- Check browser console for errors

## ✅ All Done!

Your form now:
✓ Sends enquiry to admin email
✓ Sends confirmation to user
✓ Shows success/error messages
✓ Works on any PHP hosting

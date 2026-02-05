<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Composer autoload (if using Composer)
// require 'vendor/autoload.php';

// If not using Composer, download PHPMailer manually and include these:
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Configuration - UPDATE THESE VALUES
$GMAIL_EMAIL = 'lokeshkumarns199@gmail.com';  // Your Gmail address
$GMAIL_APP_PASSWORD = 'zgcjkdceoxzobbqu';  // Gmail App Password (16 characters)
$ADMIN_EMAIL = 'lokeshkumar19.4.2007@gmail.com';  // Where to receive enquiries

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Get form data
    $name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
    $email = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : '';
    $plus2_student = isset($_POST['plus2_student']) ? 'Yes' : 'No';
    $days_idle = isset($_POST['100_days_idle']) ? 'Yes' : 'No';
    $ai_future = isset($_POST['ai_future']) ? 'Yes' : 'No';
    $ready_100_days = isset($_POST['ready_100_days']) ? 'Yes' : 'No';
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($phone)) {
        echo json_encode(['success' => false, 'message' => 'Please fill all required fields']);
        exit;
    }
    
    try {
        // ==================================================
        // EMAIL 1: Send to Admin (You)
        // ==================================================
        $mail_admin = new PHPMailer(true);
        
        // Server settings
        $mail_admin->isSMTP();
        $mail_admin->Host = 'smtp.gmail.com';
        $mail_admin->SMTPAuth = true;
        $mail_admin->Username = $GMAIL_EMAIL;
        $mail_admin->Password = $GMAIL_APP_PASSWORD;
        $mail_admin->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail_admin->Port = 587;
        
        // Recipients
        $mail_admin->setFrom($GMAIL_EMAIL, 'SNS Website Form');
        $mail_admin->addAddress($ADMIN_EMAIL);
        $mail_admin->addReplyTo($email, $name);
        
        // Content
        $mail_admin->isHTML(true);
        $mail_admin->Subject = "New Enquiry from $name";
        $mail_admin->Body = "
            <h2>New GenAI Course Enquiry</h2>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Phone:</strong> $phone</p>
            <hr>
            <h3>Questions Answered:</h3>
            <ul>
                <li><strong>Are you a +2 student?</strong> $plus2_student</li>
                <li><strong>Are you going to be idle for 100+ days?</strong> $days_idle</li>
                <li><strong>Is AI and Agentic AI the future?</strong> $ai_future</li>
                <li><strong>Ready to master AI in 100 days?</strong> $ready_100_days</li>
            </ul>
        ";
        
        $mail_admin->send();
        
        // ==================================================
        // EMAIL 2: Auto-reply to User
        // ==================================================
        $mail_user = new PHPMailer(true);
        
        // Server settings
        $mail_user->isSMTP();
        $mail_user->Host = 'smtp.gmail.com';
        $mail_user->SMTPAuth = true;
        $mail_user->Username = $GMAIL_EMAIL;
        $mail_user->Password = $GMAIL_APP_PASSWORD;
        $mail_user->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail_user->Port = 587;
        
        // Recipients
        $mail_user->setFrom($GMAIL_EMAIL, 'SNS Institutions');
        $mail_user->addAddress($email, $name);
        
        // Content
        $mail_user->isHTML(true);
        $mail_user->Subject = 'Thank you for enquiring about GenAI course - SNS Institutions';
        $mail_user->Body = "
            <p>Hi <strong>$name</strong>,</p>
            <p>Thank you for enquiring about the GenAI course by Analytics Vidhya at SNS Institutions.</p>
            <p>You've taken a great step toward upskilling yourself in the exciting world of Artificial Intelligence and Generative AI.</p>
            <p>Our Enrollment Executive will contact you shortly with further details.</p>
            <br>
            <p>Best regards,<br><strong>Team SNS Institutions</strong></p>
        ";
        
        $mail_user->send();
        
        echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => "Email could not be sent. Error: {$mail_admin->ErrorInfo}"]);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>

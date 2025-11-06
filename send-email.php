<?php
/**
 * Contact Form Handler using PHPMailer
 * Handles form submissions from contact-us.html and modal forms
 */

// Start session for error handling
session_start();

// Set headers for JSON response
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only POST requests are accepted.'
    ]);
    exit;
}

// Load PHPMailer
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load configuration
$config = require __DIR__ . '/config.php';

// Function to sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validateEmail($email) {
    // First check with filter_var
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    
    // Additional strict validation with regex
    // Email pattern: local-part@domain
    // Local part: letters, numbers, dots, hyphens, underscores, plus signs
    // Domain: letters, numbers, dots, hyphens
    // Must have @ symbol and valid domain with TLD
    $pattern = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
    
    if (!preg_match($pattern, $email)) {
        return false;
    }
    
    // Additional checks
    // Must not start or end with dot, hyphen, or underscore
    $localPart = explode('@', $email)[0];
    $domain = explode('@', $email)[1];
    
    if (preg_match('/^[._-]|[._-]$/', $localPart)) {
        return false;
    }
    
    if (preg_match('/^[.-]|[.-]$/', $domain)) {
        return false;
    }
    
    // Domain must have at least one dot (for TLD)
    if (strpos($domain, '.') === false) {
        return false;
    }
    
    // TLD must be at least 2 characters
    $tld = substr($domain, strrpos($domain, '.') + 1);
    if (strlen($tld) < 2) {
        return false;
    }
    
    return true;
}

// Function to validate name (only letters and spaces)
function validateName($name) {
    // Allow letters (including accented characters) and spaces only
    return preg_match("/^[\p{L}\s]+$/u", $name);
}

// Function to validate UAE phone number
function validateUAEPhone($phone) {
    if (empty($phone)) {
        return true; // Phone is optional, so empty is valid
    }
    
    // Remove all spaces, dashes, and parentheses for validation
    $cleaned = preg_replace('/[\s\-\(\)]/', '', $phone);
    
    // UAE phone number patterns:
    // +971XXXXXXXXX (12 digits starting with +971)
    // 971XXXXXXXXX (11 digits starting with 971)
    // 0XXXXXXXXX (10 digits starting with 0)
    // 05XXXXXXXX (9 digits starting with 05)
    
    // Check if it starts with +971 followed by 9 digits
    if (preg_match('/^\+971[0-9]{9}$/', $cleaned)) {
        return true;
    }
    
    // Check if it starts with 971 followed by 9 digits
    if (preg_match('/^971[0-9]{9}$/', $cleaned)) {
        return true;
    }
    
    // Check if it starts with 0 followed by 9 digits
    if (preg_match('/^0[0-9]{9}$/', $cleaned)) {
        return true;
    }
    
    // Check if it's 9 digits starting with 05 (most common UAE mobile format)
    if (preg_match('/^05[0-9]{7}$/', $cleaned)) {
        return true;
    }
    
    return false;
}

// Get and sanitize form data
$firstName = isset($_POST['firstName']) ? sanitizeInput($_POST['firstName']) : '';
$lastName = isset($_POST['lastName']) ? sanitizeInput($_POST['lastName']) : '';
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
$company = isset($_POST['company']) ? sanitizeInput($_POST['company']) : '';
$helpType = isset($_POST['helpType']) ? sanitizeInput($_POST['helpType']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

// Validation - field-specific errors
$fieldErrors = [];
$errors = [];

// Required fields validation
if (empty($firstName)) {
    $fieldErrors['firstName'] = 'First name is required';
    $errors[] = 'First name is required';
} elseif (!validateName($firstName)) {
    $fieldErrors['firstName'] = 'First name should only contain letters and spaces';
    $errors[] = 'First name should only contain letters and spaces';
}

if (empty($lastName)) {
    $fieldErrors['lastName'] = 'Last name is required';
    $errors[] = 'Last name is required';
} elseif (!validateName($lastName)) {
    $fieldErrors['lastName'] = 'Last name should only contain letters and spaces';
    $errors[] = 'Last name should only contain letters and spaces';
}

if (empty($email)) {
    $fieldErrors['email'] = 'Email address is required';
    $errors[] = 'Email address is required';
} elseif (!validateEmail($email)) {
    $fieldErrors['email'] = 'Invalid email address format';
    $errors[] = 'Invalid email address format';
}

// Phone validation (optional field, but if provided, must be valid UAE number)
if (!empty($phone) && !validateUAEPhone($phone)) {
    $fieldErrors['phone'] = 'Please enter a valid UAE phone number (e.g., +971 50 123 4567 or 050 123 4567)';
    $errors[] = 'Invalid UAE phone number format';
}

if (empty($helpType)) {
    $fieldErrors['helpType'] = 'Please select how we can help you';
    $errors[] = 'Please select how we can help you';
}

if (empty($message)) {
    $fieldErrors['message'] = 'Message is required';
    $errors[] = 'Message is required';
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $errors,
        'fieldErrors' => $fieldErrors
    ]);
    exit;
}

// Basic spam protection - simple honeypot (you can add more sophisticated protection)
if (isset($_POST['website']) && !empty($_POST['website'])) {
    // This is likely a bot
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'Spam detected'
    ]);
    exit;
}

try {
    // Create PHPMailer instance
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = $config['smtp_encryption'];
    $mail->Port = $config['smtp_port'];
    $mail->CharSet = 'UTF-8';
    
    // Enable verbose debug output (disable in production)
    // $mail->SMTPDebug = 2;
    // $mail->Debugoutput = function($str, $level) {
    //     error_log("PHPMailer: $str");
    // };
    
    // Recipients
    $mail->setFrom($config['smtp_from_email'], $config['smtp_from_name']);
    $mail->addAddress($config['recipient_email'], $config['recipient_name']);
    
    // Set Reply-To to user's email if enabled
    if ($config['reply_to_email'] && !empty($email)) {
        $mail->addReplyTo($email, $firstName . ' ' . $lastName);
    }
    
    // Content
    $mail->isHTML(true);
    
    // Email subject
    $subject = $config['subject_prefix'] . ' ' . ucfirst($helpType) . ' Inquiry from ' . $firstName . ' ' . $lastName;
    $mail->Subject = $subject;
    
    // Email body (HTML)
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0369A1; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0369A1; }
            .value { margin-top: 5px; }
            .message-box { background-color: white; padding: 15px; border-left: 4px solid #0369A1; margin-top: 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Name:</div>
                    <div class='value'>{$firstName} {$lastName}</div>
                </div>
                
                <div class='field'>
                    <div class='label'>Email:</div>
                    <div class='value'><a href='mailto:{$email}'>{$email}</a></div>
                </div>
                
                " . (!empty($phone) ? "
                <div class='field'>
                    <div class='label'>Phone:</div>
                    <div class='value'>{$phone}</div>
                </div>
                " : "") . "
                
                " . (!empty($company) ? "
                <div class='field'>
                    <div class='label'>Company:</div>
                    <div class='value'>{$company}</div>
                </div>
                " : "") . "
                
                <div class='field'>
                    <div class='label'>Inquiry Type:</div>
                    <div class='value'>" . ucfirst(str_replace('-', ' ', $helpType)) . "</div>
                </div>
                
                <div class='field'>
                    <div class='label'>Message:</div>
                    <div class='message-box'>" . nl2br($message) . "</div>
                </div>
            </div>
            <div class='footer'>
                <p>This email was sent from the Ingoude Technologies contact form.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $mail->Body = $emailBody;
    
    // Plain text version
    $mail->AltBody = "
New Contact Form Submission

Name: {$firstName} {$lastName}
Email: {$email}
" . (!empty($phone) ? "Phone: {$phone}\n" : "") . "
" . (!empty($company) ? "Company: {$company}\n" : "") . "
Inquiry Type: " . ucfirst(str_replace('-', ' ', $helpType)) . "

Message:
{$message}
    ";
    
    // Send email
    $mail->send();
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for contacting us! We will get back to you soon.'
    ]);
    
} catch (Exception $e) {
    // Log error (in production, log to a file instead of exposing details)
    error_log("PHPMailer Error: " . $mail->ErrorInfo);
    
    // Return error response
    http_response_code(500);
    $recipientEmail = $config['recipient_email'];
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again later or contact us directly at ' . $recipientEmail
    ]);
}


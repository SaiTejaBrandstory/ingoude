# PHPMailer SMTP Setup Guide

This guide will help you set up PHPMailer with SMTP for the contact form functionality.

## Prerequisites

- PHP 7.4 or higher
- Composer (PHP package manager)
- An SMTP email account (Gmail, Outlook, Yahoo, etc.)

## Installation Steps

### 1. Install Composer (if not already installed)

If you don't have Composer installed, download it from: https://getcomposer.org/download/

### 2. Install PHPMailer Dependencies

Open a terminal/command prompt in the project directory and run:

```bash
composer install
```

This will install PHPMailer and its dependencies in the `vendor/` directory.

### 3. Configure SMTP Settings

Edit the `config.php` file and update the following settings:

```php
'smtp_host' => 'smtp.gmail.com', // Your SMTP server
'smtp_port' => 587, // Usually 587 for TLS or 465 for SSL
'smtp_username' => 'your-email@gmail.com', // Your email address
'smtp_password' => 'your-app-password', // Your email password or app password
'smtp_encryption' => 'tls', // 'tls' or 'ssl'
'smtp_from_email' => 'your-email@gmail.com', // Email to send from
'smtp_from_name' => 'Ingoude Technologies', // Display name
'recipient_email' => 'hello@ingoude.com', // Email to receive submissions
```

### 4. Gmail Setup (If using Gmail)

If you're using Gmail, you'll need to:

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Ingoude Contact Form"
   - Copy the 16-character password
   - Use this password in `config.php` instead of your regular password

### 5. Other Email Providers

#### Outlook/Office 365
```php
'smtp_host' => 'smtp.office365.com',
'smtp_port' => 587,
'smtp_encryption' => 'tls',
```

#### Yahoo
```php
'smtp_host' => 'smtp.mail.yahoo.com',
'smtp_port' => 587,
'smtp_encryption' => 'tls',
```

#### Custom SMTP Server
Update the settings according to your email provider's SMTP configuration.

## File Structure

```
ingoude/
├── composer.json          # Composer dependencies
├── config.php             # SMTP configuration (UPDATE THIS!)
├── send-email.php         # Email handler script
├── vendor/                # Composer packages (generated after composer install)
└── contact-us.html        # Contact form page
```

## Testing

1. Make sure `vendor/autoload.php` exists (created after `composer install`)
2. Fill out the contact form on your website
3. Submit the form
4. Check the recipient email inbox for the submission

## Troubleshooting

### Error: "Could not instantiate mail function"
- Make sure Composer dependencies are installed (`composer install`)
- Check that `vendor/autoload.php` exists

### Error: "SMTP connect() failed"
- Verify your SMTP credentials in `config.php`
- Check if your firewall is blocking SMTP ports
- For Gmail, ensure you're using an App Password, not your regular password

### Error: "Authentication failed"
- Double-check your email and password
- For Gmail, make sure 2-Step Verification is enabled and you're using an App Password
- Verify the SMTP server and port settings

### Debug Mode (Development Only)

To enable debug output, uncomment these lines in `send-email.php`:

```php
$mail->SMTPDebug = 2;
$mail->Debugoutput = function($str, $level) {
    error_log("PHPMailer: $str");
};
```

**Note:** Disable debug mode in production for security.

## Security Notes

1. **Never commit `config.php` with real credentials** to version control
2. Consider moving `config.php` outside the web root for better security
3. The honeypot field helps prevent basic spam bots
4. Consider adding reCAPTCHA for additional spam protection

## Support

For PHPMailer documentation, visit: https://github.com/PHPMailer/PHPMailer


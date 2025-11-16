<?php
session_start();

// Enable error reporting only in localhost
if ($_SERVER['HTTP_HOST'] === 'localhost') {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed');
}

// CSRF Token Validation
if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token']) || 
    !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    http_response_code(403);
    die('CSRF token validation failed');
}

// Unset the token after use (one-time use)
unset($_SESSION['csrf_token']);

// Initialize error array
$errors = [];

// Sanitize and validate inputs
$customerName = isset($_POST['customerName']) ? trim($_POST['customerName']) : '';
$customerEmail = isset($_POST['customerEmail']) ? trim($_POST['customerEmail']) : '';
$customerSubject = isset($_POST['customerSubject']) ? trim($_POST['customerSubject']) : '';
$customerPhone = isset($_POST['customerPhone']) ? trim($_POST['customerPhone']) : '';
$customerMessage = isset($_POST['customerMessage']) ? trim($_POST['customerMessage']) : '';

// Validation rules
if (empty($customerName) || strlen($customerName) < 2 || strlen($customerName) > 100) {
    $errors[] = 'Name must be between 2 and 100 characters';
}

if (empty($customerEmail) || !filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email address is required';
}

if (empty($customerSubject) || strlen($customerSubject) < 3 || strlen($customerSubject) > 200) {
    $errors[] = 'Subject must be between 3 and 200 characters';
}

if (!empty($customerPhone)) {
    // Remove all non-numeric characters except + and spaces
    $cleanPhone = preg_replace('/[^0-9+\s]/', '', $customerPhone);
    if (strlen($cleanPhone) < 10 || strlen($cleanPhone) > 20) {
        $errors[] = 'Phone number must be between 10 and 20 characters';
    }
    $customerPhone = $cleanPhone;
}

if (empty($customerMessage) || strlen($customerMessage) < 10 || strlen($customerMessage) > 2000) {
    $errors[] = 'Message must be between 10 and 2000 characters';
}

// Check for suspicious content (basic spam detection)
$spamPatterns = [
    '/\b(viagra|cialis|casino|lottery|winner)\b/i',
    '/<script/i',
    '/javascript:/i',
    '/on\w+\s*=/i' // onclick, onload, etc.
];

foreach ($spamPatterns as $pattern) {
    if (preg_match($pattern, $customerMessage) || preg_match($pattern, $customerSubject)) {
        $errors[] = 'Suspicious content detected';
        break;
    }
}

// If there are validation errors
if (!empty($errors)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Prepare data for storage/email
$contactData = [
    'name' => htmlspecialchars($customerName, ENT_QUOTES, 'UTF-8'),
    'email' => htmlspecialchars($customerEmail, ENT_QUOTES, 'UTF-8'),
    'subject' => htmlspecialchars($customerSubject, ENT_QUOTES, 'UTF-8'),
    'phone' => htmlspecialchars($customerPhone, ENT_QUOTES, 'UTF-8'),
    'message' => htmlspecialchars($customerMessage, ENT_QUOTES, 'UTF-8'),
    'ip_address' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT'],
    'timestamp' => date('Y-m-d H:i:s')
];

// TODO: Implement your preferred method of handling the contact data:
// Option 1: Send email
$emailSent = sendContactEmail($contactData);

// Option 2: Store in database (using prepared statements)
// $dbSaved = saveToDatabase($contactData);

// Option 3: Store in JSON file (simple solution)
// $fileSaved = saveToJsonFile($contactData);

// Response
if ($emailSent) {
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you! Your message has been sent successfully.'
    ]);
} else {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to send message. Please try again later.'
    ]);
}

exit;

/**
 * Send contact form data via email
 */
function sendContactEmail($data) {
    $to = 'hello@imsabbar.com'; // Your email
    $subject = 'Portfolio Contact: ' . $data['subject'];
    
    $message = "
    <html>
    <head>
        <title>New Contact Form Submission</title>
    </head>
    <body>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {$data['name']}</p>
        <p><strong>Email:</strong> {$data['email']}</p>
        <p><strong>Phone:</strong> {$data['phone']}</p>
        <p><strong>Subject:</strong> {$data['subject']}</p>
        <p><strong>Message:</strong></p>
        <p>{$data['message']}</p>
        <hr>
        <p><small>Sent from: {$data['ip_address']} at {$data['timestamp']}</small></p>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Portfolio Contact Form <noreply@imsabbar.com>" . "\r\n";
    $headers .= "Reply-To: {$data['email']}" . "\r\n";
    
    return mail($to, $subject, $message, $headers);
}

/**
 * Save contact data to database using prepared statements
 * Example implementation - adjust to your database setup
 */
function saveToDatabase($data) {
    try {
        // Load database configuration from .env
        require_once __DIR__ . '/../../vendor/autoload.php';
        
        if ($_SERVER['HTTP_HOST'] === 'localhost') {
            $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..', '.env.local');
        } else {
            $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..', '.env.production');
        }
        $dotenv->load();
        
        // Connect to database
        $dsn = "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4";
        $pdo = new PDO($dsn, $_ENV['DB_USER'], $_ENV['DB_PASS'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        
        // Prepare SQL with placeholders (prevents SQL injection)
        $sql = "INSERT INTO contact_submissions (name, email, phone, subject, message, ip_address, user_agent, created_at) 
                VALUES (:name, :email, :phone, :subject, :message, :ip_address, :user_agent, :created_at)";
        
        $stmt = $pdo->prepare($sql);
        
        // Bind parameters
        $stmt->execute([
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':phone' => $data['phone'],
            ':subject' => $data['subject'],
            ':message' => $data['message'],
            ':ip_address' => $data['ip_address'],
            ':user_agent' => $data['user_agent'],
            ':created_at' => $data['timestamp']
        ]);
        
        return true;
    } catch (PDOException $e) {
        // Log error (don't expose to user)
        error_log('Database error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Save contact data to JSON file (simple alternative)
 */
function saveToJsonFile($data) {
    $file = __DIR__ . '/../data/contacts.json';
    
    // Create directory if it doesn't exist
    $dir = dirname($file);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    
    // Load existing contacts
    $contacts = [];
    if (file_exists($file)) {
        $contacts = json_decode(file_get_contents($file), true) ?: [];
    }
    
    // Add new contact
    $contacts[] = $data;
    
    // Save back to file
    return file_put_contents($file, json_encode($contacts, JSON_PRETTY_PRINT)) !== false;
}

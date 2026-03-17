<?php
  /**
  * Requires the "PHP Email Form" library
  * The "PHP Email Form" library is available only in the pro version of the template
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  * For more info and help: https://bootstrapmade.com/php-email-form/
  */

  $receiving_email_address = 'contact@arq-analytics.com';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true;
  
  if (!empty($_POST['website'])) {
    die('OK');
  }

  $name = trim($_POST['name'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $company = trim($_POST['company'] ?? '');
  $subject = trim($_POST['subject'] ?? 'Website enquiry');
  $message = trim($_POST['message'] ?? '');
  $form_context = trim($_POST['form_context'] ?? 'Website Contact');

  $contact->to = $receiving_email_address;
  $contact->from_name = $name;
  $contact->from_email = $email;
  $contact->subject = $subject;

  // Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
  /*
  $contact->smtp = array(
    'host' => 'example.com',
    'username' => 'example',
    'password' => 'pass',
    'port' => '587'
  );
  */

  $contact->add_message($form_context, 'Source');
  $contact->add_message($name, 'Full Name');
  $contact->add_message($email, 'Work Email');
  $contact->add_message($company, 'Company');
  $contact->add_message($message, 'Message', 10);

  echo $contact->send();
?>

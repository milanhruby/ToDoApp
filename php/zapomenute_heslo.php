<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

include 'DB.php';
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$conn = new mysqli($db_server,$db_user,$db_pass,$db_name);

if ($conn->connect_errno) {
    echo 'chyba db:' . $conn->connect_error . '.';
    exit();
}

$email = $_POST['email'];

// kontrola, jestli je email vyplněn
if ($email == "" || $email == null) {
    echo 'E-mail musí být vyplněn.';
    exit();
}

// kontrola formátu emailu
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo 'E-mail je ve špatném formátu.';
    exit();
}

// kontrola, jestli user existuje
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s",$email);
$stmt->execute();
$vysledek = $stmt->get_result();
$stmt->close();
if ($vysledek->num_rows < 1) {
    echo 'error - user not found';
    exit();
}

// vygenerování nového hesla
$znaky = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
$znakyLength = strlen($znaky);
$delka_retezce = 10;
$nahodny_string = '';
for ($i = 0; $i < $delka_retezce; $i++) {
    $nahodny_string .= $znaky[rand(0, $znakyLength - 1)];
}
$nove_heslo_md5 = md5($nahodny_string);

// uložení nového hesla do DB
$stmt = $conn->prepare("UPDATE users SET heslo = ? WHERE email = ?");
$stmt->bind_param("ss",$nove_heslo_md5 , $email);
$stmt->execute();
if ($conn->affected_rows < 0) {
    echo 'sql_chyba při ukládání nového hesla do databáze';
    exit();
}


$odkaz = $adresa_webu . "/login.php";

$mail = new PHPMailer();

    try {
        $mail->isSMTP();
        $mail->Host = $mail_host;
        $mail->SMTPAuth = true;
        $mail->Username = $mail_usename;
        $mail->Password = $mail_pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
    
    
        $mail->CharSet = 'UTF-8';  // !!!!
        $mail->SetFrom("info@smeniste.cz", 'ToDo-App'); //Name is optional
        $mail->AddAddress($email); // příjemce
        //$mail->AddAttachment("faktury/file.pdf",'Nové jméno souboru.pdf'); // cesta k odesílanému souboru a volitelný nový název souboru
        $mail->isHTML(true); // !!!!
        $mail->Subject = "Obnovení hesla aplikace ToDo-app";
        $mail->Body = "
                            <html>
                                <head>
                                    <title>Obnovení hesla aplikace ToDo-app</title>
                                </head>
                                <body>
                                    <style>
                                        .text {
                                            max-width: 300px;
                                            margin: 0 auto;
                                        }
                                    </style>
                                    <p class='text'>
                                        dostali jsme zprávu, že neznáte své heslo. Bylo Vám tedy vytvořeno nové heslo se kterým se můžete přihlásit.
                                        <br>Nové heslo: <span stlye='font-weight: bold'>" . $nahodny_string . "</span>.
                                        <br><br>Přihlášení: 
                                        <a href='" . $odkaz . "'>" . $odkaz . "</a> 
                                    </p>
                                </body>
                            </html>
                        ";
        
        $mail->Send();
        echo 'ok';
        exit();
    } catch (Exception $e) {
        echo 'chyba při odesílání emailu s novým heslem (' . $mail->ErrorInfo . ')';
    }


?>
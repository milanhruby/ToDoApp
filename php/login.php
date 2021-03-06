<?php
session_start();

include 'DB.php';

$conn = new mysqli($db_server,$db_user,$db_pass,$db_name);

if ($conn->connect_errno) {
    echo 'chyba db:' . $conn->connect_error . '.';
    exit();
}

$email = $_POST['email'];
$heslo = md5($_POST['heslo']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo("format_email");
    exit();
}

$smtp = $conn->prepare("SELECT * FROM users where email = ? and heslo = ?");
$smtp->bind_param("ss",$email,$heslo);
$smtp->execute();
$vysl = $smtp->get_result();
$rad = $vysl->num_rows;

if ($rad > 0) {
    $smtp->close();
    $_SESSION['user'] = $email;
    echo 'ok';
    exit();
} else if ($rad < 0) {
    echo 'chyba:' . $smtp->error . '.';
    exit();
} else {
    $smtp->close();
    // user nenalezen, zkontroluje se, jestli nemá nedokončenou registraci

    $smtp2 = $conn->prepare("SELECT * FROM registracni_tokeny where email = ?");
    $smtp2->bind_param("s",$email);
    $smtp2->execute();
    $vysl2 = $smtp2->get_result();
    $rad2 = $vysl2->num_rows;

    if ($rad2 > 0) {

        // v registračních tokenech je záznam. User nedokončil registraci
        echo 'nedokoncena_registrace';
        exit();
    } else {

        // v registračních tokenech není záznam, user prostě jen nebyl nalezen
        echo 'notok';
        exit();
    }   
}

?>
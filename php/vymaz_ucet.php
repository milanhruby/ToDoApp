<?php
session_start();

include 'DB.php';

$conn = new mysqli($db_server,$db_user,$db_pass,$db_name);

if ($conn->connect_errno) {
    echo 'chyba db:' . $conn->connect_error . '.';
    exit();
}

function httpPost($url, $data)
{
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);
    curl_close($curl);
    return $response;
}

$email = $_SESSION['user'];
$heslo = md5($_POST['heslo']);

$smtp = $conn->prepare("SELECT * FROM users where email = ?");
$smtp->bind_param("s",$email);
$smtp->execute();
$vysl = $smtp->get_result();
$rad = $vysl->num_rows;

if ($rad < 0) {
    echo 'error:' . $smtp->error . '.';
    exit();
} else if ($rad == 0) {
    echo 'error - user not found';
    exit();
} else {
    $smtp = $conn->prepare("SELECT * FROM users where email = ? and heslo = ?");
    $smtp->bind_param("ss",$email,$heslo);
    $smtp->execute();
    $vysl = $smtp->get_result();
    $rad = $vysl->num_rows;

    if ($rad > 0) {
        
        // user se vymaže, ale nevymažou se jeho seznamy a úkoly pro případ, že by se chtěl registrovat znovu
        $smtp = $conn->prepare("DELETE FROM users where email = ?");
        $smtp->bind_param("s",$email);
        $smtp->execute();
        unset($_SESSION['user']);

        echo 'ok';

    } else if ($rad < 0) {
        echo 'error:' . $smtp->error . '.';
        exit();
    } else {
        echo 'chybne_heslo';
        exit();
    }
}

?>
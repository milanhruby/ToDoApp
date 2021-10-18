<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

include 'DB.php';
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

function vrat_string($id_f,$lang_f) {

    $url = 'https://to-do-app.site/php/vrat_string.php';

    $post_hodnoty = "id=" . $id_f . "&jazyk=" . $lang_f;
    
    $ch = curl_init();
    
    curl_setopt($ch,CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_POST, true);
    curl_setopt($ch,CURLOPT_POSTFIELDS, $post_hodnoty);
    
    curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 
    
    $result = curl_exec($ch);
    if (explode("<;;;>",$result)[0] == "ok") {
        return explode("<;;;>",$result)[1];
    } else {
        return 'chyba (' . $result . ")";
    }

}

$conn = new mysqli($db_server,$db_user,$db_pass,$db_name);

if ($conn->connect_errno) {
    echo 'chyba db:' . $conn->connect_error . '.';
    exit();
}

$email = $_POST['email'];
$heslo = $_POST['heslo'];
$heslo_conf = $_POST['heslo_conf'];

/*******************************/
/******     KONTROLY  **********/
/*******************************/

// kontrola formátu emailu
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo("format_email");
    exit();
}

// kontrola, jestli se hesla shodují
if ($heslo != $heslo_conf) {
    echo 'hesla_se_neshoduji';
    exit();
}

// kontrola délky hesla
if (strlen($heslo) < 8) {
    echo 'kratke_heslo';
    exit();
}

$heslo = md5($heslo);

// kontrola, jeslti už user neexistuje
$smtp = $conn->prepare("SELECT * FROM `users` WHERE `email` = ?");
$smtp->bind_param("s",$email);
$smtp->execute();
$vysledek = $smtp->get_result();
$vysledku = $vysledek->num_rows;
$smtp->close();

if ($vysledku < 0) {
    echo 'Chyba kontroly existence uživatele v databázi';
    exit();
} else if ($vysledku > 0) {
    echo 'user_existuje';
    exit();
}

// kontrola jazyka. Pokud není ve strinzích sloupec s vybraným jazykem, nastaví se cz
    $lang = $_POST['lang'];

    $vysl = $conn->query("SHOW COLUMNS FROM `stringy`");
    $exituje_jazyk = 0;
    while ($row = $vysl->fetch_assoc()) {
        foreach($row as $key => $value){
            if ($key == "Field" && $value == $lang) {
                $exituje_jazyk = 1;
            }
        }
    }

    if ($exituje_jazyk != 1) {
        $lang = "cz";
    }

// vygenerování tokenu. Token = náhodný string
$znaky = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
$znakyLength = strlen($znaky);
$delka_retezce = 30;
$nahodny_string = '';
for ($i = 0; $i < $delka_retezce; $i++) {
    $nahodny_string .= $znaky[rand(0, $znakyLength - 1)];
}

// zjištení, pokud již v tabulce s tokeny tento email není. 
// Pokud ano, aktualizuje se token i heslo.
// Pokud ne, vloží se nový řádek
$smtp = $conn->prepare("SELECT * FROM `registracni_tokeny` WHERE `email` = ?");
$smtp->bind_param("s",$email);
$smtp->execute();
$vysledek = $smtp->get_result();
$smtp->close();
if ($vysledek->num_rows == 0) {
    $sql = "INSERT INTO `registracni_tokeny` (`token`,`heslo`,`lang`,`email`) values (?,?,?,?)";
} else if ($vysledek->num_rows < 0) {
    echo 'sql chyba';
    exit();
} else {
    $sql = "UPDATE `registracni_tokeny` SET `token` = ? , `heslo` = ? , `lang` = ? WHERE `email` = ? ";
}

$smtp = $conn->prepare($sql);
$smtp->bind_param("ssss" , $nahodny_string , $heslo , $lang , $email);
$smtp->execute();
$smtp->close();
// token je vložený, nebo upravený. Zkontroluje se, jestli je v databázi a odešle se userovi

$smtp = $conn->prepare("SELECT * FROM `registracni_tokeny` WHERE `email` = ?");
$smtp->bind_param("s",$email);
$smtp->execute();
$vysledek = $smtp->get_result();
$smtp->close();

$token = $vysledek->fetch_assoc()['token'];

$odkaz = $adresa_webu . "/dokonceni_registrace.php?email=" . $email . "&token=" . $token;

if (strlen($token) == $delka_retezce) {

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

        $mail->Subject = vrat_string(116,$lang);
        $mail->Body = "
                            <html>
                                <head>
                                    <title>" . vrat_string(116,$lang) . "</title>
                                </head>
                                <body>
                                    <style>
                                        .text {
                                            max-width: 300px;
                                            margin: 0 auto;
                                        }
                                    </style>
                                    <p class='text'>
                                        " . vrat_string(117,$lang) . "
                                        <a href='" . $odkaz . "'>" . $odkaz . "</a> 
                                    </p>
                                </body>
                            </html>
                        ";
        
        
        
        $mail->Send();
        echo 'ok';
    } catch (Exception $e) {
        echo 'chyba při odesílání emailu s aktivačním odkazem pro dokončení registrace (' . $mail->ErrorInfo . ')';
        exit();
    }

    // Pokud user nemá žádné seznamy, vytvoří se mu základní seznam
    $email_string = "<mail>" . $email . "</mail>";
    $email_string = "%{$email_string}%";

    $stmt = $conn->prepare("SELECT * FROM seznamy WHERE user = ? OR sdilen_s LIKE ?");
    $stmt->bind_param("ss",$email,$email_string);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();
    if ($vysledek->num_rows < 1) {
        // bylo nalezeno 0 seznamů které user vlastní nebo které s ním jsou sdíleny. Vytvoří se tedy ukázkový
        $nazev_noveho_seznamu = vrat_string(118,$lang); // string = Můj první ukázkový seznam
        $poradi_noveho_seznamu = 1;
        $stmt = $conn->prepare("INSERT INTO seznamy (nazev_seznamu , poradi , user) VALUES (?,?,?)");
        $stmt->bind_param("sis",$nazev_noveho_seznamu , $poradi_noveho_seznamu , $email);
        $stmt->execute();
        $affr = $conn->affected_rows;
        if ($affr > 0) {
            $id_vlozeneho_seznamu = (int)$stmt->insert_id;
            $stmt->close();

            // seznam se vytvořil. Dále se pro něj vytvoří úkoly
            $stmt = $conn->prepare("INSERT INTO ukoly (level_ukolu , text_ukolu , checked , rozbaleny , parent_seznam , parent_ukol , pozice) VALUES (?,?,?,?,?,?,?)");
            $ukol_level;
            $ukol_text;
            $ukol_checked;
            $ukol_rozbaleny;
            $ukol_parent_seznam;
            $ukol_parent_ukol;
            $ukol_pozice;
            $stmt->bind_param("isiiiii",$ukol_level , $ukol_text , $ukol_checked , $ukol_rozbaleny , $ukol_parent_seznam , $ukol_parent_ukol , $ukol_pozice);
            
            $ukol_level = 1;
            $ukol_text = vrat_string(85,$lang); // string = Registrovat se
            $ukol_checked = 1;
            $ukol_rozbaleny = 1;
            $ukol_parent_seznam = $id_vlozeneho_seznamu;
            $ukol_parent_ukol = 0;
            $ukol_pozice = 1;
            $stmt->execute();

            $id_prvniho_ukolu = (int)$stmt->insert_id;

            $ukol_level = 2;
            $ukol_text = vrat_string(119,$lang); // string = Vyplnit registrační formulář
            $ukol_checked = 1;
            $ukol_rozbaleny = 0;
            $ukol_parent_seznam = $id_vlozeneho_seznamu;
            $ukol_parent_ukol = $id_prvniho_ukolu;
            $ukol_pozice = 1;
            $stmt->execute();

            $ukol_level = 2;
            $ukol_text = vrat_string(120,$lang); // string = Kliknout na odkaz v e-mailu
            $ukol_checked = 1;
            $ukol_rozbaleny = 0;
            $ukol_parent_seznam = $id_vlozeneho_seznamu;
            $ukol_parent_ukol = $id_prvniho_ukolu;
            $ukol_pozice = 2;
            $stmt->execute();

            $ukol_level = 2;
            $ukol_text = vrat_string(121,$lang); // string = Začít používat aplikaci ToDoApp
            $ukol_checked = 1;
            $ukol_rozbaleny = 0;
            $ukol_parent_seznam = $id_vlozeneho_seznamu;
            $ukol_parent_ukol = $id_prvniho_ukolu;
            $ukol_pozice = 3;
            $stmt->execute();

            $ukol_level = 1;
            $ukol_text = vrat_string(122,$lang); // string = Vytvořit svůj vlastní nový seznam
            $ukol_checked = 0;
            $ukol_rozbaleny = 0;
            $ukol_parent_seznam = $id_vlozeneho_seznamu;
            $ukol_parent_ukol = 0;
            $ukol_pozice = 2;
            $stmt->execute();

            $ukol_level = 1;
            $ukol_text = vrat_string(123,$lang); // string = Vymazat původní ukázový seznam
            $ukol_checked = 0;
            $ukol_rozbaleny = 0;
            $ukol_parent_seznam = $id_vlozeneho_seznamu;
            $ukol_parent_ukol = 0;
            $ukol_pozice = 3;
            $stmt->execute();

            $stmt->close();

        }
    }


} else {
    echo vrat_string(124,$lang); // string = Chyba, při ukládání registračního kódu
    exit();
}




?>
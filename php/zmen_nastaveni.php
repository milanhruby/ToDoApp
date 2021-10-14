<?php
session_start();

include 'DB.php';

$conn = new mysqli($db_server,$db_user,$db_pass,$db_name);

if ($conn->connect_errno) {
    echo 'chyba db:' . $conn->connect_error . '.';
    exit();
}

$typ = $_POST['typ'];
$hodnota = $_POST['hodnota'];

$user = $_SESSION['user'];
// kontrola, jestli user existuje
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s",$user);
$stmt->execute();
$vysledek = $stmt->get_result();
$stmt->close();
if ($vysledek->num_rows < 1) {
    echo 'error - user not found';
    exit();
}

if ($typ == "jazyk") {
    $stmt = $conn->prepare("UPDATE users SET jazyk = ? WHERE email = ?");
    $stmt->bind_param("ss",$hodnota,$user);
} else if ($typ == "motiv") {
    switch ($hodnota) {
        case "light":
            $hodnota = 0;
        break;
        case "dark":
            $hodnota = 1;
        break;
        default:
            echo 'chybne_nastaveni';
            exit();
        break;
    }
    $stmt = $conn->prepare("UPDATE users SET color_scheme = ? WHERE email = ?");
    $stmt->bind_param("ss",$hodnota,$user);
} else if ($typ == "zmena_hesla") {

    $stare_heslo = $_POST['stare_heslo'];
    $nove_heslo_1 = $_POST['nove_heslo_1'];
    $nove_heslo_2 = $_POST['nove_heslo_2'];

    // kontrola, jestli je vyplněno vše
    if ($stare_heslo == "" || $nove_heslo_1 == "" || $nove_heslo_2 == "") {
        echo 'nejaka_polozka_empty';
        exit();
    }

    // kontrola, jestli se nová hesla shodují
    if ($nove_heslo_1 != $nove_heslo_2) {
        echo 'hesla_se_neshoduji';
        exit();
    }

    // kontrola, jestli staré a nové heslo nejsou stejné
    if ($nove_heslo_1 == $stare_heslo) {
        echo 'nove_a_stare_jsou_stejne';
        exit();
    }

    // kontrola, jestli je ové heslo dostatečně dlouhé
    if (strlen($nove_heslo_1) < 8) {
        echo 'heslo_moc_kratke';
        exit();
    }

    $stare_heslo = md5($stare_heslo);
    $nove_heslo_1 = md5($nove_heslo_1);
    $nove_heslo_2 = md5($nove_heslo_2);

    // kontrola, jestli je staré heslo správné
    $stmt2 = $conn->prepare("SELECT * FROM users WHERE email = ? AND heslo = ?");
    $stmt2->bind_param("ss",$user,$stare_heslo);
    $stmt2->execute();
    $vysledek = $stmt2->get_result();
    $stmt2->close();
    if ($vysledek->num_rows < 1) {
        echo 'stare_heslo_neni_spravne';
        exit();
    }

    // vše je ok, uloží se nové heslo
    $stmt2 = $conn->prepare("UPDATE users SET heslo = ? WHERE email = ?");
    $stmt2->bind_param("ss",$nove_heslo_1,$user);
    $stmt2->execute();
    $affr = $conn->affected_rows;
    $stmt2->close();
    if ($affr < 0) {
        echo 'SQL error';
        exit();
    } else if ($affr == 0) {
        echo 'nove_heslo_neulozeno';
        exit();
    } else if ($affr == 1) {
        echo 'ok';
        exit();
    } else {
        echo 'zmeneno_vice_rad';
        exit();
    }

    exit();
} else {
    // neznámé nastavení
    echo 'chybne_nastaveni';
    exit();
}

$stmt->execute();
$affr = $stmt->affected_rows;
if ($affr >= 0) {
    // 0 affected_rows je v případě, že user kliknul na již aktivní možnost
    echo 'ok';
    exit();
} else {
    echo "zmena_nastaveni_selhala";
    exit();
}


?>
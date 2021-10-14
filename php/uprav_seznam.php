<?php
session_start();

include 'DB.php';

$conn = new mysqli($db_server,$db_user,$db_pass,$db_name);

if ($conn->connect_errno) {
    echo 'chyba db:' . $conn->connect_error . '.';
    exit();
}

$typ_upravy_seznamu = $_POST['typ_upravy_seznamu'];

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

if ($typ_upravy_seznamu == "zrus_sdileni") {
    $id_seznamu = (int)$_POST['id_seznamu'];
    $ruseny_email = $_POST['ruseny_email'];

    // kontrola, jestli seznam existuje, nebo jestli user má právo sdílení zrušit (buď je majitel seznamu, nebo je sdílěný kontakt) 
    $stmt = $conn->prepare("SELECT * FROM seznamy WHERE id = ? AND ( user = ? OR sdilen_s LIKE ? )");
    $user_pr = "<mail>" . $user . "</mail>";
    $user_pr = "%{$user_pr}%";
    $stmt->bind_param("iss",$id_seznamu,$user,$user_pr);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();
    if ($vysledek->num_rows < 1) {
        echo 'seznam_neexistuje';
        exit();
    }

    // vše je ok. User se vymaže ze sdílených kontaktů
    $puvodni_sdilene_kontakty = $vysledek->fetch_assoc()['sdilen_s'];
    $puvodni_sdilene_kontakty = str_replace("<mail>","",$puvodni_sdilene_kontakty);
    $puvodni_sdilene_kontakty = str_replace("</mail>","",$puvodni_sdilene_kontakty);
    $puvodni_sdilene_kontakty = explode(";",$puvodni_sdilene_kontakty);

    $nove_sdilene_kontakty = [];

    for ($x = 0 ; $x < sizeof($puvodni_sdilene_kontakty) ; $x++) {
        if ($puvodni_sdilene_kontakty[$x] != $ruseny_email && $puvodni_sdilene_kontakty[$x] != "") {
            $nove_sdilene_kontakty[] = "<mail>" . $puvodni_sdilene_kontakty[$x] . "</mail>";
        }
    }

    $nove_sdilene_kontakty = implode(';',$nove_sdilene_kontakty);

    // nový string se sdílenými kontakty se uloží do dat seznamu v databázi
    $stmt = $conn->prepare("UPDATE `seznamy` SET `sdilen_s` = ? WHERE `id` = ?");
    $stmt->bind_param("si",$nove_sdilene_kontakty,$id_seznamu);
    $stmt->execute();
    $stmt->close();

    // kontrola, jestli sdilení zmizelo
    $stmt = $conn->prepare("SELECT `sdilen_s` FROM `seznamy` WHERE `id` = ?");
    $stmt->bind_param("i",$id_seznamu);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();
    if ($vysledek->num_rows < 1) {
        echo 'neznama_chyba';
        exit();
    } else {
        $string_sdilenych_emailu = $vysledek->fetch_assoc()['sdilen_s'];
        if (strpos($string_sdilenych_emailu, '<mail>' . $ruseny_email . '</mail>') === false) {
            echo 'ok';
            exit();
        } else {
            echo 'sdileni_se_nepodarilo_zrusit';
            exit();
        }
    }
} else if ($typ_upravy_seznamu == "nastav_nove_sdileni") {
    $id_seznamu = (int)$_POST['id_seznamu'];
    $novy_email = $_POST['novy_email'];

    // kontrola formátu emailu
    if (!filter_var($novy_email, FILTER_VALIDATE_EMAIL)) {
        echo 'spatny_format_emailu';
        exit();
    }

    if (!is_numeric($id_seznamu)) {
        echo 'id_seznamu_neni_cislo';
        exit();
    }

    // kontrola, jestl jestli je user vlastníkem seznamu. Nikdo jiný nemá právo nastavit sdílení s novým userem
    $stmt = $conn->prepare("SELECT * FROM seznamy WHERE id = ? AND  user = ? ");
    $stmt->bind_param("is",$id_seznamu,$user);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();
    if ($vysledek->num_rows < 1) {
        echo 'seznam_neexistuje';
        exit();
    }
    $data_seznamu = $vysledek->fetch_assoc();

    // kontrola, jestli již user není mezi sdílenými kontakty
    if (strpos($data_seznamu['sdilen_s'],$novy_email)) {
        echo 's_timto_userem_jiz_seznam_sdilite';
        exit();
    }

    $nove_sdilene_kontakty = explode(";",$data_seznamu['sdilen_s']);
    array_push($nove_sdilene_kontakty, "<mail>" . $novy_email . "</mail>");
    $nove_sdilene_kontakty = implode(";",$nove_sdilene_kontakty);
    
    // Vše ok, uloží se nový user ke sdílení do db
    $stmt = $conn->prepare("UPDATE seznamy SET sdilen_s = ? WHERE id = ? AND user = ? ");
    $stmt->bind_param("sis",$nove_sdilene_kontakty,$id_seznamu,$user);
    $stmt->execute();
    $affr = $conn->affected_rows;
    if ($affr == 1) {
        echo 'ok<!!!-DELIM-!!!>' . $novy_email . "<!!!-DELIM-!!!>" . $id_seznamu;
    } else if ($affr < 1) {
        echo 'chyba_nastavovani_sdileni';
    } else {
        echo 'chyba_bylo_ovlivneno_vice_rad';
    }
    
} else if ($typ_upravy_seznamu == "vymaz_seznam") {

    $id_seznamu = (int)$_POST['id_seznamu'];

    if (!is_numeric($id_seznamu)) {
        echo 'id_seznamu_neni_cislo';
        exit();
    }

    // kontrola, jestl jestli je user vlastníkem seznamu. Nikdo jiný nemá právo seznam vymazat
    $stmt = $conn->prepare("SELECT * FROM seznamy WHERE id = ? AND  user = ? ");
    $stmt->bind_param("is",$id_seznamu,$user);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $level_mazaneho_seznamu = $vysledek->fetch_assoc()['poradi'];
    $stmt->close();
    if ($vysledek->num_rows < 1) {
        echo 'seznam_neexistuje';
        exit();
    }    

    // vymazání seznamu
    $stmt = $conn->prepare("DELETE FROM seznamy WHERE id = ? AND  user = ? ");
    $stmt->bind_param("is",$id_seznamu,$user);
    $stmt->execute();
    $affr = $conn->affected_rows;
    $stmt->close();
    if ($affr < 1) {
        echo 'seznam_nevymazan';
        exit();
    }

    // aktualizace pořadí pro ostatní seznamy
    $stmt = $conn->prepare("UPDATE seznamy SET poradi = poradi - 1 WHERE  poradi > ? AND user = ? ");
    $stmt->bind_param("is",$level_mazaneho_seznamu,$user);
    $stmt->execute();

    // vymazání úkolů
    $stmt = $conn->prepare("DELETE FROM ukoly WHERE parent_seznam = ? ");
    $stmt->bind_param("i",$id_seznamu);
    $stmt->execute();
    $affr = $conn->affected_rows;
    $stmt->close();
    if ($affr < 0) {
        echo 'chyba_pri_mazani_ukolu';
        exit();
    }

    echo 'ok';

} else if ($typ_upravy_seznamu == "prejmenuj_seznam") {

    $id_seznamu = (int)$_POST['id_seznamu'];
    $novy_nazev = $_POST['novy_nazev'];

    if (!is_numeric($id_seznamu)) {
        echo 'id_seznamu_neni_cislo';
        exit();
    }

    // kontrola, jestl jestli je user vlastníkem seznamu. Nikdo jiný nemá právo seznam přejmenovat
    $stmt = $conn->prepare("SELECT * FROM seznamy WHERE id = ? AND  user = ? ");
    $stmt->bind_param("is",$id_seznamu,$user);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();
    if ($vysledek->num_rows < 1) {
        echo 'seznam_neexistuje';
        exit();
    }

    // ulož novou hodnotu do DB
    $stmt = $conn->prepare("UPDATE seznamy SET nazev_seznamu = ? WHERE  id = ? ");
    $stmt->bind_param("si",$novy_nazev,$id_seznamu);
    $stmt->execute();
    $affr = $conn->affected_rows;
    if ($affr < 0) {
        echo 'SQL error:' . $conn->error;
        exit();
    } else {
        $stmt->close();

        // ok, zkontroluje se název seznamu který se vrátí
        $stmt = $conn->prepare("SELECT nazev_seznamu FROM seznamy WHERE id = ?");
        $stmt->bind_param("i",$id_seznamu);
        $stmt->execute();
        $vysledek = $stmt->get_result();
        $novy_nazev_z_DB = $vysledek->fetch_assoc()['nazev_seznamu'];
        echo 'ok<!!!-DELIM-!!!>' . $novy_nazev_z_DB;
        exit();
    }

} else if ($typ_upravy_seznamu == "novy_seznam") {

    $novy_nazev = $_POST['novy_nazev'];

    if ($novy_nazev == "" || $novy_nazev == null) {
        echo 'nazev_noveho_seznamu_empty';
        exit();
    }

    // zjištění posledního seznamu (pořadí) daného usera
    $stmt = $conn->prepare("SELECT poradi FROM seznamy WHERE user = ? ORDER BY poradi DESC LIMIT 1");
    $stmt->bind_param("s",$user);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    if ($vysledek->num_rows > 0) {
        $poradi_posledniho_seznamu = (int)$vysledek->fetch_assoc()['poradi'];
    } else {
        $poradi_posledniho_seznamu = 0;
    }
    
    $stmt->close();

    // vložení nového seznamu do DB
    $id_noveho_seznamu;

    $poradi_noveho_seznamu = $poradi_posledniho_seznamu + 1;
    $stmt = $conn->prepare("INSERT INTO seznamy (nazev_seznamu , poradi , user) VALUES (?,?,?)");
    $stmt->bind_param("sis",$novy_nazev,$poradi_noveho_seznamu,$user);
    $stmt->execute();
    $affr = $conn->affected_rows;
    $id_noveho_seznamu = $conn->insert_id;
    $stmt->close();
    if ($affr == 1) {
        echo 'ok<!!!-DELIM-!!!>' . $id_noveho_seznamu;
    }

}



?>
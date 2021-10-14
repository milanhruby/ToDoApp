<?php
session_start();

include 'DB.php';

$conn = new mysqli($db_server,$db_user,$db_pass,$db_name);

if ($conn->connect_errno) {
    echo 'chyba db:' . $conn->connect_error . '.';
    exit();
}

$typ_dat = $_POST['typ_dat'];

if ($typ_dat == "seznamy") {
    // vrátí všechny seznamy přihlášeného uživatele
    if (!isset($_SESSION['user'])) {
        echo 'nepřihlášen žádný uživatel';
        exit();
    } else {
        $user = $_SESSION['user'];
        $smtp = $conn->prepare("SELECT * FROM users where email = ?");
        $smtp->bind_param("s",$user);
        $smtp->execute();
        $vysl = $smtp->get_result();
        $rad = $vysl->num_rows;
        $smtp->close();
    
        if ($rad == 0) {
            echo 'přihlášený uživatel nebyl nalezen v databázi.';
            exit();
        } else if ($rad < 0) {
            echo 'SQL chyba:' . $smtp->error;
            exit();
        }
    }

    // user existuje, vytáhnou se tedy jeho seznamy z DB
    $smtp = $conn->prepare("SELECT * FROM seznamy where user = ? ORDER BY poradi asc");
    $smtp->bind_param("s",$user);
    $smtp->execute();
    $vysl = $smtp->get_result();
    if ($vysl->num_rows < 0) {
        echo 'SQL chyba při vracení seznamů z databáze';
        $smtp->close();
        exit();
    } else if ($vysl->num_rows == 0) {
        echo 'ok<;;;>0';
        $smtp->close();
        exit();
    } else {
        $smtp->close();
        echo 'ok<;;;>';
        while ($row = $vysl->fetch_assoc()) {
            echo $row['id'] . '<--->' . $row['nazev_seznamu'];
            echo '<!!!>';
        }
    }

} else if ($typ_dat == "sdilene_seznamy") {

    // kontrola, jestli user existuje
    if (!isset($_SESSION['user'])) {
        echo 'nepřihlášen žádný uživatel';
        exit();
    } else {
        $user = $_SESSION['user'];
        $smtp = $conn->prepare("SELECT * FROM users where email = ?");
        $smtp->bind_param("s",$user);
        $smtp->execute();
        $vysl = $smtp->get_result();
        $rad = $vysl->num_rows;
        $smtp->close();
    
        if ($rad == 0) {
            echo 'prihlaseny_user_nenalezen';
            exit();
        } else if ($rad < 0) {
            echo 'SQL chyba:' . $smtp->error;
            exit();
        }

        // vytáhnutí sdílených seznamů z databáze
        $smtp = $conn->prepare("SELECT * FROM `seznamy` WHERE `sdilen_s` LIKE ? ORDER BY `id` DESC");
        $email_string = "<mail>" . $user . "</mail>";
        $email_string = "%{$email_string}%";
        $smtp->bind_param("s",$email_string);
        $smtp->execute();
        $vysledek = $smtp->get_result();
        $smtp->close();

        if ($vysledek->num_rows < 0) {
            echo 'SQL error';
            exit();
        } else if ($vysledek->num_rows == 0) {
            echo 'ok<!!!!!>0';
            exit();
        } else {
            $return_string = [];
            while ($row = $vysledek->fetch_assoc()) {
                $return_string[] = $row['id'] . "<!DELIM!>" . $row['nazev_seznamu'] . "<!DELIM!>" . $row['user'];
            }
            $return_string = implode("<!DELIM_1!>",$return_string);
            echo 'ok<!!!!!>' . $return_string;
            exit();
        }


    }
} else if ($typ_dat == "ukoly_seznamu") {

    // kontrola usera
    if (!isset($_SESSION['user'])) {
        echo 'neprihlasen_user';
        exit();
    } else {
        $user = $_SESSION['user'];
        $smtp = $conn->prepare("SELECT * FROM users where email = ?");
        $smtp->bind_param("s",$user);
        $smtp->execute();
        $vysl = $smtp->get_result();
        $rad = $vysl->num_rows;
        $smtp->close();
    
        if ($rad == 0) {
            echo 'user_neni_v_databazi';
            exit();
        } else if ($rad < 0) {
            echo 'SQL chyba:' . $smtp->error;
            exit();
        }
    }

    $id_seznamu = (int)$_POST['id_seznamu'];

    if (!is_numeric($id_seznamu)) {
        echo 'id_seznamu_neni_cislo';
        exit();
    }

    // zjištění jestli user vlastní seznam, nebo je s ním sdílen
    $smtp = $conn->prepare("SELECT * FROM `seznamy` WHERE `id` = ? AND ( `user` = ? OR `sdilen_s` Like ? ) ");
    $user_pr = "%{$user}%";
    $smtp->bind_param("iss",$id_seznamu,$user,$user_pr);
    $smtp->execute();
    $vysledek = $smtp->get_result();
    $smtp->close();

    if ($vysledek->num_rows < 0) {
        echo 'SQL error.';
        exit();
    } else if ($vysledek->num_rows == 0) {
        echo 'zadny_seznam_opravneny';
        exit();
    } else {
        // seznam pro usera existuje
        $row = $vysledek->fetch_assoc();
        if ($row['user'] == $user) {
            $typ_seznamu = "vlastni_seznam";
        } else {
            $typ_seznamu = "sdileny_seznam";
        }
    }

    $data_seznamu = [];
    $data_seznamu[] = $row['id'];
    $data_seznamu[] = $row['nazev_seznamu'];
    $data_seznamu[] = $row['user'];
    if ($typ_seznamu == "vlastni_seznam") {
        $data_seznamu[] = $row['sdilen_s'];
    } else if ($typ_seznamu == "sdileny_seznam") {
        $data_seznamu[] = "";
    }

    // uloží se do tabulky users ID posledního otevřeného seznamu
    $smtp = $conn->prepare("UPDATE users SET posledni_otevreny_seznam = ? WHERE email = ?");
    $smtp->bind_param("is",$id_seznamu,$user);
    $smtp->execute();
    $smtp->close();

    $data_seznamu = implode("<!DELIM!>",$data_seznamu);


    echo 'ok<!!!!!>' . $data_seznamu . '<!!!!!>';

    // vytáhnutí všech úkolů seznamu
    $smtp = $conn->prepare("SELECT * FROM `ukoly` WHERE `parent_seznam` = ? ORDER BY `level_ukolu` ASC , `pozice` ASC");
    $smtp->bind_param("i",$id_seznamu);
    $smtp->execute();
    $vysledek = $smtp->get_result();
    $smtp->close();

    if ($vysledek->num_rows < 0) {
        echo 'SQL error';
        exit();
    } else if ($vysledek->num_rows == 0) {
        echo '0';
        exit();
    } else {
        $data_ukoly = [];
        while ($row = $vysledek->fetch_assoc()) {
            $ukol = [];
            $ukol[] = $row['id'];
            $ukol[] = $row['level_ukolu'];
            $ukol[] = $row['text_ukolu'];
            $ukol[] = $row['checked'];
            $ukol[] = $row['rozbaleny'];
            $ukol[] = $row['parent_ukol'];
            $ukol[] = $row['pozice'];
            $ukol = implode("<!DELIM_UKOL_INNER!>" , $ukol);
            $data_ukoly[] = $ukol;
        }
        $data_ukoly = implode('<!DELIM_UKOL!>' , $data_ukoly);
        echo $data_ukoly;
        exit();
    }

}


?>
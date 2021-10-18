<?php
session_start();

include 'DB.php';

$conn = new mysqli($db_server,$db_user,$db_pass,$db_name);

if ($conn->connect_errno) {
    echo 'chyba db:' . $conn->connect_error . '.';
    exit();
}

/***
 *  Editování, přidávání a mazání úkolů
 * 
 * $typ a $seznam_id jsou povinné. $seznam_id určuje číslo seznamu, kterého úkol se bude řešit
*/
$typ = $_POST['typ'];
$seznam_id = (int)$_POST['seznam_id'];

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

// kontrola, jestli seznam vlastní současný uživatel a jestli seznam vůbec existuje
$stmt = $conn->prepare("SELECT id FROM `seznamy` WHERE ( `sdilen_s` LIKE ? OR user = ? ) AND id = ?"); 
$email_string = "<mail>" . $user . "</mail>";
$email_string = "%{$email_string}%";
//echo $conn->error;
$stmt->bind_param("ssi",$email_string,$user,$seznam_id);
$stmt->execute();
$vysledek = $stmt->get_result();
$stmt->close();
if ($vysledek->num_rows < 1) {
    echo 'nebyl_nalezen_seznam_usera_s_opravnenim';
}


if ($typ == "novy_ukol") {
    
    /******************************
    ***** VYTVOŘÍ SE NOVÝ ÚKOL ****
    *******************************/

    $cislo1 = 1;
    $cislo0 = 0;

    $text_ukolu = $_POST['text_ukolu'];
    $parent_ukol_id = $_POST['parent_ukol_id'];
    
    // kontorla, jestli nová hodnota není prázdná
    if ($text_ukolu == "" || $text_ukolu == null) {
        echo 'nova_hodnota_empty';
        exit();
    }

    if ($parent_ukol_id == 0) {
        // nový úkol nemá parent úkol. Je tedy hlavní a jeho level bude 1
        $level_noveho_ukolu = 1;

        // nastavení pozice nového úkolu - zjištění pozice posledního úkolu s levelem 1 pro daný seznam + 1
        $stmt = $conn->prepare("SELECT pozice FROM ukoly WHERE level_ukolu = ? AND parent_seznam = ? ORDER BY pozice DESC LIMIT 1 ");   
        $stmt->bind_param("ii",$cislo1,$seznam_id);
        $stmt->execute();
        $vysledek = $stmt->get_result();
        $stmt->close();
        $pozice_noveho_ukolu = (int)$vysledek->fetch_assoc()['pozice'] + 1;

        // nastavení parent_seznamu pro SQL string
        $novy_parent_seznam = 0;
    } else {
        // nový úkol má parent úkol (přijato přes AJAX - ještě neověřeno), zjistí se tedy level parent úkolu a nový úkol bude mít stený level + 1
        $stmt = $conn->prepare("SELECT * FROM ukoly WHERE id = ?");
        $stmt->bind_param("i",$parent_ukol_id);
        $stmt->execute();
        $vysledek = $stmt->get_result();
        $stmt->close();
        if ($vysledek->num_rows < 0) {
            echo 'SQL chyba';
            exit();
        } else if ($vysledek->num_rows == 0) {
            echo 'dany_parent_ukol_neexistuje';
            exit();
        } else {
            // parent ukol exituje. Vytvoří se se nový úkol
            $level_noveho_ukolu = (int)$vysledek->fetch_assoc()['level_ukolu'] + 1;
            $pozice_noveho_ukolu;

            // nastavení pozice nového úkolu - zjištění pozice posledního úkolu pro daný parent úkol + 1
            $stmt = $conn->prepare("SELECT pozice FROM ukoly WHERE parent_ukol = ? ORDER BY pozice DESC LIMIT 1 ");
            $stmt->bind_param("i",$parent_ukol_id);
            $stmt->execute();
            $vysledek = $stmt->get_result();
            $stmt->close();
            $pozice_noveho_ukolu = (int)$vysledek->fetch_assoc()['pozice'] + 1;

            // nastavení parent_seznamu pro SQL string
            $novy_parent_seznam = $seznam_id;
        }
    }

    
    $sql = "INSERT INTO ukoly (level_ukolu,text_ukolu,checked,rozbaleny,parent_seznam,parent_ukol,pozice) VALUES (?,?,?,?,?,?,?) ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isiiiii",
                                $level_noveho_ukolu,
                                $text_ukolu,
                                $cislo0,
                                $cislo0,
                                $seznam_id,
                                $parent_ukol_id,
                                $pozice_noveho_ukolu);
    $stmt->execute();
    $affr = $stmt->affected_rows;
    if ($affr == 1) {
        $id_vlozeneho_ukolu = $stmt->insert_id;
        $stmt->close();

        // vytahnutí dat nového úkolu z DB. Pro ujištění, že jak přesně byl úkol uložen a následné přesné vytvoření bloku ukolu v JS
        $stmt = $conn->prepare("SELECT * FROM ukoly WHERE id = ?");
        $stmt->bind_param("i",$id_vlozeneho_ukolu);
        $stmt->execute();
        $vysledek = $stmt->get_result();
        $stmt->close();
        $data_noveho_ukolu_z_DB = $vysledek->fetch_assoc();
        $data_noveho_ukolu = [];
        foreach ($data_noveho_ukolu_z_DB as $a) {
            $data_noveho_ukolu[] = $a;
        }
        $data_noveho_ukolu = implode("<!DELIM-ARRAY!>",$data_noveho_ukolu);
    }
    

    echo 'ok<!DELIM!>' . $data_noveho_ukolu;
} else if ($typ == "uprav_text_ukolu") {

    /******************************************
    ***** ZMĚNÍ SE TEXT EXISTUJÍCÍHO ÚKOLU ****
    ******************************************/

    $seznam_id;
    $id_ukolu = $_POST['id_ukolu'];
    $nova_hodnota = $_POST['nova_hodnota'];

    // kontrola, jestli úkol spadá do daného seznamu
    $stmt = $conn->prepare("SELECT `id` FROM `ukoly` WHERE `id` = ? AND `parent_seznam` = ? ");
    $stmt->bind_param("ii",$id_ukolu,$seznam_id);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();
    if ($vysledek->num_rows < 1) {
        echo 'id_ukolu_neexistuje_nebo_nespada_pod_seznam';
        exit();
    }

    // kontorla, jestli nová hodnota není prázdná
    if ($nova_hodnota == "" || $nova_hodnota == null) {
        echo 'nova_hodnota_empty';
        exit();
    }

    // uloží se nová hodnota
    $stmt = $conn->prepare("UPDATE `ukoly` SET `text_ukolu` = ? WHERE `id` = ? ");
    //echo $conn->error;
    $stmt->bind_param("si",$nova_hodnota,$id_ukolu);
    $stmt->execute();
    $affr = $conn->affected_rows;
    $stmt->close();

    if ($affr < 0) {
        echo 'nepodarilo_se_nastavit_novy_text_ukolu';
        exit();
    } else {
        // affected row je 1 nebo 0. I 0 je v pořádku. Jde o případ, kdy user mění text na to samé, co už v DB bylo
        // zkontroluje se přesný nový text v DB a ten se vrátí do JS, aby se mohl aktualizovat v prohlížeči
        $stmt = $conn->prepare("SELECT `text_ukolu` FROM `ukoly` WHERE `id` = ?");
        $stmt->bind_param("i",$id_ukolu,);
        $stmt->execute();
        $vysledek = $stmt->get_result();
        $stmt->close();
        $novy_vraceny_text = $vysledek->fetch_assoc()['text_ukolu'];

        echo 'ok<!DELIM!>' . $novy_vraceny_text;
    }

} else if ($typ == "vymaz_ukol_vcetne_podukolu") {

    /******************************************
    ******** SMAŽE ÚKOL VČETNĚ PODÚKOLŮ *******
    ******************************************/

    $id_ukolu = $_POST['id_ukolu'];

    // kontrola, jestli úkol spadá do daného seznamu
    $stmt = $conn->prepare("SELECT `id` FROM `ukoly` WHERE `id` = ? AND `parent_seznam` = ? ");
    $stmt->bind_param("ii",$id_ukolu,$seznam_id);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();
    if ($vysledek->num_rows < 1) {
        echo 'id_ukolu_neexistuje_nebo_nespada_pod_seznam';
        exit();
    }

    // zjisteni levelu mazaneho ukolu
    $stmt = $conn->prepare("SELECT `level_ukolu` , `pozice` , `parent_ukol` FROM `ukoly` WHERE `id` = ?");
    $stmt->bind_param("i",$id_ukolu);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();

    $vysledek_assoc = $vysledek->fetch_assoc();
    $level_mazaneho_ukolu = (int)$vysledek_assoc['level_ukolu'];
    $pozice_mazaneho_ukolu = (int)$vysledek_assoc['pozice'];
    $parent_ukol_mazaneho_ukolu = (int)$vysledek_assoc['parent_ukol'];

    $ukoly_k_vymazani = [];
    // naplní se pole ukolů (ID čísla) k vymazani postupnym projizdenim všech podúkolů po levelech

    $ukoly_k_vymazani[] = $id_ukolu;

    $continue = true;
    $soucasne_paren_ukoly = [];
    $soucasne_paren_ukoly[] = $id_ukolu;

    for ($x = $level_mazaneho_ukolu + 1 ; $continue == true ; $x++) {
        // cyklus začíná na prvním podúkolu. Pokud nějaký je, uloží se jeho ID k vymazání a pokračuje se o level dolů, dokud se nedojde na dno
        $soucasne_paren_ukoly_temp = $soucasne_paren_ukoly;
        $soucasne_paren_ukoly = [];
        if (sizeof($soucasne_paren_ukoly_temp) == 0) {
            $continue = false;
        } else {
            foreach ($soucasne_paren_ukoly_temp as $ukol) {
                $stmt = $conn->prepare("SELECT * FROM `ukoly` WHERE level_ukolu = ? AND parent_ukol = ? ");
                $stmt->bind_param("ii",$x,$ukol);
                $stmt->execute();
                $vysledek = $stmt->get_result();
                $stmt->close();
                if ($vysledek->num_rows > 0) {
                    while ($row = $vysledek->fetch_assoc()) {
                        $soucasne_paren_ukoly[] = $row['id'];
                        $ukoly_k_vymazani[] = $row['id'];
                    }
                }
            }
        }
    }

    // změna "pozice" u ostatních úkolů se stejným levelem jako mazaný úkol (podúkoly se němění jelikož se všechny vymažou)
    $stmt = $conn->prepare("SELECT * FROM `ukoly` WHERE level_ukolu = ? AND parent_ukol = ? AND parent_seznam = ? AND pozice > ?");
    $stmt->bind_param("iiii",$level_mazaneho_ukolu,$parent_ukol_mazaneho_ukolu,$seznam_id,$pozice_mazaneho_ukolu);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();
    if ($vysledek->num_rows > 0) {
        while ($row = $vysledek->fetch_assoc()) {
            $id_temp = (int)$row['id'];
            $stmt = $conn->prepare("UPDATE `ukoly` SET pozice = pozice - 1 WHERE id = ?");
            $stmt->bind_param("i",$id_temp);
            $stmt->execute();
        }
    }

    // konečné vymazání všech úkolů
    $pocet_mazanych_ukolu = sizeof($ukoly_k_vymazani);
    $pocet_skutecne_vymazanych_ukolu = 0;

    foreach ($ukoly_k_vymazani as $ukol) {
        $stmt = $conn->prepare("DELETE FROM `ukoly` WHERE id = ?");
        $stmt->bind_param("i",$ukol);
        $stmt->execute();
        $pocet_skutecne_vymazanych_ukolu += (int)$conn->affected_rows;
        $stmt->close();
    }

    //vytáhnutí nových pozic sourozeneckých úkolů vymazaného úkolu
    $stmt = $conn->prepare("SELECT id , pozice FROM `ukoly` WHERE level_ukolu = ? AND parent_ukol = ? AND parent_seznam = ?");
    $stmt->bind_param("iii",$level_mazaneho_ukolu,$parent_ukol_mazaneho_ukolu,$seznam_id);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();
    $data_pro_opdoved = [];
    if ($vysledek->num_rows > 0) {
        while ($row = $vysledek->fetch_assoc()) {
            $data_pro_opdoved[] = $row['id'] . ';' . $row['pozice'];
        }
    }
    $data_pro_opdoved = implode('<!!!>',$data_pro_opdoved);

    if ($pocet_mazanych_ukolu == $pocet_skutecne_vymazanych_ukolu) {
        echo 'ok<!DELIM!>' . $data_pro_opdoved;
        exit();
    } else {
        echo 'chyba_vymazan_jiny_pocet_ukolu_nez_bylo_v_planu';
    }
    
} else if ($typ == "checkbox_click") {

    /*********************************************************************
    ******** ÚKOL SE ZAŠKRTNE NEBO ODŠKTRNE (VČETNĚ JEHO PODÚKOLŮ) *******
    *********************************************************************/

    $id_ukolu = $_POST['id_ukolu'];
    $checked = $_POST['checked']; // 0 nebo 1

    // kontrola, jestli úkol spadá do daného seznamu
    $stmt = $conn->prepare("SELECT `id` FROM `ukoly` WHERE `id` = ? AND `parent_seznam` = ? ");
    $stmt->bind_param("ii",$id_ukolu,$seznam_id);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();
    if ($vysledek->num_rows < 1) {
        echo 'id_ukolu_neexistuje_nebo_nespada_pod_seznam';
        exit();
    }

    /// zjisteni levelu měněného ukolu
    $stmt = $conn->prepare("SELECT `level_ukolu` FROM `ukoly` WHERE `id` = ?");
    $stmt->bind_param("i",$id_ukolu);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();

    $level_meneneho_ukolu = (int)$vysledek->fetch_assoc()['level_ukolu'];

    $ukoly_ke_zmene = [];
    // naplní se pole ukolů (ID čísla) k vymazani postupnym projizdenim všech podúkolů po levelech

    $ukoly_ke_zmene[] = $id_ukolu;

    $continue = true;
    $soucasne_paren_ukoly = [];
    $soucasne_paren_ukoly[] = $id_ukolu;

    for ($x = $level_meneneho_ukolu + 1 ; $continue == true ; $x++) {
        // cyklus začíná na prvním podúkolu. Pokud nějaký je, uloží se jeho ID k vymazání a pokračuje se o level dolů, dokud se nedojde na dno
        $soucasne_paren_ukoly_temp = $soucasne_paren_ukoly;
        $soucasne_paren_ukoly = [];
        if (sizeof($soucasne_paren_ukoly_temp) == 0) {
            $continue = false;
        } else {
            foreach ($soucasne_paren_ukoly_temp as $ukol) {
                $stmt = $conn->prepare("SELECT * FROM `ukoly` WHERE level_ukolu = ? AND parent_ukol = ? ");
                $stmt->bind_param("ii",$x,$ukol);
                $stmt->execute();
                $vysledek = $stmt->get_result();
                $stmt->close();
                if ($vysledek->num_rows > 0) {
                    while ($row = $vysledek->fetch_assoc()) {
                        $soucasne_paren_ukoly[] = $row['id'];
                        $ukoly_ke_zmene[] = $row['id'];
                    }
                }
            }
        }
    }

    // konečné změnění všech úkolů

    foreach ($ukoly_ke_zmene as $ukol) {
        $stmt = $conn->prepare("UPDATE ukoly SET checked = ? WHERE id = ?");
        $stmt->bind_param("ii",$checked,$ukol);
        $stmt->execute();
        if ($conn->error || $conn->affected_rows < 0) {
            echo $conn->error;
            exit();
        }
        $stmt->close();
    }
    echo 'ok';

} else if ($typ == "sbal_rozbal_ukol") {

    /*****************************************************
    ******** ULOŽÍ DO DB, JESTLI JE ÚKOL ROZBALENÝ *******
    ******************************************************/

    $id_ukolu = $_POST['id_ukolu'];
    $rozbaleny = $_POST['rozbaleny']; // 0 nebo 1

    $stmt = $conn->prepare("UPDATE ukoly SET rozbaleny = ? WHERE id = ?");
    $stmt->bind_param("ii",$rozbaleny,$id_ukolu);
    $stmt->execute();
    $stmt->close();

} else if ($typ == "zmen_poradi_ukolu") {

    /******************************************************
    *****************  ZMĚNÍ POŘADÍ ÚKOLU  ****************
    ******************************************************/

    $id_ukolu = $_POST['id_ukolu'];
    $nova_pozice = $_POST['nova_pozice'];

    // zjištění staré pozice a levelu úkolu
    $stmt = $conn->prepare("SELECT pozice , level_ukolu , parent_ukol FROM ukoly WHERE id = ?");
    $stmt->bind_param("i",$id_ukolu);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $vysledek_assoc = $vysledek->fetch_assoc();
    $stara_pozice = $vysledek_assoc['pozice'];
    $level_ukolu = $vysledek_assoc['level_ukolu'];
    $parent_ukol = $vysledek_assoc['parent_ukol'];
    $stmt->close();

    if ($stara_pozice < $nova_pozice) {
        // stará pozice je menší. Úkol se posouvá dolů
        $nova_pozice -= 1; 

        // zjištění, kterým úklolům (kromě hlavního měněného úkolu) se ubere z pozice 1
        $ukoly_k_ubrani_pozice = [];

        $cyklus_start = $nova_pozice;
        $cyklus_stop = $stara_pozice + 1;
        for ($x = $cyklus_start ; $x >= $cyklus_stop ; $x--) {
            $stmt = $conn->prepare("SELECT id FROM ukoly WHERE level_ukolu = ? AND parent_seznam = ? AND parent_ukol = ? AND pozice = ?");
            $stmt->bind_param("iiii",$level_ukolu,$seznam_id,$parent_ukol,$x);
            $stmt->execute();
            $vysledek = $stmt->get_result();
            if ($vysledek->num_rows > 0) {
                $t_id = $vysledek->fetch_assoc()['id'];
                $ukoly_k_ubrani_pozice[] = $t_id;
            }
            $stmt->close();
        }
        foreach ($ukoly_k_ubrani_pozice as $ukol) {
            $stmt = $conn->prepare("UPDATE ukoly SET pozice = pozice - 1 WHERE id = ?");
            $stmt->bind_param("i",$ukol);
            $stmt->execute();
        }

        // nastavení nové pozice u měnéného úkolu
        $stmt = $conn->prepare("UPDATE ukoly SET pozice = ? WHERE id = ?");
        $stmt->bind_param("ii",$nova_pozice,$id_ukolu);
        $stmt->execute();


    } else if ($stara_pozice > $nova_pozice) {
        // stará pozice je větší. Úkol se posouvá nahoru

        $cyklus_start = $nova_pozice;
        $cyklus_stop = $stara_pozice - 1;

        $ukoly_k_pridani_pozice = [];

        for ($x = $cyklus_start ; $x <= $cyklus_stop ; $x++) {
            $stmt = $conn->prepare("SELECT id FROM ukoly WHERE level_ukolu = ? AND parent_seznam = ? AND parent_ukol = ? AND pozice = ?");
            $stmt->bind_param("iiii",$level_ukolu,$seznam_id,$parent_ukol,$x);
            $stmt->execute();
            $vysledek = $stmt->get_result();
            if ($vysledek->num_rows > 0) {
                $t_id = $vysledek->fetch_assoc()['id'];
                $ukoly_k_pridani_pozice[] = $t_id;
            }
            $stmt->close();
        }
        foreach ($ukoly_k_pridani_pozice as $ukol) {
            $stmt = $conn->prepare("UPDATE ukoly SET pozice = pozice + 1 WHERE id = ?");
            $stmt->bind_param("i",$ukol);
            $stmt->execute();
        }

        // nastavení nové pozice u měnéného úkolu
        $stmt = $conn->prepare("UPDATE ukoly SET pozice = ? WHERE id = ?");
        $stmt->bind_param("ii",$nova_pozice,$id_ukolu);
        $stmt->execute();

    } else if ($stara_pozice == $nova_pozice) {
        // stejná stará a nová pozice. Žádná změna neprobíhá 
        echo 'stejna_pozice';
        exit();
    } else {
        echo 'neznama_chyba_souvisejici_s_pozici';
        exit();
    }



    
    //vytáhnutí nových pozic sourozeneckých úkolů měněnho úkolu včetně
    $stmt = $conn->prepare("SELECT id , pozice FROM `ukoly` WHERE level_ukolu = ? AND parent_ukol = ? AND parent_seznam = ? ORDER BY pozice ASC ");
    $stmt->bind_param("iii",$level_ukolu,$parent_ukol,$seznam_id);
    $stmt->execute();
    $vysledek = $stmt->get_result();
    $stmt->close();
    $data_pro_opdoved = [];
    if ($vysledek->num_rows > 0) {
        while ($row = $vysledek->fetch_assoc()) {
            $data_pro_opdoved[] = $row['id'] . ';' . $row['pozice'];
        }
    }
    $data_pro_opdoved = implode('<!!!>',$data_pro_opdoved);
    
    echo 'ok<!DELIM!>' . $data_pro_opdoved;
    
}



?>
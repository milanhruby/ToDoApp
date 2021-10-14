<?php

include 'DB.php';

$conn = new mysqli($db_server,$db_user,$db_pass,$db_name);

if ($conn->connect_errno) {
    echo 'chyba db:' . $conn->connect_error . '.';
    exit();
}

$id = $_POST['id'];
$jazyk = $_POST['jazyk'];

$pole = explode(";",$id);

if (sizeof($pole) <= 0) {
    echo 'chyba, prázdný string';
    exit();
} else if (sizeof($pole) == 1) {
    // jde je o jeden element

    if (!is_numeric($id)) {
        echo 'ID not number';
        exit();
    } else {
        // $id je jedno číslo
        $sql = "SELECT `" . $jazyk . "` FROM `stringy` where `id` = ?";
        $smtp = $conn->prepare($sql);
        $smtp->bind_param("i",$id);
        $smtp->execute();
        $vysl = $smtp->get_result();
        if ($vysl->num_rows < 0) {
            echo 'SQL chyba při vracení stringu z databáze';
            $smtp->close();
            exit();
        } else if ($vysl->num_rows == 0) {
            echo 'zadny_string';
            $smtp->close();
            exit();
        } else {
            $smtp->close();
            echo 'ok<;;;>' . $vysl->fetch_assoc()[$jazyk];
        }
    }
} else {
    // "pole" je pole čísel ID stringů, které se vrátí

    $where = [];
    $typy = "";
    $parametry = [];

    foreach ($pole as $id_str) {
        // $id_str je id stringu
        $id_str = (int)$id_str;

        $where[] = " `id` = ? ";
        $typy .= "i";
        $parametry[] = $id_str;
    }

    $where = implode(" OR ",$where);

    $sql = "SELECT `id`,`" . $jazyk . "` FROM `stringy` WHERE 1=1 AND (" . $where . ") ";
    $smtp = $conn->prepare($sql);
    $smtp->bind_param($typy, ...$parametry);
    $smtp->execute();
    $vysledek = $smtp->get_result();
    if ($vysledek->num_rows < 0) {
        echo 'SQL chyba:' . $smtp->error;
        exit();
    } else if ($vysledek->num_rows == 0) {
        echo 'zadny_string';
        exit();
    } else {
        $pole_response = [];
        while ($row = $vysledek->fetch_assoc()) {
            $pole_response[] = $row['id'] . '<;DELIM_ELEMENT;>' . $row[$jazyk]; 
        }
        $pole = implode('<;DELIM_POLE;>',$pole_response);
        echo $pole;
        exit();
    }

}







?>
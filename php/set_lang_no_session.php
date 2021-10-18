<?php
session_start();

include 'DB.php';

$conn = new mysqli($db_server,$db_user,$db_pass,$db_name);

if ($conn->connect_errno) {
    echo 'chyba db:' . $conn->connect_error . '.';
    exit();
}

$typ = $_POST['typ'];

if ($typ == "kontrola_existence_jazyka") {

    /*************************************************************
    ************ KONTOLA, JESTLI DANÝ JAZYK EXISTUJE *************
    **************************************************************/

    $jazyk = $_POST['jazyk'];

    $vysl = $conn->query("SHOW COLUMNS FROM `stringy`");
    $exituje_jazyk = 0;
    while ($row = $vysl->fetch_assoc()) {
        foreach($row as $key => $value){
            if ($key == "Field" && $value == $jazyk) {
                $exituje_jazyk = 1;
            }
        }
    }

    if ($exituje_jazyk == 1) {
        echo 'ok';
        exit();
    } else {
        echo 'nok';
        exit();
    }
}



?>
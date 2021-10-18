<?php
session_start();

if (isset($_SESSION['user'])) {
    header("Location: app.php");
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="/res/fav.png">
    <title>Dokončení registrace</title>
</head>
<body id="body" lang="">

        <script>
            if (localStorage['lang'] != "") {

                var nastaveny_jazyk = localStorage['lang'];

                // kontrola, jestli nastavený jazyk existuje
                var xhttp = new XMLHttpRequest;
                xhttp.open("POST", "php/set_lang_no_session.php", false);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send("typ=kontrola_existence_jazyka&jazyk=" + nastaveny_jazyk); 
                var odpoved = xhttp.responseText;
                console.log(odpoved);
                if (odpoved == "ok") {
                    document.getElementById('body').setAttribute('lang',nastaveny_jazyk);
                } else {
                    document.getElementById('body').setAttribute('lang','cz');
                    localStorage['lang'] = "cz";
                }
            } else {
                document.getElementById('body').setAttribute('lang','cz');
                localStorage['lang'] = "cz";
            }

            window.addEventListener('load',function() {

                // naplň stringy

                // vybrání všech elementů, které mají attribut string_id. Znamená to, že se do nich dopní string dle jazyka
                var kontainery_stringu = document.querySelectorAll('*[string_id]');
                var IDs = [];
                kontainery_stringu.forEach(kontainer => {
                    IDs.push(kontainer.getAttribute('string_id'));
                });
                if (IDs.length > 0) {
                    IDs = IDs.join(';');
                    var pole_stringu = vrat_string(IDs);
                    pole_stringu.forEach(string_par => {
                        var id = string_par.split('<;DELIM_ELEMENT;>')[0];
                        var string = string_par.split('<;DELIM_ELEMENT;>')[1];
                        if (document.querySelector('*[string_id="' + id + '"]') != null) {
                            document.querySelector('*[string_id="' + id + '"]').innerHTML = string;
                        }
                    })
                }

            });

        </script>

        <h1 string_id="111"><!--Dokončení registrace--></h1>

    <?php
        if (isset($_GET['email']) && isset($_GET['token'])) {
            $email = $_GET['email'];
            $token = $_GET['token'];

            include 'php/DB.php';
            $conn = new mysqli($db_server,$db_user,$db_pass,$db_name);
            if ($conn->connect_errno) {
                echo '<p string_id="109"></p>'; // Chyba databáze.
            } else {
                $stmt = $conn->prepare("SELECT * FROM `registracni_tokeny` WHERE `email` = ? AND `token` = ?");
                $stmt->bind_param("ss",$email,$token);
                $stmt->execute();
                $vysledek = $stmt->get_result();
                if ($stmt->num_rows < 0) {
                    echo '<p>SQL chyba.</p>';
                } else if ($vysledek->num_rows == 0) {
                    echo '<p string_id="110"></p>'; // Nepodařilo se dokončit registraci. Token nebo email není platný.
                } else {
                    $stmt->close();

                    // Token i email v databázi je, tudíž se vytvoří user v tabulce userů
                    $data_pred_reg = $vysledek->fetch_assoc();
                    $email = $data_pred_reg['email'];
                    $token = $data_pred_reg['token'];
                    $heslo = $data_pred_reg['heslo'];
                    $lang = $data_pred_reg['lang'];
                    $id_pred_reg = (int)$data_pred_reg['id'];

                    $stmt = $conn->prepare("INSERT INTO `users` (`email`,`heslo`,`jazyk`) VALUES (?,?,?) ");
                    $stmt->bind_param("sss",$email,$heslo,$lang);
                    $stmt->execute();
                    if ($stmt->affected_rows < 0) {
                        echo '<p string_id="112"></p>';  // Nepodařilo se dokončit registraci. Chyba při vkládání uživatele do databáze
                    } else {
                        $stmt->close();

                        // kontrola, jestli je uživatel vložen do databáze
                        $stmt = $conn->prepare("SELECT * FROM `users` WHERE `email` = ?");
                        $stmt->bind_param("s",$email);
                        $stmt->execute();
                        $kontrola = $stmt->get_result();
                        $stmt->close();
                        if ($kontrola->num_rows > 0) {
                            // ok
                            $_SESSION['user'] = $email;

                            // vymazání tokenu pro registraci
                            $stmt = $conn->prepare("DELETE FROM registracni_tokeny WHERE id = ? ");
                            $stmt->bind_param("i" , $id_pred_reg);
                            $stmt->execute();
                            $stmt->close();

                            echo '<script>window.location.reload();</script>';
                            
                        } else {
                            echo '<p string_id="113"></p>'; // Nepodařilo se dokončit registraci. Chyba kontroly vložení uživatele do databáze.
                        }
                    }
                }
            }

        } else {
            echo '<p string_id="114"></p>'; // Nepodařilo se dokončit registraci.
        }
    ?>

    <script src="js/script.js"></script>
    
</body>
</html>
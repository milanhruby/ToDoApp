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
<body>

    <?php
        if (isset($_GET['email']) && isset($_GET['token'])) {
            $email = $_GET['email'];
            $token = $_GET['token'];

            include 'php/DB.php';
            $conn = new mysqli($db_server,$db_user,$db_pass,$db_name);
            if ($conn->connect_errno) {
                echo '<p>Chyba databáze.</p>';
            } else {
                $stmt = $conn->prepare("SELECT * FROM `registracni_tokeny` WHERE `email` = ? AND `token` = ?");
                $stmt->bind_param("ss",$email,$token);
                $stmt->execute();
                $vysledek = $stmt->get_result();
                if ($stmt->num_rows < 0) {
                    echo '<p>SQL chyba.</p>';
                } else if ($vysledek->num_rows == 0) {
                    echo '<p>Nepodařilo se dokončit registraci. Token nebo email není platný.</p>';
                } else {
                    $stmt->close();

                    // Token i email v databázi je, tudíž se vytvoří user v tabulce userů
                    $data_pred_reg = $vysledek->fetch_assoc();
                    $email = $data_pred_reg['email'];
                    $token = $data_pred_reg['token'];
                    $heslo = $data_pred_reg['heslo'];
                    $id_pred_reg = (int)$data_pred_reg['id'];

                    $stmt = $conn->prepare("INSERT INTO `users` (`email`,`heslo`) VALUES (?,?) ");
                    $stmt->bind_param("ss",$email,$heslo);
                    $stmt->execute();
                    if ($stmt->affected_rows < 0) {
                        echo '<p>Nepodařilo se dokončit registraci. Chyba při vkládání uživatele do databáze</p>'; 
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
                            echo '<p>Nepodařilo se dokončit registraci. Chyba kontroly vložení uživatele do databáze.</p>';
                        }
                    }
                }
            }

        } else {
            echo '<p>Nepodařilo se dokončit registraci.</p>';
        }
    ?>
    
</body>
</html>
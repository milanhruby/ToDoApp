<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
} else {
    // zjistit, jestli user stale existuje
    $user = $_SESSION['user'];
}

include 'php/DB.php';

$conn = new mysqli($db_server,$db_user,$db_pass,$db_name);

$smtp = $conn->prepare("SELECT * FROM users where email = ?");
$smtp->bind_param("s",$user);
$smtp->execute();
$vysl = $smtp->get_result();
$smtp->close();
$data_usera = $vysl->fetch_assoc();

$jazyk = $data_usera['jazyk'];
$schema = $data_usera['color_scheme'];
$posledni_otevreny_seznam = $data_usera['posledni_otevreny_seznam'];


?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <?php
    switch ($schema) {
        case 1: // 1 = dark
            echo '<link rel="stylesheet" href="style/style_dark.css">';
        break;
        default:
            // 0 - light
            echo '<link rel="stylesheet" href="style/style.css">';
        break;
    }
    ?>
    <link rel="shortcut icon" href="/res/fav.png">
    <title>ToDo app</title>
</head>
<body lang="<?php echo $jazyk; ?>">

    <?php
        echo '<script>localStorage[\'lang\'] = "' . $jazyk . '";</script>';
    ?>

    <div class="spinner">

    </div>

    <div id="debug">
        
    </div>

    <div class="app_main_body" id_seznamu="125">

        <div class="app_main_body_inner">
            <div class="horni_lista_1">
                <div class="hamburger" onclick="otevri_mobilni_menu()">
                    <div class="el_1 el"></div>
                    <div class="el_2 el"></div>
                    <div class="el_3 el"></div>
                </div>
                <div class="logo">
                    
                </div>
                <div class="btn_logout" onclick="logout()">
                    <div class="obrazek">

                    </div>
                    <div string_id="4" class="text">
                        <!--string odlasit-->
                    </div>
                </div>
            </div>

            <div class="rada_2">

                <div class="menu">

                    <div class="user_info">
                        <?php
                            echo $user;
                        ?>
                    </div>

                    <div class="menu_nadpis polozka_menu" string_id="2">
                    </div>
                    <div class="kontainer_moje_seznamy kontainer_seznamu_menu">
                        <div class="polozka_menu odkaz">
                            Seznam 1258ij ij ijo  oij ioj ij ij oji oi oi n ion io ni nj jn io n oin io jio ji joj j o ijo jj oj 
                        </div>
                        <div class="polozka_menu odkaz">
                            Seznam 3582
                        </div>
                        <div class="btn_pridat_seznam" id="btn_pridej_seznam">
                            <div class="btn" onclick="pridej_seznam()" string_id="5">
                            </div>
                        </div>
                    </div>

                    <div string_id="3" class="menu_nadpis polozka_menu">
                        <!--string sdilene seznamy-->
                    </div>
                    <div class="kontainer_sdilene_seznamy kontainer_seznamu_menu">
                        <div class="polozka_menu">
                            žádný seznam
                        </div>
                    </div>

                    <div string_id="6" class="menu_nadpis polozka_menu">
                        <!--string nastaveni-->
                    </div>

                    <div class="nastaveni_polozka">
                        <span string_id="7"><!--string Jazyk--></span>: 
                        <span class="odkaz_nastaveni_flag" onclick="zmen_jazyk(this)" lang="cz"><!--string cesky--></span><!--
                     --><span class="odkaz_nastaveni_flag" onclick="zmen_jazyk(this)" lang="en"><!--string anglicky--></span><!--
                     --><span class="odkaz_nastaveni_flag" onclick="zmen_jazyk(this)" lang="de"><!--string něměcky--></span>
                    </div>

                    <div class="nastaveni_polozka">
                        <span string_id="21"><!--string Motiv--></span>:
                        <span class="odkaz_nastaveni" onclick="zmen_motiv(this)" set="light" string_id="22"><!--string svetly--></span>,
                        <span class="odkaz_nastaveni" onclick="zmen_motiv(this)" set="dark" string_id="23"><!--string tmavy--></span>
                    </div>
                    <div class="nastaveni_polozka">
                        <span class="odkaz_nastaveni" onclick="vymaz_muj_ucet_click()" string_id="24"><!--string vymazat muj ucet--></span>
                    </div>

                    <div class="nastaveni_polozka">
                        <span class="odkaz_nastaveni" onclick="zmenit_heslo_form()" string_id="67"><!--string zmen heslo--></span>
                    </div>

                </div><!--
             --><div class="hlavni_obsah">

                    <!-- MÍSTO PRO SEZNAM -->

                </div>
            </div>

            <?php
                include 'php/import_footer.php';
            ?>
            
        </div>

        

    </div>

    <?php
        echo '
            <script>
                var posledni_otevreny_seznam_usera = ' . $posledni_otevreny_seznam . ';
                var user = "' . $user . '";
            </script>
        ';
    ?>

   

    <script src="js/script.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
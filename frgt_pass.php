<?php
session_start();
if (isset($_SESSION['user'])) {
    header("Location: app.php");
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/style.css">
    <link rel="shortcut icon" href="/res/fav.png">
    <title>ToDo app - zapomenuté heslo</title>
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

    </script>

    <div class="kontainer_vlajek">  
        <span string_id="108" class="text_jazyk"><!--jazyk--></span>
        <a href="" class="vlajka_odkaz cz" onclick="localStorage['lang'] = 'cz'"></a>
        <a href="" class="vlajka_odkaz en" onclick="localStorage['lang'] = 'en'"></a>
        <a href="" class="vlajka_odkaz de" onclick="localStorage['lang'] = 'de'"></a>
    </div>

    <div class="zapomenute_heslo_cont">
        <div class="inner">

            <div class="logo_img">
                <div class="img" onclick="window.location.href = 'index.php'">

                </div>
            </div>

            <div class="frgt_pswd_form">
                <h1 string_id="86"><!--Zapomenuté heslo--></h1>

                <div class="kontainer_formulare .form">

                    <div class="polozka">
                        <span class="label">e-mail: <span class="error" id="email_error"></span></span>
                        <input type="text" autocomplete="email" id="email">
                    </div>

                    <div class="btn_register" id="zaslat_zapomenute_heslo">
                        <div class="inner" onclick="zaslat_zapomeute_heslo()">
                            <div class="icon">
                            
                            </div>
                            <div class="text" string_id="88">
                                <!--Obnova hesla-->
                            </div>
                        </div>
                    </div>

                </div>
                
            </div>

        </div>

        <?php
            include 'php/import_footer.php';
        ?>
    </div>

   

    <script src="js/script.js"></script>
    <script src="js/frgt_pswd.js"></script>
</body>
</html>
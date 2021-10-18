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
    <title>ToDo app - register</title>
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
    <div class="register_cont">
        <div class="inner">

            <div class="logo_img">
                <div class="img" onclick="window.location.href = 'index.php'">

                </div>
            </div>

            <div class="register_form">
                <h1 string_id="93"><!--Registrace--></h1>

                <form class="kontainer_formulare">

                    <div class="polozka">
                        <span class="label">email: <span class="error" id="email_error"></span></span>
                        <input type="text" autocomplete="email" id="email">
                    </div>

                    <div class="polozka">
                        <span class="label" string_id="103"><!--heslo:--> </span><span class="error" id="heslo_error"></span>
                        <input type="password" autocomplete="new-password" id="heslo">
                    </div>

                    <div class="polozka">
                        <span class="label" string_id="94">heslo znovu:</span>
                        <input type="password" autocomplete="new-password" id="heslo_conf">
                    </div>

                    <div class="btn_register">
                        <div class="inner" onclick="register()">
                            <div class="icon">
                            
                            </div>
                            <div class="text" string_id="85">
                                <!--Registrovat-->
                            </div>
                        </div>
                    </div>

                </form>
                
            </div>

            <p style="text-align: center" id="mate_jiz_ucet"><span string_id="95"><!--Máte již učet?--></span> <a href="login.php" style="font-weight: 300;color: #929292;" string_id="96"><!--Přihlaste se--></a></p>

        </div>
    </div>

    <script src="js/script.js"></script>
    <script src="js/register.js"></script>
</body>
</html>
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
    <title>ToDo app - login</title>
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

    <div class="login_cont">
        <div class="inner">

            <div class="logo_img">
                <div class="img" onclick="window.location.href = 'index.php'">

                </div>
            </div>

            <div class="login_form">
                <h1 string_id="82">Login</h1>

                <div class="error" id="error_element">

                </div>

                <div class="login_name_cont login_input_cont">
                    <span class="icon">

                    </span>
                    <input type="text" placeholder="e-mail" autocomplete="email" id="email_input">
                </div>

                <div class="login_pass_cont login_input_cont">
                    <span class="icon">

                    </span>
                    <input type="password" id="password_input">
                </div>

                <div class="btn_login">
                    <div class="inner" onclick="login()">
                        <div class="icon">
                        
                        </div>
                        <div class="text" string_id="83">
                            Login
                        </div>
                    </div>
                </div>
            </div>

            <a href="register.php" style="font-size: 1.1rem;font-weight: bold;" string_id="85"><!--Registrovat se--></a>
            <a href="frgt_pass.php" style="margin-top: 1rem;" string_id="86"><!--Zapomenuté heslo--></a>

        </div>

        <?php
            include 'php/import_footer.php';
        ?>
    </div>

    <script src="js/script.js"></script>
    <script src="js/login.js"></script>
</body>
</html>
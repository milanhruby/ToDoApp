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
<body>
<div class="register_cont">
        <div class="inner">

            <div class="logo_img">
                <div class="img" onclick="window.location.href = 'index.php'">

                </div>
            </div>

            <div class="register_form">
                <h1>Registrace</h1>

                <form class="kontainer_formulare">

                    <div class="polozka">
                        <span class="label">email: <span class="error" id="email_error"></span></span>
                        <input type="text" autocomplete="email" id="email">
                    </div>

                    <div class="polozka">
                        <span class="label">heslo: <span class="error" id="heslo_error"></span></span>
                        <input type="password" autocomplete="new-password" id="heslo">
                    </div>

                    <div class="polozka">
                        <span class="label">heslo znovu:</span>
                        <input type="password" autocomplete="new-password" id="heslo_conf">
                    </div>

                    <div class="btn_register">
                        <div class="inner" onclick="register()">
                            <div class="icon">
                            
                            </div>
                            <div class="text">
                                Registrovat
                            </div>
                        </div>
                    </div>

                </form>
                
            </div>

            <p style="text-align: center">Máte již učet? <a href="login.php" style="font-weight: 300;color: #929292;">Přihlaste se</a></p>

        </div>
    </div>

    <script src="js/script.js"></script>
    <script src="js/register.js"></script>
</body>
</html>
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
<body>

    <div class="login_cont">
        <div class="inner">

            <div class="logo_img">
                <div class="img" onclick="window.location.href = 'index.php'">

                </div>
            </div>

            <div class="login_form">
                <h1>Login</h1>

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
                    <input type="password" placeholder="heslo" id="password_input">
                </div>

                <div class="btn_login">
                    <div class="inner" onclick="login()">
                        <div class="icon">
                        
                        </div>
                        <div class="text">
                            Login
                        </div>
                    </div>
                </div>
            </div>

            <a href="register.php" style="font-size: 1.1rem;font-weight: bold;">Registrovat se</a>
            <a href="frgt_pass.php" style="margin-top: 1rem;">Zapomenuté heslo</a>

        </div>

        <?php
            include 'php/import_footer.php';
        ?>
    </div>

    <script src="js/script.js"></script>
    <script src="js/login.js"></script>
</body>
</html>
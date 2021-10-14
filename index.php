<?php
session_start();

function redirect($page) {
    header("Location: $page");
}
if (isset($_SESSION['user'])) {
    redirect("app.php");
} else {
    redirect("login.php");
}
?>
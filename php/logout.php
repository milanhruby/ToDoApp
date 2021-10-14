<?php
session_start();

if (isset($_SESSION['user'])) {
    unset($_SESSION['user']);
}

if (!isset($_SESSION['user'])) {
    echo 'ok';
} else {
    echo 'chyba odhlášení';
}
?>
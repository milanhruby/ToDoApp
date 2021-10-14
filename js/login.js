window.addEventListener('load',function() {
    document.getElementById('password_input').addEventListener('keyup',function(e) {
        if (e.key == "Enter") {login();}
    });
    document.getElementById('email_input').addEventListener('keyup',function(e) {
        if (e.key == "Enter") {login();}
    });
});

function login() {
    spinner(1);
    var heslo = encodeURIComponent(document.getElementById('password_input').value);
    var email = encodeURIComponent(document.getElementById('email_input').value);

    if (email == "") {
        document.getElementById('error_element').innerHTML = "Email musí být vyplněn";
        document.getElementById('password_input').value = "";
        spinner();
        return;
    }

    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved == "notok") {
                    document.getElementById('error_element').innerHTML = "Nesprávnný uživatel nebo heslo";
                    document.getElementById('password_input').value = "";
                } else if (odpoved == "ok") {
                    window.location.reload();
                    document.getElementById('error_element').innerHTML = "";
                } else if (odpoved == "format_email") {
                    document.getElementById('error_element').innerHTML = "Nesprávný formát emailu";
                    document.getElementById('password_input').value = "";
                } else {
                    document.getElementById('password_input').value = "";
                    myalert(odpoved); 
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/login.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("email=" + email + "&heslo=" + heslo); 
}
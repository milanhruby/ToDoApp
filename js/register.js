window.addEventListener('load',function() {

    document.getElementById('heslo').addEventListener('keyup',function(e) {
        if (e.key == "Enter") {register();}
    });

    document.getElementById('heslo_conf').addEventListener('keyup',function(e) {
        if (e.key == "Enter") {register();}
    });

    document.getElementById('email').addEventListener('keyup',function(e) {
        if (e.key == "Enter") {register(); }
    });

});

function register() {
    spinner(1);
    var email = encodeURIComponent(document.getElementById('email').value);
    var heslo = encodeURIComponent(document.getElementById('heslo').value);
    var heslo_conf = encodeURIComponent(document.getElementById('heslo_conf').value);

    var email_error_element = document.getElementById('email_error');
    var heslo_error_element = document.getElementById('heslo_error');


    if (email == "") {
        email_error_element.innerHTML = " Email musí být vyplněn";
        heslo_error_element = "";
        document.getElementById('heslo').value = "";
        document.getElementById('heslo_conf').value = "";
        spinner();
        return;
    }

    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved == "hesla_se_neshoduji") {
                    email_error_element.innerHTML = "";
                    heslo_error_element.innerHTML = " Hesla se neshodují";
                    document.getElementById('heslo').value = "";
                    document.getElementById('heslo_conf').value = "";
                } else if (odpoved == "ok") {
                    email_error_element.innerHTML = "";
                    heslo_error_element.innerHTML = "";
                    document.getElementById('heslo').value = "";
                    document.getElementById('heslo_conf').value = "";
                    zobraz_dokonceni_registrace();
                    // casovač, poté přesměrování na app.php
                } else if (odpoved == "format_email") {
                    email_error_element.innerHTML = " Nesprávný formát emailu";
                    heslo_error_element.innerHTML = "";
                    document.getElementById('heslo').value = "";
                    document.getElementById('heslo_conf').value = "";
                } else if (odpoved == "kratke_heslo") {
                    email_error_element.innerHTML = "";
                    heslo_error_element.innerHTML = "Heslo musí obsahovat alespoň 8 znaků";
                    document.getElementById('heslo').value = "";
                    document.getElementById('heslo_conf').value = "";
                } else if (odpoved == "user_existuje") {
                    email_error_element.innerHTML = "Uživatel s tímto e-mailem již existuje";
                    heslo_error_element.innerHTML = "";
                    document.getElementById('heslo').value = "";
                    document.getElementById('heslo_conf').value = "";
                } else {
                    email_error_element.innerHTML = "";
                    heslo_error_element.innerHTML = "";
                    document.getElementById('heslo').value = "";
                    document.getElementById('heslo_conf').value = "";
                    myalert(odpoved); 
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/register.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("email=" + email + "&heslo=" + heslo + "&heslo_conf=" + heslo_conf); 


}

function zobraz_dokonceni_registrace() {
    document.querySelector('.kontainer_formulare').remove();
    var novy_element = document.createElement('p');
    novy_element.classList.add('text_o_reg_emailu');
    novy_element.appendChild(document.createTextNode('Registraci dokončíte kliknutím na odkaz, který jsme Vám odeslali na e-mail'));
    document.querySelector('.register_form').appendChild(novy_element);
}


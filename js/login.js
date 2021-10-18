window.addEventListener('load',function() {
    document.getElementById('password_input').addEventListener('keyup',function(e) {
        if (e.key == "Enter") {login();}
    });
    document.getElementById('email_input').addEventListener('keyup',function(e) {
        if (e.key == "Enter") {login();}
    });

// naplň stringy

    // vybrání všech elementů, které mají attribut string_id. Znamená to, že se do nich dopní string dle jazyka
    var kontainery_stringu = document.querySelectorAll('*[string_id]');
    var IDs = [];
    kontainery_stringu.forEach(kontainer => {
        IDs.push(kontainer.getAttribute('string_id'));
    });
    if (IDs.length > 0) {
        IDs = IDs.join(';');
        var pole_stringu = vrat_string(IDs);
        pole_stringu.forEach(string_par => {
            var id = string_par.split('<;DELIM_ELEMENT;>')[0];
            var string = string_par.split('<;DELIM_ELEMENT;>')[1];
            if (document.querySelector('*[string_id="' + id + '"]') != null) {
                document.querySelector('*[string_id="' + id + '"]').innerHTML = string;
            }
        })
    }

    document.getElementById('password_input').setAttribute('placeholder',vrat_string(84));

});

function login() {
    spinner(1);
    var heslo = encodeURIComponent(document.getElementById('password_input').value);
    var email = encodeURIComponent(document.getElementById('email_input').value);

    if (email == "") {
        document.getElementById('error_element').innerHTML = vrat_string(91); // Email musí být vyplněn
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
                    document.getElementById('error_element').innerHTML = vrat_string(104); // Nesprávnný uživatel nebo heslo
                    document.getElementById('password_input').value = "";
                } else if (odpoved == "ok") {
                    window.location.reload();
                    document.getElementById('error_element').innerHTML = "";
                } else if (odpoved == "format_email") {
                    document.getElementById('error_element').innerHTML = vrat_string(48); // Nesprávný formát emailu
                    document.getElementById('password_input').value = "";
                } else if (odpoved == "nedokoncena_registrace") {
                    document.getElementById('error_element').innerHTML = vrat_string(105); // Nedokončená registrace
                    document.getElementById('password_input').value = "";
                    myalert(vrat_string(106)); // Nedokončili jste registraci kliknutím na odkaz, kterým jsme Vám zaslali na email.
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
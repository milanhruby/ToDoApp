window.addEventListener('load',function() {

    document.getElementById('email').addEventListener('keyup',function(e) {
        if (e.key == "Enter") {e.preventDefault(); zaslat_zapomeute_heslo(); }
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

});

function zaslat_zapomeute_heslo() {
    zobraz_chybu("");
    var email = document.getElementById('email').value;
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved == "ok") {
                    // vymaž kontainer formuláře a nahraď ho hláškou, že bylo odesláno nové heslo na email
                    document.querySelector('.kontainer_formulare').remove();
                    var novy_element = document.createElement('div');
                    novy_element.classList.add('obnova_ok_element');
                    var p = document.createElement('p');
                    p.classList.add('p');
                    p.appendChild(document.createTextNode(vrat_string(89))); // string = A new replacement password has been sent to your email. Please use it to log in and we recommend that you change it immediately after logging in.
                    var p2 = document.createElement('p');
                    p2.classList.add('p2');
                        var a = document.createElement('a');
                        a.appendChild(document.createTextNode(vrat_string(83))); // string = Přihlásit se
                        a.setAttribute('href','login.php');
                        p2.appendChild(a);
                    novy_element.appendChild(p);
                    novy_element.appendChild(p2);
                    document.querySelector('.frgt_pswd_form').appendChild(novy_element);
                    
                } else if (odpoved == "error - user not found") {
                    zobraz_chybu(vrat_string(90)); // stiring = Uživatel s tímto e-mailem nebyl nalezen.
                } else if (odpoved == "E-mail musí být vyplněn.") {
                    zobraz_chybu(vrat_string(91));
                } else if (odpoved == "E-mail je ve špatném formátu.") {
                    zobraz_chybu(vrat_string(48));
                } else if (odpoved == "sql_chyba při ukládání nového hesla do databáze") {
                    zobraz_chybu(vrat_string(92))
                } else {
                    zobraz_chybu(odpoved); 
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/zapomenute_heslo.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("email=" + email); 
}

function zobraz_chybu(text) {
    var chyba_element = document.getElementById('email_error');
    chyba_element.innerHTML = text;
}
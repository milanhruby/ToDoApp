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

function register() {
    spinner(1);
    var email = encodeURIComponent(document.getElementById('email').value);
    var heslo = encodeURIComponent(document.getElementById('heslo').value);
    var heslo_conf = encodeURIComponent(document.getElementById('heslo_conf').value);

    var email_error_element = document.getElementById('email_error');
    var heslo_error_element = document.getElementById('heslo_error');

    var lang = document.getElementById('body').getAttribute('lang');


    if (email == "") {
        email_error_element.innerHTML = " " + vrat_string(91); // email musí být vyplněn
        heslo_error_element.innerHTML = "";
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
                    heslo_error_element.innerHTML = " " + vrat_string(97); // Hesla se neshodují
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
                    email_error_element.innerHTML = " " + vrat_string(48); // Nesprávný formát emailu
                    heslo_error_element.innerHTML = "";
                    document.getElementById('heslo').value = "";
                    document.getElementById('heslo_conf').value = "";
                } else if (odpoved == "kratke_heslo") {
                    email_error_element.innerHTML = "";
                    heslo_error_element.innerHTML = " " + vrat_string(98); // Heslo musí obsahovat alespoň 8 znaků
                    document.getElementById('heslo').value = "";
                    document.getElementById('heslo_conf').value = "";
                } else if (odpoved == "user_existuje") {
                    email_error_element.innerHTML = " " + vrat_string(99); // Uživatel s tímto e-mailem již existuje
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
    xhttp.send("email=" + email + "&heslo=" + heslo + "&heslo_conf=" + heslo_conf + "&lang=" + lang); 


}

function zobraz_dokonceni_registrace() {
    document.querySelector('.kontainer_formulare').remove();
    document.getElementById('mate_jiz_ucet').remove();

    var kontainer_reg_mail_odeslan = document.createElement('div');
    kontainer_reg_mail_odeslan.classList.add('kontainer_reg_mail_odeslan');
    document.querySelector('.register_form').appendChild(kontainer_reg_mail_odeslan);

        var h2 = document.createElement('h2');
        h2.appendChild(document.createTextNode('✓ ' + vrat_string(100)));
        kontainer_reg_mail_odeslan.appendChild(h2);

        var text_o_reg_emailu = document.createElement('p');
        text_o_reg_emailu.classList.add('text_o_reg_emailu');
        kontainer_reg_mail_odeslan.appendChild(text_o_reg_emailu);
        var span_bold = document.createElement('span');
        span_bold.style.fontWeight = "bold";
        span_bold.appendChild(document.createTextNode(vrat_string(101))); // Registraci dokončíte kliknutím na odkaz
        text_o_reg_emailu.appendChild(span_bold);
        text_o_reg_emailu.appendChild(document.createTextNode(vrat_string(102))); // , který jsme Vám odeslali na e-mail
}


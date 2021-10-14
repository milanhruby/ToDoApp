window.addEventListener('load',function() {

    document.getElementById('email').addEventListener('keyup',function(e) {
        if (e.key == "Enter") {e.preventDefault(); zaslat_zapomeute_heslo(); }
    });

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
                    p.appendChild(document.createTextNode('Na e-mail Vám bylo zasláno nové náhradní heslo. Použijte ho prosím pro přihlášení a doporučujeme si ho ihned po přihlášení změnit.'));
                    var p2 = document.createElement('p');
                    p2.classList.add('p2');
                        var a = document.createElement('a');
                        a.appendChild(document.createTextNode('Přihlásit se'));
                        a.setAttribute('href','login.php');
                        p2.appendChild(a);
                    novy_element.appendChild(p);
                    novy_element.appendChild(p2);
                    document.querySelector('.frgt_pswd_form').appendChild(novy_element);
                    
                } else if (odpoved == "error - user not found") {
                    zobraz_chybu('Uživatel s tímto e-mailem nebyl nalezen.'); 
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
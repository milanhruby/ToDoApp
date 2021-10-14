var scroll_top = 0;
var scroll_left = 0;

function spinner(typ) {
    if (typ == 1) {
        zakaz_scroll();
        var spinner = document.createElement('div');
        spinner.classList.add('spinner');
        var body = document.querySelector('body');
        body.insertBefore(spinner,body.firstChild);
    } else {
        povol_scroll();
        var spinnery = document.querySelectorAll('.spinner');
        spinnery.forEach(el => {
            el.remove();
        });
    }
    
}

function myalert(string) {
    if (string != undefined) {
        zakaz_scroll();
        var myalert = document.createElement('div');
        myalert.classList.add('myalert');
        var body = document.querySelector('body');
        body.insertBefore(myalert,body.firstChild);

        var text_element = document.createElement('div');
        text_element.classList.add('text_element');
        var text = document.createTextNode(string);
        text_element.appendChild(text);
        myalert.appendChild(text_element);
        var ok_btn = document.createElement('div');
        ok_btn.classList.add('ok_btn');
        ok_btn.appendChild(document.createTextNode('OK'));
        ok_btn.setAttribute('onclick','myalert()');
        text_element.appendChild(document.createElement('br'));
        text_element.appendChild(ok_btn);
    } else {
        povol_scroll();
        var myalert = document.querySelectorAll('.myalert');
        myalert.forEach(el => {
            el.remove();
        });
    }
}

function myPrompt(nadpis_string,text_string,funkce,typ_inputu) {

    // vymazání starých dialogů
    var dialogy = document.querySelectorAll('.myPrompt , .bile_pozadi');
    dialogy.forEach(element => {
        element.remove();
    });

    if (nadpis_string === undefined) {
        return;
    }

    var body = document.querySelector('body');

    // vytvoření bílého pozadí
    var bile_pozadi = document.createElement('div');
    bile_pozadi.classList.add('bile_pozadi');
    body.insertBefore(bile_pozadi,body.firstChild); 

    // vytvoření dialogu
    var myPrompt = document.createElement('div');
    myPrompt.classList.add('myPrompt');
    myPrompt.classList.add("absolutni_element_dimensions");

    // vytvoření nadpisu
    var nadpis = document.createElement('p');
    nadpis.classList.add('nadpis');
    nadpis.appendChild(document.createTextNode(nadpis_string));
    myPrompt.appendChild(nadpis);

    // vytvoření textu
    var text = document.createElement('p');
    text.classList.add('text');
    text.appendChild(document.createTextNode(text_string));
    myPrompt.appendChild(text);

    // vytvoření inputu
    var input = document.createElement('input');
    if (typ_inputu == "pass") input.setAttribute('type','password');
    input.addEventListener('keyup',function(e) {if (e.key == "Enter") {input.parentElement.querySelector('.btn').click();}});
    myPrompt.appendChild(input);
    
    // vytvoření tlačítka
    var btn = document.createElement('div');
    btn.classList.add('btn');
    btn.appendChild(document.createTextNode(vrat_string(16)));
    btn.setAttribute('onclick',funkce);
    myPrompt.appendChild(btn);

    // vytvoření close btn
    var close_btn = document.createElement('div');
    close_btn.classList.add('close_btn');
    close_btn.setAttribute('onclick','myPrompt()');
    close_btn.appendChild(document.createTextNode("×"));
    myPrompt.appendChild(close_btn);



    
    body.insertBefore(myPrompt,body.firstChild);
    
    input.focus();
}

function zakaz_scroll() {
    // soucasny scroll offset
    scroll_top = window.pageYOffset;
    scroll_left = window.pageXOffset;
    // při scrollu, nastav vždy scroll offset na puvodní hodnotu
    window.onscroll = function() {
        window.scrollTo(scroll_top,scroll_left);
    }
}

function povol_scroll() {
    window.onscroll = function() {};
}

function logout() {
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved == "ok") {
                    window.location.reload();
                } else {
                    myalert('chyba' + odpoved);
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/logout.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(); 
}
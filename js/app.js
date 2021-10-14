var seznamy_naplneny = 0;

window.addEventListener('load',function() {

// naplň seznam seznamů:
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var odpoved = this.responseText;
                if (odpoved.split('<;;;>')[0] != "ok") {
                    myalert(odpoved);
                } else {

                    var kontainer_odkazu_na_seznamy = document.querySelector('.kontainer_moje_seznamy , .kontainer_seznamu_menu');
                    
                    // nejdříve vymazat staré odkazy
                    var stare_odkazy = kontainer_odkazu_na_seznamy.querySelectorAll('.polozka_menu , .odkaz');
                    stare_odkazy.forEach(element => {
                        element.remove();
                    });

                    var data = odpoved.split('<;;;>')[1];

                    if (data == "0") {
                        var p = document.createElement('p');
                        let text_zadny_seznam = vrat_string(1);
                        p.appendChild(document.createTextNode(text_zadny_seznam));
                        p.classList.add('text_zadny_senam');
                        kontainer_odkazu_na_seznamy.insertBefore(p,document.getElementById('btn_pridej_seznam'));

                        // zobraz hlášku o žádném seznamu k otevření
                        document.querySelectorAll('.otevreny_seznam').forEach(element => {
                            element.remove();
                        });
                        var zadny_seznam_kont = document.createElement('div');
                        zadny_seznam_kont.classList.add('zadny_seznam_kont');
                        document.querySelectorAll('.hlavni_obsah')[0].appendChild(zadny_seznam_kont);

                        var p = document.createTextNode(vrat_string(25));
                        zadny_seznam_kont.appendChild(p);

                    } else {
                        data = data.split('<!!!>');
                        
                        // data = pole seznamu  
                        data.forEach(seznam => {
                            if (seznam != "") {
                                var data_seznamu = seznam.split('<--->');
                                // data_seznamu[0] = id
                                // data_seznamu[1] = název seznamu
                                var div = document.createElement('div');
                                div.classList.add('polozka_menu');
                                div.classList.add('odkaz');
                                div.setAttribute('ïd_seznamu',data_seznamu[0]);
                                div.setAttribute('typ',"seznam_odkaz");
                                div.setAttribute('onclick','otevri_seznam(this)');
                                var text = document.createTextNode(data_seznamu[1]);
                                div.appendChild(text);
                                kontainer_odkazu_na_seznamy.insertBefore(div,document.getElementById('btn_pridej_seznam'));
                            }
                        });
                        
                    }

                    seznamy_naplneny += 1;
                    otevri_posledni_useruv_otevreny_seznam();
                    
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/vrat_data.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ_dat=seznamy"); 

// naplň seznam sdílených seznamů

    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved.split('<!!!!!>')[0] == 'ok') {
                    var data_sdilenych_seznamu = odpoved.split('<!!!!!>')[1];
                    document.querySelectorAll('.kontainer_sdilene_seznamy .polozka_menu').forEach(element => {element.remove();});
                    if (data_sdilenych_seznamu == "0") {
                        // žádný seznam
                        var polozka_menu = document.createElement('div');
                        polozka_menu.classList.add('polozka_menu');
                        polozka_menu.appendChild(document.createTextNode(vrat_string(10))); // string žádné seznamy
                        document.querySelector('.kontainer_sdilene_seznamy').appendChild(polozka_menu);
                    } else {
                        // nějaké seznamy existují
                        var seznamy = data_sdilenych_seznamu.split('<!DELIM_1!>');
                        seznamy.forEach(seznam => {
                            var id_seznamu = seznam.split('<!DELIM!>')[0];
                            var nazev_seznamu = seznam.split('<!DELIM!>')[1];
                            var autor_seznamu = seznam.split('<!DELIM!>')[2];

                            var polozka_menu = document.createElement('div');
                            polozka_menu.classList.add('polozka_menu');
                            polozka_menu.classList.add('odkaz');
                            polozka_menu.setAttribute('ïd_seznamu',id_seznamu);
                            polozka_menu.setAttribute('nazev_seznamu',nazev_seznamu);
                            polozka_menu.setAttribute('typ',"seznam_odkaz");
                            polozka_menu.setAttribute('autor_seznamu',autor_seznamu);
                            polozka_menu.setAttribute('onclick','otevri_seznam(this)');
                            polozka_menu.appendChild(document.createTextNode(nazev_seznamu));
                            document.querySelector('.kontainer_sdilene_seznamy').appendChild(polozka_menu);
                        });
                    }
                    seznamy_naplneny += 1;
                    otevri_posledni_useruv_otevreny_seznam();
                } else if (odpoved == "prihlaseny_user_nenalezen") {
                    myalert(vrat_string(25));
                } else {
                    myalert(odpoved);
                }

                // else
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/vrat_data.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ_dat=sdilene_seznamy"); 
    
    

// naplň stringy

    // vybrání všech elementů, které mají attribut string_id. Znamená to, že se do nich dopní string dle jazyka
    var kontainery_stringu = document.querySelectorAll('*[string_id]');
    var IDs = [];
    kontainery_stringu.forEach(kontainer => {
        IDs.push(kontainer.getAttribute('string_id'));
    });
    IDs = IDs.join(';');
    var pole_stringu = vrat_string(IDs);
    pole_stringu.forEach(string_par => {
        var id = string_par.split('<;DELIM_ELEMENT;>')[0];
        var string = string_par.split('<;DELIM_ELEMENT;>')[1];
        if (document.querySelector('*[string_id="' + id + '"]') != null) {
            document.querySelector('*[string_id="' + id + '"]').innerHTML = string;
        }
    });



// vytvoř čáry mezi úkoly
    vytvor_a_nastav_cary_mezi_ukoly();

    spinner();

});

window.addEventListener("resize", function() {
    vytvor_a_nastav_cary_mezi_ukoly();
});

function otevri_posledni_useruv_otevreny_seznam() {
    // Otevři userův poslední otevřený seznam
    if (seznamy_naplneny == 2) {
        // poslední otevřený seznam je v DOMU - otevře se tedy
        if (document.querySelectorAll('div[typ="seznam_odkaz"][ïd_seznamu="' + posledni_otevreny_seznam_usera + '"]').length > 0) {
            document.querySelectorAll('div[typ="seznam_odkaz"][ïd_seznamu="' + posledni_otevreny_seznam_usera + '"]')[0].click();
        } else if (document.querySelectorAll('div[typ="seznam_odkaz"]').length > 0) {
            // posl. otevřený seznam v seznamu seznamů není. Otevře se tedy první seznam, pokud existuje
            document.querySelectorAll('div[typ="seznam_odkaz"]')[0].click();
        } else {
            // poslední userův seznam není v seznamu seznamů.
        }
    }
}

function otevri_seznam(element) {

    var menu = document.querySelector('.menu');

    // pokud he otevřené mobilní menu, zavři ho
    if (menu.classList.contains('otevrene')) {
        menu.classList.remove('otevrene');
        haburger_trans('zavrit');
    }


    if (element.parentElement.classList.contains('kontainer_sdilene_seznamy')) {
        var typ_seznamu = "sdileny_seznam";
    } else if (element.parentElement.classList.contains('kontainer_moje_seznamy')) {
        var typ_seznamu = "vlastni_seznam";
    } else {
        myalert(vrat_string(27));
        return;
    }

    spinner(1);

    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved.split("<!!!!!>")[0] == "ok") {

                    var data_seznamu = odpoved.split("<!!!!!>")[1];
                    var ukoly_k_seznamu = odpoved.split("<!!!!!>")[2];

                    // data seznamu
                    var id_seznamu = data_seznamu.split("<!DELIM!>")[0];
                    var nazev_seznamu = data_seznamu.split("<!DELIM!>")[1];
                    var vlastnik_seznamu = data_seznamu.split("<!DELIM!>")[2];
                    if (typ_seznamu == "sdileny_seznam") {
                        var seznam_sdilen_s = "";
                    } else {
                        var seznam_sdilen_s = data_seznamu.split("<!DELIM!>")[3];
                        seznam_sdilen_s = seznam_sdilen_s.replace(/<mail>/g, '');
                        seznam_sdilen_s = seznam_sdilen_s.replace(/<\/mail>/g, '');
                        seznam_sdilen_s = seznam_sdilen_s.split(';');
                    }

                    
                    // vymaž původní konteiner s ukoly pro zobrazený seznam
                    if (document.querySelector('.otevreny_seznam') != null) {
                        document.querySelector('.otevreny_seznam').remove();
                    }

                    // vytvoř nový konteiner pro otevřený seznam
                    var otevreny_seznam = document.createElement('div');
                    otevreny_seznam.classList.add('otevreny_seznam');
                    otevreny_seznam.setAttribute('id_seznamu' , id_seznamu);
                    document.querySelector('.hlavni_obsah').appendChild(otevreny_seznam);

                    // vytvoření panelu s názvem seznamu 
                    var nadpis_seznamu = document.createElement('div');
                    nadpis_seznamu.appendChild(document.createTextNode(nazev_seznamu));
                    nadpis_seznamu.classList.add('nadpis_seznamu');
                    otevreny_seznam.appendChild(nadpis_seznamu);

                    // vytvoření panelu s tlačítky pro úpravu seznamu (liší dle toho, jestli je user vlastníkem seznamu, nebo je s ním jen sdílen)
                    var konteiner_tlacitek_akci = document.createElement('div');
                    konteiner_tlacitek_akci.classList.add('konteiner_tlacitek_akci');
                    otevreny_seznam.appendChild(konteiner_tlacitek_akci);

                        // naplnění panul tlačítek obsahem (dle vlastnictví seznamu)
                        if (typ_seznamu == "sdileny_seznam") {
                            var info_sdili_s_vami = document.createElement('div');
                            info_sdili_s_vami.classList.add('info_sdilen_s');
                                    var text = document.createElement('span');
                                    text.classList.add('text');
                                    var barevny_text = document.createElement('span');
                                    barevny_text.classList.add('barevny_text');
                                    barevny_text.appendChild(document.createTextNode(vrat_string(38)));
                                    text.appendChild(barevny_text);
                                    text.appendChild(document.createElement('br'));
                                    text.appendChild(document.createTextNode(vlastnik_seznamu));
                                    info_sdili_s_vami.appendChild(text);
                                    var close_btn = document.createElement('span');
                                    close_btn.classList.add('close_btn');
                                    close_btn.appendChild(document.createTextNode('×'));
                                    close_btn.setAttribute('onclick','zrusit_sdileni_tohoto_seznamu_s(\'' + user +'\',' + id_seznamu + ',this)');
                                    info_sdili_s_vami.appendChild(close_btn);
                                konteiner_tlacitek_akci.appendChild(info_sdili_s_vami);

                        } else {
                            var btn_share = document.createElement('div');
                            btn_share.classList.add('btn');btn_share.classList.add('share');
                            btn_share.setAttribute('onclick','sdilet_seznam()');
                            konteiner_tlacitek_akci.appendChild(btn_share);

                            var btn_delete = document.createElement('div');
                            btn_delete.classList.add('btn');btn_delete.classList.add('delete');
                            btn_delete.setAttribute('onclick','vymazat_seznam()');
                            konteiner_tlacitek_akci.appendChild(btn_delete);

                            var btn_edit = document.createElement('div');
                            btn_edit.classList.add('btn');btn_edit.classList.add('edit');
                            btn_edit.setAttribute('onclick','upravit_nazev_seznamu()');
                            konteiner_tlacitek_akci.appendChild(btn_edit);

                            var btn_refresh = document.createElement('div');
                            btn_refresh.classList.add('btn');btn_refresh.classList.add('refresh');
                            btn_refresh.setAttribute('onclick','refresh_seznam()');
                            konteiner_tlacitek_akci.appendChild(btn_refresh);

                            if (seznam_sdilen_s.length > 0) {
                                seznam_sdilen_s.forEach(sdileny_email_element => {
                                    if (sdileny_email_element != "") {
                                        var info_sdilen_s = document.createElement('div');
                                        info_sdilen_s.classList.add('info_sdilen_s');
                                            var text = document.createElement('span');
                                            text.classList.add('text');
                                            var barevny_text = document.createElement('span');
                                            barevny_text.classList.add('barevny_text');
                                            barevny_text.appendChild(document.createTextNode(vrat_string(32)));
                                            text.appendChild(barevny_text);
                                            text.appendChild(document.createElement('br'));
                                            text.appendChild(document.createTextNode(sdileny_email_element));
                                            info_sdilen_s.appendChild(text);
                                            var close_btn = document.createElement('span');
                                            close_btn.classList.add('close_btn');
                                            close_btn.appendChild(document.createTextNode('×'));
                                            close_btn.setAttribute('onclick','zrusit_sdileni_tohoto_seznamu_s(\'' + sdileny_email_element +'\',' + id_seznamu + ',this)');
                                            info_sdilen_s.appendChild(close_btn);
                                        konteiner_tlacitek_akci.appendChild(info_sdilen_s);
                                    }
                                });
                            }

                        }

                    // vytvoření kontainerů pro jednotlivé úkoly
                    var kontainer_polozek_seznamu = document.createElement('div');
                    kontainer_polozek_seznamu.classList.add('kontainer_polozek_seznamu');
                    otevreny_seznam.appendChild(kontainer_polozek_seznamu);
                    var kontainer_polozek_seznamu_inner = document.createElement('div');
                    kontainer_polozek_seznamu_inner.classList.add('kontainer_polozek_seznamu_inner');
                    kontainer_polozek_seznamu.appendChild(kontainer_polozek_seznamu_inner);


                    // zrušení označení seznamů v seznamu jako otevřené (tučné) a nastavení otevíraného seznamu tučně
                    document.querySelectorAll('.kontainer_seznamu_menu .polozka_menu.otevrena').forEach(element => {
                        element.classList.remove('otevrena');
                    });
                    document.querySelector('.polozka_menu.odkaz[ïd_seznamu="' + id_seznamu + '"]').classList.add('otevrena');
                    

                    // data položek
                    if (ukoly_k_seznamu == "SQL error") {
                        myalert(vrat_string(31));
                    } else if (ukoly_k_seznamu == "0") {
                        // žádné úkoly - vytvoří se blok s hláškou o tom, že nejsou žádné úkoly
                        var element_zadna_polozka = document.createElement('div');
                        element_zadna_polozka.classList.add('element_zadna_polozka');
                        element_zadna_polozka.appendChild(document.createTextNode(vrat_string(35)));
                        kontainer_polozek_seznamu_inner.appendChild(element_zadna_polozka);

                        
                    } else {
                            
                            
                        ukoly_k_seznamu = ukoly_k_seznamu.split('<!DELIM_UKOL!>');
                        ukoly_k_seznamu.forEach(ukol => {
                            var id_ukolu = ukol.split('<!DELIM_UKOL_INNER!>')[0];
                            var level_ukolu = ukol.split('<!DELIM_UKOL_INNER!>')[1];
                            var text_ukolu = ukol.split('<!DELIM_UKOL_INNER!>')[2];
                            var checked = ukol.split('<!DELIM_UKOL_INNER!>')[3];
                            var rozbaleny = ukol.split('<!DELIM_UKOL_INNER!>')[4];
                            var parent_ukol = ukol.split('<!DELIM_UKOL_INNER!>')[5];
                            var pozice = ukol.split('<!DELIM_UKOL_INNER!>')[6];
                            
                            vytvor_element_blok_ukolu(
                                id_ukolu,
                                level_ukolu,
                                text_ukolu,
                                checked,
                                rozbaleny,
                                parent_ukol,
                                pozice);
                        });

                        vytvor_a_nastav_cary_mezi_ukoly();
                    }

                    
                    // přidání tlačítka na přidání hlavního úkolu
                    var element_pridani_dalsiho_ukolu = document.createElement('div');
                    element_pridani_dalsiho_ukolu.classList.add('element_pridani_dalsiho_ukolu');
                    kontainer_polozek_seznamu_inner.appendChild(element_pridani_dalsiho_ukolu);
                        var div = document.createElement('div');
                        element_pridani_dalsiho_ukolu.appendChild(div);
                            var input = document.createElement('input');
                            input.setAttribute('type','text');
                            input.setAttribute('placeholder',vrat_string(12));
                            input.setAttribute('onkeyup','onkeyup_input_pridat_ukol(event,this)');
                            div.appendChild(input);
                        var span = document.createElement('span');
                        span.setAttribute('onclick','pridat_ukol(this)');
                        span.appendChild(document.createTextNode(vrat_string(11)));
                        element_pridani_dalsiho_ukolu.appendChild(span);

                } else if (odpoved == "neprihlasen_user") {
                    myalert(vrat_string(28));
                } else if (odpoved == "user_neni_v_databazi") {
                    myalert(vrat_string(17));
                } else if (odpoved == "id_seznamu_neni_cislo") {
                    myalert(vrat_string(29));
                } else if (odpoved == "zadny_seznam_opravneny") {
                    myalert(vrat_string(30));
                } else {
                    myalert(odpoved);
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/vrat_data.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ_dat=ukoly_seznamu&id_seznamu=" + element.getAttribute('ïd_seznamu')); 

}

function vytvor_element_blok_ukolu(
                                    id_ukolu,
                                    level_ukolu,
                                    text_ukolu,
                                    checked,
                                    rozbaleny,
                                    parent_ukol,
                                    pozice) {

    // prvně se vymaže hláška o tom, že není žádný úkol
    if (document.querySelector('.kontainer_polozek_seznamu_inner .element_zadna_polozka') != null) {
        document.querySelector('.kontainer_polozek_seznamu_inner .element_zadna_polozka').remove();
    } 

    // vytvoření nového bloku
    var blok_ukolu = document.createElement('div');
    blok_ukolu.classList.add('blok_ukolu');
    blok_ukolu.setAttribute('id_ukolu',id_ukolu);
    blok_ukolu.setAttribute('pozice',pozice);
    blok_ukolu.setAttribute('level_ukolu',level_ukolu);
    level_ukolu = parseInt(level_ukolu);
    if (level_ukolu == 1) {
        // blok se vytvoří přímo do kontaineru
        document.querySelector('.kontainer_polozek_seznamu_inner').insertBefore(blok_ukolu,document.querySelector('.kontainer_polozek_seznamu_inner > .element_pridani_dalsiho_ukolu'));
    } else {
        // blok se vytvoří do submenu jiného úkolu.
        if (document.querySelector('.blok_ukolu[id_ukolu="' + parent_ukol + '"]') != null) {
            document.querySelector('.blok_ukolu[id_ukolu="' + parent_ukol + '"] > .submenu').insertBefore(blok_ukolu,document.querySelector('.blok_ukolu[id_ukolu="' + parent_ukol + '"] > .submenu > .element_pridani_dalsiho_ukolu'));
        }
    }

    var checkbox_kontainer = document.createElement('div');
    checkbox_kontainer.classList.add('checkbox');
    blok_ukolu.appendChild(checkbox_kontainer);
        var checkbox_input = document.createElement("input");
        checkbox_input.setAttribute('type','checkbox');
        if (checked == "1") {
            checkbox_input.checked = true;
        } else {
            checkbox_input.checked = false;
        }
        checkbox_kontainer.appendChild(checkbox_input);
        var custom_checkbox = document.createElement('div');
        custom_checkbox.classList.add('custom_checkbox');
        custom_checkbox.setAttribute('onclick','checkbox_click(this)');
        checkbox_kontainer.appendChild(custom_checkbox);
    var move_icon = document.createElement('div');
    move_icon.classList.add('move_icon');
    move_icon.setAttribute('onmousedown',"dots_mousedown(event,this)");
    move_icon.setAttribute('ontouchstart',"dots_mousedown(event,this)");
    move_icon.classList.add('icon');
    blok_ukolu.appendChild(move_icon);
    var edit_icon = document.createElement('div');
    edit_icon.classList.add('edit_icon');
    edit_icon.setAttribute('onclick','uprav_tento_ukol(this)');
    edit_icon.classList.add('icon');
    blok_ukolu.appendChild(edit_icon);
    var delete_icon = document.createElement('div');
    delete_icon.classList.add('delete_icon');
    delete_icon.setAttribute('onclick','vymaz_tento_ukol(this)');
    delete_icon.classList.add('icon');
    blok_ukolu.appendChild(delete_icon);
    var textova_cast = document.createElement('div');
    textova_cast.classList.add('textova_cast');
    textova_cast.appendChild(document.createTextNode(text_ukolu));
    blok_ukolu.appendChild(textova_cast);
    var btn_rozbalit = document.createElement('div');
    btn_rozbalit.classList.add('btn_rozbalit');
    btn_rozbalit.classList.add('icon');
    btn_rozbalit.setAttribute('onclick','sbal_rozbal_ukol(this)');
    if (rozbaleny == "0") {
        btn_rozbalit.classList.add('sbaleny');
    }
    blok_ukolu.appendChild(btn_rozbalit);
    var submenu = document.createElement('div');
    submenu.classList.add('submenu');
    if (rozbaleny == "0") {
        submenu.classList.add('sbaleny');
    }
    blok_ukolu.appendChild(submenu);
        var element_pridani_dalsiho_ukolu = document.createElement('div');
        element_pridani_dalsiho_ukolu.classList.add('element_pridani_dalsiho_ukolu');
        submenu.appendChild(element_pridani_dalsiho_ukolu);
            var div = document.createElement('div');
            element_pridani_dalsiho_ukolu.appendChild(div);
                var input = document.createElement('input');
                input.setAttribute('type','text');
                input.setAttribute('onkeyup','onkeyup_input_pridat_ukol(event,this)');
                input.setAttribute('placeholder',vrat_string(13));
                div.appendChild(input);
            var btn_pridat_podukol = document.createElement('span');
            btn_pridat_podukol.setAttribute('onclick','pridat_ukol(this)');
            btn_pridat_podukol.appendChild(document.createTextNode(vrat_string(11))); // string přidat
            element_pridani_dalsiho_ukolu.appendChild(btn_pridat_podukol);

                                        
}

var drag_id_ukolu_ke_zmene_pozice = 0;
var drag_seznamu_ukolu_ke_zmene_pozice = 0;
var probiha_presun_ukolu = 0;
var mouseDown = 0;
var stara_pozice_ukolu = 0;
var nova_pozice_ukolu = 0;
var element_znazornujici_posun_ukolu_offset = 6;


function dots_mousedown(e,dots_element) {
    e.preventDefault();
    drag_id_ukolu_ke_zmene_pozice = dots_element.parentElement.getAttribute('id_ukolu');
    drag_seznamu_ukolu_ke_zmene_pozice = document.querySelectorAll('.otevreny_seznam[id_seznamu]')[0].getAttribute('id_seznamu');
    probiha_presun_ukolu = 1;

    var blok_ukolu = document.querySelectorAll('.blok_ukolu[id_ukolu="' + drag_id_ukolu_ke_zmene_pozice + '"]')[0];
    var kontainer_bloku_ukolu = blok_ukolu.parentElement;
            
    var temp = dots_element.parentElement.parentElement.childNodes;
    var vsechny_bloky = [];
    temp.forEach(element => {
        if (element.classList.contains('blok_ukolu')) {
            vsechny_bloky.push(element);
        }
    });
    vsechny_bloky.forEach(element => {
        if (element.getAttribute("id_ukolu") == drag_id_ukolu_ke_zmene_pozice) {
            stara_pozice_ukolu = vsechny_bloky.indexOf(element);
        }
    });

    vytvor_element_znazorneni_posunu(drag_id_ukolu_ke_zmene_pozice);
    var element_znazornujici_posun_ukolu = document.querySelectorAll('.element_znazornujici_posun_ukolu')[0];
    element_znazornujici_posun_ukolu.style.height = vsechny_bloky[stara_pozice_ukolu].scrollHeight + 10 + "px";
    element_znazornujici_posun_ukolu.style.top = (vsechny_bloky[stara_pozice_ukolu].getBoundingClientRect().top - kontainer_bloku_ukolu.getBoundingClientRect().top - element_znazornujici_posun_ukolu_offset) + "px";
}

document.body.onmousemove = function(e) { 
    drag_onmousemove(e);
}

document.body.ontouchmove = function(e) { 
    drag_onmousemove(e);
}

function drag_onmousemove(e) {
    var element_znazornujici_posun_ukolu = document.querySelectorAll('.element_znazornujici_posun_ukolu')[0];
    
    if (probiha_presun_ukolu == 1 ) {
        if (mouseDown == 1) {
            drag_id_ukolu_ke_zmene_pozice; // id posouvaného úkolu
            
            if (e.type == 'touchmove') {
                var pozice_mysi_na_strance = e.changedTouches[0].pageY;
            } else {
                var pozice_mysi_na_strance = e.pageY;
            }

            var blok_ukolu = document.querySelectorAll('.blok_ukolu[id_ukolu="' + drag_id_ukolu_ke_zmene_pozice + '"]')[0];
            var kontainer_bloku_ukolu = blok_ukolu.parentElement;

            var max_top_pozice = kontainer_bloku_ukolu.getBoundingClientRect().top;
            var max_bottom_pozice = kontainer_bloku_ukolu.getBoundingClientRect().bottom ;

            // od spodni pozice se odecte vyska elementu pro pridani ukolu. Pod nej totiž nejde ukol posunout
            var vyska_elementu_pro_pridani_ukolu = kontainer_bloku_ukolu.querySelector('.element_pridani_dalsiho_ukolu').scrollHeight + 11; // 11px je marin-top
            max_bottom_pozice = max_bottom_pozice - vyska_elementu_pro_pridani_ukolu;

            // ulození všech bloků v kontaineru pro další zpracování jejich pozic
            var vsechny_bloky_temp = kontainer_bloku_ukolu.childNodes;
            var vsechny_bloky = [];
            vsechny_bloky_temp.forEach(blok => {
                if (blok.classList.contains('blok_ukolu')) {
                    vsechny_bloky.push(blok);
                }
            });

            // zjištění, nad kterým blokem je myš
            var blok_na_kterem_hoveruje_mys = 0;
            if (pozice_mysi_na_strance < max_top_pozice) {
                // mys je moc nahore
                blok_na_kterem_hoveruje_mys = 0;
                nova_pozice_ukolu = 0;
            } else if (pozice_mysi_na_strance > max_bottom_pozice) {
                // mys je moc dole
                blok_na_kterem_hoveruje_mys = vsechny_bloky.length - 1;
                nova_pozice_ukolu = vsechny_bloky.length;
            } else {
                // mys je ve spravnem rozsahu

                vsechny_bloky.forEach(blok => {
                    var blok_top = blok.getBoundingClientRect().top - 8; // 8 px je margin-top u bloku ukolu
                    var blok_bottom = blok.getBoundingClientRect().bottom;
                    if (blok_top <= pozice_mysi_na_strance && blok_bottom > pozice_mysi_na_strance) {

                        blok_na_kterem_hoveruje_mys = vsechny_bloky.indexOf(blok);

                        // v jaké části myš hoveruje

                        var polovina = ((blok_bottom - blok_top) / 2) + blok_top;

                        if (pozice_mysi_na_strance <= polovina && pozice_mysi_na_strance > blok_top) {
                            // hoveruje nahoře
                            if (blok_na_kterem_hoveruje_mys == stara_pozice_ukolu) {
                                // hoveruje na puvodnim ukolu
                                nova_pozice_ukolu = stara_pozice_ukolu;
                                element_znazornujici_posun_ukolu.style.height = vsechny_bloky[nova_pozice_ukolu].scrollHeight + 10 + "px";
                                element_znazornujici_posun_ukolu.style.top = (vsechny_bloky[nova_pozice_ukolu].getBoundingClientRect().top - kontainer_bloku_ukolu.getBoundingClientRect().top - element_znazornujici_posun_ukolu_offset) + "px";
                            } else if (blok_na_kterem_hoveruje_mys - 1 == stara_pozice_ukolu) {
                                // hoveruje pod puvodním úkolem
                                nova_pozice_ukolu = stara_pozice_ukolu;
                                element_znazornujici_posun_ukolu.style.height = vsechny_bloky[nova_pozice_ukolu].scrollHeight + 10 + "px";
                                element_znazornujici_posun_ukolu.style.top = (vsechny_bloky[nova_pozice_ukolu].getBoundingClientRect().top - kontainer_bloku_ukolu.getBoundingClientRect().top - element_znazornujici_posun_ukolu_offset) + "px";
                            } else {
                                var pozice_v_bloku = blok.getAttribute('pozice');
                                nova_pozice_ukolu = pozice_v_bloku - 1;
                                // hoveruje jinde, hodnota se změní
                                
                                nova_pozice_ukolu = blok_na_kterem_hoveruje_mys;

                                element_znazornujici_posun_ukolu.style.height = "0px";
                                element_znazornujici_posun_ukolu.style.top = (vsechny_bloky[nova_pozice_ukolu].getBoundingClientRect().top - kontainer_bloku_ukolu.getBoundingClientRect().top - element_znazornujici_posun_ukolu_offset) + "px";
                                
                            }
                        } else if (pozice_mysi_na_strance > polovina && pozice_mysi_na_strance > blok_top) {
                            // hoveruje dole
                            if (blok_na_kterem_hoveruje_mys == stara_pozice_ukolu) {
                                // hoveruje na puvodnim ukolu
                                nova_pozice_ukolu = stara_pozice_ukolu;
                                element_znazornujici_posun_ukolu.style.height = vsechny_bloky[nova_pozice_ukolu].scrollHeight + 10 + "px";
                                element_znazornujici_posun_ukolu.style.top = (vsechny_bloky[nova_pozice_ukolu].getBoundingClientRect().top - kontainer_bloku_ukolu.getBoundingClientRect().top - element_znazornujici_posun_ukolu_offset) + "px";
                            } else if (blok_na_kterem_hoveruje_mys + 1 == stara_pozice_ukolu) {
                                // hoveruje pod puvodním úkolem
                                nova_pozice_ukolu = stara_pozice_ukolu;
                                element_znazornujici_posun_ukolu.style.height = vsechny_bloky[nova_pozice_ukolu].scrollHeight + 10 + "px";
                                element_znazornujici_posun_ukolu.style.top = (vsechny_bloky[nova_pozice_ukolu].getBoundingClientRect().top - kontainer_bloku_ukolu.getBoundingClientRect().top - element_znazornujici_posun_ukolu_offset) + "px";
                            } else {
                                // hoveruje jinde, hodnota se změní
                                var pozice_v_bloku = blok.getAttribute('pozice');
                                nova_pozice_ukolu = pozice_v_bloku;

                                element_znazornujici_posun_ukolu.style.height = "0px";
                                element_znazornujici_posun_ukolu.style.top = (vsechny_bloky[nova_pozice_ukolu - 1].getBoundingClientRect().bottom + 8 - kontainer_bloku_ukolu.getBoundingClientRect().top - element_znazornujici_posun_ukolu_offset) + "px";
                            }
                        } 
                    }
                });
            }
        }
    }
}

document.body.onmousedown = function() { 
    mouseDown = 1;
}

document.body.ontouchstart = function() {
    mouseDown = 1;
}


// Konec posunu úkolu
document.body.onmouseup = function() { 
    drag_onmouseup();
}

document.body.ontouchend = function() { 
    drag_onmouseup();
}

function drag_onmouseup() {

    mouseDown = 0;

    if (probiha_presun_ukolu == 1 ) {
        // zjisti pozici bloku s kde id_ukolu == drag_id_ukolu_ke_zmene_pozice
        probiha_presun_ukolu = 0;
        vymaz_element_znazorneni_posunu();
        nova_pozice_ukolu = parseInt(nova_pozice_ukolu) + 1;

        var xhttp = new XMLHttpRequest;
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                spinner();
                if (this.status == 200) {
                    var odpoved = xhttp.responseText;
                    if (odpoved.split("<!DELIM!>")[0] == "ok") {
                        
                        
                        // aktualizuj data dle opovedi pro zmenu attributu "pozice" ukolu
                        var nova_data = odpoved.split("<!DELIM!>")[1].split('<!!!>');
                        if (document.querySelector('.blok_ukolu[id_ukolu="' + drag_id_ukolu_ke_zmene_pozice + '"]') != null) {
                            var puvodni_blok_ukolu = document.querySelector('.blok_ukolu[id_ukolu="' + drag_id_ukolu_ke_zmene_pozice + '"]');   
                            var kontainer = puvodni_blok_ukolu.parentElement;
                            var kontainer_childs = kontainer.childNodes;
                            var btn_pridani_ukolu;
                            kontainer_childs.forEach(element => {
                                if (element.classList.contains('element_pridani_dalsiho_ukolu')) {
                                    btn_pridani_ukolu = element;
                                }
                            });
                            nova_data.forEach(data => {
                                var t_id = data.split(";")[0];
                                var t_pozice = data.split(";")[1];
                                if (document.querySelector('.blok_ukolu[id_ukolu="' + t_id + '"]') != null) {
                                    var prechodny_blok_ukolu = document.querySelector('.blok_ukolu[id_ukolu="' + t_id + '"]');
                                    
                                    prechodny_blok_ukolu.setAttribute('pozice',t_pozice);
                                    // zmen pozice úkolů dle hodnoty "pozice"
                                    kontainer.appendChild(prechodny_blok_ukolu);
                                }
                            });
                            kontainer.appendChild(btn_pridani_ukolu);
                        }
                        

                    } else if (odpoved == "error - user not found") {
                        myalert(vrat_string(17));
                    } else if (odpoved == "dany_parent_ukol_neexistuje") {
                        myalert(vrat_string(37));
                    } else if (odpoved == "nebyl_nalezen_seznam_usera_s_opravnenim") {
                        myalert(vrat_string(36));
                    } else if (odpoved == "id_ukolu_neexistuje_nebo_nespada_pod_seznam") {
                        myalert(vrat_string(41));
                    } else if (odpoved == "neznama_chyba_souvisejici_s_pozici") {
                        myalert(vrat_string(44));
                    } else if (odpoved == "stejna_pozice") {
                        // pozice je stejná, žádná změna neprobíhá
                    } else {
                        myalert("error:" + odpoved + ".");
                    }
                } else {
                    // chyba AJAX
                    myalert('chyba AJAX');
                }
            }
        }
        xhttp.open("POST", "php/set_ukol.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("typ=zmen_poradi_ukolu&seznam_id=" + drag_seznamu_ukolu_ke_zmene_pozice + "&id_ukolu=" + drag_id_ukolu_ke_zmene_pozice + "&nova_pozice=" + nova_pozice_ukolu); 
    }
}

function vytvor_element_znazorneni_posunu(id_ukolu) {
    var element_znazornujici_posun_ukolu = document.createElement('div');
    element_znazornujici_posun_ukolu.classList.add('element_znazornujici_posun_ukolu');
    document.querySelectorAll('.blok_ukolu[id_ukolu="' + id_ukolu + '"]')[0].parentElement.appendChild(element_znazornujici_posun_ukolu);
}

function vymaz_element_znazorneni_posunu() {
    document.querySelectorAll('.element_znazornujici_posun_ukolu').forEach(element => {
        element.remove();
    });
}

function vymaz_tento_ukol(btn) {
    var id_ukolu = btn.parentElement.getAttribute('id_ukolu');
    var id_seznamu = document.querySelector('.otevreny_seznam').getAttribute('id_seznamu');
    spinner(1);

    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved.split("<!DELIM!>")[0] == "ok") {

                    // ok, ukol vymazan
                    document.querySelector('.blok_ukolu[id_ukolu="' + id_ukolu + '"]').remove();

                    // aktualizuj data dle opovedi pro zmenu attributu "pozice_ukolu"
                    var nova_data = odpoved.split("<!DELIM!>")[1].split('<!!!>');
                    nova_data.forEach(data => {
                        var t_id = data.split(";")[0];
                        var t_pozice = data.split(";")[1];
                        if (document.querySelector('.blok_ukolu[id_ukolu="' + t_id + '"]') != null) {
                            document.querySelector('.blok_ukolu[id_ukolu="' + t_id + '"]').setAttribute('pozice',t_pozice);
                        }
                    });

                } else if (odpoved == "error - user not found") {
                    myalert(vrat_string(17));
                } else if (odpoved == "dany_parent_ukol_neexistuje") {
                    myalert(vrat_string(37));
                } else if (odpoved == "nebyl_nalezen_seznam_usera_s_opravnenim") {
                    myalert(vrat_string(36));
                } else if (odpoved == "id_ukolu_neexistuje_nebo_nespada_pod_seznam") {
                    myalert(vrat_string(41));
                } else if (odpoved == "chyba_vymazan_jiny_pocet_ukolu_nez_bylo_v_planu") {
                    myalert(vrat_string(43));
                } else {
                    myalert("error:" + odpoved + ".");
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/set_ukol.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ=vymaz_ukol_vcetne_podukolu&seznam_id=" + id_seznamu + "&id_ukolu=" + id_ukolu); 
}

function uprav_tento_ukol(btn) {
    var id_ukolu = btn.parentElement.getAttribute('id_ukolu');
    var puvodni_text_ukolu = btn.parentElement.querySelector('.textova_cast').innerHTML;
    myPrompt(vrat_string(39),vrat_string(40),"ajax_uprav_ukol(" + id_ukolu + ")","text");
    // string 39 - úprava úkolu
    // string 40 - Zde můžete zadat nový text pro daný úkol

    // nastavit předvplnění inputu v myprompt podle toho, jaký je do teď text úkolu
    document.querySelector('.myPrompt input').value = puvodni_text_ukolu;
}

function ajax_uprav_ukol(id_ukolu) {
    var novy_text_ukolu = encodeURIComponent(document.querySelector('.myPrompt input').value);
    var id_seznamu = document.querySelector('.otevreny_seznam').getAttribute('id_seznamu');
    myPrompt();
    spinner(1);

    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved.split("<!DELIM!>")[0] == "ok") {

                    var novy_text_vraceny_z_DB = odpoved.split("<!DELIM!>")[1];
                    // najdi blok ukolu s id_ukolu a aktualizuj data dle responseText
                    document.querySelector('.blok_ukolu[id_ukolu="' + id_ukolu + '"] .textova_cast').innerHTML = novy_text_vraceny_z_DB;

                } else if (odpoved == "error - user not found") {
                    myalert(vrat_string(17));
                } else if (odpoved == "dany_parent_ukol_neexistuje") {
                    myalert(vrat_string(37));
                } else if (odpoved == "nebyl_nalezen_seznam_usera_s_opravnenim") {
                    myalert(vrat_string(36));
                } else if (odpoved == "id_ukolu_neexistuje_nebo_nespada_pod_seznam") {
                    myalert(vrat_string(41));
                } else if (odpoved == "nepodarilo_se_nastavit_novy_text_ukolu") {
                    myalert(vrat_string(42));
                } else if (odpoved == "nova_hodnota_empty") {
                    myalert(vrat_string(62));
                } else {
                    myalert("error:" + odpoved + ".");
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/set_ukol.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ=uprav_text_ukolu&seznam_id=" + id_seznamu + "&id_ukolu=" + id_ukolu + "&nova_hodnota=" + novy_text_ukolu); 
}

function zrusit_sdileni_tohoto_seznamu_s(ruseny_user,id_seznamu,close_btn) {
    var info_kostka_se_sdilenym_emailem = close_btn.parentElement;
    
    spinner(1);
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved == "ok") {
                    // vymazání kostky se sdíleným emailem v případě úspěšného vymazání uz databáze
                    info_kostka_se_sdilenym_emailem.remove();

                    // pokud šlo a sdílený seznam:
                    // - vymaž ho ze seznamu seznamů a přepni se na první vlastní seznam (pokud žádný sdílený seznam seznam nezbyl, upozorni na to v seznamu sdílených seznamů)
                    // - pokud neexistuje, přepni se na první sdílený seznam
                    // - pokud ani ten neexistuje - zobraz hlášku v seznamu i bloku hlavní obsah

                    // pokud šlo o sdílený seznam
                    if (document.querySelectorAll('.kontainer_sdilene_seznamy .polozka_menu.odkaz[ïd_seznamu="' + id_seznamu + '"]').length > 0) {
                        // v seznamu sdílených seznamů existuje odkaz na seznam, ve kterém user již nechce být sdílený.

                        // vymazání položky z měnu
                        if (document.querySelectorAll('.kontainer_sdilene_seznamy .polozka_menu.odkaz[ïd_seznamu="' + id_seznamu + '"]').length > 0) {
                            document.querySelectorAll('.kontainer_sdilene_seznamy .polozka_menu.odkaz[ïd_seznamu="' + id_seznamu + '"]')[0].remove();

                            // odkaz je vymazán. Zjištění, jestli nějaký zbyl
                            if (document.querySelectorAll('.kontainer_sdilene_seznamy .polozka_menu.odkaz').length < 1) {
                                // žádný seznam nezbyl, zobrazí se o tom zpráva
                                var kontainer = document.createElement('div');
                                kontainer.classList.add('polozka_menu');
                                kontainer.appendChild(document.createTextNode(vrat_string(10))); // string žádný seznam
                                document.querySelectorAll('.kontainer_sdilene_seznamy')[0].appendChild(kontainer);
                            }
                        }

                        // přepnutí se na první vlastní seznam
                        if (document.querySelectorAll('.kontainer_moje_seznamy .polozka_menu.odkaz').length > 0) {
                            document.querySelectorAll('.kontainer_moje_seznamy .polozka_menu.odkaz')[0].click();
                        } else {
                            // v seznamu vlastních seznamů nic není. Zjistí se tedy, jestli je něco k otevření v seznamu sdílených seznamů
                            if (document.querySelectorAll('.kontainer_sdilene_seznamy .polozka_menu.odkaz').length > 0) {
                                document.querySelectorAll('.kontainer_sdilene_seznamy .polozka_menu.odkaz')[0].click();
                            } else {
                                // user nemá žádný vlastní seznam
                                document.querySelectorAll('.otevreny_seznam').forEach(element => {
                                    element.remove();
                                });
                                var zadny_seznam_kont = document.createElement('div');
                                zadny_seznam_kont.classList.add('zadny_seznam_kont');
                                document.querySelectorAll('.hlavni_obsah')[0].appendChild(zadny_seznam_kont);
            
                                var p = document.createTextNode(vrat_string(25));
                                zadny_seznam_kont.appendChild(p);
                            }
                        }
                        
                    }


                } else if (odpoved == "error - user not found") {
                    myalert(vrat_string(17));
                } else if (odpoved == "seznam_neexistuje") {
                    myalert(vrat_string(30));
                    info_kostka_se_sdilenym_emailem.remove();
                } else if (odpoved == "zmena_nastaveni_selhala") {
                    myalert(vrat_string(20));
                } else if (odpoved == "neznama_chyba") {
                    myalert(vrat_string(33));
                } else if (odpoved == "sdileni_se_nepodarilo_zrusit") {
                    myalert(vrat_string(34));
                } else {
                    myalert(odpoved);
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/uprav_seznam.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ_upravy_seznamu=zrus_sdileni&id_seznamu=" + id_seznamu + "&ruseny_email=" + ruseny_user); 

}

function vrat_string(id_stringu) {
    // Id stringu muže být jedno číslo (vrátí se 1 string), nebo pole ve formě stringu oddělené středníkem
    // Pokud jde o pole, server vrátí pole (jako string), který vapadá následovně vypadá následovně:
    // id_stringu<;DELIM_ELEMENT;>string<;DELIM_POLE;>id_stringu<;DELIM_ELEMENT;>string....


    var xhttp = new XMLHttpRequest;
    var jazyk = document.querySelector('body').getAttribute('lang');
    xhttp.open("POST", "php/vrat_string.php", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + id_stringu + "&jazyk=" + jazyk);
    var odpoved = xhttp.responseText;

    // zjištení, jestli odpověď byla:
        // ok<;;;>string, nebo
        // zadny_string, nebo 
        // jestli obsahuje <;DELIM_ELEMENT;> = jde o pole

    if (odpoved.split('<;;;>')[0] == "ok") {
        var string = odpoved.split('<;;;>')[1];
        return string;
    } else if (odpoved == "zadny_string") {
        return "missing string";
    } else if (odpoved.includes('<;DELIM_ELEMENT;>')) {
        var data = odpoved.split('<;DELIM_POLE;>');
        return data;
    } else  {
        myalert('chyba: ' + odpoved);
        return "error";
    } 

}

function checkbox_click(element) {

    // tento ukol + všechny jeho podůkoly dostanou class spinning
    var vsechny_sub_check_boxy = element.parentElement.parentElement.querySelectorAll('.checkbox');
    vsechny_sub_check_boxy.forEach(checkbox => {
        checkbox.classList.add('spinning');
    });

    var id_ukolu = element.parentElement.parentElement.getAttribute('id_ukolu');
    var id_seznamu = document.querySelector('.otevreny_seznam').getAttribute('id_seznamu');
    var hidden_checkbox = element.parentElement.querySelector('input');

    if (hidden_checkbox.checked == true) {
        // ukol je zaškrtnutý, zruší se zaškrtnutí
        var check_novy_status = 0;
    } else {
        // ukol není zaškrtnutý, zaškrtne se
        var check_novy_status = 1;
    }

    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            // zruš spinnery
            vsechny_sub_check_boxy.forEach(checkbox => {
                checkbox.classList.remove('spinning');
            });
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved.split("<!DELIM!>")[0] == "ok") {

                    if (check_novy_status == 0) {
                        vsechny_sub_check_boxy.forEach(checkbox => {
                            checkbox.parentElement.querySelector('input').checked = false;
                        });
                    } else {
                        vsechny_sub_check_boxy.forEach(checkbox => {
                            checkbox.parentElement.querySelector('input').checked = true;
                        });
                    }

                } else if (odpoved == "error - user not found") {
                    myalert(vrat_string(17));
                } else if (odpoved == "nebyl_nalezen_seznam_usera_s_opravnenim") {
                    myalert(vrat_string(36));
                } else if (odpoved == "id_ukolu_neexistuje_nebo_nespada_pod_seznam") {
                    myalert(vrat_string(41));
                } else {
                    myalert("error:" + odpoved + ".");
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/set_ukol.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ=checkbox_click&seznam_id=" + id_seznamu + "&id_ukolu=" + id_ukolu + "&checked=" + check_novy_status); 

}

function sbal_rozbal_ukol(btn) {
    var id_ukolu = btn.parentElement.getAttribute('id_ukolu');
    var id_seznamu = document.querySelector('.otevreny_seznam').getAttribute('id_seznamu');
    var nova_hodnota_rozbaleni;

    var submenu = btn.parentElement.querySelector('.submenu');
    var vyska_submenu = submenu.scrollHeight;
    if (submenu.classList.contains('sbaleny')) {
        // submenu se rozbalí
        nova_hodnota_rozbaleni = 1;
        submenu.classList.remove('sbaleny');
        submenu.style.maxHeight = vyska_submenu + "px";
        btn.classList.remove('sbaleny');
        setTimeout(function (){
            submenu.style.maxHeight = "";
            vytvor_a_nastav_cary_mezi_ukoly();
        },130);
    } else {
        // submenu se sbalí
        nova_hodnota_rozbaleni = 0;
        submenu.style.maxHeight = vyska_submenu + "px";
        setTimeout(function (){
            submenu.style.maxHeight = "";
            submenu.classList.add('sbaleny');
            // class sbaleny již má ve style.css již max-height = 0, ale nastavení max-height attributem přímo na elementu má přednost
            setTimeout(function (){
                vytvor_a_nastav_cary_mezi_ukoly();
            },120);
        },120);
        btn.classList.add('sbaleny');
    }

    var xhttp = new XMLHttpRequest;
    xhttp.open("POST", "php/set_ukol.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ=sbal_rozbal_ukol&seznam_id=" + id_seznamu + "&id_ukolu=" + id_ukolu + "&rozbaleny=" + nova_hodnota_rozbaleni);
}

function vytvor_a_nastav_cary_mezi_ukoly() {
    // Čáry se vyrtvoří, aby bylo přehledné, který úkol spadá pod který úkol a aby bylo jasno,
    // pod který úkol se inputem přidává podúkol

    // čáry se vytvoří v každém bloku úkolu přidáním SVG elementu do submenu bloku (stejná velikost, absolutní pozice).

    // prvně se vymažou staré čáry
    var SVGs = document.querySelectorAll('.svg_kontainer_car');
    SVGs.forEach(element => {
        element.remove();
    });

    if (document.querySelector('.kontainer_polozek_seznamu') != null) {
        // pokud je .kontainer_polozek_seznamu null, neexistuje a tudíž není otevřený seznam -> čáry se tedy nevytváří
        
        var submenu = document.querySelectorAll('.submenu:not(.sbaleny)');
        for (var x = 0; x < submenu.length ; x++) {
            
        // vytvoří se SVG element

            var svg_kontainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg_kontainer.classList.add('svg_kontainer_car');
            submenu[x].parentElement.appendChild(svg_kontainer);

        // vytvoří se vertikální čára od elementu k poslednímu elementu v jeho submenu

            // získání všech pouze přímých dětí submenu a to pouze bloku_ukolu a tlacitka pro pridani ukolu.
            var elementy_temp = submenu[x].childNodes;
            var elementy = [];
            for (var y = 0 ; y < elementy_temp.length ; y++) {
                if (elementy_temp[y].tagName == "DIV" || elementy_temp[y].tagName == "div") {
                    if (elementy_temp[y].classList.contains('blok_ukolu') || elementy_temp[y].classList.contains('element_pridani_dalsiho_ukolu') ) {
                        elementy.push(elementy_temp[y]);
                    }
                }
            }
            // "elementy" jsou elementy, ke kterým povedou čáry

            // získání základní X-ové souřadnice (start X i end X pro vertikální čáru)

            var zakl_x = 15;

            // získání horizontálních souřadnic. Začíná se za checkboxem a končí u poslendího elementu v submenu

            var vert_start_y = 15;
            var vert_end_y = elementy[elementy.length - 1].getBoundingClientRect().top - svg_kontainer.getBoundingClientRect().top + 15;

            // vytvoření vertikální čáry

            var cara_vert = document.createElementNS('http://www.w3.org/2000/svg','line');
            cara_vert.setAttribute('x1',zakl_x);
            cara_vert.setAttribute('y1',vert_start_y);
            cara_vert.setAttribute('x2',zakl_x);
            cara_vert.setAttribute('y2',vert_end_y);
            svg_kontainer.appendChild(cara_vert);

        // vytvoří se horizontální čáry pro každý element v submenu

            for (var y = 0 ; y < elementy.length ; y++) {
                var cara_horiz = document.createElementNS('http://www.w3.org/2000/svg','line');

                var start_horiz_x = 35;

                // zjištění vertikální pozice
                var vert_pozice_elementu = elementy[y].getBoundingClientRect().top - svg_kontainer.getBoundingClientRect().top + 15;

                cara_horiz.setAttribute('x1',start_horiz_x);
                cara_horiz.setAttribute('y1',vert_pozice_elementu); // vertikální hodnota je stejná u start i end pozice - je to horizontální čára
                cara_horiz.setAttribute('x2',zakl_x);
                cara_horiz.setAttribute('y2',vert_pozice_elementu); // vertikální hodnota je stejná u start i end pozice - je to horizontální čára
                svg_kontainer.appendChild(cara_horiz);
            }   
        }
    }
}

function pridat_ukol(tlacitko) {
    // tlacitko = btn pro pridani ukolu

    tlacitko.setAttribute('onclick','');
    tlacitko.classList.add('spinner_btn_add_ukol');

    var text_ukolu = encodeURIComponent(tlacitko.parentElement.querySelector('input[type="text"]').value);
    var parent_ukol_id;
    var seznam_id = document.querySelector('.otevreny_seznam').getAttribute('id_seznamu');

    if (tlacitko.parentElement.classList.contains('kontainer_polozek_seznamu_inner')) {
        // přidává se hlavní úkol
        parent_ukol_id = 0;
    } else {
        // přidává se podúkol nějakého úkolu
        parent_ukol_id = tlacitko.parentElement.parentElement.parentElement.getAttribute('id_ukolu');
    }

    
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var odpoved = this.responseText;

                if (odpoved.split("<!DELIM!>")[0] == "ok") {
                    // ok, úkol byl vložen.

                    // nejdříve se z response vytáhnou data o novém úkolu
                    var data_noveho_ukolu = odpoved.split("<!DELIM!>")[1].split("<!DELIM-ARRAY!>");

                    vytvor_element_blok_ukolu(
                        data_noveho_ukolu[0], // id ukolu
                        data_noveho_ukolu[1], // level úkolu
                        data_noveho_ukolu[2], // text úkolu
                        data_noveho_ukolu[3], // checked
                        data_noveho_ukolu[4], // rozbalený
                        // data_noveho_ukolu[4] je parent_seznam. To pro vložení bloku již není třeba kontrolovat
                        data_noveho_ukolu[6], // parent úkol
                        data_noveho_ukolu[7]); // pozice - není třeba

                    // aktualizace car
                    vytvor_a_nastav_cary_mezi_ukoly();

                    // vyprázdnění inputu  
                    tlacitko.parentElement.querySelector('input[type="text"]').value = "";

                } else if (odpoved == "error - user not found") {
                    myalert(vrat_string(17));
                } else if (odpoved == "dany_parent_ukol_neexistuje") {
                    myalert(vrat_string(37));
                } else if (odpoved == "nebyl_nalezen_seznam_usera_s_opravnenim") {
                    myalert(vrat_string(36));
                } else if (odpoved == "nova_hodnota_empty") {
                    myalert(vrat_string(62));
                } else {
                    myalert("error:" + odpoved + ".");
                }

                // po úspěšném přidání úkolu se zpřístupní btn na přidání úkolu
                tlacitko.setAttribute('onclick','pridat_ukol(this)');
                tlacitko.classList.remove('spinner_btn_add_ukol');
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/set_ukol.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ=novy_ukol&text_ukolu=" + text_ukolu + "&parent_ukol_id=" + parent_ukol_id + "&seznam_id=" + seznam_id); 
    

}

function onkeyup_input_pridat_ukol(e,input) {
    if (e.key == "Enter") {
        input.parentElement.parentElement.querySelector('span').click();
    }
}

function vrat_soucasny_seznam() {
    return document.querySelector('.app_main_body').getAttribute('id_seznamu');
}
function otevri_mobilni_menu() {
    var menu = document.querySelector('.menu');
    if (menu.classList.contains('otevrene')) {
        menu.classList.remove('otevrene');
        haburger_trans('zavrit');
    } else {
        menu.classList.add('otevrene');
        haburger_trans('otevrit');
    }
}

function a(text) {
    document.getElementById('debug').innerHTML = text;
}

function haburger_trans(typ) {
    if (typ == "zavrit") {
        document.querySelector('.hamburger').classList.remove('otevrene');
    } else {
        document.querySelector('.hamburger').classList.add('otevrene');
    }
}

function zmen_jazyk(element) {
    var novy_jazyk = element.getAttribute('lang');
    zmen_nastaveni("jazyk",novy_jazyk);
}

function zmen_motiv(element) {
    var novy_motiv = element.getAttribute('set');
    zmen_nastaveni("motiv",novy_motiv); 
}

function vymaz_muj_ucet(tlacitko) {
    myPrompt();
    spinner(1);
    var heslo = tlacitko.parentElement.querySelector('input').value;
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved == "ok") {
                    window.location.reload();
                } else if (odpoved == "error - user not found") {
                    myalert(vrat_string(17));
                } else if (odpoved == "chybne_heslo") {
                    myalert(vrat_string(18));
                } else if (odpoved == "chybne_nastaveni") {
                    myalert(vrat_string(19));
                } else if (odpoved == "zmena_nastaveni_selhala") {
                    myalert(vrat_string(20));
                } else {
                    myalert(odpoved);
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/vymaz_ucet.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("heslo=" + heslo); 
}

function vymaz_muj_ucet_click() {
    var string_nadpis_vymazat_ucet = vrat_string(15);
    var string_otazka_opravdu_vymzat_ucet = vrat_string(14);
    myPrompt(string_nadpis_vymazat_ucet,string_otazka_opravdu_vymzat_ucet,"vymaz_muj_ucet(this)","pass");
}

function zmen_nastaveni(typ,hodnota) {

    spinner(1);
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;
                if (odpoved == "ok") {
                    window.location.reload();
                } else if (odpoved == "error - user not found") {
                    myalert(vrat_string(17));
                } else {
                    myalert(odpoved);
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/zmen_nastaveni.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ=" + typ + "&hodnota=" + hodnota); 

}

function pridej_seznam() {
   myPrompt(vrat_string(63) , vrat_string(64) , "pridat_seznam_ok()" , "text");
}

function pridat_seznam_ok() {
    var typ_upravy_seznamu = "novy_seznam";
    var novy_nazev_seznamu = document.querySelector('.myPrompt input').value;
    myPrompt();

    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;

                if (odpoved.split("<!!!-DELIM-!!!>")[0] == "ok") {

                    // seznam byl vytvořen
                    var novy_seznam_z_DB = odpoved.split("<!!!-DELIM-!!!>")[1];
                    /*document.querySelector('.otevreny_seznam .nadpis_seznamu').innerHTML = novy_seznam_z_DB;
                    document.querySelector('.polozka_menu.odkaz[ïd_seznamu="' + id_seznamu + '"]').innerHTML = novy_seznam_z_DB;*/
                    // vytvoř v seznamu seznamů položku
                    var nova_polozka = document.createElement('div');
                    nova_polozka.classList.add('polozka_menu');
                    nova_polozka.classList.add('odkaz');
                    nova_polozka.setAttribute('ïd_seznamu',novy_seznam_z_DB);;
                    nova_polozka.setAttribute('onclick','otevri_seznam(this)');
                    nova_polozka.innerHTML = novy_nazev_seznamu;

                    var btn_pridat_seznam = document.getElementById('btn_pridej_seznam');

                    var kontainer = document.querySelector('.kontainer_moje_seznamy.kontainer_seznamu_menu');
                    kontainer.appendChild(nova_polozka);
                    kontainer.appendChild(btn_pridat_seznam);
                    nova_polozka.click();

                } else if (odpoved == "error - user not found") {
                    myalert(vrat_string(17));
                } else if (odpoved == "seznam_neexistuje") {
                    myalert(vrat_string(61));
                } else if (odpoved == "nazev_noveho_seznamu_empty") { 
                    myalert(vrat_string(65));
                } else if (odpoved == "id_seznamu_neni_cislo") {
                    myalert(vrat_string(52));
                } else if (odpoved == "chyba_pri_mazani_ukolu") { //
                    myalert(vrat_string(55));
                } else {
                    myalert(odpoved);
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/uprav_seznam.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ_upravy_seznamu=" + typ_upravy_seznamu + "&novy_nazev=" + novy_nazev_seznamu); 
}

function sdilet_seznam() {
    var nadpis_okna = vrat_string(45); // string = Nový kontakt pro sdílení
    var text_okna = vrat_string(46); // string = Zadejte e-mail uživatele, se kterým chcete sdílet tento seznam. Pokud uživatel zatím není registrovaný, po své registraci seznam uvidí.
    myPrompt(nadpis_okna,text_okna,'nastav_sdileni_seznamu(this)',"text");
}

function nastav_sdileni_seznamu(ok_btn) {
    myPrompt();
    spinner(1);
    var input_hodnota = ok_btn.parentElement.querySelector('input').value;
    if (document.querySelector('.otevreny_seznam') == null) {
        myalert(vrat_string(33)); // string = neznámá chyba
        return;
    }
    var id_seznamu = document.querySelector('.otevreny_seznam').getAttribute('id_seznamu');

    var typ_upravy_seznamu = "nastav_nove_sdileni";
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;

                if (odpoved.split("<!!!-DELIM-!!!>")[0] == "ok") {

                    var novy_email_vraceny_z_db = odpoved.split("<!!!-DELIM-!!!>")[1];
                    var id_seznamu_novy_email_vraceny_z_db = odpoved.split("<!!!-DELIM-!!!>")[2];
                    // vytvoř novou info kostku se sdíleným emailem
                    var kontainer_pro_kostku = document.querySelector('.konteiner_tlacitek_akci');
                    var kostka = document.createElement('div');
                    kostka.classList.add('info_sdilen_s');
                    kontainer_pro_kostku.appendChild(kostka);

                    var text_span = document.createElement('span');
                    text_span.classList.add('text');
                    kostka.appendChild(text_span);
                        var barevny_text = document.createElement('span');
                        barevny_text.classList.add('barevny_text');
                        barevny_text.appendChild(document.createTextNode(vrat_string(32))); // string = seznam sdílen s:
                        text_span.appendChild(barevny_text);

                        text_span.appendChild(document.createElement('br'));

                        text_span.appendChild(document.createTextNode(novy_email_vraceny_z_db));

                    var x_btn = document.createElement('span');
                    x_btn.classList.add('close_btn');
                    x_btn.appendChild(document.createTextNode('×'));
                    x_btn.setAttribute('onclick','zrusit_sdileni_tohoto_seznamu_s("' + novy_email_vraceny_z_db + '",' + id_seznamu_novy_email_vraceny_z_db + ',this)');
                    kostka.appendChild(x_btn);

                } else if (odpoved == "error - user not found") {
                    myalert(vrat_string(17));
                } else if (odpoved == "seznam_neexistuje") {
                    myalert(vrat_string(47));
                } else if (odpoved == "spatny_format_emailu") {
                    myalert(vrat_string(48));
                } else if (odpoved == "s_timto_userem_jiz_seznam_sdilite") {
                    myalert(vrat_string(49));
                } else if (odpoved == "chyba_nastavovani_sdileni") {
                    myalert(vrat_string(50));
                } else if (odpoved == "chyba_bylo_ovlivneno_vice_rad") {
                    myalert(vrat_string(51));
                } else if (odpoved == "id_seznamu_neni_cislo") {
                    myalert(vrat_string(52));
                } else {
                    myalert(odpoved);
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/uprav_seznam.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ_upravy_seznamu=" + typ_upravy_seznamu + "&id_seznamu=" + id_seznamu + "&novy_email=" + input_hodnota); 
}

function vymazat_seznam() {
    myalert(vrat_string(56)); // string = Do you really want to delete this list?
    var btn_ok = document.querySelector(".myalert").querySelector(".text_element").querySelector(".ok_btn");
    btn_ok.setAttribute("onclick","vymazat_seznam_ok()");
    btn_ok.innerHTML = vrat_string(57);

    var btn_ne = document.createElement("div");
    btn_ne.classList.add("ok_btn");
    btn_ne.setAttribute("onclick","myalert()");
    btn_ne.appendChild(document.createTextNode(vrat_string(58)));
    document.querySelector(".myalert").querySelector(".text_element").appendChild(btn_ne);
}

function vymazat_seznam_ok() {

    myalert();

    var id_seznamu = document.querySelector('.otevreny_seznam').getAttribute('id_seznamu');
    var typ_upravy_seznamu = "vymaz_seznam";
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;

                if (odpoved.split("<!!!-DELIM-!!!>")[0] == "ok") {

                    // ok
                    // vymaže se otevřený seznam a položka se seznamu seznamů
                    var kontainer_odkazu_vlastni_seznamy = document.querySelector(".kontainer_moje_seznamy.kontainer_seznamu_menu");
                    if (kontainer_odkazu_vlastni_seznamy.querySelector('.polozka_menu.odkaz[ïd_seznamu="' + id_seznamu + '"]') != null) {
                        kontainer_odkazu_vlastni_seznamy.querySelector('.polozka_menu.odkaz[ïd_seznamu="' + id_seznamu + '"]').remove();
                    }

                    // pokud již v seznamu není žádný jiný seznam, ojeví se hláška žádný  seznam
                    if (kontainer_odkazu_vlastni_seznamy.querySelectorAll('.polozka_menu.odkaz[ïd_seznamu]').length == 0) {
                        var btn_pridani_seznamu = document.getElementById('btn_pridej_seznam');
                        
                        var hlaska_no_list = document.createElement('div');
                        hlaska_no_list.classList.add('text_zadny_senam');
                        hlaska_no_list.appendChild(document.createTextNode(vrat_string(1)));
                        kontainer_odkazu_vlastni_seznamy.appendChild(hlaska_no_list);

                        if (btn_pridani_seznamu != null) {
                            kontainer_odkazu_vlastni_seznamy.appendChild(btn_pridani_seznamu);
                        }
                        
                    }
                    // otevře se 1. volný seznam  
                    if (kontainer_odkazu_vlastni_seznamy.querySelectorAll('.polozka_menu[ïd_seznamu]').length > 0) {
                        // když existuje normální seznam, otevře se první
                        kontainer_odkazu_vlastni_seznamy.querySelectorAll('.polozka_menu[ïd_seznamu]')[0].click();
                    } else {
                        // když neexistuje normální seznam, zkontrolují se sdílené seznamy k otevření
                        var kontainer_odkazu_sdilene_seznamy = document.querySelector(".kontainer_sdilene_seznamy.kontainer_seznamu_menu");
                        var sdilene_seznamy = kontainer_odkazu_sdilene_seznamy.querySelectorAll('.polozka_menu.odkaz');
                        if (sdilene_seznamy.length > 0) {
                            // otevře se první sdílený seznam
                            sdilene_seznamy[0].click();
                        } else {
                            // není vůbec žádný seznam k otevření otevřený seznam se vymaže a místo něj se objeví hláška
                            var hlavni_obsah = document.querySelector('.rada_2 .hlavni_obsah');
                            hlavni_obsah.querySelectorAll('*').forEach(element => {
                                element.remove();
                            });
                            var hlaska = document.createElement('div');
                            hlaska.classList.add('zadny_seznam_kont');
                            hlaska.appendChild(document.createTextNode(vrat_string(25)));
                            hlavni_obsah.appendChild(hlaska);
                        }
                    }

                } else if (odpoved == "error - user not found") {
                    myalert(vrat_string(17));
                } else if (odpoved == "seznam_neexistuje") {
                    myalert(vrat_string(53));
                } else if (odpoved == "seznam_nevymazan") {
                    myalert(vrat_string(54));
                } else if (odpoved == "chyba_bylo_ovlivneno_vice_rad") {
                    myalert(vrat_string(51));
                } else if (odpoved == "id_seznamu_neni_cislo") {
                    myalert(vrat_string(52));
                } else if (odpoved == "chyba_pri_mazani_ukolu") {
                    myalert(vrat_string(55));
                } else {
                    myalert(odpoved);
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/uprav_seznam.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ_upravy_seznamu=" + typ_upravy_seznamu + "&id_seznamu=" + id_seznamu); 
}

function upravit_nazev_seznamu() {
    myPrompt(vrat_string(59) , vrat_string(60) , "upravit_nazev_seznamu_ok(this)" , "text");
    var puvodni_nazev_seznamu = document.querySelector(".otevreny_seznam").querySelector(".nadpis_seznamu").innerHTML;

}

function upravit_nazev_seznamu_ok(btn) {
    myPrompt();
    var input = btn.parentElement.querySelector("input");
    var novy_nazev = input.value;

    var id_seznamu = document.querySelector('.otevreny_seznam').getAttribute('id_seznamu');
    var typ_upravy_seznamu = "prejmenuj_seznam";
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;

                if (odpoved.split("<!!!-DELIM-!!!>")[0] == "ok") {

                    // seznam byl přejmenován
                    var novy_seznam_z_DB = odpoved.split("<!!!-DELIM-!!!>")[1];
                    document.querySelector('.otevreny_seznam .nadpis_seznamu').innerHTML = novy_seznam_z_DB;
                    document.querySelector('.polozka_menu.odkaz[ïd_seznamu="' + id_seznamu + '"]').innerHTML = novy_seznam_z_DB;
                    

                } else if (odpoved == "error - user not found") {
                    myalert(vrat_string(17));
                } else if (odpoved == "seznam_neexistuje") {
                    myalert(vrat_string(61));
                } else if (odpoved == "chyba_bylo_ovlivneno_vice_rad") { //
                    myalert(vrat_string(51));
                } else if (odpoved == "id_seznamu_neni_cislo") {
                    myalert(vrat_string(52));
                } else if (odpoved == "chyba_pri_mazani_ukolu") { //
                    myalert(vrat_string(55));
                } else {
                    myalert(odpoved);
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/uprav_seznam.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ_upravy_seznamu=" + typ_upravy_seznamu + "&id_seznamu=" + id_seznamu + "&novy_nazev=" + novy_nazev); 
}

function refresh_seznam() {
    if ( document.querySelectorAll('.kontainer_moje_seznamy.kontainer_seznamu_menu .polozka_menu.odkaz.otevrena').length > 0) {
        document.querySelectorAll('.kontainer_moje_seznamy.kontainer_seznamu_menu .polozka_menu.odkaz.otevrena')[0].click();
    }
}

function zmenit_heslo_form() {
    myPrompt(vrat_string(68) , vrat_string(69) , "zmenit_heslo_ok()" , "pass");
    var prompt = document.querySelector('.myPrompt');
    var btn = prompt.querySelector('.btn');
    var chyba_element = document.createElement('span');
    chyba_element.classList.add('chyba_element');
    chyba_element.setAttribute('style','color: red');
    var stare_heslo_input = prompt.querySelector('input');
    stare_heslo_input.id = "stare_heslo_input";
    stare_heslo_input.setAttribute('placeholder',vrat_string(70));
    stare_heslo_input.addEventListener('keyup',function(e) {if (e.key == "Enter") {btn.click();}});
    var nove_heslo_1_input = document.createElement('input');
    nove_heslo_1_input.id = "nove_heslo_1_input";
    nove_heslo_1_input.setAttribute('type','password');
    nove_heslo_1_input.setAttribute('placeholder',vrat_string(71));
    nove_heslo_1_input.addEventListener('keyup',function(e) {if (e.key == "Enter") {btn.click();}});
    var nove_heslo_2_input = document.createElement('input');
    nove_heslo_2_input.id = "nove_heslo_2_input";
    nove_heslo_2_input.setAttribute('type','password');
    nove_heslo_2_input.setAttribute('placeholder',vrat_string(72));
    nove_heslo_2_input.addEventListener('keyup',function(e) {if (e.key == "Enter") {btn.click();}});
    

    prompt.appendChild(chyba_element);
    prompt.appendChild(stare_heslo_input);
    prompt.appendChild(nove_heslo_1_input);
    prompt.appendChild(nove_heslo_2_input);
    prompt.appendChild(btn);

    stare_heslo_input.focus();
}

function zmenit_heslo_ok() {
    var prompt = document.querySelector('.myPrompt');
    var chyba_element = prompt.querySelector('.chyba_element');
    chyba_element.innerHTML = "";
    var stare_heslo = encodeURIComponent(document.getElementById('stare_heslo_input').value);
    var nove_heslo_1 = encodeURIComponent(document.getElementById('nove_heslo_1_input').value);
    var nove_heslo_2 = encodeURIComponent(document.getElementById('nove_heslo_2_input').value);

    document.getElementById('stare_heslo_input').value = "";
    document.getElementById('nove_heslo_1_input').value = "";
    document.getElementById('nove_heslo_2_input').value = "";

    document.getElementById('stare_heslo_input').focus();

    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            spinner();
            if (this.status == 200) {
                var odpoved = xhttp.responseText;

                if (odpoved.split("<!!!-DELIM-!!!>")[0] == "ok") {
                    
                    myPrompt();
                    myalert(vrat_string(80));

                } else if (odpoved == "error - user not found") {
                    myPrompt();
                    myalert(vrat_string(73)); // Chyba. Nejste přihlášeni, nebo Váš e-mail není v naší databázi uživatelů
                } else if (odpoved == "nejaka_polozka_empty") {
                    chyba_element.innerHTML = vrat_string(74); // Všechny 3 položky jsou povinné
                } else if (odpoved == "hesla_se_neshoduji") {
                    chyba_element.innerHTML = vrat_string(75); // Potvrzení nového hesla se neshoduje s novým heslem
                } else if (odpoved == "heslo_moc_kratke") {
                    chyba_element.innerHTML = vrat_string(76); // Nové heslo je moc krátké. Min. 8 znaků
                } else if (odpoved == "stare_heslo_neni_spravne") {
                    chyba_element.innerHTML = vrat_string(77); // Staré heslo není správné
                } else if (odpoved == "nove_a_stare_jsou_stejne") {
                    chyba_element.innerHTML = vrat_string(78); // Nové heslo nesmí být stejné jako předchozí heslo
                } else if (odpoved == "zmeneno_vice_rad") {
                    myPrompt();
                    myalert(vrat_string(81)); // Chyba při ukládání hesla do databáze
                } else if (odpoved == "nove_heslo_neulozeno") {
                    myPrompt();
                    myalert(vrat_string(79)); // Nové heslo neuloženo
                } else {
                    myalert(odpoved);
                }
            } else {
                // chyba AJAX
                myalert('chyba AJAX');
            }
        }
    }
    xhttp.open("POST", "php/zmen_nastaveni.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("typ=zmena_hesla&stare_heslo=" + stare_heslo + "&nove_heslo_1=" + nove_heslo_1 + "&nove_heslo_2=" + nove_heslo_2 + "&hodnota=a"); 


}
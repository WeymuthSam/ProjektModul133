$(document).ready(function () { // wenn der Dom geladen ist

    $(document).ajaxStart(function () { //Bei einem ajax request wird der Loading button sichtbargesetzt
        $('#loading').removeClass('visually-hidden');//(Inspiriert bei Julian)
    })
    $(document).ajaxStop(function () { //beim stopp wieder sichtbar false
        $('#loading').addClass('visually-hidden');
    })

    if (localStorage.getItem('altesDatum') == null || localStorage.getItem('altesDatum') == "") {
        localStorage.setItem('altesDatum', moment().format('WW-GGGG')) //Datum wird im Localstorage gesetzt wenn localstorage leer ist
    }

    $('#Datum').text(localStorage.getItem('altesDatum')) // Wird in das Datumfeld eingefügt aus dem Localstorage

    $('#Berufsgruppe').change(function () { //wenn Feld Berufsgruppe sich verändert
        localStorage.setItem('altesDatum', moment().format('WW-GGGG'))
        $('#Datum').text(localStorage.getItem('altesDatum'))
        localStorage.setItem("berufsgruppe", this.value) // wird die Berufsgruppe im Localstorage gespeichert
        localStorage.removeItem("klassenauswahl")
        $('#InfoBerufsauswahl').addClass("visually-hidden")
        klasse(); // Function Klasse wird aufgerufen
    })

    $('#Klassenauswahl').change(function () { // Wenn sich das Feld Klassenauswahl sich verändert
        localStorage.setItem('altesDatum', moment().format('WW-GGGG'))
        $('#Datum').text(localStorage.getItem('altesDatum'))
        localStorage.setItem("klassenauswahl", this.value)  // wird die Klassenauswahl im Localstorage gespeichert
        $('#InfoKlassenauswahl').addClass("visually-hidden")
        tabelle(); //Function tabelle wird aufgerufen
    })

    $.ajax({ // ajax abfrage block ( asynchron)
        type: "GET",
        url: "http://sandbox.gibm.ch/berufe.php",
        data: { format: 'JSON' }, // format mitgeben
        dataType: 'json'
    }).done(function (data) {
        if (data != '' || data == null) {
            $('#errorMessage').removeClass("alert alert-warning")
            $('#Berufsgruppe').append('<option disabled selected>Ihre Auswahl ... </option>');// Berufgruppefeld wird mit einem AUswahlfeld erweitert
            $.each(data, function (key, value) {
                if (value.beruf_id == localStorage.getItem('berufsgruppe')) { // wenn die Berufid dem Beruf aus dem Localstorage übereinstimmt
                    $('#Berufsgruppe').append('<option value="' + value.beruf_id + '" selected>' + value.beruf_name + '</option>'); // wird in das feld die Berufe gesetzt
                    klasse() // aufruf nach function klasse
                } else {
                    $('#Berufsgruppe').append('<option value=' + value.beruf_id + '>' + value.beruf_name + '</option>'); //wird in das feld die Berufe gesetzt
                }
            })
        } else {
            $('#errorMessage').html('<div class="alert alert-warning">Keine Berufe gefunden ...</div>')
        }
    }).fail(function () {
        $('#errorMessage').text("Fehler aufgetreten"); // wenn etwas mit dem abfrage nicht stimmt wird eine warnung ausgegeben.
    })


    function klasse() {
        $('#Stundenplannavigation').addClass("visually-hidden") // wird Stundenplannavigation unsichbar gesetzt
        $('#Tabelle').addClass("visually-hidden") // wird Tabelle unsichbar gesetzt
        $('#Klassenauswahl').empty() // Feld Klassenauwahl wird geleert
        $('#tabelle').empty() // Inhalt der Tabelle wird geleert

        $.ajax({ // Asynchrone Abfrage für die Klassen anhand der Berufs
            type: "GET",
            url: "http://sandbox.gibm.ch/klassen.php?beruf_id=" + localStorage.getItem('berufsgruppe'),
            data: { format: 'JSON' }, // format mitgeben
            dataType: 'json'
        }).done(function (data) {
            if (data != '' || data == null) {
                $('#Klassenauswahl').removeClass("visually-hidden") // wird Klassenauswahl sichbar gesetzt
                $('#InfoKlassenauswahl').removeClass("visually-hidden")
                $('#TitelKlassenauswahl').removeClass("visually-hidden")  //wird Titel der Klassenauswahl  wird sichbar gesetzt
                $('#errorMessage').empty()
                $('#Klassenauswahl').append('<option disabled selected >Ihre Auswahl ... </option>'); // wieder wird ein Auswahlvorschlag gegeben
                $.each(data, function (key, value) {
                    if (value.klasse_id == localStorage.getItem('klassenauswahl')) { // wenn die klasse dem Localstore entspricht
                        $('#Klassenauswahl').append('<option value=' + value.klasse_id + ' selected>' + value.klasse_name + ' , ' + value.klasse_longname + '</option>'); // Klassen werden gesetzt
                        tabelle() //function tabelle wird aufrufen
                    } else {
                        $('#Klassenauswahl').append('<option value=' + value.klasse_id + '>' + value.klasse_name + ' , ' + value.klasse_longname + '</option>');// Klassen werden gesetzt
                    }

                })
            } else {
                $('#errorMessage').html('<div class="alert alert-warning">Keine Klassen vorhanden</div>')
                $('#Klassenauswahl').addClass("visually-hidden") // wird Klassenauswahl unsichtbar gesetzt
                $('#InfoKlassenauswahl').addClass("visually-hidden")
                $('#TitelKlassenauswahl').addClass("visually-hidden")
            }
        }).fail(function () {
            $('#errorMessage').html('<div class="alert alert-warning">Fehler bei der API-Abfrage beginnen Sie vom Anfang</div>');
            $('#Klassenauswahl').addClass("visually-hidden") // wird Klassenauswahl unsichtbar gesetzt
            $('#InfoKlassenauswahl').addClass("visually-hidden")
            $('#TitelKlassenauswahl').addClass("visually-hidden")  // fehler wird ausgeben wenn api abfrage fehlschlägt
            $('#Klassenauswahl').addClass("visually-hidden")
            $('#Tabelle').addClass("visually-hidden") // tabelle wird UNsichtbar gesetzt 
            $('#Stundenplannavigation').addClass("visually-hidden") // navigation wird UNsichtbar gesetzt 
        })
    }

    $('#Zurueck').click(function () { // wenn der zurück button geklickt wird 
        var date = localStorage.getItem('altesDatum') // datum wird aus dem localstorage geholt und auf date gesetzt
        localStorage.setItem("altesDatum", moment(date, "WW-GGGG").subtract(7, 'days').format('WW-GGGG')); // das gesetze date wird formatiert und 7 subtrahiert und wieder so im localstorage gespeichert
        $('#Datum').text(localStorage.getItem('altesDatum')) // und dann auf das datum feld der navigation gesetzt
        tabelle() // function tabelle wird aufegrufen
    })

    $('#Vor').click(function () { // wenn der pfeil der navigation gedrückt wird der nach vorne zeigt
        var date = localStorage.getItem('altesDatum') // datum wird aus dem localstorage geholt und auf date gesetzt
        localStorage.setItem("altesDatum", moment(date, "WW-GGGG").add(7, 'days').format('WW-GGGG'));// das gesetze date wird formatiert und 7  addiert und wieder so im localstorage gespeichert
        $('#Datum').text(localStorage.getItem('altesDatum')) // und dann auf das datum feld der navigation gesetzt
        tabelle()

    })

    function tabelle() {
        $('#Stundenplannavigation').removeClass("visually-hidden") // navigation wird sichtbar gesetzt
        $('#tabelle').empty() // tabellen inhalt wird geleert
        $.ajax({ // ajax request anhand der klasse und des datums um den korrekten stundenplan zu erhalten
            type: "GET",
            url: "http://sandbox.gibm.ch/tafel.php?klasse_id=" + localStorage.getItem('klassenauswahl') + "&woche=" + localStorage.getItem('altesDatum'),
            data: { format: 'JSON' }, // format mitgeben
            dataType: 'json'
        }).done(function (data) {
            if (data != '' || data == null) {
                $('#Tabelle').removeClass("visually-hidden") // tabelle wird sichtbar gesetzt 
               

                $('#errorMessage').empty()
                $.each(data, function (key, value) {
                    $('#tabelle').append('<tr>' +
                        '<td>' + Datum(value.tafel_datum) + '</td>' +
                        '<td>' + Wochentag(value.tafel_wochentag) + '</td>' +
                        '<td>' + value.tafel_von + '</td>' +
                        '<td>' + value.tafel_bis + '</td>' +
                        '<td>' + value.tafel_lehrer + '</td>' +
                        '<td>' + value.tafel_longfach + '</td>' +
                        '<td>' + value.tafel_raum + '</td>'
                    );
                })
            } else {
                $('#errorMessage').html('<div class="alert alert-warning">Kein Stundenplan für diese Woche vorhanden</div>')
                $('#Tabelle').addClass("visually-hidden")
            }
        }).fail(function () {
            $('#errorMessage').html('<div class="alert alert-warning">Fehler bei der API-Abfrage beginnen Sie vom Anfang</div>');  // bei falschen request wird ein error ausgegeben.
            $('#InfoKlassenauswahl').addClass("visually-hidden")
            $('#TitelKlassenauswahl').addClass("visually-hidden")  // fehler wird ausgeben wenn api abfrage fehlschlägt
            $('#Klassenauswahl').addClass("visually-hidden")
            $('#Tabelle').addClass("visually-hidden") // tabelle wird UNsichtbar gesetzt 
            $('#Stundenplannavigation').addClass("visually-hidden") // navigation wird UNsichtbar gesetzt 
        })
    }

    function Wochentag(zahl) { // funktion um die WOchentage in zahlen umzuwandeln
        var wochentage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'] // array mit den wochentagen
        return wochentage[zahl]; // der umgewandelte wochentag wird zurückgegeben
    }

    function Datum(datum) { // funktion um das datum zu ändern
        const formatDate = (datum) => {
            const [year, month, day] = datum.split('-')
            const formatted_date = [day, month, year].join('.')
            return formatted_date;
        }
        return formatDate(datum); // das formatierte datum wird zurück gegeben.
    }

}) 

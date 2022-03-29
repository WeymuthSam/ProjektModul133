$(document).ready(function () {
    $('#Berufsgruppe').change(function () {
        $('#Klassenauswahl').removeClass("visually-hidden")
        $('#TitelKlassenauswahl').removeClass("visually-hidden")
    })

    $('#Klassenauswahl').change(function () {
        $('#Tabelle').removeClass("visually-hidden")
        $('#Stundenplannavigation').removeClass("visually-hidden")

    })

    $.ajax({
        type: "GET",
        url: "http://sandbox.gibm.ch/berufe.php",
        data: { format: 'JSON' }, // format mitgeben
        dataType: 'json'
    }).done(function (data) {
        $('#Berufsgruppe')
        $.each(data, function (key, value) {
            if (value.beruf_id == localStorage.getItem('berufsgruppe')) {
                $('#Berufsgruppe').append('<option class=' + value.beruf_id + ' value=' + value.beruf_id + ' selected>' + value.beruf_name + '</option>');
            } else {
                $('#Berufsgruppe').append('<option class=' + value.beruf_id + ' value=' + value.beruf_id + '>' + value.beruf_name + '</option>');
            }

        })
    }).fail(function () {
        $('#errorMessage').text("Fehler aufgetreten");
    })


    function klasse(berufsgruppe) {
        $.ajax({
            type: "GET",
            url: "http://sandbox.gibm.ch/klassen.php?beruf_id=" + berufsgruppe,
            data: { format: 'JSON' }, // format mitgeben
            dataType: 'json'
        }).done(function (data) {
            $('#Klassenauswahl')
            $.each(data, function (key, value) {
                if (value.klasse_id == localStorage.getItem('klasse')) {
                    $('#Klassenauswahl').append('<option class=' + value.klasse_id + ' value=' + value.klasse_id + ' selected>' + value.klasse_name + ' , ' + value.klasse_longname + '</option>');
                } else {
                    $('#Klassenauswahl').append('<option class=' + value.klasse_id + ' value=' + value.klasse_id + '>' + value.klasse_name + ' , ' + value.klasse_longname + '</option>');
                }

            })
        }).fail(function () {
            $('#errorMessage').text("Fehler aufgetreten");
        })
    }

    if (localStorage.getItem("berufsgruppe")) {
        klasse(localStorage.getItem("berufsgruppe"))
    }


    if (localStorage.getItem("klasse")) {
        tabelle(localStorage.getItem("klasse"))
    }


    $('#Berufsgruppe').change(function () {
        $('#klassauswahl').empty();
        localStorage.setItem("berufsgruppe", this.value)
        klasse(this.value);
    })

    $('#Klassenauswahl').change(function () {
        $('#tabelle').empty();
        localStorage.setItem("klassenauswahl", this.value)
        tabelle(this.value);
    })


    function tabelle(klasse) {
        $.ajax({
            type: "GET",
            url: "http://sandbox.gibm.ch/tafel.php?klasse_id=" + klasse,
            data: { format: 'JSON' }, // format mitgeben
            dataType: 'json'
        }).done(function (data) {
            $.each(data, function (key, value) {
                $('#tabelle').append('<tr>'),
                    $('#tabelle').append('<td>' + value.tafel_datum + '</td>'),
                    $('#tabelle').append('<td>' + Wochentag(value.tafel_wochentag) + '</td>'),
                    $('#tabelle').append('<td>' + value.tafel_von + '</td>'),
                    $('#tabelle').append('<td>' + value.tafel_bis + '</td>'),
                    $('#tabelle').append('<td>' + value.tafel_lehrer + '</td>'),
                    $('#tabelle').append('<td>' + value.tafel_longfach + '</td>'),
                    $('#tabelle').append('<td>' + value.tafel_raum + '</td>');
            })
        }).fail(function () {
            $('#errorMessage').text("Fehler aufgetreten");
        })
    }

    function Wochentag(zahl) {
        var wochentage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
        return wochentage[zahl];
    }
}) 

$(document).ready(function () {
    $(document).ajaxStart(function () {
        $('#loading').removeClass('visually-hidden');
    })
    $(document).ajaxStop(function () {
        $('#loading').addClass('visually-hidden');
    })
    if (localStorage.getItem('altesDatum') == null || localStorage.getItem('altesDatum') == "") {
        localStorage.setItem('altesDatum', moment().format('WW-GGGG'))
    }
    $('#Datum').text(localStorage.getItem('altesDatum'))

    $('#Berufsgruppe').change(function () {
        $('#Klassenauswahl').removeClass("visually-hidden")
        $('#TitelKlassenauswahl').removeClass("visually-hidden")
        $('#klasse').empty();
        localStorage.setItem("berufsgruppe", this.value)
        klasse(this.value);
    })

    $('#Klassenauswahl').change(function () {
        $('#Tabelle').removeClass("visually-hidden")
        $('#Stundenplannavigation').removeClass("visually-hidden")
        $('#tabelle').empty();
        localStorage.setItem("klassenauswahl", this.value)
        tabelle();

    })

    $.ajax({
        type: "GET",
        url: "http://sandbox.gibm.ch/berufe.php",
        data: { format: 'JSON' }, // format mitgeben
        dataType: 'json'
    }).done(function (data) {
        $('#Berufsgruppe').append('<option>Bitte wählen Sie einen Beruf</option>')
        $.each(data, function (key, value) {
            if (value.beruf_id == localStorage.getItem('berufsgruppe')) {
                $('#Berufsgruppe').append('<option class=' + value.beruf_id + ' value=' + value.beruf_id + ' selected>' + value.beruf_name + '</option>');
                $('#Klassenauswahl').removeClass("visually-hidden")
                $('#TitelKlassenauswahl').removeClass("visually-hidden")
                klasse(value.beruf_id)
            } else {
                $('#Berufsgruppe').append('<option class=' + value.beruf_id + ' value=' + value.beruf_id + '>' + value.beruf_name + '</option>');
            }

        })
    }).fail(function () {
        $('#errorMessage').text("Fehler aufgetreten");
    })


    function klasse(berufsgruppe) {
        $('#Klassenauswahl').empty()
        $('#tabelle').empty()
        //$('#Klassenauswahl').addClass("visually-hidden")
        // $('#TitelKlassenauswahl').addClass("visually-hidden")
        $.ajax({
            type: "GET",
            url: "http://sandbox.gibm.ch/klassen.php?beruf_id=" + berufsgruppe,
            data: { format: 'JSON' }, // format mitgeben
            dataType: 'json'
        }).done(function (data) {
            if (data == null) {
                alert('Keine Daten gefunden')
            } else { }
            $('#Klassenauswahl').append('<option>Bitte wählen Sie die Klasse</option>')
            //$('#Klassenauswahl')
            $.each(data, function (key, value) {
                if (value.klasse_id == localStorage.getItem('klassenauswahl')) {
                    $('#Klassenauswahl').append('<option class=' + value.klasse_id + ' value=' + value.klasse_id + ' selected>' + value.klasse_name + ' , ' + value.klasse_longname + '</option>');
                    $('#Tabelle').removeClass("visually-hidden")
                    $('#Stundenplannavigation').removeClass("visually-hidden")
                    tabelle()
                } else {
                    $('#Klassenauswahl').append('<option class=' + value.klasse_id + ' value=' + value.klasse_id + '>' + value.klasse_name + ' , ' + value.klasse_longname + '</option>');
                }

            })
        }).fail(function () {
            $('#errorMessage').text("Fehler aufgetreten");
        })
    }

    $('#Zurueck').click(function () {
        var date = localStorage.getItem('altesDatum')
        localStorage.setItem("altesDatum", moment(date, "WW-GGGG").subtract(7, 'days').format('WW-GGGG'));
        $('#Datum').text(localStorage.getItem('altesDatum'))
        tabelle()
    })

    $('#Vor').click(function () {
        var date = localStorage.getItem('altesDatum')
        localStorage.setItem("altesDatum", moment(date, "WW-GGGG").add(7, 'days').format('WW-GGGG'));
        $('#Datum').text(localStorage.getItem('altesDatum'))
        tabelle()

    })

    function tabelle() {
        $('#tabelle').empty()
        $.ajax({
            type: "GET",
            url: "http://sandbox.gibm.ch/tafel.php?klasse_id=" + localStorage.getItem('klassenauswahl') + "&woche=" + localStorage.getItem('altesDatum'),
            data: { format: 'JSON' }, // format mitgeben
            dataType: 'json'
        }).done(function (data) {
            $.each(data, function (key, value) {

                $('#tabelle').append('<tr>'),
                    $('#tabelle').append('<td>' + Datum(value.tafel_datum) + '</td>'),
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

    function Datum(datum) {
        const formatDate = (datum) => {
            const [year, month, day] = datum.split('-')
            const formatted_date = [day, month, year].join('.')
            return formatted_date;
        }
        return formatDate(datum);
    }

}) 

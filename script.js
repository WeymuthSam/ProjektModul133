$(document).ready(function () {
    $('#Berufsgruppe').change(function(){
        $('#Klassenauswahl').removeClass("visually-hidden")
        $('#TitelKlassenauswahl').removeClass("visually-hidden")
    })

    $('#Klassenauswahl').change(function(){
        $('#Tabelle').removeClass("visually-hidden")
        $('#Stundenplannavigation').removeClass("visually-hidden")

    })

/*
    $.ajax({
        type: "GET",
        url: "http://sandbox.gibm.ch/berufe.php",
        data: { format: 'JSON' }, // format mitgeben
        dataType: 'json'
    }).done(function (data) {
        $('#Berufsgruppe').append('<option> Ihre Auswahl </option>')
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

    $.ajax({
        type: "GET",
        url: "http://sandbox.gibm.ch/klassen.php?beruf_id=10",
        data: { format: 'JSON' }, // format mitgeben
        dataType: 'json'
    }).done(function (data) {
        $('#Klassenauswahl').append('<option> Ihre Auswahl </option>')
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

    if (localStorage.getItem("berufsgruppe")) {
        ajax(localStorage.getItem("berufsgruppe"))
    }
    if (localStorage.getItem("klasse")) {
        ajax(localStorage.getItem("klasse"))
    }


    $('#Berufsgruppe').change(function () {
        $('#berufsgruppe').empty();
        localStorage.setItem("berufsgruppe", this.value)
        ajax(this.value);
    })

    $('#Klassenauswahl').change(function () {
        $('#klassenauswahl').empty();
        localStorage.setItem("klassenauswahl", this.value)
        ajax(this.value);
    })


    function ajax(filiale) {
        $.ajax({
            type: "GET",
            url: "https://gibm.becknet.ch/warenhaus/getFiliale.php?filiale=" + filiale,
            data: { format: 'JSON' }, // format mitgeben
            dataType: 'json'
        }).done(function (data) {
            $.each(data, function (key, value) {
                $('#tabelle').append('<td>' + value.stadt + '</td>');
                $('#tabelle').append('<td>' + value.strasse + '</td>');
                $('#tabelle').append('<td>' + value.oeffnungszeiten + '</td>');

            })
        }).fail(function () {
            $('#errorMessage').text("Fehler aufgetreten");
        })
    }*/
}) 

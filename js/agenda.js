class Agenda {
    constructor(url) {
        this.url = url;
        this.last_api_call = null;
        this.last_api_result = null;
        this.intervalo = 10;
    }

    obtenerCarrerasTemporadaActual() {
        const now = new Date();

        if (this.last_api_call !== null) {
            const tiempoTranscurrido = (now - this.last_api_call) / (1000 * 60); 
            if (tiempoTranscurrido < this.intervalo) {
                $('section').find('article').remove();
                var races = $(this.last_api_result).find('Race');
                
                races.each(function(){
                    var article = $('<article>');
                    article.append($('<h3>').text($(this).find('RaceName').text()));
                    article.append($('<p>').text('Nombre del circuito: ' + $(this).find('Circuit CircuitName').text()));
                    article.append($('<p>').text('Coordenadas del circuito: ' + $(this).find('Circuit Location').attr('lat') + ', ' + $(this).find('Circuit Location').attr('long')));
                    article.append($('<p>').text('Fecha: ' + $(this).find('Date').eq(0).text())); 
                    article.append($('<p>').text('Hora: ' + $(this).find('Time').eq(0).text()));
                    $('section').append(article)
                });
                return;
            }
        }

        $.ajax({
            dataType: "xml",
            url: this.url,
            method: 'GET',
            success: (datos) => {
                var races = $(datos).find('Race');
                $('section').find('article').remove();
                races.each(function () {
                    var article = $('<article>');
                    article.append($('<h3>').text($(this).find('RaceName').text()));
                    article.append($('<p>').text('Nombre del circuito: ' + $(this).find('Circuit CircuitName').text()));
                    article.append($('<p>').text('Coordenadas del circuito: ' + $(this).find('Circuit Location').attr('lat') + ', ' + $(this).find('Circuit Location').attr('long')));
                    article.append($('<p>').text('Fecha: ' + $(this).find('Date').eq(0).text()));
                    article.append($('<p>').text('Hora: ' + $(this).find('Time').eq(0).text()));
                    $('section').append(article);
                });
        
                this.last_api_call = now;
                this.last_api_result = datos;
            },
            error: () => {
                $('section').find('article').remove();
                var article = $('<article>');
                article.append($('<h3>').text('Error'));
                article.append($('<p>').text('No se han podido obtener datos de las carreras'));
        
                $('section').append(article);
                return;
            }
        });

        
    }
}

var agenda = new Agenda("https://ergast.com/api/f1/current");
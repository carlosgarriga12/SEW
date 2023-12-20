class Viajes {
    constructor() {
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    getPosicion(posicion) {
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
        this.precision = posicion.coords.accuracy;
        this.altitud = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo = posicion.coords.heading;
        this.velocidad = posicion.coords.speed;
    }

    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización"
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible"
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado"
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido"
                break;
        }
    }

    getMapaEstatico() {
        let url = "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/geojson(%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B"
        url += this.longitud
        url += "%2C"
        url += this.latitud
        url += "%5D%7D)/"
        url += this.longitud + "," + this.latitud
        url += ",12/300x200?access_token=pk.eyJ1IjoiY2FybG9zZ2FycmlnYTEyIiwiYSI6ImNscGk0a3RhdDBjaG4yaW1hbWZmejFmcXYifQ.Tt6wJvHxGfjJS6BKNc0Tkw"

        $('section:first').append('<img src="' + url + '" alt="Mapa estático de la posición del usuario"/>')
        $('section:first button').remove()

    }

    getMapaDinamico() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zZ2FycmlnYTEyIiwiYSI6ImNscGk0a3RhdDBjaG4yaW1hbWZmejFmcXYifQ.Tt6wJvHxGfjJS6BKNc0Tkw';
        const map = new mapboxgl.Map({
            container: 'mapaDinamico',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [this.longitud, this.latitud],
            zoom: 13
        });

        var markerCoordinates = [this.longitud, this.latitud];

        /*Añadir el marcador en el mapa genera una advertencia en el código generado, pero es código externo*/
        new mapboxgl.Marker()
            .setLngLat(markerCoordinates)
            .addTo(map);

        map.resize()
        $('section:eq(1) button').remove()
    }

    readXMLFile(files) {
        var archivo = files[0];

        var tipoXml = /xml.*/;
        if (archivo.type.match(tipoXml)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                var content = evento.target.result;
                var xmlContent = $.parseXML(content)
                var xml = $(xmlContent)

                xml.find('ruta').each(function () {
                    var ruta = $(this);
                    var nombre = ruta.attr('nombre');
                    var tipo = ruta.attr('tipo');
                    var medioTransporte = ruta.attr('medioTransporte');
                    var recomendacion = ruta.attr('recomendacion');
                    var duracion = ruta.find('duracion').text();
                    var agencia = ruta.find('agencia').text();
                    var descripcion = ruta.find('descripcion').eq(0).text();
                    var personasAdecuadas = ruta.find('personasAdecuadas').text();
                    var lugarInicio = ruta.find('lugarInicio').text();
                    var direccionInicio = ruta.find('direccionInicio').text();

                    var longitud = ruta.find('coordenadas > longitud').eq(0).text();
                    var latitud = ruta.find('coordenadas > latitud').eq(0).text();
                    var altitud = ruta.find('coordenadas > altitud').eq(0).text();

                    var referencias = '';
                    ruta.find('referencias > referencia').each(function () {
                        var referencia = $(this).text();
                        referencias += '<li><a href="' + referencia + '">' + referencia + '</a></li>';
                    });

                    var hitos = '';
                    ruta.find('hitos > hito').each(function () {
                        var hito = $(this);
                        var hitoNombre = hito.attr('nombre');
                        var descripcionHito = hito.find('descripcion').text();
                        var longitudHito = hito.find('coordenadas > longitud').text();
                        var latitudHito = hito.find('coordenadas > latitud').text();
                        var altitudHito = hito.find('coordenadas > altitud').text();
                        var unidadesDistancia = hito.find('distanciaHitoAnterior').attr("unidadesDistancia");
                        var distanciaHitoAnterior = hito.find('distanciaHitoAnterior').text();
                        var fotografia = hito.find('fotografias > fotografia').text();

                        hitos += '<h6>' + hitoNombre + '</h6>'
                        hitos += '<p>' + descripcionHito + '</p>'
                        hitos += '<p>Coordenadas: (' + longitudHito + ', ' + latitudHito + ', ' + altitudHito + ')</p>'
                        hitos += '<p>Distancia al hito anterior: ' + distanciaHitoAnterior + ' ' + unidadesDistancia + '</p>'
                        hitos += '<img src="multimedia/imagenes/' + fotografia + '" alt= "Fotografía de ' + hitoNombre + '"/>';
                    });

                    $('main').append("<section></section>")
                    $('main section:last').append("<h4>" + nombre + "</h4>")
                    $('main section:last').append('<p>Descripción: ' + descripcion + '</p>')
                    $('main section:last').append('<ul>')
                    $('main section:last ul:last').append('<li>Tipo: ' + tipo + '</li>')
                    $('main section:last ul:last').append('<li>Recomendacion: ' + recomendacion + '</li>')
                    $('main section:last ul:last').append('<li>Medio de transporte: ' + medioTransporte + '</li>')
                    $('main section:last ul:last').append('<li>Duración: ' + duracion + '</li>')
                    $('main section:last ul:last').append('<li>Agencia: ' + agencia + '</li>')
                    $('main section:last ul:last').append('<li>Personas adecuadas: ' + personasAdecuadas + '</li>')
                    $('main section:last ul:last').append('<li>Lugar de inicio: ' + lugarInicio + '</li>')
                    $('main section:last ul:last').append('<li>Dirección de inicio: ' + direccionInicio + '</li>')
                    $('main section:last ul:last').append('<li>Coordenadas de inicio: (' + longitud + ', ' + latitud + ', ' + altitud + ')</li>')
                    $('main section:last').append('<h5>Referencias de la ruta</h5>')
                    $('main section:last').append('<ul>' + referencias + '</ul>')
                    $('main section:last').append('<h5>Hitos de la ruta</h5>')
                    $('main section:last').append(hitos)
                })
            }
            lector.readAsText(archivo);
        }
    }

    readKMLFiles(files) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zZ2FycmlnYTEyIiwiYSI6ImNscGk0a3RhdDBjaG4yaW1hbWZmejFmcXYifQ.Tt6wJvHxGfjJS6BKNc0Tkw';
        const map = new mapboxgl.Map({
            container: 'mapaDinamicoKML',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-80.01815662080142, 21.915225131956095],
            zoom: 6
        });

        for (let i = 0; i < files.length; i++) {
            var kml = files[i]
            var lector = new FileReader();

            lector.onload = function (evento) {
                var content = evento.target.result;
                var kmlContent = $.parseXML(content)
                var kmlDOM = $(kmlContent)
                var coordinates = kmlDOM.find('coordinates').text().split("\n")
                coordinates.shift()
                coordinates.pop()
                let coordenadasParseadas = coordinates.map(elemento => {
                    let elementosSeparados = elemento.split(",");
                    return [parseFloat(elementosSeparados[0]), parseFloat(elementosSeparados[1])];
                });

                map.on('load', function () {
                    map.addLayer({
                        'id': 'linea' + i,
                        'type': 'line',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                    'type': 'LineString',
                                    'coordinates': coordenadasParseadas
                                }
                            }
                        },
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': '#F00',
                            'line-width': 8
                        }
                    });
                });
            }
            lector.readAsText(kml);
        }
    }

    readSVGFiles(files) {
        for (let i = 0; i < files.length; i++) {
            var svg = files[i]
            var lector = new FileReader();

            lector.onload = function (evento) {
                var content = evento.target.result;
                var svgContent = $.parseXML(content)
                var svgDOM = $(svgContent)
                var etiquetaSVG = svgDOM.find('svg')
                etiquetaSVG.attr('version', '1.1');

                $('body > section:nth-child(9)').append(etiquetaSVG)
            }
            lector.readAsText(svg);
        }
    }
}

class Carrusel {

    constructor() {
        this.curSlide = 5;
        this.maxSlide = 9;
    }

    siguienteFoto() {
        if (this.curSlide === this.maxSlide) {
            this.curSlide = 0;
        } else {
            this.curSlide++;
        }
        let lastSection = document.querySelector('body > section:last-child');
        let slides = lastSection.querySelectorAll('img');

        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
    }

    anteriorFoto() {
        if (this.curSlide === 0) {
            this.curSlide = this.maxSlide;
        } else {
            this.curSlide--;
        }

        let lastSection = document.querySelector('body > section:last-child');
        let slides = lastSection.querySelectorAll('img');
        //   move slide by 100%
        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
    }

}

var viajes = new Viajes();
var carrusel = new Carrusel();
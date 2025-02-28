class Pais {
    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = Number(poblacion);
        this.formaGobierno = "";
        this.coordenadasCapital = "";
        this.religionMayoritaria = "";
    }

    rellenarAtributos(formaGobierno, coordenadasCapital, religionMayoritaria) {
            this.formaGobierno = formaGobierno;
            this.coordenadasCapital = coordenadasCapital;
            this.religionMayoritaria = religionMayoritaria;
    }

    getNombre(){
        return this.nombre;
    }

    getCapital() {
        return this.capital;
    }

    getPoblacion() {
        return this.poblacion.toString();
    }

    getFormaDeGobierno() {
        return this.formaGobierno;
    }

    getCoordenadasCapital() {
        return this.coordenadasCapital;
    }

    getReligionMayoritaria() {
        return this.religionMayoritaria;
    }

    getInformacionSecundaria() {
        var informacionSecundaria = "<p>Información secundaria: </p>";
        informacionSecundaria += "<ul>\n";

        informacionSecundaria += "<li>Población: " + this.getPoblacion() + "</li>\n";
        informacionSecundaria += "<li>Forma de gobierno: " + this.getFormaDeGobierno() + "</li>\n";
        informacionSecundaria += "<li>Religión mayoritaria: " + this.getReligionMayoritaria() + "</li>\n";

        informacionSecundaria += "</ul>\n"

        return informacionSecundaria;
    }

    escribirCoordenadasCapital() {
        document.write("<p>");
        document.write("Coordenadas de la capital: " + this.coordenadasCapital);
        document.write("</p>");
    }

    obtenerMeteorologia() {
        var coordenadasFormateadas = this.coordenadasCapital.split(",").map(element => element.trim());
        var theURL = "https://api.openweathermap.org/data/2.5/forecast?lat="
        theURL += coordenadasFormateadas[1];
        theURL += "&lon=";
        theURL += coordenadasFormateadas[0];
        theURL += "&appid=";
        theURL += "fb8f6fe3712f02f3aa278705b5d6c710";
        theURL += "&units=metric";

        $.ajax({
            dataType: "json",
            url: theURL,
            method: 'GET',
            success: function(datos){
                var datosMeteorologicos = datos.list.filter(element => element.dt_txt.includes("15:00:00"));
                $('button').attr("disabled","disabled");
                datosMeteorologicos.forEach(day => {
                    var article = $('<article>');
                    article.append($('<h4>').text(day.dt_txt.replace("15:00:00", "").trim()));
                    article.append($('<p>').text('Temperatura máxima: ' + day.main.temp_max + " ºC"));
                    article.append($('<p>').text('Temperatura mínima: ' + day.main.temp_min + " ºC"));
                    article.append($('<p>').text('Porcentaje de humedad: ' + day.main.humidity + " %")); 
                    article.append($('<p>').text('Cantidad de lluvia: ' + (day.pop * 100).toFixed(2) + ' %'));
                    article.append($('<img />')
                            .attr('src', 'https://openweathermap.org/img/w/' + day.weather[0].icon + '.png')
                            .attr('alt', day.weather[0].description))
                    $('section[data-topic="meteorologia"]').append(article);
                });
            },
            error:function(){
                $('section[data-topic="meteorologia"]').append('<p>Hubo algún error durante la petición</p>');
                $('button').attr("disabled","disabled");
            }
        });
    }
}

var pais = new Pais("Cuba", "La Habana", 2130000);
pais.rellenarAtributos("República", "-82.38304, 23.13302", "Ateos");

document.write("<p>");
document.write("Nombre: " + pais.getNombre());
document.write("</p>");
document.write("<p>");
document.write("Capital: " + pais.getCapital());
document.write("</p>");
document.write(pais.getInformacionSecundaria());
pais.escribirCoordenadasCapital();
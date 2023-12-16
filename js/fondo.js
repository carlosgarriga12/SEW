class Fondo{
    constructor(nombrePais, capital, coordenadas){
        this.nombrePais = nombrePais;
        this.capital = capital;
        this.coordenadas = coordenadas;
    }

    obtenerImagen() {
        var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
            $.getJSON(flickrAPI, 
                    {
                        tags: this.nombrePais,
                        tagmode: "any",
                        format: "json"
                    })
                .done(function(data) {
                        $.each(data.items, function(i,item ) {
                            $('body').css("background-image", "url('" + item.media.m.replace('_m','_b') + "')").css("background-size", "cover");

                            if ( i === 1 ) {
                                return false;
                            }
                        });
            })

    }
}

var fondo = new Fondo("Cuba", "La Habana", "-82.38304, 23.13302");
fondo.obtenerImagen();
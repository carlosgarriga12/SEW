class Noticias {
    constructor() {
        this.soportaAPIFile = false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            this.soportaAPIFile = true;
        }
    }

    readInputFile(files) {
        if (this.soportaAPIFile) {
            alert("El navegador soporta API FILE")
            var archivo = files[0];
            //Solamente admite archivos de tipo texto
            var tipoTexto = /text.*/;
            if (archivo.type.match(tipoTexto)) {
                var lector = new FileReader();
                lector.onload = function (evento) {
                    let contenido = lector.result;
                    let noticias =  contenido.split('\n')

                    noticias.forEach((noticia) => {
                        let secciones = noticia.split('_')
                        var article = $('<article>')

                        $(article).append($('<h3>').text(secciones[0]))
                        $(article).append($('<h4>').text(secciones[1]))
                        $(article).append($('<p>').text(secciones[2]))
                        $(article).append($('<p>').text(secciones[3]))

                        $('main').append(article)

                    })
                }
                lector.readAsText(archivo);
            }
        } else {
            alert("El navegador NO soporta API FILE")
        }
    }

    addNoticia() {
        var textAreas = document.querySelectorAll('textarea')

        let textoTitulo = textAreas[0].value
        let textoSubtitulo = textAreas[1].value
        let textoContenido = textAreas[2].value
        let textoAutor = textAreas[3].value
        
        if (textoTitulo === "" || textoSubtitulo === "" || textoContenido === "" || textoAutor === "") {
            alert("Por favor rellene todos los campos antes de añadir una noticia");
        } else {
            var article = $('<article>')

            $(article).append($('<h3>').text(textoTitulo))
            $(article).append($('<h4>').text(textoSubtitulo))
            $(article).append($('<p>').text(textoContenido))
            $(article).append($('<p>').text(textoAutor))

            $('main').append(article)

            textAreas.forEach((t) => t.value = "")
        }
    }
}

var noticias = new Noticias();
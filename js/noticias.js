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

                        let titulo = $('<h3>').text(secciones[0]);
                        let subtitulo = $('<h4>').text(secciones[1]);
                        let contenido = $('<p>').text(secciones[2]);
                        let autor = $('<p>').text(secciones[3]);

                        $('main').append(titulo)
                        $('main').append(subtitulo)
                        $('main').append(contenido)
                        $('main').append(autor)

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
            alert("Porfavor rellene todos los campos antes de añadir una noticia");
        } else {
            let titulo = $('<h3>').text(textoTitulo);
            let subtitulo = $('<h4>').text(textoSubtitulo);
            let contenido = $('<p>').text(textoContenido);
            let autor = $('<p>').text(textoAutor);

            $('main').append(titulo)
            $('main').append(subtitulo)
            $('main').append(contenido)
            $('main').append(autor)

            textAreas.forEach((t) => t.value = "")
        }
    }
}

var noticias = new Noticias();
<?php

class Carrusel {
    protected $pais;
    protected $capital;
    protected $perPage;

    public function __construct($pais, $capital)
    {
        $this-> pais = $pais;
        $this-> capital = $capital;
        $this-> perPage = 10;
    }

    public function getPerPage() {
        return $this -> perPage;
    }

    public function obtenerFotos() {
        $api_key = '1d78d173bec581a8fd4cb84ef6f3b609';
        $tag = urldecode($this -> pais);
        // Fotos públicas recientes
        $url = 'https://api.flickr.com/services/feeds/photos_public.gne?';
        $url.= '&api_key='.$api_key;
        $url.= '&tags='.$tag;
        $url.= '&per_page='.$this -> getPerPage();
        $url.= '&format=json';
        $url.= '&nojsoncallback=1';

        $respuesta = file_get_contents($url);
        $json = json_decode($respuesta);

        return $json;
    }
}

class Moneda{

    protected $monedaLocal;
    protected $monedaExtranjera;

    public function __construct($monedaLocal, $monedaExtranjera)
    {
        $this -> monedaLocal = $monedaLocal;
        $this -> monedaExtranjera = $monedaExtranjera;
    }

    public function devolverCambioMoneda() {
        $api_key = "1a19f49c63e1f9a8f6692e25";
        $url = "https://v6.exchangerate-api.com/v6/";
        $url.= $api_key;
        $url.= "/latest/";
        $url.= $this -> monedaLocal;

        $respuesta = file_get_contents($url);
        $json = json_decode($respuesta);
        $monedaExtranjera = $this->monedaExtranjera;
        $rate = $json->conversion_rates-> $monedaExtranjera;

        return $rate;
    }
}
?>
<!DOCTYPE html>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Escritorio Virtual - Viajes</title>
    <meta name ="author" content ="Carlos Garriga Suárez" />
    <meta name ="description" content ="Documento de mis viajes del Escritorio Virtual (Virtual Desktop)" />
    <meta name ="keywords" content ="escritorio,virtual,viajes" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/viajes.css" />
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet' />
    <link rel="icon" type="image/x-icon" href="multimedia/imagenes/favicon.png" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'></script>
    <script src="js/viajes.js"></script>
</head>

<body>
    <header>
        <h1>Escritorio virtual</h1>
        <nav>
            <a tabindex="1" accesskey="I" href="index.html">Inicio</a>
            <a tabindex="2" accesskey="S" href="sobremi.html">Sobre mi</a>
            <a tabindex="3" accesskey="N" href="noticias.html">Noticias</a>
            <a tabindex="4" accesskey="A" href="agenda.html">Agenda</a>
            <a tabindex="5" accesskey="M" href="meteorologia.html">Meteorología</a>
            <a tabindex="6" accesskey="V" href="viajes.php">Viajes</a>
            <a tabindex="7" accesskey="J" href="juegos.html">Juegos</a>
        </nav>
    </header>
    <h2>Mapas</h2>
    <section>
        <h3>Mapa estático de la posición del usuario</h3>
        <button onclick="viajes.getMapaEstatico()">Obtener mapa estático</button>
    </section>
    <section>
        <h3>Mapa dinámico de la posición del usuario</h3>
        <button onclick="viajes.getMapaDinamico()">Obtener mapa dinámico</button>
        <section id="mapaDinamico">
            <h4>Esta sección se usará para representar el mapa</h4>
        </section>
    </section>
    <h2>Lectura de archivos con el API FILE</h2>
    <section>
        <h3>Lectura XML</h3>
        <p>Seleccione un archivo XML:</p>
        <p>
            <input type="file" id="archivoXML" onchange="viajes.readXMLFile(this.files);">
        </p>
    </section>
    <main></main>
    <section>
        <h3>Lectura de KML</h3>
        <p>Seleccione los archivos KML:</p>
        <p>
            <input type="file" id="archivoKML" onchange="viajes.readKMLFiles(this.files);" multiple>
        </p>
        <section id="mapaDinamicoKML">
            <h4>Esta sección se usará para representar el mapa</h4>
        </section>
    </section>
    <section>
        <h3>Lectura de SVG</h3>
        <p>Seleccione los archivos SVG:</p>
        <p>
            <input type="file" id="archivoSVG" onchange="viajes.readSVGFiles(this.files);" multiple>
        </p>
    </section>
    <h2>Cambio de moneda</h2>
    <?php
        $moneda = new Moneda("EUR", "CUP");
        $conversion = $moneda -> devolverCambioMoneda();
        echo "<p>Actualmente 1€ equivale a ". $conversion . " pesos cubanos.</p>";
    ?>
    <h2>Carrusel de fotos</h2>
    <?php
        $carrusel = new Carrusel("Cuba", "La Habana");

        $fotos = $carrusel -> obtenerFotos();

        if($fotos==null) {
            echo "<section>";
            echo "<h3>No se ha podido generar el carrusel</h3>";
            echo "<p>Algo ha ido mal durante la petición de las fotos</p>";
            echo "</section>";
        }

        else {
            echo "<section>";
            echo "<h3>Carrusel generado correctamente</h3>";
            for($i=0;$i<$carrusel -> getPerPage();$i++) {
                $URLfoto = $fotos->items[$i]->media->m;       
                echo "<img alt='". "Foto carrusel ".$i."' src='".str_replace('_m', '_b', $URLfoto)."' />";
                
            }
            echo "<button onclick='carrusel.siguienteFoto();'> > </button>";
            echo "<button onclick='carrusel.anteriorFoto();'> < </button>";
            echo "</section>";
        }
    ?>
</body>
</html>
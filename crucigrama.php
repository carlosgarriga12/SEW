<?php
    session_start();
    class Record {
        protected $server;
        protected $user;
        protected $pass;
        protected $dbname;
        protected $db;

        public function __construct()
        {
            $this-> server = "localhost";
            $this-> user = "DBUSER2023";
            $this-> pass = "DBPSWD2023";
            $this-> dbname = "records";
        }

        public function getDb() {
            return $this-> db;
        }

        public function realizarConexion() {
            $this-> db = new mysqli($this-> server, $this-> user, $this-> pass, $this-> dbname);
            if($this-> db->connect_error) {
                echo "Error conectándose a la base de datos";  
            }
        }

        public function addRegistro($nombre, $apellidos, $dificultad, $tiempo) {
            $consultaPre = $this->db->prepare("INSERT INTO registro (nombre, apellidos, dificultad, tiempo) VALUES (?,?,?,?)");
            $consultaPre->bind_param('sssi', $nombre, $apellidos, $dificultad, $tiempo);
            $consultaPre->execute();
            $consultaPre->close();
        }

        public function mejoresRegistros($dificultad) {
            $consultaPre = $this -> db -> prepare("SELECT nombre, apellidos, tiempo FROM registro WHERE dificultad = ? ORDER BY tiempo ASC LIMIT 10");
            $consultaPre -> bind_param('s', $dificultad);
            $consultaPre -> execute();
            $result = $consultaPre -> get_result();
            $consultaPre->close();
            return $result;
        }

    }
?>

<!DOCTYPE html>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Escritorio Virtual - Crucigrama</title>
    <meta name ="author" content ="Carlos Garriga Suárez" />
    <meta name ="description" content ="Documento de los juegos del Escritorio Virtual (Virtual Desktop)" />
    <meta name ="keywords" content ="escritorio,virtual,juegos" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />
    <link rel="icon" type="image/x-icon" href="multimedia/imagenes/favicon.png" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="js/crucigrama.js"></script>
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
    <nav>
        <a tabindex="8" accesskey="E" href="memoria.html">Memoria</a>
        <a tabindex="9" accesskey="U" href="sudoku.html">Sudoku</a>
        <a tabindex="10" accesskey="C" href="crucigrama.php">Crucigrama</a>
        <a tabindex="11" accesskey="P" href="api.html">API</a>
        <a tabindex="12" accesskey="Z" href="php/pizzeria.php">Pizzería</a>
    </nav>
    <h2>Crucigrama matemático</h2>
    <main>
    </main>
    <?php
        if (count($_POST)>0) 
        {   
            $record = new Record();
            $nombre = $_POST["nombre"];
            $apellidos = $_POST["apellidos"];
            $dificultad = $_POST["dificultad"];
            $tiempo = $_POST["tiempo"];
            
            $record -> realizarConexion();
            $record -> addRegistro($nombre, $apellidos, $dificultad, $tiempo);
            $result = $record -> mejoresRegistros($dificultad);
            echo '<section>';
            echo '<h3>Mejores resultados en dificultad '. $dificultad. '</h3>';
            echo '<ol>';
            while ($row = $result->fetch_assoc()) {
                echo '<li>Nombre: ' . $row["nombre"] . ' ' . $row["apellidos"] . ' - Tiempo: ' . $row["tiempo"] . ' segundos</li>';
            }
            echo '</ol>';
            echo '</section>';
            $record->getDb()->close();
            session_destroy();
        }
    ?>
    <section data-type="botonera">
        <h3>Botonera</h3>
        <button onclick="crucigrama.introduceElement(1)">1</button>
        <button onclick="crucigrama.introduceElement(2)">2</button>
        <button onclick="crucigrama.introduceElement(3)">3</button>
        <button onclick="crucigrama.introduceElement(4)">4</button>
        <button onclick="crucigrama.introduceElement(5)">5</button>
        <button onclick="crucigrama.introduceElement(6)">6</button>
        <button onclick="crucigrama.introduceElement(7)">7</button>
        <button onclick="crucigrama.introduceElement(8)">8</button>
        <button onclick="crucigrama.introduceElement(9)">9</button>
        <button onclick="crucigrama.introduceElement('*')">*</button>
        <button onclick="crucigrama.introduceElement('+')">+</button>
        <button onclick="crucigrama.introduceElement('-')">-</button>
        <button onclick="crucigrama.introduceElement('/')">/</button>
    </section>
    <script>
        crucigrama.paintMathword();

        document.addEventListener("keydown", function(event) {
            const tecla = event.key;
            let operators = ['+', '-', '*', '/'];

            if ((!isNaN(tecla) && tecla >= 1 && tecla <= 9)|| operators.includes(tecla)) {
                let selectedParagraph = document.querySelector("p[data-state='clicked']");
                if(selectedParagraph != null) {
                    crucigrama.introduceElement(tecla);
                }
                else {
                    alert("Seleccione una celda antes de introducir el valor");
                }
            } 
        });
    </script>
</body>
</html>
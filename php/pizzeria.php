<?php

class Pizzeria
{
    protected $server;
    protected $user;
    protected $pass;
    protected $dbname;
    protected $sql_init_file;
    protected $sql_init_info_file;

    public function __construct()
    {
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "pizzeria";
        $this->sql_init_file = "pizzeria.sql";
        $this->sql_init_info_file = "pizzeria.csv";
    }

    public function crearBaseDeDatos()
    {
        if($this-> existeBaseDeDatos()) {
            echo "<p>Ya existe la base de datos</p>";
        } else {
            $conn = new mysqli($this->server, $this->user, $this->pass);

            $sqlContent = file_get_contents($this->sql_init_file);
    
            if ($conn->multi_query($sqlContent)) {
                echo "<p>Base de datos creada correctamente</p>";
            } else {
                echo "<p>Error al ejecutar el script SQL: " . $conn->error. "</p>";
            }
    
            $conn->close();
        }
    }

    public function existeBaseDeDatos() {
        $conn = new mysqli($this->server, $this->user, $this-> pass);
        $sql = "SHOW DATABASES LIKE '$this->dbname'";
        $result = $conn->query($sql);
        return $result->num_rows > 0;
    }

    public function importarDatos()
    {
        $csvFile = fopen($this->sql_init_info_file, "r");

        if (!$csvFile) {
            echo ("No se pudo abrir el archivo CSV");
        }
        
        if ($this-> existeBaseDeDatos()) {
            $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $dataElement = "";
            for($i = 0; $i < 2; $i = $i + 1) {
                while (($data = fgetcsv($csvFile, 1000, ",")) !== FALSE) {
                    $firstElement = $data[0];
                    switch ($firstElement) {
                        case "ID_Cliente":
                            $dataElement = "Cliente";
                            continue 2;
                        case "ID_Encargo":
                            $dataElement = "Encargo";
                            continue 2;
                        case "ID_Ingrediente":
                            $dataElement = "Ingrediente";
                            continue 2;
                        case "ID_Pizza":
                            if($data[1] === "ID_Ingrediente") {
                                $dataElement = "PizzaIngrediente";
                            } else {
                                $dataElement = "Pizza";
                            }
                            continue 2;
                        default:
                            switch ($dataElement) {
                                case "Cliente":
                                    $this->insertarClienteCSV($data, $db);
                                    break;
                                case "Encargo":
                                    $this->insertarEncargoCSV($data, $db);
                                    break;
                                case "Ingrediente":
                                    $this->insertarIngredienteCSV($data, $db);
                                    break;
                                case "Pizza":
                                    $this->insertarPizzaCSV($data, $db);
                                    break;
                                case "PizzaIngrediente":
                                    $this->insertarPizzaIngredienteCSV($data, $db);
                                    break;
                                default:
                                    break;
                            }
                            break;
                    }
                }
            }
            fclose($csvFile);
            $db->close();
            echo "<p>Datos importados correctamente</p>";
        } else {
            echo "<p>La base de datos no ha sido creada</p>";
        }
    }

    public function exportarDatos() {
        if ($this->existeBaseDeDatos()) {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
    
            $csvFileName = "pizzeria_exportada.csv";
            $csvFile = fopen($csvFileName, 'w');
    
            $tablesQuery = "SHOW TABLES";
            $tablesResult = $conn->query($tablesQuery);
    
            while ($tableRow = $tablesResult->fetch_row()) {
                $tableName = $tableRow[0];
    
                $columnsQuery = "SHOW COLUMNS FROM $tableName";
                $columnsResult = $conn->query($columnsQuery);
                $columnNames = array();
    
                while ($columnRow = $columnsResult->fetch_assoc()) {
                    $columnNames[] = '"' . $columnRow['Field'] . '"';
                }
    
                fwrite($csvFile, implode(',', $columnNames) . "\n");
    
                $dataQuery = "SELECT * FROM $tableName";
                $dataResult = $conn->query($dataQuery);
    
                while ($rowData = $dataResult->fetch_assoc()) {
                    $rowDataQuoted = array_map(function($value) {
                        return '"' . $value . '"';
                    }, $rowData);
                    fwrite($csvFile, implode(',', $rowDataQuoted) . "\n");
                }
            }
            fclose($csvFile);
            $conn->close();
            echo "<p>Datos exportados correctamente a la carpeta local</p>";
        } else {
            echo "<p>La base de datos no ha sido creada todavía";
        }
    }

    private function insertarClienteCSV($data, $db)
    {
        $stmt = $db->prepare("INSERT INTO clientes (ID_Cliente, Nombre_Cliente, Direccion, Telefono) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $data[0], $data[1], $data[2], $data[3]);
        $stmt->execute();
        $stmt->close();
    }

    private function insertarEncargoCSV($data, $db)
    {
        $stmt = $db->prepare("INSERT INTO encargos (ID_Encargo, Fecha_Encargo, ID_Cliente, ID_Pizza, Cantidad, Total_Precio) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isiiid", $data[0], $data[1], $data[2], $data[3], $data[4], $data[5]);
        $stmt->execute();
        $stmt->close();
    }

    private function insertarIngredienteCSV($data, $db)
    {
        $stmt = $db->prepare("INSERT INTO ingredientes (ID_Ingrediente, Nombre_Ingrediente, Tipo) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $data[0], $data[1], $data[2]);
        $stmt->execute();
        $stmt->close();
    }

    private function insertarPizzaCSV($data, $db)
    {
        $stmt = $db->prepare("INSERT INTO pizza (ID_Pizza, Nombre_Pizza, Precio) VALUES (?, ?, ?)");
        $stmt->bind_param("isd", $data[0], $data[1], $data[2]);
        $stmt->execute();
        $stmt->close();
    }

    private function insertarPizzaIngredienteCSV($data, $db)
    {
        $stmt = $db->prepare("INSERT INTO pizza_ingredientes (ID_Pizza, ID_Ingrediente, Cantidad) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $data[0], $data[1], $data[2]);
        $stmt->execute();
        $stmt->close();
    }

    public function obtenerClientes() {
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $result = $db -> query("SELECT * FROM clientes");
        return $result;
    }

    public function crearCliente($nombre, $direccion, $telefono) {
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $stmt = $db->prepare("INSERT INTO clientes (Nombre_Cliente, Direccion, Telefono) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nombre, $direccion, $telefono);
        $stmt->execute();
        $stmt->close();
        $db->close();
    }

    public function obtenerPizzas() {
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $result = $db -> query("SELECT * FROM pizza");
        return $result;
    }

    public function obtenerIngredientesPizza($idPizza) {
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $ingredientes = array();
        $stmt = $db->prepare("SELECT i.Nombre_Ingrediente, i.Tipo, pi.Cantidad
        FROM pizza_ingredientes pi
        JOIN ingredientes i ON pi.ID_Ingrediente = i.ID_Ingrediente
        WHERE pi.ID_Pizza = ?");
        $stmt->bind_param("i", $idPizza);
        $stmt->execute();
        $stmt->bind_result($nombreIngrediente, $tipo, $cantidad);

        while ($stmt->fetch()) {
            $ingredientes[] = array(
                'Nombre_Ingrediente' => $nombreIngrediente,
                'Tipo' => $tipo,
                'Cantidad' => $cantidad
            );
        }

        $stmt->close();
        $db->close();

        return $ingredientes;
    }

    public function encontrarClientePorNombre($nombre) {
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        $stmt = $db->prepare("SELECT * FROM clientes WHERE Nombre_Cliente = ?");
        $stmt->bind_param("s", $nombre);
        $stmt->execute();

        $result = $stmt->get_result();
        $cliente = $result->fetch_assoc();

        $stmt->close();
        $db->close();

        return $cliente;
    }

    public function obtenerEncargosPorCliente($idCliente)
    {
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        $stmt = $db->prepare("SELECT * FROM encargos WHERE ID_Cliente = ?");
        $stmt->bind_param("i", $idCliente);
        $stmt->execute();

        $result = $stmt->get_result();
        $encargos = array();

        while ($encargo = $result->fetch_assoc()) {
            $encargos[] = $encargo;
        }

        $stmt->close();
        $db->close();

        return $encargos;
    }

}
?>
<!DOCTYPE html>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Escritorio Virtual - Pizzeria</title>
    <meta name="author" content="Carlos Garriga Suárez" />
    <meta name="description" content="Documento de los juegos del Escritorio Virtual (Virtual Desktop)" />
    <meta name="keywords" content="escritorio,virtual,juegos" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/pizzeria.css" />
    <link rel="icon" type="image/x-icon" href="../multimedia/imagenes/favicon.png" />

</head>

<body>
    <header>
        <h1>Escritorio virtual</h1>
        <nav>
            <a tabindex="1" accesskey="I" href="../index.html">Inicio</a>
            <a tabindex="2" accesskey="S" href="../sobremi.html">Sobre mi</a>
            <a tabindex="3" accesskey="N" href="../noticias.html">Noticias</a>
            <a tabindex="4" accesskey="A" href="../agenda.html">Agenda</a>
            <a tabindex="5" accesskey="M" href="../meteorologia.html">Meteorología</a>
            <a tabindex="6" accesskey="V" href="../viajes.php">Viajes</a>
            <a tabindex="7" accesskey="J" href="../juegos.html">Juegos</a>
        </nav>
    </header>
    <nav>
        <a tabindex="8" accesskey="E" href="../memoria.html">Memoria</a>
        <a tabindex="9" accesskey="U" href="../sudoku.html">Sudoku</a>
        <a tabindex="10" accesskey="C" href="../crucigrama.php">Crucigrama</a>
        <a tabindex="11" accesskey="P" href="../api.html">API</a>
        <a tabindex="12" accesskey="Z" href="pizzeria.php">Pizzería</a>
    </nav>
    <h2>Pizzeria virtual</h2>
    <section>
        <h3>Panel de control</h3>
        <form action="#" method="post" name="panel">
            <input type='submit' value='Crear base de datos' name='crear' />
            <input type='submit' value='Importar información' name='importar' />
            <input type='submit' value='Exportar información' name='exportar' />
        </form>
    </section>
    <?php
    $pizzeria = new Pizzeria();
    if (count($_POST) > 0) {
        if (isset($_POST["crear"])) $pizzeria->crearBaseDeDatos();
        if (isset($_POST["importar"])) $pizzeria->importarDatos();
        if (isset($_POST["exportar"])) $pizzeria->exportarDatos();
        if (isset($_POST["nombre"]) && isset($_POST["direccion"]) && isset($_POST["telefono"])) {
            $pizzeria -> crearCliente($_POST["nombre"], $_POST["direccion"], $_POST["telefono"]);
        }
    }
    ?>
    <section>
        <h3>Aplicación</h3>
        <section>
            <h4>Clientes de la pizzería</h4>
            <?php 
                if($pizzeria->existeBaseDeDatos()) {
                    $clientes = $pizzeria -> obtenerClientes();
                    if ($clientes-> num_rows > 0) {
                        echo "<ul>";
                        while ($row = $clientes->fetch_assoc()) {
                            echo "<li>Nombre: " . $row["Nombre_Cliente"] . " - Direccion: " . $row["Direccion"] . " - Teléfono: " . $row["Telefono"] . "</li>";
                        }
                        echo "</ul>";
                        echo "<form action='#' method='post' name='clientes'>";
                        echo "<p>";
                        echo "<label for='nombre'>Nombre: </label>";
                        echo "<input id='nombre' name='nombre' type='text' placeholder='Escriba su nombre' required>";
                        echo "</p>";
                        echo "<p>";
                        echo "<label for='direccion'>Dirección: </label>";
                        echo "<input id='direccion' name='direccion' type='text' placeholder='Escriba su dirección' required>";
                        echo "</p>";
                        echo "<p>";
                        echo "<label for='telefono'>Teléfono: </label>";
                        echo "<input id='telefono' name='telefono' type='text' placeholder='Escriba su teléfono' required>";
                        echo "</p>";
                        echo "<p>";
                        echo "<input type='submit' value='Añadir cliente' name='addCliente' />";
                        echo "</p>";
                        echo "</form>";
                    } else {
                        echo "<p>No hay clientes en la base de datos</p>";
                    }
                } else {
                    echo "<p>No existe la base de datos todavía</p>";
                }
            ?>
        </section>
        <section>
            <h4>Pizzas y sus ingredientes</h4>
            <?php
                 if($pizzeria->existeBaseDeDatos()) {
                    $pizzas = $pizzeria -> obtenerPizzas();
                    if ($pizzas-> num_rows > 0) {
                        echo "<ul>";
                        while ($row = $pizzas->fetch_assoc()) {
                            echo "<li>" . $row["Nombre_Pizza"] . " - " . $row["Precio"]."€";
                            echo "<ul>";
                            $ingredientes = $pizzeria -> obtenerIngredientesPizza($row["ID_Pizza"]);
                            foreach ($ingredientes as $ingrediente) {
                                echo "<li>Ingrediente: " . $ingrediente['Nombre_Ingrediente'] . " - Tipo: " . $ingrediente['Tipo'] . " - Cantidad: " . $ingrediente['Cantidad'] . "</li>";
                            }
                            echo "</ul>";
                            echo "</li>";
                        }
                        echo "</ul>";
                    } else {
                        echo "<p>No hay pizzas en la base de datos</p>";
                    }
                } else {
                    echo "<p>No existe la base de datos todavía</p>";
                }
            ?>
        </section>
        <section>
            <h4>Encargos por cliente</h4>
            <?php
                if($pizzeria->existeBaseDeDatos()) {
                    $clientes = $pizzeria -> obtenerClientes();
                    if ($clientes-> num_rows > 0) {
                        echo "<form action='#' method='post' name='clientes'>";
                        echo "<p>";
                        echo "<label for='nombreCliente'>Nombre del cliente: </label>";
                        echo "<input id='nombreCliente' name='nombreCliente' type='text' placeholder='Escriba su nombre' required>";
                        echo "</p>";
                        echo "<p>";
                        echo "<input type='submit' value='Buscar pedidos de cliente' name='buscarCliente' />";
                        echo "</p>";
                        echo "</form>";
                        if (isset($_POST["nombreCliente"])) {
                            $cliente = $pizzeria -> encontrarClientePorNombre($_POST["nombreCliente"]);
                            if (!empty($cliente)){
                                echo "<h5>Encargos del cliente " . $cliente["Nombre_Cliente"] ."</h5>";
                                $encargos = $pizzeria -> obtenerEncargosPorCliente($cliente["ID_Cliente"]);
                                if(!empty($encargos)) {
                                    echo "<ul>";
                                    foreach ($encargos as $encargo) {
                                        echo "<li>Encargo " . $encargo['ID_Encargo'] . " - Precio: " . $encargo['Total_Precio'] . " - Fecha: " . $encargo['Fecha_Encargo'] . "</li>";
                                    }
                                    echo "</ul>";
                                } else {
                                    echo "<p>No hay encargos para este cliente</p>";
                                }
                            } else {
                                echo "<p>No existe el cliente especificado</p>";
                            }
                            
                        }

                    } else {
                        echo "<p>No hay clientes en la base de datos</p>";
                    }
                } else {
                    echo "<p>No existe la base de datos todavía</p>";
                }
            ?>
        </section>
    </section>
</body>
</html>
class Crucigrama{
    constructor(board, dificultad) {
        this.board = board;
        this.columnas = 9;
        this.filas = 11;
        this.initTime = null;
        this.endTime = null;
        this.boardArray = [];
        this.dificultad = dificultad;
        this.tiempoTotal = ""

        for(let i = 0; i < this.filas; i++) {
            let fila = new Array(this.columnas);
            this.boardArray.push(fila);
        }
    }

    start() {
        const valores = this.board.split(',');

        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                if (valores[i * this.columnas + j].trim() === ".") {
                    this.boardArray[i][j] = 0;
                    continue;
                }
                if (valores[i * this.columnas + j].trim() === "#") {
                    this.boardArray[i][j] = -1;
                } 
                else {
                    try {
                        let numero = parseInt(valores[i * this.columnas + j]);
                        if (isNaN(numero)) {
                            throw new Error("La cadena no es un número válido");
                        } else {
                            this.boardArray[i][j] = numero;
                        }
                    } catch(error) {
                        this.boardArray[i][j] = valores[i * this.columnas + j];
                    }
                }
            }
        }
    }

    paintMathword() {
        for(let i = 0; i < this.filas; i++) {
            for(let j = 0; j < this.columnas; j++) {
                var parrafo = $("<p>")
                        .attr("data-state", "none")
                        .attr("data-row", i)
                        .attr("data-col", j);
                if (this.boardArray[i][j] === 0) {
                    parrafo.click(function () {
                        if($("p[data-state='clicked']").length == 0) {
                            $(this).attr("data-state", "clicked");
                        }
                    });
                } else {
                    if (this.boardArray[i][j] === -1) {
                        parrafo.attr("data-state", "empty");

                    } else {
                        parrafo.text(this.boardArray[i][j]);
                        parrafo.attr("data-state", "blocked");
                    }
                }
                $('main').append(parrafo)
            }
        }
        this.initTime = new Date()
    }

    check_win_condition() {
        for(let i = 0; i < this.filas; i++) {
            for(let j = 0; j < this.columnas; j++) {
                if (this.boardArray[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    calculate_date_difference() {
        if (this.initTime && this.endTime) {
            const diferencia = this.endTime - this.initTime;
            const segundosTotales = Math.floor(diferencia / 1000);
            const horas = Math.floor(segundosTotales / 3600);
            const minutos = Math.floor((segundosTotales % 3600) / 60);
            const segundos = segundosTotales % 60;

            return horas + ":" + minutos + ":" + segundos;
        }
    }

    introduceElement(valor) {
        const selectedParagraph = $("p[data-state='clicked']");

        if(selectedParagraph.length == 0) {
            alert("Seleccione una celda antes de introducir el valor");
            return;
        }

        let expression_row = true;
        let expression_col = true;
        
        const row = parseInt(selectedParagraph.attr("data-row"));
        const col = parseInt(selectedParagraph.attr("data-col"));

        this.boardArray[row][col] = valor;

        if (col + 1 < this.columnas) {
            if(this.boardArray[row][col + 1] !== -1) {
                let nextCol = col + 1;
                while (nextCol < this.columnas && this.boardArray[row][nextCol] !== "=") {
                    nextCol++;
                }

                if (nextCol < this.columnas) {
                    let primerOperando = this.boardArray[row][nextCol - 3];
                    let operador = this.boardArray[row][nextCol - 2];
                    let segundoOperando = this.boardArray[row][nextCol - 1];
                    let resultado = this.boardArray[row][nextCol + 1];

                    if (primerOperando !== 0 && operador !== 0 && segundoOperando !== 0 && resultado !== 0) {
                        let expresion = [primerOperando, operador, segundoOperando]
                        let expresionString = expresion.join(' ');
                        if (resultado != eval(expresionString)) {
                            expression_row = false;
                        }
                    }
                }
            }  
        } 

        if (row + 1 < this.filas) {
            if(this.boardArray[row + 1][col] !== -1) {
                let nextRow = row + 1;
                while (nextRow < this.filas && this.boardArray[nextRow][col] !== "=") {
                    nextRow++;
                }

                if (nextRow < this.filas) {
                    let primerOperando = this.boardArray[nextRow - 3][col];
                    let operador = this.boardArray[nextRow - 2][col];
                    let segundoOperando = this.boardArray[nextRow - 1][col];
                    let resultado = this.boardArray[nextRow + 1][col];

                    if (primerOperando !== 0 && operador !== 0 && segundoOperando !== 0 && resultado !== 0) {
                        let expresion = [primerOperando, operador, segundoOperando]
                        let expresionString = expresion.join(' ');
                        if (resultado != eval(expresionString)) {
                            expression_col = false;
                        }
                    }
                }
            }  
        } 

        if (expression_col && expression_row) {
            selectedParagraph.text(valor);
            selectedParagraph.attr("data-state", "correct");
        } else {
            this.boardArray[row][col] = 0;
            selectedParagraph.attr("data-state", "none");
            alert("El dato introducido no es correcto para la casilla seleccionada");
        }

        if(this.check_win_condition()) {
            this.endTime = new Date()
            this.tiempoTotal = this.calculate_date_difference()
            alert("Enhorabuena. Has tardado " + this.tiempoTotal + " en resolver el crucigrama");
            this.createRecordForm();
        }  
    }

    parseTime(cadenaTiempo) {
        let tiempoArray = cadenaTiempo.split(":");
        let tiempoTotal = parseInt(tiempoArray[0]) * 3600 + parseInt(tiempoArray[1]) * 60 + parseInt(tiempoArray[2]);
        return tiempoTotal;
    }

    createRecordForm() {
        var formulario = "<section>"
        +"<h3>Formulario de tiempos del crucigrama</h3>"
        +"<form action='#' method='post' name='record'>"
        +"<p>"
            +"<label for='nombre'>Nombre: </label>"
            +"<input id='nombre' type='text' name='nombre' value=''/>"
        +"</p>"
        +"<p>"
            +"<label for='apellidos'>Apellidos: </label>"
            +"<input id='apellidos' type='text' name='apellidos' value=''/>"
        +"</p>"
        +"<p>"
            +"<label for='dificultad'>Nombre: </label>"
            +"<input id='dificultad' type='text' name='dificultad' value='" + this.dificultad + "' readonly/>"
        +"</p>"
        +"<p>"
            +"<label for='tiempo'>Tiempo empleado: </label>"
            +"<input id='tiempo' type='number' name='tiempo' value='" + this.parseTime(this.tiempoTotal) + "' readonly/>"
        +"</p>"           
        +"<input type='submit'  value='Enviar datos'/>"
        +"</form>"
        +"</section>";
        
        $('main').after(formulario)
    }
}


var crucigrama = 
new Crucigrama("4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16", "fácil");
//new Crucigrama("12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32", "intermedio");
//new Crucigrama("4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72", "difícil");

crucigrama.start();
crucigrama.paintMathword();
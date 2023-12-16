class Sudoku {
    constructor(tablero) {
        this.tablero = tablero;
        this.filas = 9;
        this.columnas = 9;
        this.tableroBidimensional = [];
    }

    start(){
        let tableroUnidimensional = this.tablero.split("");

        for(let i = 0; i < this.filas; i++) {
            let fila = [];
            for(let j = 0; j < this.columnas; j++) {
                fila.push(tableroUnidimensional[i * this.columnas + j] === "."? 0 : parseInt(tableroUnidimensional[i * this.columnas + j])); 
            }
            this.tableroBidimensional.push(fila);
        }
    }

    createStructure() {
        let mainSection = document.querySelector("main");
        for(let i = 0; i < this.filas; i++) {
            for(let j = 0; j < this.columnas; j++) {
                let parrafo = document.createElement("p");

                parrafo.setAttribute("data-state", "none");
                parrafo.setAttribute("data-row", i.toString());
                parrafo.setAttribute("data-column", j.toString());

                if(this.tableroBidimensional[i][j] === 0) {
                    parrafo.addEventListener("click", () => {
                        if (document.querySelectorAll("p[data-state='clicked']").length == 0) {
                            parrafo.dataset.state = "clicked";
                        }
                    });
                } else {
                    parrafo.innerHTML = this.tableroBidimensional[i][j].toString();
                    parrafo.dataset.state = "blocked";
                }

                mainSection.append(parrafo)
                
            }
        }
    }

    paintSudoku() {
        this.createStructure()
    }

    introduceNumber(numero) {
        let selectedParagraph = document.querySelector("p[data-state='clicked']");

        let fila = parseInt(selectedParagraph.dataset.row);
        let columna = parseInt(selectedParagraph.dataset.column);

        if (this.checkRow(numero, fila) && this.checkColumn(numero, columna) && this.checkSection(numero, fila, columna)) {
            selectedParagraph.removeEventListener("click", () => {});
            selectedParagraph.dataset.state = "correct";
            
            this.tableroBidimensional[fila][columna] = numero;
            selectedParagraph.innerHTML= numero;

            if(this.sudokuCompleted()) {
                alert("Sudoku completado")
            }
        } else {
            alert("El número introducido no es válido")
        }

    }

    checkRow(numero, fila) {
        let numerosEnFila = this.tableroBidimensional[fila];

        for (let i = 0; i < this.columnas; i++) {
            if(numerosEnFila[i] == numero) {
                return false;
            }
        }
        return true;
    }

    checkColumn(numero, columna) {
        for (let i = 0; i < this.filas; i++) {
            if (this.tableroBidimensional[i][columna] == numero) {
                return false;
            }
        }
        return true;
    }

    checkSection(numero,fila,columna) {
        const inicioFila = Math.floor(fila / 3) * 3;
        const inicioColumna = Math.floor(columna / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.tableroBidimensional[inicioFila + i][inicioColumna + j] == numero) {
                    return false;
                }
            }
        }
        return true;
    }

    sudokuCompleted() {
        for(let i = 0; i< this.filas; i++) {
            for(let j = 0; j< this.columnas; j++) {
                if (this.tableroBidimensional[i][j] == 0) {
                    return false;
                }
            }
        }
        return true;
    }
}

//var sudoku = new Sudoku("86497213515.683942932154678745316829298745316316298457683421597521937264479561283");
var sudoku = new Sudoku("3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6");
sudoku.start();
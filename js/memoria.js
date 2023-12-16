class Memoria {
    constructor(hasFlippedCard, lockBoard, firstCard, secondCard) {
        this.elements =  [
                {
                    element: "HTML5",
                    source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
                },
                {
                    element: "HTML5",
                    source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
                },
                {
                    element: "CSS3",
                    source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
                },
                {
                    element: "CSS3",
                    source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
                },
                {
                    element: "JS",
                    source: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
                },
                {
                    element: "JS",
                    source: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
                },
                {
                    element: "PHP",
                    source: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
                },
                {
                    element: "PHP",
                    source: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
                },
                {
                    element: "SVG",
                    source: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
                },
                {
                    element: "SVG",
                    source: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg "
                },
                {
                    element: "W3C",
                    source: "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
                },
                {
                    element: "W3C",
                    source: "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
                },

        ]
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    unflipCards(){
        this.lockBoard = true;
        setTimeout(() => {
            const flippedCards = document.querySelectorAll('article[data-state="flip"]');

            flippedCards.forEach(card => {
                card.dataset.state = "hidden";
            });
            this.resetBoard();
        }, 1000);
    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    checkForMatch() {
        this.firstCard === this.secondCard ? this.disableCards() : this.unflipCards();
    }

    disableCards() {
        const matchedCards = document.querySelectorAll('article[data-element="' + this.firstCard +'"]');

        matchedCards.forEach(card => {
            card.dataset.state = "revealed";
        });
        this.resetBoard();
    }

    createElements() {
        var elements = ''
        for(let i = 0; i < this.elements.length; i++) {
            elements += this.createElement(this.elements[i].source, this.elements[i].element);
        }
        var section = document.querySelector('section');
        var actualText = section.innerHTML;
        actualText = actualText + elements;
        section.innerHTML = actualText;
    }

    createElement(logo, elementName) {
        var article = ''
        article += '<article data-element="' + elementName +'" data-state="hidden">\n';
        article += '<h3>Tarjeta de memoria</h3>\n';
        article += '<img src="' + logo + '" alt="' + elementName + '"/>\n';
        article += '</article>\n';
        return article;
    }

    addEventListeners() {
        const articles = document.querySelectorAll("article");
        
        articles.forEach(card => {
            card.addEventListener("click", this.flipCard.bind(card, this));
        });
    }


    flipCard(game) {
        if (this.dataset.state == "revealed") return;
        if (game.lockBoard) return;
        if (this.dataset.element == game.firstCard && this.dataset.state == "flip") return;

        this.dataset.state = "flip";

        if (game.hasFlippedCard) {
            game.secondCard = this.dataset.element;
            game.checkForMatch();
        } else {
            game.hasFlippedCard = true;
            game.firstCard = this.dataset.element;
        }
    }
}

var game = new Memoria();

game.shuffleElements();
game.createElements();
game.addEventListeners();
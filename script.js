/**
 * Redirecciona desde el index hasta la página del juego
 * @method cargarJuego
 * @param {String} nombreUsuario - Nombre ingresado por el usuario
 * äparam {String} tema - Tema de juego seleccionado por el usuario: Animales, Figuras, Frutas
 */
const cargarJuego = (nombreUsuario, tema, nivel) => {
    if(nombreUsuario==""){
        alert("Tienes que completar tu nombre de usuario para poder jugar!");
    }else{
        localStorage.setItem("nombreUsuario", nombreUsuario);
        localStorage.setItem("tema", tema);
        localStorage.setItem("nivel", nivel);
        window.open("game.html", "_self");
    }
}

/**
 * Realiza el dibujo en el Canvas
 * @method dibujarJuego
 */
const dibujarJuego = () => {
    //Obtener datos del localStorage
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const tema = localStorage.getItem("tema");
    const nivel = localStorage.getItem("nivel");

    //Dibujo de Canvas
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let nombreTours = document.getElementById("numTurno");
    document.getElementById("nivel").textContent = nivel;

    const cardWidth = 80;
    const cardHeight = 80;
    const cardSpacing = 20;
    let numRows = 4;
    let numCols = 6;
    let selectedCards = [];
    let matchedCards = [];
    let cards;
    let turns = 0;

    if (tema === "animales") {
        cards = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐯', '🦁', '🐮', '🐷'];
    } else if (tema === "figuras") {
        cards = ['🔵',' 🟦 ', '🟨', '🟡', '🟥', '🔴', '🟤', '🟫️', '🟧', '🟠', '🟩 ', '🟢'];
    } else {
        cards = ['🍎', '🍓', '🍌', '🍊', '🍇', '🍏', '🍉', '🍐', '🍑', '🍒', '🍍', '🥝'];
    }

    //slice(): Crea una copia del array seleccionando los elementos que especificas, sin modificar el array original.
    if(nivel==="medio"){
        cards = cards.slice(0, 10);
        numCols = numCols-1;
    }else if(nivel==="facil"){
        cards = cards.slice(0, 8);
        numCols = numCols-2;
    }
    // Necesitamos duplicar las cartas para hacer pares
    let shuffledCards = shuffle(cards.concat(cards));

    //cronómetro
    let timerId; // Identificador del cronómetro
    let startTime; // Hora de inicio del cronómetro
    let elapsedTime = 0; // Tiempo transcurrido desde el inicio del cronómetro

    /**
     * Mezcla las cartas al asar
     * @method  function shuffle
     * @param {array} array - cuadro que se mezclará
     * @return Se devuelve el cuadro mixto
     */
    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    /**
     * Dibujar un mapa en el canvas
     * @method drawCard
     * @param {number} x - coordenada del lugar donde se dibujará el mapa
     * @param {number} y - coordenadas del lugar donde se dibujará el mapa
     * @param {string} value - representa el valor de la carta
     * @param {boolean} visible - determina si la carta debe ser visible o no
     */
    function drawCard(x, y, value, visible) {
        const margen = 10;
        ctx.fillStyle = visible ? '#fff' : '#000';
        ctx.fillRect(x, y, cardWidth, cardHeight);
        if (visible) {
            ctx.fillStyle = '#000';
            ctx.font = '40px Arial';
            ctx.fillText(value, x + cardWidth / 2 - margen, y + cardHeight / 2 + margen);
        }
    }

    /**
     * Dibuja el tablero de juego
     * @method drawBoard
     */
    function drawBoard() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                let index = row * numCols + col;
                let x = col * (cardWidth + cardSpacing) + cardSpacing;
                let y = row * (cardHeight + cardSpacing) + cardSpacing;

                let card = shuffledCards[index];
                let visible = selectedCards.includes(index) || matchedCards.includes(index);
                drawCard(x, y, card, visible);
            }
        }
    }

    /**
     * gestiona los clics  en el canva
     * @method handleClick
     * @param {MouseEvent} event - el objeto de evento generado cuando se hace clic
     */
    function handleClick(event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        let col = Math.floor(x / (cardWidth + cardSpacing));
        let row = Math.floor(y / (cardHeight + cardSpacing));

        let index = row * numCols + col;

        if (selectedCards.length < 2 && !selectedCards.includes(index) && !matchedCards.includes(index)) {
            selectedCards.push(index);
            const audioCard = new Audio("sounds/click1.wav");
            audioCard.play();
            drawBoard();

            if (selectedCards.length === 2) {
                turns++;
                nombreTours.textContent = turns.toString();

                let card1 = shuffledCards[selectedCards[0]];
                let card2 = shuffledCards[selectedCards[1]];

                if (card1 === card2) {
                    matchedCards.push(selectedCards[0]);
                    matchedCards.push(selectedCards[1]);
                }

                selectedCards = [];

                setTimeout(function () {
                    drawBoard();

                    if (matchedCards.length === shuffledCards.length) {
                        const audioWin = new Audio("sounds/Randomize15.ogg");
                        audioWin.play();
                        clearInterval(timerId);
                        alert(`Felicidades ${nombreUsuario}! \n Has completado el juego en ${turns.toString()} turnos.`);
                    }
                }, 1000);
            }
        }
    }

// Añade un controlador de eventos para hacer clic en el canva
    canvas.addEventListener('click', handleClick);

// Dibuja el tablero de juego inicial
    drawBoard();

    /**
     * Dactualiza la visualización del cronómetro en tiempo real en la página web
     * @method updateTimer
     * @return no devuelve nada pero actualiza la pantalla del cronómetro
     */
    function updateTimer() {
        let timer = document.getElementById("timer");
        let currentTime = new Date().getTime();
        let deltaTime = currentTime - startTime + elapsedTime;

        let hours = Math.floor(deltaTime / (1000 * 60 * 60));
        let minutes = Math.floor((deltaTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((deltaTime % (1000 * 60)) / 1000);

        timer.textContent = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
    }

    /**
     * formatear los dígitos del cronómetro con un cero a la izquierda si es necesario
     * @method formatTime
     * @param {number} time - Explicación de que valor almacena ParámetroA
     * @return string
     */
    function formatTime(time) {
        return time < 10 ? "0" + time : time;
    }

    /**
     * activación automática del cronómetro
     * @method startAutomaticTimer
     */
    function startAutomaticTimer() {
        startTime = new Date().getTime();
        timerId = setInterval(updateTimer, 1000);
    }

// Activación de la función de cronómetro automático
    startAutomaticTimer();
}
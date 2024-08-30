const canvas= document.getElementById('snakeCanvas')
canvas.width = 400;
canvas.height = 200;
const ctx = canvas.getContext('2d')


//position : début partie
let snake = [
    {x:50, y:100}
]

//mouvement horizontal par défaut
let dx = 10
//aucun déplacement vertical par défaut
let dy = 0

//position du fruit
let fruitX
let fruitY

//score de départ
let score=0
let isScoreSaved = false;

//vitesse de départ
let speed=200

function moveSnake() {
    let head = {x: snake[0].x + dx, y:snake[0].y + dy}

    if (head.x >= canvas.width){
        head.x =0
    }else if (head.x <0){
        head.x=canvas.width -10
    }

    if (head.y >= canvas.height){
        head.y =0
    }else if (head.y <0){
        head.y=canvas.height -10
    }

    //avance d'un pas + place la tête
    snake.unshift(head)
    //supprime dernier élément déplacé
    snake.pop()
}

function showSnake() {
    ctx.fillStyle = 'purple'
    snake.forEach(segment =>{
        ctx.fillRect(segment.x, segment.y, 10, 10);
    })
}

document.addEventListener('keydown', turn)

function turn(event){
    const keyPressed = event.key
    if (keyPressed === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -10;
    } else if (keyPressed === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 10;
    } else if (keyPressed === 'ArrowLeft' && dx === 0) {
        dx = -10;
        dy = 0;
    } else if (keyPressed === 'ArrowRight' && dx === 0) {
        dx = 10;
        dy = 0;
    }

}

document.getElementById('arrowUp').addEventListener('click', function(){
    if (dy === 0){
        dx = 0;
        dy = -10;
    }
})

document.getElementById('arrowDown').addEventListener('click', function(){
    if (dy === 0){
        dx = 0;
        dy = 10;
    }
})

document.getElementById('arrowLeft').addEventListener('click', function(){
    if (dx === 0){
        dx = -10;
        dy = 0;
    }
})

document.getElementById('arrowRight').addEventListener('click', function(){
    if (dx === 0){
        dx = 10;
        dy = 0;
    }
})

function placeFruit(){
    fruitX = Math.floor(Math.random() * canvas.width/10)*10
    fruitY = Math.floor(Math.random() * canvas.height/10)*10
}
function showFruit(){
    ctx.fillStyle = 'pink'
    ctx.fillRect(fruitX, fruitY, 10, 10)
}

function checkEatFruit(){
    if (snake[0].x === fruitX && snake[0].y === fruitY){
        //ajout fruit au corps
        snake.push({})
        // ajout 10 points
        score+=10
        //nouveau fruit à manger
        placeFruit()

        //augmente la vitesse
        if (speed>50){
            speed-=10
        }
    }
}

function showScore(){
    ctx.fillStyle = "black"
    ctx.font = '20px'
    ctx.fillText('Score :' + score, canvas.width -120, 30)
}

function checkCollision(){
    for (let i=1; i<snake.length;i++){
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y){
            return true
        }
    }
    return false
}

function initializeTop20() {
    const top20 = [
        { pseudo: 'LAmourDuRisque', score: 450 },
        { pseudo: 'Jonathan&Jennifer', score: 320 },
        { pseudo: 'JpePasJsuisAuChomage', score: 300 },
        { pseudo: 'Razmocket', score: 260 },
        { pseudo: 'BondJamesBond', score: 250 },
        { pseudo: 'BornToBeAlive', score: 220 },
        { pseudo: 'MoiJeNétaisRien', score: 210 },
        { pseudo: 'EtVoilàQuAujourdhui', score: 190 },
        { pseudo: 'TumeVoisTumeVoisPlus', score: 180 },
        { pseudo: 'QuiMaimeMeSuive', score: 170 },
        { pseudo: 'LouBegaMamboN5', score: 160 },
        { pseudo: 'AlexandrieAlexandra', score: 140 },
        { pseudo: 'CaVamaChicorée', score: 120 },
        { pseudo: 'JaimePasTropBcpCa', score: 110 },
        { pseudo: 'OnLaissePasBBds1Coin', score: 100 },
        { pseudo: 'Sidewinder', score: 60 },
        { pseudo: 'JcroisJvConclure', score: 50 },
        { pseudo: 'OubliqtaAucuneChance', score: 30 },
        { pseudo: 'VayFonce', score: 20 },
        { pseudo: 'TucheAvecunT', score: 10 },
    ];

    if (!localStorage.getItem('top20')) {
        localStorage.setItem('top20', JSON.stringify(top20));
    }
}

function toggleDisplay(showCanvas) {
    const canvas = document.getElementById('snakeCanvas');
    const scoreDiv = document.getElementById('score');

    if (showCanvas) {
        canvas.style.display = 'block';
        scoreDiv.style.display = 'none';
    } else {
        canvas.style.display = 'none';
        scoreDiv.style.display = 'block';
    }
}

function displayGameOver(score) {
    toggleDisplay(false); 

    const top20 = JSON.parse(localStorage.getItem('top20'));
    let scoreContent = '<button id="restartGameBtn">Rejouer</button>';

    scoreContent += `<p>Ton Score: ${score}</p>`;

    // Check si score peut intégrer le Top 20
    const lowestScore = top20[top20.length - 1].score;
    if (score > lowestScore && !isScoreSaved) {
        scoreContent += `
        <form id="highScoreForm">
            <div id="newHighScore">
                <label for="playerName">Bienvenue dans le top 20!! Ton pseudo :</label>
                <input type="text" id="playerName" pattern=".{6,20}" required>
                <button id="saveScoreBtn">M'intégrer parmi l'élite</button>
            </div>
        </form>`;
    }

    // Afficher le Top 20
    scoreContent += '<ul class="top20-list">';
    top20.forEach((entry, index) => {
        scoreContent += `<li>${index + 1}. ${entry.pseudo}: ${entry.score}</li>`;
    });
    scoreContent += '</ul>';

    document.getElementById('score').innerHTML = scoreContent;

    const saveScoreBtn = document.getElementById('saveScoreBtn');
    const playerName = document.getElementById('playerName');
    if (saveScoreBtn && score > lowestScore && !isScoreSaved) {
        saveScoreBtn.onclick = function (event) {
            // Empêcher la validation HTML5 par défaut
        event.preventDefault();
            const playerName = document.getElementById('playerName').value.trim();
            if (playerName.length < 6 || playerName.length > 20) {
                alert("Le pseudo doit contenir entre 6 et 20 caractères.");
                return;
            }
            
            
            if (playerName) {
                // Ajouter le nouveau score dans le Top 20+màj top 20 ds local storage
                top20.push({ pseudo: playerName, score: score });
                top20.sort((a, b) => b.score - a.score); 
                top20.pop(); 
                localStorage.setItem('top20', JSON.stringify(top20)); 

                isScoreSaved = true;

                displayGameOver(score);
            }
        };
    }

    const restartGameBtn = document.getElementById('restartGameBtn');
    if (restartGameBtn) {
        restartGameBtn.onclick = function () {
            document.location.reload();
        };
    }
}


function endGame(score) {
    displayGameOver(score);
}

function automaticMoveSnake() {
    moveSnake()
    if (checkCollision()){
        endGame(score)
        return
    }
    checkEatFruit()
    ctx.clearRect(0,0, canvas.width, canvas.height)
    showSnake()
    showFruit()
    showScore()
    setTimeout(automaticMoveSnake, speed)
}

initializeTop20();
//1er fruit
placeFruit()
//1er déplacement auto : début partie
automaticMoveSnake()

const arrowLeft = document.getElementById('arrow-left')
const arrowRight = document.getElementById('arrow-right')
arrowLeft.onclick = function () {
    document.body.classList.add('move-left');
    alert("Pas d'autre jeu disponible pour le moment.")
    setTimeout(() => {
        document.body.classList.remove('move-left')
    }, 1000);
}
arrowRight.onclick = function () {
    document.body.classList.add('move-right');
    alert("Pas d'autre jeu disponible pour le moment.");
    setTimeout(() => {
        document.body.classList.remove('move-right')
    }, 1000);
}
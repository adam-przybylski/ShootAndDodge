// SCREN SIZE
const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;

alert("Sterowanie: \n WASD - ruch postacią \n Enter - strzelanie \n Q - pauza")

// MOVEMENT SPEED CONSTANT
const MOVE_SPEED = 5;

// HANDLERS
let svg = document.querySelector('svg');
let obs = document.getElementById('obstacles');
let character = document.getElementById('character');

// START GAMES
let startTime;
svg.onload = function(){
    startTime = new Date();
    window.requestAnimationFrame(gameLoop);
    character.setAttribute('y', WINDOW_HEIGHT/2)
}

// KEY INPUT OBJECT
let keyPresses = {};


// KEY LISTENERS
window.addEventListener("keydown",keyDownListener, false);
window.addEventListener("keydown",pauseButtonListener, false);
window.addEventListener("keyup",keyUpListener, false);

function keyDownListener(event){
    keyPresses[event.key] = true;
}

function keyUpListener(event){
    keyPresses[event.key] = false;
}

// PAUSE BUTTON HANDLER
let pauseFlag = false;
function pauseButtonListener(event){
    if(event.key == 'q'){
        if(!pauseFlag){
            pauseFlag = true;
        } else {
            pauseFlag = false;
        }
    }  
}

// FUNCTION THAT CONTROLS IF PLAYER WENT OUT OF SCREEN
function moveRestriction(){
    if(character.getAttribute('x') >= WINDOW_WIDTH-parseInt(character.getAttribute('width'))){
        character.setAttribute('x',(WINDOW_WIDTH-parseInt(character.getAttribute('width'))).toString());
    }
    if(character.getAttribute('x') <=0){
        character.setAttribute('x','0');
    }
    if(character.getAttribute('y') >= WINDOW_HEIGHT-parseInt(character.getAttribute('height'))){
        character.setAttribute('y', (WINDOW_HEIGHT-parseInt(character.getAttribute('height'))).toString());
    }
    if(character.getAttribute('y') <= 41){
        character.setAttribute('y','41');
    }
}

// SHOOTING HANDLER
let bulletArray = [];
function shoot(){
    if(frame>50){
        if(keyPresses.Enter){
            let item = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            item.r.baseVal.value = 10;
            let x = parseInt(character.getAttribute('x')) + 200;
            let y = parseInt(character.getAttribute('y')) + 25;
            item.cx.baseVal.value = x.toString();
            item.cy.baseVal.value = y.toString();
            item.style.fill = "red";
            item.style.stroke = "black";
            svg.appendChild(item);
            bulletArray.push(item);
            frame = 0;
        }
    }
}

// FUNCTION THAT DELETES BULLETS IF THEY GO OUT OF SCREEN
function controllBullets(){
    let i = 0;
    bulletArray.forEach(bullet =>{
        bullet.cx.baseVal.value += 20;
        if(bullet.cx.baseVal.value > WINDOW_WIDTH+100){
            svg.removeChild(bullet);
            bulletArray.splice(i,1);
        }
        i++;
    });
}

// OBSTACLES/"ENEMY" HANDLER
let enemyArray = [];
function spawnObstacles(){
    if(enemyFrame>40){
        let enemy = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        enemy.width.baseVal.value = 50;
        enemy.height.baseVal.value = 50;
        enemy.x.baseVal.value = Math.floor(Math.random()*WINDOW_WIDTH) + WINDOW_WIDTH;
        enemy.y.baseVal.value = Math.floor(Math.random()*(WINDOW_HEIGHT-50)+40);
        enemy.style.fill = "green";
        enemy.style.stroke = "black";
        obs.appendChild(enemy);
        enemyArray.push(enemy);
        enemyFrame = 0;
    }
}

// FUNCTION THAT DELETES ENEMISES IF THEY ARE OUT OF SCREEN
function controlEnemies(){
    let i = 0;
    enemyArray.forEach(enemy =>{
        enemy.x.baseVal.value -= 8;
        if(enemy.x.baseVal.value <= -50){
            obs.removeChild(enemy);
            enemyArray.splice(i,1);
        }
        i++;
    });
}

// CONTROLS OBSTACLES AND BULLETS COLLISIONS
let points = 0;
function controlCollision(){
    for(let i = 0; i < bulletArray.length; i++){
        let bullet = bulletArray[i];
        for(let j = 0; j < enemyArray.length; j++){
            let enemy = enemyArray[j];
            if(bullet.cx.baseVal.value > enemy.x.baseVal.value
                && bullet.cx.baseVal.value < enemy.x.baseVal.value + enemy.width.baseVal.value
                && bullet.cy.baseVal.value  > enemy.y.baseVal.value - bullet.r.baseVal.value/2
                && bullet.cy.baseVal.value < enemy.y.baseVal.value + enemy.height.baseVal.value + bullet.r.baseVal.value/2){
                    svg.removeChild(bullet);
                    bulletArray.splice(i,1);
                    obs.removeChild(enemy);
                    enemyArray.splice(j,1);
                    points += 5;
            }
        }
    }
}

let gameOverFlag = false;
function controlPlayerCollision(){
    enemyArray.forEach(enemy =>{
        if(parseFloat(enemy.x.baseVal.value) < (parseFloat(character.getAttribute('x')) + parseFloat(character.getAttribute('width')))
            && parseFloat(enemy.x.baseVal.value) > (parseFloat(character.getAttribute('x')) - parseFloat(enemy.width.baseVal.value))
            && parseFloat(enemy.y.baseVal.value) > (parseFloat(character.getAttribute('y')) - parseFloat(character.getAttribute('height')))
            && parseFloat(enemy.y.baseVal.value) < (parseFloat(character.getAttribute('y')) + parseFloat(character.getAttribute('height')))){
                gameOverFlag = true;
        }
    });
}

// PLAYER MOVEMENT HANDLER
function move(){
    if(keyPresses.w){
        let y = character.getAttribute('y');
        y = parseInt(y);
        y = y - MOVE_SPEED;
        character.setAttribute('y', y.toString());
    }
    if(keyPresses.s){
        let y = character.getAttribute('y');
        y = parseInt(y);
        y = y + MOVE_SPEED;
        character.setAttribute('y', y.toString());
    }
    if(keyPresses.a){
        let x = character.getAttribute('x');
        x = parseInt(x);
        x = x - MOVE_SPEED;
        character.setAttribute('x', x.toString());
    }
    if(keyPresses.d){
        let x = character.getAttribute('x');
        x = parseInt(x);
        x = x + MOVE_SPEED;
        character.setAttribute('x', x.toString());
    }
}

let timeDiff;
function score(){
    let endTime = new Date();
    timeDiff = endTime - startTime - pauseTime;
    timeDiff = Math.floor(timeDiff / 1000);
    document.getElementById("time").firstChild.data = "Czas: " + timeDiff.toString();
    document.getElementById("score").firstChild.data = "Wynik: " + (timeDiff + points).toString();
}

// SOME IMPORTANT VARIABLES
let frameCounter = 0;
let frame = 100;
let enemyFrame = 100;
let pauseText = document.getElementById("textPause");

// GAME LOOP
let startPause
function gameLoop(){
    move();
    moveRestriction();
    shoot();
    controllBullets();
    spawnObstacles();
    controlEnemies();
    controlCollision();
    score();
    controlPlayerCollision();
    if(pauseFlag){
        startPause = new Date();
        svg.setAttribute('visibility','hidden')
        pauseText.style.visibility = "visible";
        pauseText.setAttribute('x',(WINDOW_WIDTH/2).toString());
        pauseText.setAttribute('y',(WINDOW_HEIGHT/2).toString());
        window.requestAnimationFrame(pauseLoop);
        return;
    }
    if(gameOverFlag){
        alert("Koniec gry \n" + "Przetrwany czas: " + timeDiff.toString() + "\nWynik: " + (timeDiff+points).toString() + "\nWciśnij F5, aby zagrac ponownie");
        return;
    }
    frame++;
    enemyFrame++;
    frameCounter = window.requestAnimationFrame(gameLoop);
}



// PAUSE LOOP
let pauseTime = 0;
function pauseLoop(){
    if(!pauseFlag){
        let endPause = new Date();
        pauseTime = pauseTime + (endPause - startPause);
        pauseText.style.visibility = "hidden";
        svg.setAttribute('visibility','visible')
        window.requestAnimationFrame(gameLoop);
        return;
    }
    window.requestAnimationFrame(pauseLoop);
}



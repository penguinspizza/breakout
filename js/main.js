var canvas = document.getElementById("myCanvas"); //htmlをjsで扱う
var ctx = canvas.getContext("2d"); //2dとして土地を扱う

//ボールの座標
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 1;
var dy = -1;
var ballRadius = 10;
var color = getRandomColor();
var paddleHeight = 10;
var paddleWidth = 480;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = (canvas.height - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
//ブロックの定数
var brickRowCount = 6;
var brickColumnCount = 6;
var brickWidth = 20;
var brickHeight = 20;
var brickPadding = 32;
var brickOffsetTop = 100;
var brickOffsetLeft = 100;
// スコア
var score = 1;
var brickCount = brickRowCount * brickColumnCount;
// ライフ
var lives = 100;
var ConstLives = lives;
// music
class playSound {
    constructor(audioData) {
        this.audioData = new Audio(audioData);
    }

    play() {
        this.audioData.pause();
        this.audioData.currentTime = 0;
        this.audioData.play();
    }
}
var bomb = new playSound("../sound/爆発2.mp3");
var lunch = new playSound("../sound/ビーム砲1.mp3");
var ou = new playSound("../sound/男衆「オウ！」.mp3");
var end = new playSound("../sound/運命2.mp3");
var dondon = new playSound("../sound/ドンドンパフパフ.mp3");

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getRandom256() {
    return ('00' + getRandomInt(0, 256).toString(16)).slice(-2);
}

function getRandomColor() {
    return "#" + getRandom256() + getRandom256() + getRandom256();
}

// たまをうごかす
function drawBall(color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fill();
    ctx.closePath();
}

function drawPaddleBottom(color) {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddleTop(color) {
    ctx.beginPath();
    ctx.rect(paddleX, paddleHeight - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddleRight(color) {
    ctx.beginPath();
    ctx.rect(0, paddleY, paddleHeight, paddleWidth);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddleLeft(color) {
    ctx.beginPath();
    ctx.rect(canvas.width - paddleHeight, paddleY, paddleHeight, paddleWidth);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}


var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = getRandomColor();
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
// 衝突判定
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x - ballRadius && x < b.x + brickWidth + ballRadius && y > b.y - ballRadius && y < b.y + brickHeight + ballRadius) {
                    dy = -dy;
                    b.status = 0;
                    var paddleMinus = paddleWidth * 0.05;
                    paddleWidth -= paddleMinus;
                    paddleX += paddleMinus / 2;
                    paddleY += paddleMinus / 2;
                    score *= 2;
                    brickCount--;
                    bomb.play();
                    if (brickCount == 0) {
                        dondon.play();
                        setTimeout(clearAlert, 2000);
                    }
                }
            }
        }
    }
}

function clearAlert() {
    alert("YOU WIN, CONGRATULATIONS!");
    document.location.reload();
    clearInterval(interval);
}

//スコア表示用の関数
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = getRandomColor();
    ctx.fillText("Score: " + score, 8, 20);
}

// ライフ関数
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = getRandomColor();
    ctx.fillText("Lives: " + lives, canvas.width - 80, 20);
}


function gameOverMessage() {
    alert("GAME OVER");
    document.location.reload();
}

function gameOver() {
    lives--;
    if (!lives) { // ゼロのとき
        end.play();
        setTimeout(gameOverMessage, 5000);
    }
    else { // まだある時
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = ConstLives - lives;
        dy = ConstLives - lives;
        paddleX = (canvas.width - paddleWidth) / 2;
        paddleY = (canvas.height - paddleWidth) / 2;
        ou.play();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(color);
    drawPaddleBottom(color);
    drawPaddleTop(color);
    drawPaddleRight(color);
    drawPaddleLeft(color);
    drawScore();
    drawLives();
    collisionDetection();
    drawBricks();
    if (x + dx + ballRadius > canvas.width - ballRadius) { // もしx軸上の範囲外に行ったら
        if (y > paddleY && y < paddleY + paddleWidth) {
            dx = -dx;
            color = getRandomColor();
            lunch.play();
        }
        else {
            gameOver();
        }
    }
    if (y + dy - ballRadius < 0 + ballRadius) { // もしy軸上の範囲外に行ったら
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            color = getRandomColor();
            lunch.play();
        }
        else {
            gameOver();
        }

    }
    if (x + dx - ballRadius < 0 + ballRadius) { // もしx軸上の範囲外に行ったら
        if (y > paddleY && y < paddleY + paddleWidth) {
            dx = -dx;
            color = getRandomColor();
            lunch.play();
        }
        else {
            gameOver();
        }
    }
    if (y + dy + ballRadius >= canvas.height - ballRadius) { // もしy軸上の範囲外に行ったら
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            color = getRandomColor();
            lunch.play();
        }
        else {
            gameOver();
        }
    }
    x += dx;
    y += dy;
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    if (downPressed && paddleY < canvas.height - paddleWidth) {
        paddleY += 7;
    }
    else if (upPressed && paddleY > 0) {
        paddleY -= 7;
    }

    requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    console.log(e.key);
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
    else if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
    else if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    var relativeY = e.clientY - canvas.offsetTop;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
    if (relativeY > 0 && relativeY < canvas.height) {
        paddleY = relativeY - paddleWidth / 2;
    }
}

// var interval = setInterval(draw, 10);
draw();

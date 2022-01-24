let canvas = document.querySelector("#canvas")
let ctx = canvas.getContext('2d')
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 50;

class Snake {
    constructor(x, y, size){
        this.x = x
        this.y = y
        this.size = size
        this.tail = [{x: this.x, y:this.y}]
        this.moveX = 0
        this.moveY = 1
    }
    draw(color){
        for(let i = 0; i < this.tail.length; i++){
            ctx.fillStyle = color
            ctx.fillRect(this.tail[i].x, this.tail[i].y, this.size, this.size)
        }
    }
    update(){
        let move
        if(this.moveY == 1){
            move = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        } else if (this.moveY == -1){
            move = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        } else if (this.moveX == 1){
            move = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y 
            }
        } else if (this.moveX == -1){
            move = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        }
        this.tail.shift()
        this.tail.push(move)
    }
}

class Food {
    constructor(x, y, color){
        this.x = x
        this.y = y
        this.size = snake.size
        this.color = color
    }

    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.size, this.size)
    }

    check(){
        for(let i = 0; i < snake.tail.length; i++){
            if(this.x == snake.tail[i].x && this.y == snake.tail[i].y){
                snake.tail.unshift({x: this.x + 0.1, y: this.y + 0.1})
                generateApple()
                snake.draw("green")
            }
        }
    }
}

let snake = new Snake(20, 20, 20)
let food = new Food()
let highscore = [0]

function checkIfDead(){
    for(let i = 1; i < snake.tail.length; i++){
        if(snake.tail[0].x == snake.tail[i].x && snake.tail[0].y == snake.tail[i].y){
            if(highscore[0] < snake.tail.length){
                highscore.shift()
                highscore.push(snake.tail.length-1)
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            snake.tail.splice(0, snake.tail.length - 1)
        }
    } 
}

function checkOffsetErrAndIfWhenHitWall() {
    let head = snake.tail[snake.tail.length - 1]

    if(head.x < 0){
        head.x = canvas.width - snake.size
    } else if(head.x > canvas.width){
        head.x = 0
    } else if(head.y < 0){
        head.y = canvas.height - snake.size
    } else if(head.y > canvas.height){
        head.y = 0
    }
    
    if(head.x % 10 != 0){
        head.x += 1
    } else if(head.y %  10!= 0){
        head.y -= 3
    }
}

function score() {
    ctx.font = "40px Arial"
    ctx.fillStyle = "white"
    ctx.fillText("Score:" + (snake.tail.length - 1), 1000, 60)
}

function highScore() {
    ctx.font = "40px Arial"
    ctx.fillStyle = "white"
    ctx.fillText("Highscore:" + highscore, 700, 60)
}

function mainLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    snake.update()
    snake.draw("white")
    checkIfDead() 
    checkOffsetErrAndIfWhenHitWall()
    food.check()
    food.draw() 
    score()
    highScore()
}

function generateApple() {
    let x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
    let y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size
    let colors = ["green", "red", "white", "yellow", "purple", "blue", "brown", "orange", "pink", "lightblue"]
    food.x = x
    food.y = y
    food.color = colors[Math.floor(Math.random() * (10 + 1))]
    food.draw()
}

/* CONTROLS */
window.addEventListener('keydown', (e) => {
    if(e.key == "ArrowLeft" && snake.moveX != 1){
        snake.moveX = -1
        snake.moveY = 0
    } else if(e.key == "ArrowRight" && snake.moveX != -1){
        snake.moveX = 1
        snake.moveY = 0
    } else if(e.key == "ArrowUp" && snake.moveY != 1){
        snake.moveX = 0
        snake.moveY = -1
    } else if(e.key == "ArrowDown" && snake.moveY != -1){
        snake.moveX = 0
        snake.moveY = 1
    }
})

//Start up
generateApple()
setInterval(mainLoop, 1000/15)

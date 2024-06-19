// define color constants of the game
const colors = {
    light: "#e6e6e6",
    lightBall: "#e15f5f",
    dark: "#424244",
    darkBall: "#5fa4e1"
};
// get the canvas element and its 2D drawing context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define contants for the grid size and speed limits
const GRID_SIZE =25;
const SPEED_LIMIT =10;
const MIN_SPEED =5;

// Calculate the number of columns and rows based on canvas size
 const columns = canvas.width / GRID_SIZE;
 const rows = canvas.height / GRID_SIZE;

 //create a gird and intialise colors for each cell
 const grid =[];
 for (let x = 0; x < columns; x++){
    grid[x]=[];
    for(let y=0; y<rows; y++){
        // set the left half of the grid to light and right half to dark
        grid[x][y]=x < columns /2 ? colors.light :colors.dark;
    }
 }
 //intilalize ball objects woth starting positions, velocities and colors
 const balls =[
    {
        x:canvas.width /4,
        y: canvas.height /2,
        dx:7, 
        dy:-7,
        primaryColor: colors.lightBall,
        secondaryColor: colors.dark
    },
    {
        x:(canvas.width*3)/4,
        y:canvas.height/2,
        dx: -7,
        dy: 7,
        primaryColor: colors.darkBall,
        secondaryColor: colors.light
    }
 ];
//  Function to draw a ball onthe canvas
function drawBall(ball){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, GRID_SIZE / 2, 0, Math.PI  * 2);
    ctx.fillStyle = ball.primaryColor;
    ctx.fill();
    ctx.closePath();
}
// Function to draw the grid onthe canvas
function drawGrid(){
    for(let x=0; x<columns; x++){
        for (let y=0; y<rows; y++){
            ctx.fillStyle = grid[x][y];
            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE,GRID_SIZE);
        }

    }
}
//Function to detect collison of the ball with the grid cells
function detectCollision(ball){
    for (let angle=0; angle <Math.PI * 2; angle += Math.PI /4){
        const collisionX = ball.x + Math.cos(angle)*(GRID_SIZE / 2);
        const collisionY = ball.y + Math.sin(angle)*(GRID_SIZE / 2);
        const gridX= Math.floor(collisionX / GRID_SIZE);
        const gridY =Math.floor (collisionY / GRID_SIZE);
        if(gridX >=0 && gridX < columns && gridY >= 0 && gridY < rows){
            if (grid[gridX][gridY]!== ball.secondaryColor){
                grid[gridX][gridY] = ball.secondaryColor;
                if(Math.abs(Math.cos(angle))>Math.abs(Math.sin(angle))){
                    ball.dx=-ball.dx; 
                } else{
                    ball.dy = -ball.dx;
                }
            }
        }
    }
}
// function to check wall collision 
function checkWallCollision(ball){
    // reverse direction if the ball hits the left or the right wall
    if(ball.x +ball.dx>canvas.width -GRID_SIZE / 2||ball.x +ball.dx<GRID_SIZE/2){
        ball.dx=-ball.dx;
    }
    //reverse direction if the ball hits the top or bottom wall
    if (ball.y+ ball.dy>canvas.height-GRID_SIZE / 2||ball.y+ball.dy<GRID_SIZE /2){
        ball.dy=-ball.dy;
    }
}
// update the speed of the ball randomly within the speed limits
function updateBallSpeed(ball){
    //slightly after ball speed randomly
    ball.dx +=(Math.random() - 0.5)*0.1;
    ball.dy +=(Math.random() - 0.5)*0.1;

    // ensure ball speed stays within the defined limits
    ball.dx =Math.min(Math.max(ball.dx, -SPEED_LIMIT), SPEED_LIMIT);
    ball.dy =Math.min(Math.max(ball.dy, -SPEED_LIMIT), SPEED_LIMIT);

// ensure ball speed doesnt drop the min speed
if (Math.abs(ball.dx)< MIN_SPEED)ball.dx=ball.dx>0?MIN_SPEED: -MIN_SPEED;
if (Math.abs(ball.dy)< MIN_SPEED)ball.dy=ball.dy>0?MIN_SPEED: -MIN_SPEED;
}
// main game loop to update the game state and render the frame
function gameLoop(){
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw the grid
    drawGrid();

    balls.forEach(ball =>{
        drawBall(ball);
        detectCollision(ball);
        checkWallCollision(ball);
        // update ball position
        ball.x += ball.dx;
        ball.y+=ball.dy;
        //update ball speed
        updateBallSpeed(ball);
    });
//request the next animation frame
requestAnimationFrame(gameLoop);
}
//start game
requestAnimationFrame(gameLoop);
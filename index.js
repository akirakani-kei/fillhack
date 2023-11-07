//button handlers
//37 left
//38 up
//39 right
//40 down

var canvas = document.getElementById("matrixCanvas");
var ctx = canvas.getContext("2d");

/// 15x15, 0-14 on either axis
let [x, y] = [7, 7];
let startTime = 0;
let lastAlgorRun = 0;
let minimumTimeBeforeAlgorRun = 1500;
let lastGridRandomise = 0;
let lastDash = 0;
let lastDashPosAlpha = [0, 0, 0]; //x, y, alpha
let lastShadowDecrease = 0;

let lastYellowChanceChange = 0;
let oneInXChanceForYellow = 9; // actually 1 in 10 because account for 0

let shiftHeld = false;


// 0 = ok
// 1 = yellow
// 2 = orange
// 3 = red
// 4 = gone
let grid = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

let r = 0;
let c = 0;

function randomiseGrid(log=true) {
    r = 0;
    grid.forEach(row => {
        c = 0;
        row.forEach(column => {
            log ? console.log(grid[r][c], r, c) : null;
            if (grid[r][c] > 0) {}
            else grid[r][c] = (Math.round(Math.random() * oneInXChanceForYellow) == 1) ? 1 : 0;
            c++;
        });
        r++;
    });
};

function forceGridReset() {
    grid = [];
    for (i=0;i<15;i++) {
        grid[i] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
}

//151515
let colors = [
    "#544C4A",
    "yellow",
    "orange",
    "red",
    "black"
];

function randomGridPositions() {
    let row = Math.floor(Math.random() * grid.length);
    let column = Math.floor(Math.random() * 15);

    return [row, column];
}

document.onkeydown = e => {
    let keyCode = e.keyCode;
    switch (keyCode) {
        case 37:
            if (shiftHeld && ((Date.now() - lastDash) > 30000)) {
                if ((x - 2) < 0) x = 0;
                else {
                    x -= 2
                    lastDash = Date.now();
                    lastDashPosAlpha = [x, y, 0.9];
                };
            } else {
                // single
                if ((x - 1) < 0) return;
                x--;
            }
        break;

        case 38:
            if (shiftHeld && ((Date.now() - lastDash) > 30000)) {
                if ((y - 2) < 0) y = 0;
                else {
                    y -= 2
                    lastDash = Date.now();
                    lastDashPosAlpha = [x, y, 0.9];
                };
            } else {
                if ((y - 1) < 0) return;
                y--;
            }
            
        break;

        case 39:
            if (shiftHeld && ((Date.now() - lastDash) > 30000)) {
                if ((x + 2) > 14) x = 14;
                else {
                    x += 2
                    lastDash = Date.now();
                    lastDashPosAlpha = [x, y, 0.9];
                };
            } else {
                if ((x + 1) > 14) return;
                x++;
            }
            
        break;

        case 40:
            if (shiftHeld && ((Date.now() - lastDash) > 30000)) {
                if ((y + 2) > 14) y = 14;
                else {
                    y += 2
                    lastDash = Date.now();
                    lastDashPosAlpha = [x, y, 0.9];
                };
            } else {
                if ((y + 1) > 14) return;
                y++;
            }
            
        break;

        case 16:
            shiftHeld = true;
        break;
    }
}

document.onkeyup = e => {
    switch (e.keyCode) {
        case 16:
            shiftHeld = false;
        break;
    }
}

const render = (force) => {
    let kill = false;

    if ((Date.now() - lastAlgorRun) > minimumTimeBeforeAlgorRun) {
        let randomPosition = randomGridPositions();
        //console.log("row", randomPosition[0], "column", randomPosition[1]);
        fill(randomPosition[1], randomPosition[0], 1, 2);

        randomPosition = randomGridPositions();
        fill(randomPosition[1], randomPosition[0], 2, 3);

        randomPosition = randomGridPositions();
        fill(randomPosition[1], randomPosition[0], 3, 4);

        lastAlgorRun = Date.now();
        if (minimumTimeBeforeAlgorRun !== 100) {
            minimumTimeBeforeAlgorRun -= 50;
        }
    }

    if ((Date.now() - lastGridRandomise) > 5000) {
        randomiseGrid(false);
        //console.log("randomised");
        lastGridRandomise = Date.now();
    }

    if ((Date.now() - lastYellowChanceChange) > 15000) {
        if (oneInXChanceForYellow != 1) {
            oneInXChanceForYellow--;
        }
        lastYellowChanceChange = Date.now();
    }

    var matrixSize = 15;
    var cellSize = canvas.width / matrixSize;
    for (var row = 0; row < matrixSize; row++) {
      for (var col = 0; col < matrixSize; col++) {
        // ctx.fillStyle = "#151515";
        ctx.fillStyle = colors[grid[row][col]];
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);

        if (grid[row][col] == 4){
            ctx.beginPath();
            //top left corner
            ctx.moveTo(col * cellSize, row * cellSize);
            // bottom right corner
            ctx.lineTo((col * cellSize) + cellSize, (row * cellSize) + cellSize);
            ctx.stroke();

            ctx.beginPath();
            //top right corner
            ctx.moveTo((col * cellSize) + cellSize, row * cellSize);
            // bottom left corner
            ctx.lineTo((col * cellSize), (row * cellSize) + cellSize);
            ctx.stroke();
        }
      }
    }

    ctx.font = "10px JetBrains Mono";
    ctx.fillStyle = "black";
    changesTimeIndicator.innerHTML = `${(((lastAlgorRun + minimumTimeBeforeAlgorRun) - Date.now())/1000)}s pana la fill (${minimumTimeBeforeAlgorRun/1000}s)`;
    moreYellowsTimeIndicator.innerHTML = `${(((lastGridRandomise + 5000) - Date.now())/1000)}s pana la generare (1 in ${oneInXChanceForYellow+1}, ${((lastYellowChanceChange + 15000) - Date.now())/1000}s)`;
    
    let dashTimeText = (Date.now() - lastDash) > 30000 ? `<span style="color: #39ff14">dash ready</span>` : `<span style="color: white">${(((lastDash + 30000) - Date.now())/1000)}s pana la urmatorul dash</span>`;

    dashTime.innerHTML = dashTimeText;
    timeSurvived.innerHTML = `${((Date.now() - startTime)/1000)}s survived`;

    // if (!(lastDashPosAlpha[2] < 0)) {
    //     if (((Date.now() - lastShadowDecrease) > 100)){ 
    //         ctx.fillStyle = "white";
    //         ctx.globalAlpha = lastDashPosAlpha[2];
    //         console.log(lastDashPosAlpha[0], lastDashPosAlpha[1], lastDashPosAlpha[2])
    //         // ctx.fillStyle = `rgba(255, 255, 255, ${lastDashPosAlpha[2]})`;
    //         ctx.fillRect((lastDashPosAlpha[0]*40)+10, (lastDashPosAlpha[1]*40)+10, 20, 20);
    //         lastDashPosAlpha[2] -= 0.1;
    //         lastShadowDecrease = Date.now();
    //         ctx.globalAlpha = 1;
    //     }
    // }

    ctx.fillStyle = "#85A1F2";
    ctx.fillRect((x*40)+10, (y*40)+10, 20, 20);

    if (grid[y][x] == 4) kill = true;
    if (kill) {
        ctx.font = "50px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("you died", 220, 300);
       
        //alert(`game over you suck \n you survived for: ${(Date.now() - startTime)/1000} seconds`) 
    
        document.getElementById('playButton').style.display = "";
    }
    if (kill) return;

    // ctx.beginPath();
    // ctx.arc(x, y, 7.5, 0, 2 * Math.PI);
    
    // ctx.stroke();

    if (!force) requestAnimationFrame(() => render());
}


document.getElementById('playButton').onclick = () => {
    forceGridReset();

    minimumTimeBeforeAlgorRun = 1500;
    oneInXChanceForYellow = 9;
    [x, y] = [7, 7];

    document.getElementById('playButton').innerText = "play again";
    document.getElementById('playButton').style.display = "none";
    setTimeout(() => {
        //console.log("x");
        randomiseGrid(false);
    }, 1000);
    lastAlgorRun = Date.now();
    lastGridRandomise = Date.now();
    lastYellowChanceChange = Date.now();
    lastDash = Date.now();
    startTime = Date.now();
    requestAnimationFrame(() => render());
}; 

function fill(x, y, targetColor, newColor) {
    if(x>=0 && x<=15-1 && y>=0 && y<=15 -1)
        if(grid[y][x]==targetColor)
            {
                grid[y][x]=newColor;
                fill(x-1,y, targetColor, newColor);
                fill(x,y+1, targetColor, newColor);
                fill(x+1,y, targetColor, newColor);
                fill(x,y-1, targetColor, newColor);
            }
}
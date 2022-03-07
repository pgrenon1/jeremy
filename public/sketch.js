let cellWidth = 25;
let mazeWidth, mazeHeight;
let grid = [];
let marginX = 20;
let marginY = 20;
let walkers = [];
let left, right, up, down;
let directions = [left, right, up, down];
let walkerInterval = 0;
let mouseDown = false;
let mouseCell;
let pfGrid;
let reservedWeight = 0;

document.getElementById('inputText').addEventListener('keyup', function ()
{
    let text = this.value;

    pxxl("fonts/test.bdf", text, function (pixels)
    {
        Reset();

        if (text == "")
            return;

        mazeWidth = pixels.reduce(function (prev, current)
        {
            return (prev.x > current.x) ? prev : current
        }).x + 2;

        mazeHeight = pixels.reduce(function (prev, current)
        {
            return (prev.y > current.y) ? prev : current
        }).y + 5;

        createCanvas(mazeWidth * cellWidth + marginX * 2, windowHeight);

        InitGrid();

        for (var p = 0, hue = 0; p < pixels.length; p++, hue++)
        {
            var pixel = pixels[p];
            var cell = GetCellAtCoordinates(pixel.x, pixel.y);
            ReserveCell(cell);
        }

        CreateMaze();
    });
}, false);

function setup()
{
    createCanvas(windowWidth, windowHeight);

    left = createVector(-1, 0);
    up = createVector(0, 1);
    right = createVector(1, 0);
    down = createVector(0, -1);

    directions = [left, up, right, down];

    textAlign(CENTER, CENTER);
}

function draw()
{
    background(51, 25, 51);

    DrawCells();

    UpdateWalkers();

    DrawWalkers();
}

// function mousePressed()
// {
//     mouseDown = true;

//     if (keyIsDown(17)) // LEFT CTRL
//     {
//         let x = PositionToXCoordinates(mouseX);
//         let y = PositionToYCoordinates(mouseY);


//     }
// }

function mouseReleased()
{
    mouseDown = false;
}

function CreateMaze()
{
    let firstWalker = new Walker(0, 0, walkerInterval, false, CreateRandomWalkers);
    walkers.push(firstWalker);
    firstWalker.Start();
}

function CreateRandomWalkers()
{
    let count = 0;
    for (let x = 0; x < mazeWidth; ++x)
    {
        for (let y = 0; y < mazeHeight; ++y)
        {
            let cell = GetCellAtCoordinates(x, y);
            if (!cell.wasVisited && !cell.tested)
            {
                DFS(cell);
                count++;
                console.log(x, y);
                let randomWalker = new Walker(x, y, walkerInterval, true, null);
                walkers.push(randomWalker);
                randomWalker.Start();
            }
        }
    }
    console.log(count);
}

function DFS(cell, visited)
{
    // These arrays are used to get row and column numbers
    // of 8 neighbors of a given cell
    let rowNbr = [-1, -1, -1, 0, 0, 1, 1, 1];
    let colNbr = [-1, 0, 1, -1, 1, -1, 0, 1];

    // Mark this cell as visited
    cell.tested = true;

    // Recur for all connected neighbours
    for (let i = 0; i < cell.neighbours.length; i++)
    {
        let neighbour = cell.neighbours[i];

        if (neighbour == null)
            continue;

        if (!neighbour.wasVisited && !neighbour.tested)
        {
            DFS(neighbour);
        }
    }
}

function ReserveCell(cell)
{
    cell.isReserved = true;
    pfGrid.setWeightAt(cell.gridCoordinates.x, cell.gridCoordinates.y, reservedWeight);
}

function PositionToXCoordinates(x)
{
    return int(map(x, marginX, mazeWidth * cellWidth, 0, mazeWidth));
}

function PositionToYCoordinates(y)
{
    return int(map(y, marginY, mazeHeight * cellWidth, 0, mazeHeight));
}

function DrawCells()
{
    for (let i = 0; i < grid.length; i++)
    {
        const cell = grid[i];
        cell.Draw();
    }
}

function UpdateWalkers()
{
    for (let i = 0; i < walkers.length; i++)
    {
        const walker = walkers[i];
        walker.Update();
    }
}

function DrawWalkers()
{
    for (let i = 0; i < walkers.length; i++)
    {
        const walker = walkers[i];
        walker.Draw();
    }
}

function InitGrid()
{
    let i = 0;
    for (let y = 0; y < mazeHeight; y++)
    {
        for (let x = 0; x < mazeWidth; x++)
        {
            let newCell = CreateCell(i, x, y);

            grid.push(newCell);

            i++;
        }
    }

    for (let i = 0; i < grid.length; i++)
    {
        const cell = grid[i];
        cell.AddNeighbours();
    }

    pfGrid = new PF.Grid(mazeWidth, mazeHeight);
}

function Reset()
{
    grid = [];
    walkers = [];
}

function CreateCell(i, x, y)
{
    return new Cell(i, x, y, cellWidth, cellWidth, grid);
}

function GetCellAtCoordinates(x, y)
{
    if (!IsInGrid(x, y))
        return null;

    return grid[GetIndex(x, y)];
}

function GetIndex(x, y)
{
    let index = x + mazeWidth * y;

    return index;
}

function IsInGrid(x, y)
{
    let inGrid = x >= 0 && x < mazeWidth && y >= 0 && y < mazeHeight;

    return inGrid;
}

function RemoveWalls(cellA, cellB)
{
    let direction = p5.Vector.sub(cellB.gridCoordinates, cellA.gridCoordinates);
    let inverseDirection = p5.Vector.mult(direction, -1);

    cellA.RemoveWallInDirection(direction);
    cellB.RemoveWallInDirection(inverseDirection);
}

function RemoveFromArray(arr, elt)
{
    for (var i = arr.length - 1; i >= 0; i--)
    {
        if (arr[i] == elt)
        {
            arr.splice(i, 1);
        }
    }
}
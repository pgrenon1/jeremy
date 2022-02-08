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

function setup()
{
    createCanvas(windowWidth, windowHeight);

    up = createVector(0, 1);
    down = createVector(0, -1);
    left = createVector(-1, 0);
    right = createVector(1, 0);

    directions = [left, right, up, down];

    textAlign(CENTER, CENTER);
    rectMode(CENTER)

    CreateGrid();
}

function draw()
{
    background(51, 25, 51);

    UpdateMouse();

    UpdateWalkers();

    DrawWalkers();

    DrawCells();
}

function mousePressed()
{
    mouseDown = true;

    if (keyIsDown(17)) // LEFT CTRL
    {
        let x = PositionToXCoordinates(mouseX);
        let y = PositionToYCoordinates(mouseY);

        CreateWalker(x, y);
    }
}

function mouseReleased()
{
    mouseDown = false;
}

function UpdateMouse()
{
    if (!mouseDown || keyIsDown(17)) // LEFT CTRL
        return;

    let x = PositionToXCoordinates(mouseX);
    let y = PositionToYCoordinates(mouseY);
    let cell = GetCellAtCoordinates(x, y);

    if (mouseCell != undefined && mouseCell != cell)
    {
        let direction = p5.Vector.sub(mouseCell.gridCoordinates, cell.gridCoordinates);
        let inverseDirection = p5.Vector.mult(direction, -1);
        cell.RemoveWallInDirection(direction);
        mouseCell.RemoveWallInDirection(inverseDirection);
        mouseCell.isReserved = true;
    }

    mouseCell = cell;
}

function PositionToXCoordinates(x)
{
    return int(map(x + cellWidth / 2, marginX, windowWidth, 0, mazeWidth));
}

function PositionToYCoordinates(y)
{
    return int(map(y + cellWidth / 2, marginY, windowHeight, 0, mazeHeight));
}

function CreateWalker(x, y)
{
    walkers.push(new Walker(x, y, walkerInterval));
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

function CreateGrid()
{
    mazeWidth = int((windowWidth - marginX) / cellWidth);
    mazeHeight = int((windowHeight - marginY) / cellWidth);

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
}

function CreateCell(i, x, y)
{
    return new Cell(i, x, y, cellWidth, cellWidth, grid);
}

function GetCellAtCoordinates(x, y)
{
    return grid[GetIndex(x, y)];
}

function GetIndex(x, y)
{
    let index = x + int(mazeWidth * y);
    return index;
}

function GetNeighbour(cell, x, y)
{
    let index = GetIndex(cell.x + x, cell.y + y);
    return grid[index];
}

function IsInGrid(x, y)
{
    return x >= 0 && x < mazeWidth && y >= 0 && y < mazeHeight;
}

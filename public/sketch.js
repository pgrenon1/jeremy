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
let reservedWeight = 0.1;

document.getElementById('inputText').addEventListener('keyup', function ()
{
    pxxl("fonts/test.bdf", this.value, function (pixels)
    {
        Reset();

        for (var p = 0, hue = 0; p < pixels.length; p++, hue++)
        {
            var pixel = pixels[p];
            var cell = GetCellAtCoordinates(pixel.x, pixel.y);
            ReserveCell(cell);
        }
    });
}, false);

function setup()
{
    createCanvas(windowWidth, windowHeight);

    CreateSlider();

    left = createVector(-1, 0);
    up = createVector(0, 1);
    right = createVector(1, 0);
    down = createVector(0, -1);

    directions = [left, up, right, down];

    textAlign(CENTER, CENTER);

    CreateGrid();

    pfGrid = new PF.Grid(mazeWidth, mazeHeight);
}

function draw()
{
    background(51, 25, 51);
    UpdateMouse();

    UpdateSlider();

    DrawCells();

    UpdateWalkers();

    DrawWalkers();
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

function CreateSlider()
{
    slider = createSlider(0, 100, 10);
    slider.position(400, 10);
    slider.style('width', '180px');
}

function UpdateSlider()
{
    let value = slider.value() / 100;
    reservedWeight = value;
}

function UpdateMouse()
{
    if (!mouseDown || keyIsDown(17)) // LEFT CTRL
        return;

    let x = PositionToXCoordinates(mouseX);
    let y = PositionToYCoordinates(mouseY);
    let cell = GetCellAtCoordinates(x, y);

    // if (mouseCell != undefined && mouseCell != cell)
    // {
    //     let direction = p5.Vector.sub(mouseCell.gridCoordinates, cell.gridCoordinates);
    //     let inverseDirection = p5.Vector.mult(direction, -1);
    //     cell.RemoveWallInDirection(direction);
    //     mouseCell.RemoveWallInDirection(inverseDirection);
    //     mouseCell.isReserved = true;
    //     pfGrid.setWeightAt(mouseCell.gridCoordinates.x, mouseCell.gridCoordinates.y, 0.1);
    // }

    // mouseCell = cell;
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
    mazeWidth = int((width - marginX) / cellWidth);
    mazeHeight = int((height - marginY) / cellWidth);

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
}

function Reset()
{
    grid = [];
    walkers = [];
    CreateGrid();
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
let cellWidth = 25;
let mazeWidth, mazeHeight;
let grid = [];
let marginX = 0;
let marginY = 0;
let walkers = [];
let left, right, up, down;
let directions = [left, right, up, down];
let walkerInterval = 0;
let mouseDown = false;
let mouseCell;
let pfGrid;
let reservedWeight = 0;
let mousePath = []
let canvas;
let showLoading = true;
let showMaze = true;
let bgText;
let bgColor;

function setup()
{
    bgColor = color(15, 15, 15);

    canvas = createCanvas(windowWidth, windowHeight);

    left = createVector(-1, 0);
    up = createVector(0, -1);
    right = createVector(1, 0);
    down = createVector(0, 1);

    directions = [left, up, right, down];

    textAlign(CENTER, CENTER);

    let urlParams = getURLParams();
    let text = urlParams.text;
    if (text != undefined)
    {
        CreateMaze(decodeURIComponent(text));
    }
    else
    {
        CreateMaze("brother");
    }

    let makingof = urlParams.makingof;
    if (makingof != undefined)
    {
        showLoading = makingof != "true";
    }
}

function draw()
{
    if (!showMaze)
    {
        canvas.style("display", "none");
        return;
    }

    clear();

    DrawMargins();

    DrawCells();

    UpdateWalkers();

    DrawWalkers();

    UpdateMouse();

    if (showLoading)
        DrawForeground();
}

function DrawMargins()
{
    noStroke();
    fill(bgColor);
    rect(0, 0, width, marginY);
    rect(0, 0, marginX, height);
    rect(0, height - marginY, width, marginY);
    rect(width - marginX, 0, marginX, height);
}

function CreateMaze(text)
{
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

        canvas = createCanvas(windowWidth, windowHeight);

        marginX = width / 2 - mazeWidth * cellWidth / 2;
        marginY = height / 2 - mazeHeight * cellWidth / 2;

        bgText = document.getElementById('bgText');

        InitGrid();

        for (var p = 0, hue = 0; p < pixels.length; p++, hue++)
        {
            var pixel = pixels[p];
            var cell = GetCellAtCoordinates(pixel.x, pixel.y);
            ReserveCell(cell);
        }

        FillMaze();

        ShowBGText();
    });
}

function ShowBGText()
{
    bgText.style.display = "flex";
    bgText.style.width = canvas.width;
    bgText.style.height = canvas.height;
}

function DrawForeground()
{
    if (walkers.length == 0 || walkers.some((walker) => { return walker.isWalking; }))
    {
        background(bgColor);

        fill(255);
        textSize(25);
        let visitedCells = 0;
        for (let i = 0; i < grid.length; i++)
        {
            const cell = grid[i];
            if (cell.wasVisited)
                visitedCells++;
        }
        let percent = visitedCells / grid.length;
        text("LOADING " + Math.round(percent * 100) + "%", width / 2, height / 2);
    }
}

function mouseReleased()
{
    mouseDown = false;
    mousePath = [];
}

function mousePressed()
{
    mouseDown = true;

    if (mousePath.length == 0)
    {
        if (grid.length > 0 && grid[0].PositionIsInBounds(mouseX, mouseY))
        {
            mousePath.push(grid[0]);
        }
    }
}

function UpdateMouse()
{
    if (!mouseDown)
        return;

    if (mousePath.length == 0)
        return;

    for (let i = 0; i < mousePath.length; i++)
    {
        const cell = mousePath[i];

        for (let j = 0; j < cell.neighbours.length; j++)
        {
            const neighbour = cell.neighbours[j];

            if (neighbour == undefined)
                continue;

            if (!cell.IsConnected(neighbour))
                continue;

            if (neighbour.PositionIsInBounds(mouseX, mouseY) && !mousePath.includes(neighbour))
            {
                mousePath.push(neighbour);
                if (neighbour == grid[grid.length - 1])
                {
                    showMaze = false;
                }
            }
        }
    }
}

function FillMaze()
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
                let randomWalker = new Walker(x, y, walkerInterval, true, null);
                walkers.push(randomWalker);
                randomWalker.Start();
            }
        }
    }
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

function PositionToCoordinates(x, y)
{
    return createVector(PositionToXCoordinates(x), PositionToYCoordinates(y));
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
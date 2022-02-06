let cellWidth = 50
let cellHeight = 50
let mazeWidth, mazeHeight;
let cells = [];

function setup()
{
    createCanvas(windowWidth, windowHeight);

    CreateGrid();
}

function draw()
{
    background(51, 25, 51)

    for (let i = 0; i < cells.length; i++)
    {
        const cell = cells[i];
        cell.Draw();
    }
}

function CreateGrid()
{
    mazeWidth = windowWidth / cellWidth;
    mazeHeight = windowHeight / cellHeight;

    for (let x = 0; x < mazeWidth; x++)
    {
        for (let y = 0; y < mazeHeight; y++)
        {
            let newCell = CreateCell(x, y);
            cells.push(newCell);
        }
    }
}

function CreateCell(x, y)
{
    return new Cell(x, y, cellWidth, cellHeight, cells);
}

function GetIndex(x, y)
{
    let index = x + mazeWidth * y;
    return index;
}
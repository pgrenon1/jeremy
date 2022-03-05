class Cell
{
    constructor(i, x, y)
    {
        this.i = i;
        this.gridCoordinates = createVector(x, y);
        this.position = createVector(x * cellWidth + marginX, y * cellWidth + marginY);
        this.left = this.position.x;
        this.right = this.position.x + cellWidth;
        this.top = this.position.y;
        this.bottom = this.position.y + cellWidth;
        this.wasVisited = false;
        this.walls = [true, true, true, true]; // left, top, right, bottom
        this.isReserved = false;
        this.visitedColor = color(51, 51, 51, 51);
        this.showWeight = false;
        this.neighbours = [];
    }

    AddNeighbours()
    {
        directions.forEach(direction =>
        {
            let neighbour = this.GetNeighbour(direction.x, direction.y);

            this.neighbours.push(neighbour);
        });
    }

    GetNeighbour(xOffset, yOffset)
    {
        return GetCellAtCoordinates(this.gridCoordinates.x + xOffset, this.gridCoordinates.y + yOffset);
    }

    RemoveWallInDirection(direction)
    {
        if (direction.x == -1)
            this.RemoveWallAtIndex(0);
        else if (direction.y == -1)
            this.RemoveWallAtIndex(1);
        else if (direction.x == 1)
            this.RemoveWallAtIndex(2);
        else if (direction.y == 1)
            this.RemoveWallAtIndex(3);
    }

    RemoveWallAtIndex(i)
    {
        this.walls[i] = false;
    }

    DrawLeft()
    {
        line(this.left, this.top, this.left, this.bottom);
    }

    DrawRight()
    {
        line(this.right, this.top, this.right, this.bottom);
    }

    DrawTop()
    {
        line(this.left, this.top, this.right, this.top);
    }

    DrawBottom()
    {
        line(this.left, this.bottom, this.right, this.bottom);
    }

    PositionIsInBounds(x, y)
    {
        return this.left < x && this.right > x && this.top < y && this.bottom > y;
    }

    Draw()
    {
        if (this.wasVisited)
            fill(this.visitedColor);
        else if (this.isReserved)
            fill(51, 51, 51, 200);
        else
            fill(25, 25, 25, 150);

        noStroke();
        rect(this.left, this.top, cellWidth);
        stroke(0);
        strokeWeight(2);

        if (this.walls[0])
            this.DrawLeft();

        if (this.walls[1])
            this.DrawTop();

        if (this.walls[2])
            this.DrawRight();

        if (this.walls[3])
            this.DrawBottom();

        fill(255);
        if (this.showWeight)
            text(pfGrid.getWeightAt(this.gridCoordinates.x, this.gridCoordinates.y), this.position.x + cellWidth / 2, this.position.y + cellWidth / 2);

        fill(25);
    }
}
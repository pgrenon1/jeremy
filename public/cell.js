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
        this.visitedColor = color(51, 51, 51);
        if (i == 0)
            this.visitedColor = color(255, 51, 51);
        else if (i == mazeWidth * mazeHeight - 1)
            this.visitedColor = color(51, 255, 51);
        this.mousePathColor = bgColor;
        this.showWeight = false;
        this.neighbours = [];
        this.tested = false;
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

    GetWallIndex(direction)
    {
        if (direction.x == -1)
            return 0;
        else if (direction.y == -1)
            return 1;
        else if (direction.x == 1)
            return 2;
        else if (direction.y == 1)
            return 3;
    }

    RemoveWallInDirection(direction)
    {
        let wallIndex = this.GetWallIndex(direction);
        this.RemoveWallAtIndex(wallIndex);
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

    IsConnected(otherCell)
    {
        let direction = p5.Vector.sub(otherCell.gridCoordinates, this.gridCoordinates);
        let inverseDirection = p5.Vector.mult(direction, -1);

        let wallIndex = this.GetWallIndex(direction);
        let otherWallIndex = otherCell.GetWallIndex(inverseDirection);

        return !this.walls[wallIndex] && !otherCell.walls[otherWallIndex];
    }

    DrawWalls()
    {
        fill(0, 0, 0);
        stroke(0, 0, 0);
        strokeWeight(2);
        if (this.walls[0])
            this.DrawLeft();

        if (this.walls[1])
            this.DrawTop();

        if (this.walls[2])
            this.DrawRight();

        if (this.walls[3])
            this.DrawBottom();
    }

    DrawWeight()
    {
        fill(255, 255, 255);
        text(pfGrid.getWeightAt(this.gridCoordinates.x, this.gridCoordinates.y), this.position.x + cellWidth / 2, this.position.y + cellWidth / 2);
    }

    Draw()
    {
        noStroke();
        if (mousePath.includes(this))
        {
            fill(this.mousePathColor);
            rect(this.left - 0.5, this.top - 0.5, cellWidth + 1);
        }
        else
        {
            fill(this.visitedColor);
            rect(this.left - 0.5, this.top - 0.5, cellWidth + 1);
        }

        if (this.PositionIsInBounds(mouseX, mouseY))
        {
            stroke(0, 0, 0)
            rect(this.left + 1, this.top + 1, cellWidth - 2, cellWidth - 2, 5);
        }

        this.DrawWalls();

        if (this.showWeight)
            this.DrawWeight();
    }
}
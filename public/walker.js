class Walker
{
    constructor(x, y, t)
    {
        this.position = createVector(x, y);
        this.t = t;
        this.timer = 0;
        this.visited = [];
        this.currentCell = GetCellAtCoordinates(x, y);
        this.walk = true;
        this.visitedColor = color(random(0, 255), random(0, 255), random(0, 255));
    }

    Stop()
    {
        this.walk = false;
    }

    Walk()
    {
        this.currentCell.wasVisited = true;
        this.currentCell.visitedColor = this.visitedColor;

        let directionCandidates = directions.filter(dir => this.CanWalk(dir));
        let direction = random(directionCandidates);

        if (direction == undefined)
        {
            let previousCell = this.visited.pop();

            if (previousCell == undefined)
            {
                this.Stop();
                return;
            }

            direction = p5.Vector.sub(previousCell.gridCoordinates, this.currentCell.gridCoordinates);
        }
        else
        {
            this.visited.push(this.currentCell);
        }

        let inverseDirection = p5.Vector.mult(direction, -1);

        this.position = p5.Vector.add(this.position, direction);
        let newCell = grid[GetIndex(this.position.x, this.position.y)];

        this.currentCell.RemoveWallInDirection(direction);
        newCell.RemoveWallInDirection(inverseDirection);

        this.currentCell = newCell;
    }

    CanWalk(direction)
    {
        let newX = this.position.x + direction.x;
        let newY = this.position.y + direction.y;

        if (!IsInGrid(newX, newY))
            return false;

        var cell = GetCellAtCoordinates(newX, newY);

        if (cell.wasVisited || cell.isReserved)
            return false;

        return true;
    }

    Update()
    {
        if (!this.walk)
            return;

        this.timer += deltaTime / 1000;
        if (this.timer >= this.t)
        {
            this.timer = 0;

            this.Walk();
        }
    }

    Draw()
    {
        strokeWeight(cellWidth);
        point(this.position.x * cellWidth + marginX, this.position.y * cellWidth + marginY);
        strokeWeight(1);
    }
}
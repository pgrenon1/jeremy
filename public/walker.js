class Walker
{
    constructor(x, y, t)
    {
        this.position = createVector(x, y);
        this.t = t;
        this.timer = 0;
        this.visited = [];
        this.currentCell = GetCellAtCoordinates(x, y);
        this.isWalking = true;
        this.visitedColor = color(51, 51, 51)//color(random(0, 255), random(0, 255), random(0, 255));
        this.random = walkers.length != 0;
        this.path = [];
        this.end = grid[grid.length - 1];
        this.isTextWalker = walkers.length == 0;
        this.breakOnNewPath = false;
    }

    Stop()
    {
        this.isWalking = false;
    }

    GetClosestUnvisitedReservedCell()
    {
        let smallestCost = 1000;
        let closestReservedCell;
        for (let i = 0; i < grid.length; i++)
        {
            const cell = grid[i];

            if (cell == this.currentCell)
                continue;

            if (!cell.isReserved)
                continue;

            if (cell.wasVisited)
                continue;

            if (this.visited.includes(cell))
                continue;

            let pathToThatCell = this.FindPath(this.currentCell, cell);

            // let distance = dist(this.currentCell.gridCoordinates.x, this.currentCell.gridCoordinates.y, cell.gridCoordinates.x, cell.gridCoordinates.y);
            // if (distance <= shortestDistance && !this.visited.includes(cell) && cell.isReserved && !cell.wasVisited)
            let cost = this.GetPathCost(pathToThatCell);
            if (cost < smallestCost)
            {
                smallestCost = cost;
                closestReservedCell = cell;
            }
        }

        return closestReservedCell;
    }

    FindPath(start, end)
    {
        let pfGridCopy = pfGrid.clone();
        for (let i = 0; i < grid.length; i++)
        {
            const cell = grid[i];
            let canWalk = this.CanWalk(cell);
            pfGridCopy.setWalkableAt(cell.gridCoordinates.x, cell.gridCoordinates.y, canWalk);
        }

        let finder = new PF.AStarFinder();
        let path = finder.findPath(start.gridCoordinates.x, start.gridCoordinates.y, end.gridCoordinates.x, end.gridCoordinates.y, pfGridCopy);
        return path.reverse();
    }

    GetPathCost(path)
    {
        let totalCost = 0;

        for (let i = 0; i < path.length; i++)
        {
            const position = path[i];
            totalCost += pfGrid.getWeightAt(position[0], position[1]);
        }

        return totalCost;
    }

    Walk()
    {
        this.currentCell.wasVisited = true;
        this.currentCell.visitedColor = this.visitedColor;

        if (this.currentCell == this.end)
        {
            this.Stop();
            return;
        }

        let newCell;

        if (this.random)
        {
            newCell = random(this.currentCell.neighbours.filter(cell => this.CanWalk(cell)));

            if (newCell == undefined)
            {
                let previousCell = this.visited.pop();

                if (previousCell == undefined)
                {
                    this.Stop();
                    return;
                }

                newCell = previousCell;
            }
        }
        else
        {
            if (this.path.length == 0)
            {
                let target;
                let closestUnvisitedReserved = this.GetClosestUnvisitedReservedCell();

                if (closestUnvisitedReserved != undefined)
                {
                    target = closestUnvisitedReserved;
                }
                else
                {
                    target = this.end;
                }

                this.path = this.FindPath(this.currentCell, target);
                if (this.breakOnNewPath)
                    this.Stop();
            }

            let newCellPosition = this.path.pop();

            newCell = GetCellAtCoordinates(newCellPosition[0], newCellPosition[1]);

            newCell.isReserved = true;
        }

        this.position = newCell.position;

        RemoveWalls(this.currentCell, newCell);

        if (!newCell.wasVisited && !this.visited.includes(this.currentCell))
            this.visited.push(this.currentCell);

        this.currentCell = newCell;
        pfGrid.setWeightAt(this.currentCell.gridCoordinates.x, this.currentCell.gridCoordinates.y, 0);
    }

    CanWalk(cell)
    {
        if (cell == undefined)
            return false;

        if (!this.isTextWalker && (cell.isReserved || cell.wasVisited))
            return false;

        return true;
    }

    Update()
    {
        if (!this.isWalking)
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
        if (this.isWalking)
            point(this.currentCell.position.x + cellWidth / 2, this.currentCell.position.y + cellWidth / 2);

        if (this.path.length > 0 && !this.isWalking)
        {
            strokeWeight(cellWidth / 2);
            for (let i = 0; i < this.path.length; i++)
            {
                const position = this.path[i];
                let cell = GetCellAtCoordinates(position[0], position[1]);
                point(cell.position.x + cellWidth / 2, cell.position.y + cellWidth / 2);
            }
        }

        strokeWeight(1);

        if (keyIsDown(LEFT_ARROW))
        {
            this.isWalking = true;
        }
    }

    Heuristic(a, b)
    {
        var d = dist(a.x, a.y, b.x, b.y);
        return d;
    }
}

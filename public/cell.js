class Cell
{
    constructor(x, y, width, height, grid)
    {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.left = this.x * this.width - this.width / 2;
        this.right = this.x * this.width + this.width / 2;
        this.top = this.y * this.height - this.height / 2;
        this.bottom = this.y * this.height + this.height / 2;
        this.grid = grid;
    }

    DrawLeft()
    {
        line(this.left, this.top, this.left, this.bottom)
    }

    DrawRight()
    {
        line(this.right, this.top, this.right, this.bottom)
    }

    DrawTop()
    {
        line(this.left, this.top, this.right, this.top)
    }

    DrawBottom()
    {
        line(this.left, this.bottom, this.right, this.bottom)
    }

    Draw()
    {
        this.DrawBottom()
        this.DrawTop()
        this.DrawLeft()
        this.DrawRight()
    }
}
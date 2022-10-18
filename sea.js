class Sea {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.numFish = 0;
        this.numSharks = 0;
        this.chronon = 0;
        this.ctx = document.getElementById('seaCanvas').getContext('2d', { willReadFrequently: true });
        this.array = new Array();
        for (let j = 0; j < this.height; j++) {
            var row = new Array();
            for (let i = 0; i < this.width; i++) {
                row.push(null);
            }
            this.array.push(row)
        }
    }

    getNorthCellCoords(x, y) {
        if (y !== 0) {
            return {
                x: x,
                y: y - 1
            };
        } else {
            return {
                x: x,
                y: this.height - 1
            };
        }
    }

    getWestCellCoords(x, y) {
        if (x !== 0) {
            return {
                x: x - 1,
                y: y
            };
        } else {
            return {
                x: this.width - 1,
                y: y
            };
        }
    }

    getSouthCellCoords(x, y) {
        if (y !== this.height - 1) {
            return {
                x: x,
                y: y + 1
            };            
        } else {
            return {
                x: x,
                y: 0
            };
        }
    }

    getEastCellCoords(x, y) {
        if (x !== this.width - 1) {
            return {
                x: x + 1,
                y: y
            };
        } else {
            return {
                x: 0,
                y: y
            }
        }
    }

    getCell(x, y) {
        return this.array[y][x];
    }

    getAdjacentCoords(x, y) {
        var coords = new Array();
        coords.push(this.getNorthCellCoords(x, y));
        coords.push(this.getWestCellCoords(x,y));
        coords.push(this.getSouthCellCoords(x,y));
        coords.push(this.getEastCellCoords(x,y));
        return coords;
    }

    getEmptyAdjacentCoords(x, y) {
        var coords = this.getAdjacentCoords(x, y);
        var empty = new Array();
        for (let i = 0; i < coords.length; i++) {
            let testX = coords[i].x;
            let testY = coords[i].y;
            if (this.array[testY][testX] == null) {
                empty.push(coords[i]);
            }
        }
        return empty;
    }

    getAdjacentFishCoords(x, y) {
        var coords = this.getAdjacentCoords(x, y);
        var fish = new Array();
        for (let i = 0; i < coords.length; i++) {
            let testX = coords[i].x;
            let testY = coords[i].y;
            if (this.array[testY][testX] != null) {
                if (this.array[testY][testX].species === 'fish') {
                    fish.push(coords[i]);
                }
            }
        }
        return fish;
    }

    move(origin, destination) {
        this.array[origin.y][origin.x].x = destination.x;
        this.array[origin.y][origin.x].y = destination.y;
        this.array[destination.y][destination.x] = this.array[origin.y][origin.x];
        this.array[origin.y][origin.x] = null;
    }

    addFish(origin, chronon) {
        this.numFish++;
        this.array[origin.y][origin.x] = new Fish(this, origin.x, origin.y, chronon);
    }

    addShark(origin, chronon) {
        this.numSharks++;
        this.array[origin.y][origin.x] = new Shark(this, origin.x, origin.y, chronon);
    }

    kill(coord) {
        if (this.array[coord.y][coord.x].species === 'fish') {
            this.numFish--;
        } else if (this.array[coord.y][coord.x].species === 'shark') {
            this.numSharks--;
        }
        this.array[coord.y][coord.x] = null;
    }

    generate() {
        let fishPct = document.getElementById('fishPct').value / 100;
        let sharkPct = document.getElementById('sharkPct').value / 100;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let r = Math.random();
                if (r < fishPct) {
                    this.array[y][x] = new Fish(this, x, y, 0);
                    this.numFish++;
                } else if (r < fishPct + sharkPct) {
                    this.array[y][x] = new Shark(this, x, y, 0);
                    this.numSharks++;
                } else {
                    this.array[y][x] = null;
                }
            }
        }
    }

    draw() {
        const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        const data = imageData.data;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let i = 4 * (y * this.width + x);
                if (this.array[y][x] == null) {
                    // white water
                    data[i] = 255;
                    data[i + 1] = 255;
                    data[i + 2] = 255;
                    data[i + 3] = 255;
                } else if (this.array[y][x].species === 'fish') {
                    // yellow fish
                    data[i] = 255;
                    data[i + 1] = 255;
                    data[i + 2] = 0;
                    data[i + 3] = 255;
                } else if (this.array[y][x].species === 'shark') {
                    // red sharks
                    data[i] = 255;
                    data[i + 1] = 0; 
                    data[i + 2] = 0;
                    data[i + 3] = 255;
                }
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
        document.getElementById('chrononText').innerHTML = this.chronon;
        document.getElementById('fishText').innerHTML = this.numFish;
        document.getElementById('sharksText').innerHTML = this.numSharks;
    }

    tick() {
        this.chronon++;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.array[y][x] == null) {
                    // do nothing
                } else {
                    this.array[y][x].tick(this.chronon);
                }
            }
        }
    }
}

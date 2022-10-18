class Animal {
    constructor(sea, x, y, chronon) {
        this.sea = sea;
        this.x = x;
        this.y = y;
        this.chronon = chronon; 
        this.species = null;
        this.hasMoved = false;
        this.turnsToBreed = 0;
        this.turnsToStarve = 0;    
    }
}

class Fish extends Animal {
    constructor(sea, x, y, chronon) {
        super(sea, x, y, chronon);
        this.turnsToBreed = document.getElementById('fishBreedTurns').value;
        this.species = 'fish';
    }

    tick(chronon) {
        if (chronon === this.chronon) {
            // already moved            
        } else {
            // yet to move
            var empty = this.sea.getEmptyAdjacentCoords(this.x, this.y);
            if (empty.length === 0) {
                // no empty adjacent cells
            } else {
                // there is at least one empty adjacent cell available
                var origin = {x: this.x, y: this.y};
                var destination = randomChoice(empty);
                if (this.turnsToBreed <= 0) {
                    this.turnsToBreed = document.getElementById('fishBreedTurns').value;
                    this.sea.move(origin, destination);
                    this.sea.addFish(origin, this.chronon + 1);
                } else {
                    this.sea.move(origin, destination);
                }
            }
            this.chronon++;
            this.turnsToBreed--;
        }        
    }
}

class Shark extends Animal {
    constructor(sea, x, y, chronon) {
        super(sea, x, y, chronon);
        this.turnsToBreed = document.getElementById('sharkBreedTurns').value;
        this.turnsToStarve = document.getElementById('sharkStarveTurns').value;
        this.species = 'shark';
    }

    tick(chronon) {
        if (chronon === this.chronon) {
            // already moved
        } else {
            // yet to move
            var fish = this.sea.getAdjacentFishCoords(this.x, this.y);
            if (fish.length === 0) {
                // no adjacent fish
                var empty = this.sea.getEmptyAdjacentCoords(this.x, this.y);
                if (empty.length === 0) {
                    // no empty adjacent cells
                } else {
                    // there is at least one empty adjacent cell available
                    var origin = {x: this.x, y: this.y};
                    var destination = randomChoice(empty);
                    if (this.turnsToBreed <= 0) {
                        this.turnsToBreed = document.getElementById('sharkBreedTurns').value;
                        this.sea.move(origin, destination);
                        this.sea.addShark(origin, this.chronon + 1);
                    } else {
                        this.sea.move(origin, destination);
                    }
                }
            } else {
                // devourin' time!
                var origin = {x: this.x, y: this.y};
                var destination = randomChoice(fish);
                this.turnsToStarve = document.getElementById('sharkStarveTurns').value;
                if (this.turnsToBreed <= 0) {
                    this.turnsToBreed = document.getElementById('sharkBreedTurns').value + 1;
                    this.sea.kill(destination);
                    this.sea.move(origin, destination);
                    this.sea.addShark(origin, this.chronon + 1);
                } else {
                    this.sea.kill(destination);
                    this.sea.move(origin, destination);
                }
            }
            this.chronon++;
            this.turnsToBreed--;
            this.turnsToStarve--;
            if (this.turnsToStarve === 0) {
                this.sea.kill({x: this.x, y: this.y});
            }
        }
    }
}

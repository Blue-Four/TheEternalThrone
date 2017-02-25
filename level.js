// Background
function Level(game, spritesheet, tile_sprite_array, tile_logic) {
    this.game = game;
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
	this.array = tile_sprite_array;
	this.floor = [];
	this.walls = [];
	//height and width for spawning logic
	this.width = tile_sprite_array[0].length;
	this.height = tile_sprite_array.length;
	
	// Convert tile sprite array to an array of Tile objects, and integrate tile logic.
	for	(var iX = 0; iX < this.width; iX++) {
		for	(var iY = 0; iY < this.height; iY++) {
			// var tile_x = (tile_sprite_array.length - iY + iX - 2) * 30;
			// var tile_y = (15 * (iX + iY));
			var tile_x = (iX - iY) * 30;
			var tile_y = 15 * (iX + iY);
			
			var tile = new Tile(spritesheet, tile_sprite_array[iY][iX],
								tile_logic[tile_sprite_array[iY][iX]],
								tile_x, tile_y,
								iX, iY,
								game);				
			this.array[iY][iX] = tile;
			if	(tile.type === "TYPE_FLOOR") { this.floor.push(tile); }
			else	{
				// If this tile is a doorway, draw an additional generic floor tile underneath it.
				if	(tile.type === "TYPE_DOOR_CLOSED" || tile.type === "TYPE_EXIT_CLOSED") {
					this.floor.push(new Tile(spritesheet, 0, "TYPE_FLOOR",
									tile_x, tile_y, iX, iY, game));
				}
				
				this.walls.push(tile);
				
			}
			
		}
		
	//graph used for pathfinding
	var collMap = genCollMap(this.array);
 	this.graph = new Graph(collMap, { diagonal: false });
		
	}
	
	// Sort both Tile arrays by depth, so they can be drawn in the proper order.
	this.floor.sort(function (a, b) {
		return a.y - b.y;
		
	});
	
	this.walls.sort(function (a, b) {
		return a.y - b.y;
		
	});
	
}

Level.prototype.getTileFromPoint = function(x, y) {
	var calculated_x = Math.round((x / 30 + y / 15) / 2);
	var calculated_y = Math.round((y / 15 - (x / 30)) / 2);
	
	if	(calculated_y > this.array.length - 1 ||
		 calculated_x > this.array[0].length - 1 ||
		 calculated_y < 0 ||
		 calculated_x < 0) {
		return new Tile(null, 0, "TYPE_WALL", x, y, 0, 0, null);
	} else {
		return this.array[calculated_y][calculated_x];
	}
}

Level.prototype.getPointFromTile = function(xIndex, yIndex) {
	var findTile = this.array[yIndex][xIndex];
	var coords = [findTile.x, findTile.y];
	return coords;
}

//returns array representation of path to take
Level.prototype.findPath = function(xStart, yStart, xEnd, yEnd) {
	var startIndex = this.graph.grid[parseInt(xStart)][parseInt(yStart)];
	var endIndex = this.graph.grid[parseInt(xEnd)][parseInt(yEnd)];
	var result = astar.search(this.graph, startIndex, endIndex);
	return result;
}

Level.prototype.getRandomLocation = function() {
	var tile;
	var x, y;
	do {
		 x = Math.floor(Math.random() * (this.width));
		 y = Math.floor(Math.random() * (this.height));
		 tile = this.array[y][x];
	} while (!isWalkable(tile));
	var coords = [];
	coords.x = tile.x;
	coords.y = tile.y;
	return coords;
}

function genCollMap(array) {
	var width = array[0].length;
	var height = array.length;
    var collMap = [];
    for(var i = 0; i < width; i++){
        collMap.push([]);
    };

    for(var x = 0; x < width; x++){
        for(var y = 0; y < height; y++){
        	if(isWalkable(array[y][x])) {
        		collMap[x].push(1);
        	} else {
        		collMap[x].push(0);
        	}
        };
    };
	
    return(collMap);
	
}

/*
Tile Types
	"TYPE_FLOOR"
	Walkable. Drawn before all character entities, regardless of position on the Y-axis.
	
	"TYPE_WALL"
	Blocks traversal of all character entities. Obeys the order of depth when drawn.
	
	"TYPE_DOOR_OPEN"
	Allows traversal of all character entities. Obeys the order of depth when drawn.
	
	"TYPE_DOOR_CLOSED"
	Blocks traversal of all character entities. Obeys the order of depth when drawn.
	
	"TYPE_EXIT_OPEN"
	Allows traversal of all character entities. Obeys the order of depth when drawn.
	
	"TYPE_EXIT_OPEN"
	Blocks traversal of all character entities. Obeys the order of depth when drawn.
	
*/
function Tile(spritesheet, sprite_index, type, x, y, xIndex, yIndex, game) {
	this.spritesheet = spritesheet;
	this.sprite_index = sprite_index;
	this.type = type;
	this.xIndex = xIndex;
	this.yIndex = yIndex;
	this.x = x;
	this.y = y;
	this.game = game;
}

Tile.prototype.draw = function() {
	var iIndexAddition = 0;
	if	(this.type === "TYPE_DOOR_OPEN" || this.type === "TYPE_EXIT_OPEN") { iIndexAddition = 1; }
	this.drawnX = this.x + this.game.x - 60;		
	this.drawnY = this.y + this.game.y - 90;
	this.game.ctx.drawImage(this.spritesheet,
			120 * (this.sprite_index + iIndexAddition), 0,
			120, 120,
			this.drawnX, this.drawnY,
			120, 120);
}

Tile.prototype.isCollision = function(x, y) {
	var center_x = this.x + 60;
	var center_y = this.y + 90;
	
	/*
	 sector2 | sector1 
	-------------------
	 sector3 | sector4 
	*/
	var sector1 = (center_x / 2) - center_y - 15;
	var sector2 = (center_x / 2) + center_y + 15;
	var sector3 = (center_x / 2) - center_y + 15;
	var sector4 = (center_x / 2) + center_y - 15;
	
	return (sector1 <= 0 && sector2 <= 0 && sector3 >= 0 && sector4 >= 0);
	
}

function isWalkable(tile) {
	return (tile.type === "TYPE_FLOOR" || tile.type === "TYPE_DOOR_OPEN" || tile.type === "TYPE_EXIT_OPEN");
}
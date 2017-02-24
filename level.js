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
	//graph used for pathfinding
	var collMap = genCollMap(tile_sprite_array);
 	this.graph = new Graph(collMap, { diagonal: true });
	
	// Convert tile sprite array to an array of Tile objects, and integrate tile logic.
	for	(var iX = 0; iX < this.width; iX++) {
		for	(var iY = 0; iY < this.height; iY++) {
			// var tile_x = (tile_sprite_array.length - iY + iX - 2) * 30;
			// var tile_y = (15 * (iX + iY));
			var tile_x = (iX - iY) * 30;
			var tile_y = 15 * (iX + iY);
			
			var tile = new Tile(tile_sprite_array[iY][iX],
								tile_logic[tile_sprite_array[iY][iX]],
								tile_x, tile_y,
								iX, iY);				
			this.array[iY][iX] = tile;
			if	(tile.type === "TYPE_FLOOR") { this.floor.push(tile); }
			else	{ this.walls.push(tile); }
			
		}
		
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
	
	if	(calculated_y >= this.array.length || calculated_x >= this.array[0].length ||
		 calculated_y < 0 || calculated_x < 0) {
		return new Tile(null, "TYPE_WALL", x, y);
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
	} while (tile.type == "TYPE_WALL");
	var coords = [];
	coords.x = tile.x;
	coords.y = tile.y;
	return coords;
}

function genCollMap(tile_sprite_array) {
	var width = tile_sprite_array[0].length;
	var height = tile_sprite_array.length;
    var collMap = [];
    for(var i = 0; i < height; i++){
        collMap.push([]);
    };

    for(var i = 0; i < height; i++){
        for(var j = 0; j < width; j++){
        	if(tile_sprite_array[i][j] == 1) {
        		collMap[j].push(0);
        	} else {
        		collMap[j].push(1);
        	}
        };
    };

    console.log(collMap);
    return(collMap);
}


/*
Tile Types
	"TYPE_FLOOR"
	Walkable. Drawn before all character entities, regardless of position on the Y-axis.
	
	"TYPE_WALL"
	Blocks traversal of all character entities. Obeys the order of depth when drawn.

*/
function Tile(sprite_index, type, x, y, xIndex, yIndex) {
	this.sprite_index = sprite_index;
	this.type = type;
	this.xIndex = xIndex;
	this.yIndex = yIndex;
	this.x = x;
	this.y = y;
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
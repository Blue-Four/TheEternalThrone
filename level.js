// Background
function Level(game, spritesheet, tile_sprite_array, tile_logic) {
    this.game = game;
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
	this.array = tile_sprite_array;
	this.floor = [];
	this.walls = [];
	
	// Convert tile sprite array to an array of Tile objects, and integrate tile logic.
	for	(var iX = 0; iX < tile_sprite_array[0].length; iX++) {
		for	(var iY = 0; iY < tile_sprite_array.length; iY++) {
			// var tile_x = (tile_sprite_array.length - iY + iX - 2) * 30;
			// var tile_y = (15 * (iX + iY));
			
			var tile_x = (iX - iY) * 30;
			var tile_y = 15 * (iX + iY);
			
			var tile = new Tile(tile_sprite_array[iY][iX],
								tile_logic[tile_sprite_array[iY][iX]],
								tile_x, tile_y);
				
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

/*
Tile Types
	"TYPE_FLOOR"
	Walkable. Drawn before all character entities, regardless of position on the Y-axis.
	
	"TYPE_WALL"
	Blocks traversal of all character entities. Obeys the order of depth when drawn.

*/
function Tile(sprite_index, type, x, y) {
	this.sprite_index = sprite_index;
	this.type = type;
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
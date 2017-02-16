function apply_AI_Wander(character) {
	character.ai_active = true;
	
	var interval = setInterval(function () {
		if	(character.ai_active) {
			var tile = getRandomTile(character, 1);
			
			character.end_x = tile.x;
			character.end_y = tile.y;
			
			character.path_start = true;
			character.is_moving = true;
			
		} else {
			clearInterval(interval);
			
		}
	
			
	}, 5000 + (Math.floor(Math.random() * 2000) - 1000));
	
}

function getRandomTile(character, radius) {
	var tile = character.game.level.getTileFromPoint(character.x, character.y);
	var tiles = [];
	
	var y = -1 * radius;
	for	( ; y <= radius; y++) {
		var x = -1 * radius;
		for	( ; x <= radius; x++) {
			if	(x + y !== 0 && character.game.level.array[tile.yIndex + y][tile.xIndex + x].type === "TYPE_FLOOR") {
				tiles.push(character.game.level.array[tile.yIndex + y][tile.xIndex + x]);
				
			}
			
		}
		
	}
	
	var iTile = Math.floor(Math.random() * tiles.length);
	
	return tiles[iTile];
	
}
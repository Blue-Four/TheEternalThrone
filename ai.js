function apply_AI_Wander(character) {
    character.ai_active = true;
    
    var interval = setInterval(function () {
        if  (character.ai_active) {
            //character.moveNodes = [];
            var tile = getRandomTile(character, 3);
           
            character.end_x = tile.x;
            character.end_y = tile.y;
           
            character.path_start = true;
            if (character.is_dying || character.is_dead) character.is_moving = false;
            else character.is_moving = true;
         
        } else {
            clearInterval(interval);
           
        }
   
           
    }, 1000 + (Math.floor(Math.random() * 2000) - 1000));
   
}

function disable_AI_Wander(character) {
    character.ai_active = false;
}

function enable_AI_Wander(character) {
    character.ai_active = true;
}
 
 
function getRandomTile(character, radius) {
/*    var tile = character.game.level.getTileFromPoint(character.x, character.y);
    var tiles = [];
   
    var y = -1 * radius + tile.yIndex;
    for ( ; y <= radius + tile.yIndex; y++) {
        var x = -1 * radius + tile.xIndex;
        for ( ; x <= radius + tile.xIndex; x++) {
            if  (character.game.level.array[y][x].type === "TYPE_FLOOR") {
                tiles.push(character.game.level.array[y][x]);  
            }   
            
        }  
    }
    var iTile = Math.floor(Math.random() * tiles.length);
   
    return tiles[iTile];*/
   
    var tile;
    var x, y;
    do {
         x = Math.floor(Math.random() * (character.game.level.width));
         y = Math.floor(Math.random() * (character.game.level.height));
         tile = character.game.level.array[y][x];
    } while (tile.type == "TYPE_WALL");
    return tile;
}

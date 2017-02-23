var AM = new AssetManager();

var SCREEN_WIDTH = 1280;
var SCREEN_HEIGHT = 720;

// Begin download queue.
AM.queueDownload("./img/tiles/tile_short.png");
AM.queueDownload("./img/barbarian_spritesheet.png");
AM.queueDownload("./img/skeleton_spritesheet.png");
AM.queueDownload("./img/villager1_spritesheet.png");
AM.queueDownload("./img/zombie.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);	
	var level = new Level(gameEngine, AM.getAsset("./img/tiles/tile_short.png"), path_test, tile_logic_basic);
    gameEngine.setLevel(level);
	
    gameEngine.start();

    //player entity is first to be added
    var randomCoords = level.getRandomLocation();
	var barbarianPC = new CharacterPC(gameEngine, AM.getAsset("./img/barbarian_spritesheet.png"), randomCoords.x, randomCoords.y, 175, 1);
    gameEngine.addEntity(barbarianPC);

    var inventoryPC = new Inventory();
	
	randomCoords = level.getRandomLocation();
	var missDemeanor = new Ally_Villager(gameEngine, AM.getAsset("./img/villager1_spritesheet.png"), randomCoords.x, randomCoords.y, 110, 1);
    gameEngine.addEntity(missDemeanor);
	apply_AI_Wander(missDemeanor);
	
	for(var i = 0; i < 4; i++) {	
		//spawn randomly for display purposes
		randomCoords = level.getRandomLocation();
		//rX = Math.floor(Math.random() * SCREEN_WIDTH);
   		//rY = Math.floor(Math.random() * SCREEN_HEIGHT);
		var zombie = new Zombie(gameEngine, AM.getAsset("./img/zombie.png"), randomCoords.x, randomCoords.y);
		gameEngine.addEntity(zombie);
		apply_AI_Wander(zombie);
		//apply_AI_Wander(zombie);
	}

	for(var i = 0; i < 4; i++) {
		randomCoords = level.getRandomLocation();
		//rX = Math.floor(Math.random() * SCREEN_WIDTH);
   		//rY = Math.floor(Math.random() * SCREEN_HEIGHT);
		var swordyMcSwordface = new Enemy_Skeleton_Melee(gameEngine, AM.getAsset("./img/skeleton_spritesheet.png"), randomCoords.x, randomCoords.y, 110, 1);
	    gameEngine.addEntity(swordyMcSwordface);
		apply_AI_Wander(swordyMcSwordface);
	}

	for(var i = 0; i < 2; i++) {
		//rX = Math.floor(Math.random() * SCREEN_WIDTH);
   		//rY = Math.floor(Math.random() * SCREEN_HEIGHT);
		var largeMcSwordface = new Large_Skeleton_Melee(gameEngine, AM.getAsset("./img/skeleton_spritesheet.png"), randomCoords.x, randomCoords.y, 25, 2);
	    gameEngine.addEntity(largeMcSwordface);
	    apply_AI_Wander(largeMcSwordface);
	}

    console.log("All Done!");
	
});
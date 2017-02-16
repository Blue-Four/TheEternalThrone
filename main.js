var AM = new AssetManager();

var SCREEN_WIDTH = 1280;
var SCREEN_HEIGHT = 720;

// Begin download queue.
AM.queueDownload("./img/tiles/basic.png");
AM.queueDownload("./img/barbarian_spritesheet.png");
AM.queueDownload("./img/skeleton_spritesheet.png");
AM.queueDownload("./img/villager1_spritesheet.png");
AM.queueDownload("./img/zombie.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);	
	var level = new Level(gameEngine, AM.getAsset("./img/tiles/basic.png"), level_test1, tile_logic_basic);
    gameEngine.setLevel(level);
	
    gameEngine.start();

	var barbarianPC = new CharacterPC(gameEngine, AM.getAsset("./img/barbarian_spritesheet.png"), 100, 200, 175, 1);
    gameEngine.addEntity(barbarianPC);
	
	var missDemeanor = new Ally_Villager(gameEngine, AM.getAsset("./img/villager1_spritesheet.png"), 100, 200, 110, 1);
    gameEngine.addEntity(missDemeanor);
	apply_AI_Wander(missDemeanor);
	/*
	for(var i = 0; i < 4; i++) {	
		//spawn randomly for display purposes
		rX = Math.floor(Math.random() * SCREEN_WIDTH);
   		rY = Math.floor(Math.random() * SCREEN_HEIGHT);
		var zombie = new Zombie(gameEngine, AM.getAsset("./img/zombie.png"), rX, rY);
		gameEngine.addEntity(zombie);
		apply_AI_Wander(zombie);
	}

	for(var i = 0; i < 4; i++) {
		rX = Math.floor(Math.random() * SCREEN_WIDTH);
   		rY = Math.floor(Math.random() * SCREEN_HEIGHT);
		var swordyMcSwordface = new Enemy_Skeleton_Melee(gameEngine, AM.getAsset("./img/skeleton_spritesheet.png"), rX, rY, 110, 1);
	    gameEngine.addEntity(swordyMcSwordface);
		apply_AI_Wander(swordyMcSwordface);
	}

	for(var i = 0; i < 2; i++) {
		rX = Math.floor(Math.random() * SCREEN_WIDTH);
   		rY = Math.floor(Math.random() * SCREEN_HEIGHT);
		var largeMcSwordface = new Large_Skeleton_Melee(gameEngine, AM.getAsset("./img/skeleton_spritesheet.png"), rX, rY, 25, 2);
	    gameEngine.addEntity(largeMcSwordface);
	    apply_AI_Wander(largeMcSwordface);
	}*/

    console.log("All Done!");
	
});
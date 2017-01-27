var AM = new AssetManager();

// Begin download queue.
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/barbarian_spritesheet.png");
AM.queueDownload("./img/skeleton_spritesheet.png");
AM.queueDownload("./img/villager1_spritesheet.png");
AM.queueDownload("./img/zombie.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
	
	var background = new Background(gameEngine, AM.getAsset("./img/background.jpg"));
    gameEngine.addEntity(background);

	var barbarianPC = new CharacterPC(gameEngine, AM.getAsset("./img/barbarian_spritesheet.png"), 200, 200);
    gameEngine.addEntity(barbarianPC);
	
	var missDemeanor = new Ally_Villager(gameEngine, AM.getAsset("./img/villager1_spritesheet.png"), 400, 200);
    gameEngine.addEntity(missDemeanor);
	apply_AI_Wander(missDemeanor);
	
	for(var i = 0; i < 4; i++) {	
		//spawn randomly for display purposes
		rX = Math.floor(Math.random() * 800);
   		rY = Math.floor(Math.random() * 600);
		var zombie = new Zombie(gameEngine, AM.getAsset("./img/zombie.png"), rX, rY);
		gameEngine.addEntity(zombie);
		apply_AI_Wander(zombie);
	}

	for(var i = 0; i < 4; i++) {
		rX = Math.floor(Math.random() * 800);
   		rY = Math.floor(Math.random() * 600);
		var swordyMcSwordface = new Enemy_Skeleton_Melee(gameEngine, AM.getAsset("./img/skeleton_spritesheet.png"), rX, rY);
	    gameEngine.addEntity(swordyMcSwordface);
		apply_AI_Wander(swordyMcSwordface);
	}

    console.log("All Done!");
	
});
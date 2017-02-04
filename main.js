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
	
	var background = new Background(gameEngine, AM.getAsset("./img/background.jpg"), AM.getAsset("./img/background.jpg"));
    gameEngine.addEntity(background);
	
	var background = AM.getAsset("./img/barbarian_spritesheet.png");
	var offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = 400;
    offscreenCanvas.height = 400;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.drawImage(background, 0, 0);
    offscreenCtx.restore();
	
	var pixels = offscreenCanvas.getContext('2d').getImageData(0,0, 128, 128).data;
	var percentage = computeSquare(pixels, 55, 55, 128, 128);
	console.log("Percentage is " + percentage);

	// var barbarianPC = new CharacterPC(gameEngine, AM.getAsset("./img/barbarian_spritesheet.png"), 200, 200, 60, 175, 1);
    // gameEngine.addEntity(barbarianPC);
	
	// var missDemeanor = new Ally_Villager(gameEngine, AM.getAsset("./img/villager1_spritesheet.png"), 400, 200, 60, 110, 1);
    // gameEngine.addEntity(missDemeanor);
	// apply_AI_Wander(missDemeanor);
	
	// for(var i = 0; i < 4; i++) {	
		// //spawn randomly for display purposes
		// rX = Math.floor(Math.random() * 800);
   		// rY = Math.floor(Math.random() * 600);
		// var zombie = new Zombie(gameEngine, AM.getAsset("./img/zombie.png"), rX, rY);
		// gameEngine.addEntity(zombie);
		// apply_AI_Wander(zombie);
	// }

	// for(var i = 0; i < 4; i++) {
		// rX = Math.floor(Math.random() * 800);
   		// rY = Math.floor(Math.random() * 600);
		// var swordyMcSwordface = new Enemy_Skeleton_Melee(gameEngine, AM.getAsset("./img/skeleton_spritesheet.png"), rX, rY, 60, 110, 1);
	    // gameEngine.addEntity(swordyMcSwordface);
		// apply_AI_Wander(swordyMcSwordface);
	// }

	// for(var i = 0; i < 2; i++) {
		// rX = Math.floor(Math.random() * 800);
   		// rY = Math.floor(Math.random() * 600);
		// var largeMcSwordface = new Large_Skeleton_Melee(gameEngine, AM.getAsset("./img/skeleton_spritesheet.png"), rX, rY, 60, 25, 2);
	    // gameEngine.addEntity(largeMcSwordface);
	    // apply_AI_Wander(largeMcSwordface);
	// }

    console.log("All Done!");
	
});
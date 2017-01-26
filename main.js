var AM = new AssetManager();

// Begin download queue.
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/barbarian_spritesheet.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
	
	var background = new Background(gameEngine, AM.getAsset("./img/background.jpg"));
    gameEngine.addEntity(background);

	var barbarianPC = new CharacterPC(gameEngine, AM.getAsset("./img/barbarian_spritesheet.png"));
	barbarianPC.x = 200;
	barbarianPC.y = 200;
    gameEngine.addEntity(barbarianPC);
	
    console.log("All Done!");
	
});
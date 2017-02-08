window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
	this.level = null;
	this.x = 0;
	this.y = 0;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        return { x: x, y: y };
    }

    var that = this;

    // event listeners are added here

    this.ctx.canvas.addEventListener("click", function (e) {
        that.leftclick = getXandY(e);
		that.mouse_clicked_left = true;
		that.level.getTileFromPoint(that.leftclick.x, that.leftclick.y);
    }, false);
	
	this.ctx.canvas.addEventListener("mousedown", function (e) {
		that.mouse_down = true;
		that.mouse_anchor = getXandY(e);
    }, false);
	
	this.ctx.canvas.addEventListener("mouseup", function (e) {
		that.mouse_down = false;
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        that.rightclick = getXandY(e);
		that.mouse_clicked_right = true;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        that.mouse = getXandY(e);		
    }, false);

    this.ctx.canvas.addEventListener("mousewheel", function (e) {
        console.log(e);
        that.wheel = e;
        console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        console.log(e);
        console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {
		// var scrollSpeed = 5;
        // if (e.code === "KeyW") that.y += scrollSpeed;
		// if (e.code === "KeyA") that.x += scrollSpeed;
		// if (e.code === "KeyS") that.y -= scrollSpeed;
		// if (e.code === "KeyD") that.x -= scrollSpeed;
        console.log(e);
        console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        console.log(e);
        console.log("Key Up Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.setLevel = function (level) {
    console.log('set level');
    this.level = level;
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
		
	// Sort all entities by depth, so they can be drawn in the proper order.
	this.entities.sort(function (a, b) {
		return a.y - b.y;
		
	});

	for	(var iFloorCount = 0; iFloorCount < this.level.floor.length; iFloorCount++) {
		var tile = this.level.floor[iFloorCount];
		
		if	(tile.x + this.x > -120 && tile.x + this.x < SCREEN_WIDTH + 120 
			&& tile.y + this.y > -120 && tile.y + this.y < SCREEN_HEIGHT + 120) {
				this.ctx.drawImage(this.level.spritesheet,
					120 * tile.sprite_index, 0,
					120, 120,
					tile.x + this.x, tile.y + this.y,
					120, 120);
					
		}
		
	}

	var iWallCount = 0;
	var iEntityCount = 0;
	while	(true) {			
		if	(iEntityCount < this.entities.length && iWallCount < this.level.walls.length) {
			var tile = this.level.walls[iWallCount];
			var entity = this.entities[iEntityCount];
			
			if	(tile.y + 90 <= entity.y) {
				if	(tile.x + this.x > -120 && tile.x + this.x < SCREEN_WIDTH + 120 
						&& tile.y + this.y > -120 && tile.y + this.y < SCREEN_HEIGHT + 120) {
					this.ctx.drawImage(this.level.spritesheet,
								120 * tile.sprite_index, 0,
								120, 120,
								tile.x + this.x, tile.y + this.y,
								120, 120);
								
				}
							
				iWallCount++;
				
			} else {
				if	(entity.x + this.x > -120 && entity.x + this.x < SCREEN_WIDTH + 120 
						&& entity.y + this.y > -120 && entity.y + this.y < SCREEN_HEIGHT + 120) {
					entity.draw(this.ctx);
					
				}
				
				iEntityCount++;				
			
			}
			
		} else if (iWallCount < this.level.walls.length && iEntityCount >= this.entities.length) {
			this.ctx.drawImage(this.level.spritesheet,
								120 * tile.sprite_index, 0,
								120, 120,
								tile.x + this.x, tile.y + this.y,
								120, 120);
			iWallCount++;	
			
		} else if (iWallCount >= this.level.walls.length && iEntityCount < this.entities.length) {
			entity.draw(this.ctx);
			iEntityCount++;	
			
		} else {
			break;
			
		}
		
	}

    this.ctx.font = "bold 16px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("L-Click: Death Animation", 600, 20);
    this.ctx.fillText("R-Click: Move Player", 600, 36);
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        entity.update();
    }
		
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}
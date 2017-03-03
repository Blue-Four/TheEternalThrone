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

function GameEngine(objective_sprite_sheet, overlay_sprite) {
    this.entities = [];
    this.guielements = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
	this.level = null;
	this.x = 0;
	this.y = 0;
	this.objectives = new Objectives(this, objective_sprite_sheet);
    this.door = false;
	this.overlay_sprite = overlay_sprite;
    this.player = null;
	
	// Dialogue Variables
    this.in_dialogue = false;
    this.dialogue = null;
    this.former_x = 0;
    this.former_y = 0;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.gameVictory = false;	
    this.startInput();
	this.level.music.play();
	this.music_playing = true;
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
	that.digits = [false, false, false];

    // event listeners are added here

    this.ctx.canvas.addEventListener("click", function (e) {
        that.leftclick = getXandY(e);
		that.mouse_clicked_left = true;
		var tile = that.level.getTileFromPoint(that.leftclick.x - that.x, that.leftclick.y - that.y);
		// Checks to see if the mouse click was within 64 pixels of the PC.
		// If so, and the clicked tile happens to be a door, interact with it.
		if	((Math.sqrt(Math.pow((SCREEN_WIDTH / 2) - that.leftclick.x, 2) + Math.pow((SCREEN_HEIGHT / 2) - that.leftclick.y, 2))) < 64) {
			if (tile.type === "TYPE_DOOR_OPEN") {
				tile.type = "TYPE_DOOR_CLOSED";
				that.level.graph.grid[tile.xIndex][tile.yIndex].weight = 0;
                playDoorClose();
			} else if (tile.type === "TYPE_DOOR_CLOSED") {
				tile.type = "TYPE_DOOR_OPEN";
				that.level.graph.grid[tile.xIndex][tile.yIndex].weight = 1;
                playDoorOpen();
			} else if (tile.type === "TYPE_EXIT_CLOSED") {
				if	(that.playerKeys > 0) {
				tile.type = "TYPE_EXIT_OPEN";
				that.level.graph.grid[tile.xIndex][tile.yIndex].weight = 1;
                playDoorOpen();
                playVictory();
				}
                else playLocked();
			}
			
		}
    }, false);
	
	this.ctx.canvas.addEventListener("mousedown", function (e) {
		that.mouse_down = true;
        if(e.which == 1) {
            that.hold_left = true;
        }
		that.mouse_anchor = getXandY(e);
        //console.log("Click at " + e.x + " " + e.y);
    }, false);
	
	this.ctx.canvas.addEventListener("mouseup", function (e) {
		that.mouse_down = false;
        if(e.which == 1) {
            that.hold_left = false;
        }

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
        //console.log(e);
        that.wheel = e;
        //console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        //console.log(e);
        //console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {
        if (e.code === "KeyH") that.KeyH = true;
        if (e.code === "Digit1") that.digits[0] = true;
        if (e.code === "Digit2") that.digits[1] = true;
        if (e.code === "Digit3") that.digits[2] = true;
        //if (e.code === "Digit2") that.Digit2 = true;
		// var scrollSpeed = 5;
        //console.log(e);
        //console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
		
		if	(e.code === "KeyM") {
			if	(that.music_playing === true) {
				that.level.music.pause();
				that.music_playing = false;
			} else {
				that.level.music.play();
				that.music_playing = true;
			}
			
		}
		
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (e.code === "KeyH") that.KeyH = false;
        if (e.code === "Digit1") that.digits[0] = false;
        if (e.code === "Digit2") that.digits[1] = false;
        if (e.code === "Digit3") that.digits[2] = false;
        //console.log(e);
        //console.log("Key Up Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);

    if (entity instanceof CharacterPC) this.player = entity;
}

GameEngine.prototype.addGUIElement = function (guielement) {
    console.log('added gui element');
    this.guielements.push(guielement);
}

GameEngine.prototype.startDialogue = function (dialogue) {
	if	(!this.in_dialogue) {
		console.log('begin dialogue');
		this.guielements.push(dialogue);
		this.in_dialogue = true;
		
		this.dialogue = dialogue;
		this.former_x = this.x;
		this.former_y = this.y;
		
	}
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
				tile.draw();
					
		}
		
	}

	var iWallCount = 0;
	var iEntityCount = 0;
	while	(true) {
		if	(iEntityCount < this.entities.length && iWallCount < this.level.walls.length) {
			var tile = this.level.walls[iWallCount];
			var entity = this.entities[iEntityCount];
			
			if	(tile.y <= entity.y) {
				// If this tile is within the bounds of the screen...
				if	(tile.x + this.x > -120 && tile.x + this.x < SCREEN_WIDTH + 120 
						&& tile.y + this.y > -120 && tile.y + this.y < SCREEN_HEIGHT + 120) {
					tile.draw();
								
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
			var tile = this.level.walls[iWallCount];
			
			tile.draw();
								
			iWallCount++;	
			
		} else if (iWallCount >= this.level.walls.length && iEntityCount < this.entities.length) {
			var entity = this.entities[iEntityCount];
			
			entity.draw(this.ctx);
			iEntityCount++;	
			
		} else {
			break;
			
		}
		
	}
	
	for	(var i = 0; i < this.guielements.length; i++) {
		this.guielements[i].draw();
		
	}
	
	this.ctx.drawImage(this.overlay_sprite, -1, -1,
						SCREEN_WIDTH + 2, SCREEN_HEIGHT + 2);

	this.ctx.save();
	this.ctx.beginPath();
    this.ctx.font = "bold 18px Times New Roman";
    this.ctx.fillStyle = "#FF2d2d";    
    this.ctx.fillText("L-Click: Attack/Interact", SCREEN_WIDTH - 240, 40);
    this.ctx.fillText("R-Click: Move Player", SCREEN_WIDTH - 240, 60);
    this.ctx.fillText("H Key: Use Potion", SCREEN_WIDTH - 240, 80);
    this.ctx.fillText("M Key: Mute Music", SCREEN_WIDTH - 240, 100);
    this.ctx.fillText("Gold: " + this.playerGold, 20, 100);
    this.ctx.fillText("Potions: " + this.playerPotions, 20, 120);
    this.ctx.fillText("Keys: " + this.playerKeys, 20, 140);
    this.ctx.strokeStyle="#FFFFFF";
    this.ctx.rect(20,20,200,20);
    this.ctx.stroke();
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(20, 20, this.playerHealth * 2, 20);
    this.ctx.stroke();
    this.ctx.fillStyle = "blue";
    this.ctx.strokestyle ="#0000FF";
    this.ctx.rect(20, 50, 200, 20);
    this.ctx.fillRect(20, 50, this.playerExperience * 200, 20);
    this.ctx.stroke();
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Level " + this.playerLevel, 25, 65);
    //this.ctx.filRect(20, 100, this.)
	this.ctx.closePath();
    this.ctx.restore();
    if(this.playerHealth <= 0) {
        this.ctx.fillStyle = "red";
        this.ctx.font = "bold 96px Arial";
        this.ctx.fillText("YOU DIED", this.surfaceWidth/3, this.surfaceHeight/2);
    }
    if(this.gameVictory) {
        this.ctx.fillStyle = "#DDDD55";
        this.ctx.font = "bold 96px Arial";
        this.ctx.fillText("VICTORY!", this.surfaceWidth/3, this.surfaceHeight/2);
    }
	
	this.objectives.draw();
	
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        if (entity instanceof CharacterPC) {
                this.playerHealth = entity.health;
                this.playerGold = entity.inventory.gold;
                this.playerGold = entity.inventory.gold;
                this.playerLevel = entity.currentLevel;
                this.playerExperience = (entity.experience / entity.levels[this.playerLevel]);
                this.levelUp = entity.leveledUp;
                this.playerPotions = entity.inventory.health_potion;
                this.playerKeys = entity.inventory.key;
				
		}
		
        entity.update();
		
		if (entity.is_dead) {
			if	(!entity.deathflag) {
				entity.dateofdeath = new Date();
				entity.deathflag = true;
			}
			
			if	(new Date() - entity.dateofdeath > 5000) {
				console.log("testificate");
				this.entities.splice(i, 1);
				entitiesCount--;

			}
			
        }
		
	}
		
	if	(this.in_dialogue && 
		 Math.sqrt(Math.pow(this.y - this.former_y, 2), Math.pow(this.x - this.former_x)) > 64) {
		this.dialogue.destroy = true;
	}
		
	var iCount = 0;
	var elementsLength = this.guielements.length;
	while	(iCount < elementsLength) {
		this.guielements[iCount].update();
		
		if	(this.guielements[iCount].destroy) {
			if	(this.guielements[iCount] instanceof Dialogue) { this.in_dialogue = false; }
			this.guielements.splice(iCount, 1);
			elementsLength--;
		}
		
		iCount++;
		
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

function playDoorOpen() {
    var doorOpen = document.getElementById("door_open");
    doorOpen.loop = false;
    doorOpen.play();
}

function playDoorClose() {
    var doorClose = document.getElementById("door_close");
    doorClose.loop = false;
    doorClose.play();
}

function playPickup() {
    var pickupFX = document.getElementById("pickup");
    pickupFX.loop = false;
    pickupFX.play();
}

function playLocked() {
    var locked = document.getElementById("door_locked");
    locked.loop = false;
    locked.play();
}

function playVictory() {
    victorySound = document.getElementById("victory");
    victorySound.loop = false;
    victorySound.play();
}


//set which frame to start from and number of frames to select set to animate 
function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, 
                    loop, scale, startFrame) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
    this.startFrame = startFrame;
    this.facing = 0;
    this.state = 0;
    this.state_switched = false;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 (this.frameWidth * (this.startFrame % this.sheetWidth)) + xindex * this.frameWidth, 
                 (this.frameHeight * (this.startFrame / this.sheetWidth)) + yindex * this.frameHeight, 
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
};

Animation.prototype.currentFrame = function () {
	if	(this.state_switched === true) {
		this.state_switched = false;
		return 0;
	} else {
		return Math.floor(this.elapsedTime / this.frameDuration);	
	}	
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


function Zombie(game, spritesheet, x, y) {
	/*
	    4
	  3   5
	2       6
	  1   7
	    0
	*/
    this.animations = [];
    //walking animations
    this.animations['dir4'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 0.9, 76);
    this.animations['dir0'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 0.9, 220);
    this.animations['dir2'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 0.9, 4);
    this.animations['dir6'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 0.9, 148);
    this.animations['dir3'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 0.9, 40);
    this.animations['dir5'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 0.9, 112);
    this.animations['dir7'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 0.9, 184);
    this.animations['dir1'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 0.9, 256);

    //idle animations
    this.animations['idle0'] = new Animation(spritesheet, 128, 128, 36, 0.15, 4, true, 0.9, 216);
    this.animations['idle1'] = new Animation(spritesheet, 128, 128, 36, 0.15, 4, true, 0.9, 252);
    this.animations['idle2'] = new Animation(spritesheet, 128, 128, 36, 0.15, 4, true, 0.9, 0);
    this.animations['idle3'] = new Animation(spritesheet, 128, 128, 36, 0.15, 4, true, 0.9, 36);
    this.animations['idle4'] = new Animation(spritesheet, 128, 128, 36, 0.15, 4, true, 0.9, 72);
    this.animations['idle5'] = new Animation(spritesheet, 128, 128, 36, 0.15, 4, true, 0.9, 108);
    this.animations['idle6'] = new Animation(spritesheet, 128, 128, 36, 0.15, 4, true, 0.9, 144);
    this.animations['idle7'] = new Animation(spritesheet, 128, 128, 36, 0.15, 4, true, 0.9, 180);

/*    //death animations
    this.animations['death4'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 99);
    this.animations['death0'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 243);
    this.animations['death2'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 27);
    this.animations['death6'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 171);*/

    this.x = x;
    this.y = y;
    this.animation = this.animations['idle0'];
    this.speed = 110;
    this.game = game;
    this.ctx = game.ctx;
	
	// Movement
	this.is_moving = false;
	this.desired_x = x + 64;
	this.desired_y = y + 64;
	
}

Zombie.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x + this.game.x, this.y + this.game.y);
}

Zombie.prototype.update = function () {
	zombieMovement(this);
	
}


//handle zombie movement, adapted from handleMovement
function zombieMovement(character) {
	if	(character.is_moving === true) {
		var frameHalfSize = (character.animation.frameWidth / 2);
		var desired_movement_arc = calculateMovementArc(character.x + frameHalfSize, character.y + frameHalfSize,
											character.desired_x, character.desired_y);
		if	(Math.abs(character.x + frameHalfSize - character.desired_x) < 1 &&
			 Math.abs(character.y + frameHalfSize - character.desired_y) < 1) {
			character.x = character.desired_x - frameHalfSize;
			character.y = character.desired_y - frameHalfSize;
			var idle = "idle" + desired_movement_arc;
			character.animation = character.animations[idle];
			character.is_moving = false;
			character.animation.state_switched = true;
			
		} else {
			character.animation.state = 1;
		
			if	(desired_movement_arc !== character.animation.facing) {
				character.animation.state_switched = true;
				var dir = "dir" + desired_movement_arc;
				character.animation = character.animations[dir];
				character.animation.facing = desired_movement_arc;
				
			}
			
			var direction = Math.atan2(character.desired_y - (character.y + frameHalfSize),
										character.desired_x - (character.x + frameHalfSize));
			
			character.x += character.game.clockTick * character.speed * Math.cos(direction);
			character.y += character.game.clockTick * character.speed * Math.sin(direction) / 2;
			
		}
	
	}
	
}
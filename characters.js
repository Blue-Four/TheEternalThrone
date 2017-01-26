function AnimationCharacter(spriteSheet, frameSize, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
	
	// Caches a reversed version of the sprite-sheet, for animations facing from north-east to south-east.
    var offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = frameSize * 15;
    offscreenCanvas.height = frameSize * 25;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
	offscreenCtx.scale(-1, 1);
    offscreenCtx.drawImage(spriteSheet, frameSize * -15, 0);
    offscreenCtx.restore();
    this.spriteSheetReversed = offscreenCanvas;
	
    this.frameSize = frameSize;
    this.frameDuration = frameDuration;
	this.sheetWidth = frameSize * 15;
	this.sheetHeight = frameSize * 25;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
	
	/*
	    4
	  3   5
	2       6
	  1   7
	    0
	*/
	this.facing = 0;
	
	/*	Number	State
		0		Idle
		1		Moving
		2		Attacking
		3		Dying
		4		Corpse
	*/
	this.state = 0;
	
	// Switch this to true whenever the character should begin a new animation, such as a transition from moving to attacking.
	this.state_switched = false;
	
}

AnimationCharacter.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
	
    var frame = this.currentFrame();
    var source_x = 0;
    var source_y = 0;
	source_x = frame * this.frameSize;
	
	/*
	    4
	  3   5
	2       6
	  1   7
	    0
	*/
	
	// Code for calculating the correct sprites for the direction the character is facing.
	var direction = this.facing;
	if	(direction > 4) { direction = direction - (2 * (direction - 4)); }

	source_y = (direction * this.frameSize) + (this.state * this.frameSize * 5);

	if	(this.facing < 5) {
		ctx.drawImage(this.spriteSheet,
			 source_x, source_y,  // Source from the sprite sheet.
			 this.frameSize, this.frameSize,
			 x, y,
			 this.frameSize * this.scale,
			 this.frameSize * this.scale);
		
	} else {		
		ctx.drawImage(this.spriteSheetReversed,
			 (14 * this.frameSize) - source_x, source_y,  // Source from the sprite sheet.
			 this.frameSize, this.frameSize,
			 x, y,
			 this.frameSize * this.scale,
			 this.frameSize * this.scale);
		
	}

				 
}

AnimationCharacter.prototype.currentFrame = function () {
	if	(this.state_switched === true) {
		this.state_switched = false;
		
		return 0;
		
	} else {
		return Math.floor(this.elapsedTime / this.frameDuration);
		
	}
	
}

AnimationCharacter.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


// Basic PC
function CharacterPC(game, spritesheet) {
    this.animation = new AnimationCharacter(spritesheet, 120, 0.05, 15, true, 1);
    this.x = 0;
    this.y = 0;
    this.speed = 110;
    this.game = game;
    this.ctx = game.ctx;
	
	// Movement
	this.is_moving = false;
	this.desired_x = 60;
	this.desired_y = 60;
	
}

CharacterPC.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

CharacterPC.prototype.update = function () {
	if	(this.game.mouse_clicked_right) {
		this.desired_x = this.game.click.x;
		this.desired_y = this.game.click.y;
		
		this.is_moving = true;
		
		this.game.mouse_clicked_right = false;
		
	}
	handleMovement(this);
	
}


// Shared functionality

// Handles movement for all Characters. Should be called from the Character.update() function.
function handleMovement(character) {
	if	(character.is_moving === true) {
		var frameHalfSize = (character.animation.frameSize / 2);
		if	(Math.abs(character.x + frameHalfSize - character.desired_x) < 1 &&
			 Math.abs(character.y + frameHalfSize - character.desired_y) < 1) {
			character.x = character.desired_x - frameHalfSize;
			character.y = character.desired_y - frameHalfSize;
			character.is_moving = false;
			character.animation.state = 0;
			character.animation.state_switched = true;
			
		} else {
			character.animation.state = 1;
			
			// Tests to make sure the character is facing the appropriate direction.
			var desired_movement_arc = calculateMovementArc(character.x + frameHalfSize, character.y + frameHalfSize,
														character.desired_x, character.desired_y);
			if	(desired_movement_arc !== character.animation.facing) {
				character.animation.state_switched = true;
				character.animation.facing = desired_movement_arc;
				
			}
			
			var direction = Math.atan2(character.desired_y - (character.y + frameHalfSize),
										character.desired_x - (character.x + frameHalfSize));
			
			character.x += character.game.clockTick * character.speed * Math.cos(direction);
			character.y += character.game.clockTick * character.speed * Math.sin(direction) / 2;
			
		}
	
	}
	
}

// http://math.stackexchange.com/questions/796243/how-to-determine-the-direction-of-one-point-from-another-given-their-coordinate
function calculateMovementArc(current_x, current_y, desired_x, desired_y) {
	var direction = Math.atan2(current_y - desired_y, desired_x - current_x) - (Math.PI / 8);	
	if	(direction < 0) { direction += 2 * Math.PI; }
	
	if		(direction >= Math.PI / 2		&&		direction < 3 * Math.PI / 4) 		{ return 3; }
	else if	(direction >= 3 * Math.PI / 4	&&		direction < Math.PI) 				{ return 2; }
	else if	(direction >= Math.PI			&&		direction < 5 * Math.PI / 4) 		{ return 1; }
	else if	(direction >= 5 * Math.PI / 4	&&		direction < 3 * Math.PI / 2) 		{ return 0; }
	else if	(direction >= 3 * Math.PI / 2	&&		direction < 7 * Math.PI / 4) 		{ return 7; }
	else if	(direction >= 7 * Math.PI / 4) 												{ return 6; }
	else if	(direction < Math.PI / 4) 													{ return 5; }
	else if	(direction >= Math.PI / 4		&&		direction < Math.PI / 2) 			{ return 4; }
	else																				{ return 0; }
	
}
/*
function Path(x1, y1, x2, y2) {
	
	
	function 
	
}

Character.prototype.update = function () {
	if	(this.game.mouse_clicked) {
		this.desired_x = this.game.click.x;
		this.desired_y = this.game.click.y;
		
		console.log(this.desired_x);
		console.log(this.desired_y);
		
		this.is_moving = true;
		
		this.game.mouse_clicked = false;
		
	}
	handleMovement(this);
	
}
*/
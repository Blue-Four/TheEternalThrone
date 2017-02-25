function AnimationCharacter(spriteSheet, frameSize, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
	
	this.sheetWidth = frameSize * frames * 5;
	this.sheetHeight = frameSize * 5;
	this.frameSize = frameSize;
    this.frameDuration = frameDuration;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
	this.frames_state = [frames, frames, frames, frames, 1];
	
	// Caches a reversed version of the sprite-sheet, for animations facing from north-east to south-east.
    var offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = this.sheetWidth;
    offscreenCanvas.height = this.sheetHeight;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
	offscreenCtx.scale(-1, 1);
    offscreenCtx.drawImage(spriteSheet, 0 - this.sheetWidth, 0);
    offscreenCtx.restore();
    this.spriteSheetReversed = offscreenCanvas;
	
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
		if 	(this.loop) this.elapsedTime = 0;
		if	(this.state === 3) { this.state = 4; }
	}
	
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

	var frame = this.currentFrame();
    var source_x = 0;
    var source_y = 0;
	
	source_x = (frame + (this.frames_state[this.state] * direction)) * this.frameSize;
	source_y = this.frameSize * this.state;	
	
	// Set up to pull from the reversed sprite-sheet if the character is facing
	// directions North-east to South-east.
	if	(this.facing < 5) {
		sourceImage = this.spriteSheet;
	} else {
		sourceImage = this.spriteSheetReversed;
		source_x = this.sheetWidth - source_x - this.frameSize;
	}
	
	ctx.drawImage(sourceImage,
		 source_x, source_y,  // Source from the sprite sheet.
		 this.frameSize, this.frameSize,
		 x - (this.frameSize * this.scale / 2), y - (this.frameSize * this.scale / 2),
		 this.frameSize * this.scale,
		 this.frameSize * this.scale);

				 
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
    return (this.elapsedTime >= this.frameDuration * this.frames_state[this.state]);
}


// Basic Sprite
function BasicSprite(game, spritesheet, x, y, speed, scale) {
	this.animation = new AnimationCharacter(spritesheet, 120, 0.1, 15, true, scale);
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.game = game;
    this.ctx = game.ctx;
	this.collision_radius = 24;
	this.health = 100;
	
	// Movement
	this.is_moving = false;
	this.is_attack = false;
	this.is_dying = false;
	this.is_dead = false;

	//Combat
	this.damage_range = 10;

	// Flags
	this.is_aggro = false;
	this.was_aggro = false;

	this.desired_x = x;
	this.desired_y = y;
	this.end_x = x;
	this.end_y = y;
	this.moveNodes = [];
}

BasicSprite.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x + this.game.x, this.y + this.game.y);
}

BasicSprite.prototype.setHealth = function(health) {
	this.health = health;
}

BasicSprite.prototype.getHealth = function() {
	return this.health;
}

BasicSprite.prototype.update = function () {
	if (!this.is_dead) {
		// find Player in entities list
		for (i in this.game.entities) {
			if (this.game.entities[i] instanceof CharacterPC) {
				var player = this.game.entities[i];
				break;
			}
		}

		// Attack logic
		if(this.type === "ENEMY") {
			var isAggro = checkAggro(player, this);
			if(isAggro && !player.is_dead) {
				//disable AI wander so they don't change their mind
				disable_AI_Wander(this);
				this.desired_x = player.x;
				this.desired_y = player.y;
				//this.path_start = true;
				
				// Attack Player
				if (checkAttack(player, this)) {
					//this.is_moving = false;
					this.is_attack = true;
					if(checkDistance(player,this) > this.damage_range) {
						this.desired_x = player.x;
						this.desired_y = player.y;
						this.is_moving = true;
					}
				}
				if (checkDistance(player, this) < this.damage_range) {
					this.is_moving = false;
					if (player.health > 0) {
						player.health -= this.attack_power * 0.05;
						if (player.health <= 0) {
							player.health = 0;
							this.is_attack = false;
							killCharacter(player);
						}
					}

					// Attack Enemy
					if (player.game.hold_left) {
						// var desired_movement_arc = calculateMovementArc(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2	,
														// player.game.leftclick.x, player.game.leftclick.y);
						// console.log(desired_movement_arc);
						// player.animation.facing = desired_movement_arc;
						this.health -= player.attack_power * 0.05;
						if (this.health <= 0) {
							this.health = 0;
							killCharacter(this);
							//console.log("Gold: " + player.inventory.getGold());
							player.inventory.setGold(this.gold);
							player.experience += this.expGain;
							//console.log("Gold: " + player.inventory.getGold());
							if (this instanceof Large_Skeleton_Melee) {
								//console.log("Key: " + player.inventory.getKey());
								player.inventory.setKey(this.key);
								console.log("Key: " + player.inventory.getKey());
							}
						}
					}			
				}
				this.was_aggro = true;
			}
			else {
				this.is_moving = true;
				if (player.health < 100) player.heatlh += 5 * .025;
			}

			// Go back to wandering
			if (this.was_aggro) {
				enable_AI_Wander(this);
				this.was_aggro = false;
			}


		}

		// Player attack
		if (this.type === "PLAYER") {
			if (this.game.hold_left) {
				this.is_attack = true;
				this.is_moving = false;
			}
			else {
				this.is_attack = false;
				this.is_moving = true;
			}	
			if (this.game.Digit1) {
				if (this.health < 100 && this.inventory.health_potion > 0) {
					this.health += 25;
					if (this.health > 100) this.health = 100;
					this.inventory.health_potion -= 1;
				}
			}
		}

		// Death animation
		if(this.game.Digit2) {
			this.is_dying = true;
			this.animation.state = 3;
			this.is_dead = true;
			this.is_moving = false;
		} 
		else {
			if(!isAggro) getPath(this);
			handleMovement(this);
		}
	}
}

// BasicSprite.prototype.getNearestBoundingPoint = function (x, y) {
	// var point = Math.atan2(y - character.y, x - character.x);
	
	// var x_bound = Math.abs(this.x - this.collision_radius * Math.cos(direction));
	// var y_bound = Math.abs(this.y - this.collision_radius * Math.sin(direction) / 2);
	
	// return array = [x_bound, y_bound];
	
// }

// PC
function CharacterPC(game, spritesheet, x, y, offset, speed, scale) {
	BasicSprite.call(this, game, spritesheet, x, y, offset, speed, scale);
	this.type = "PLAYER";
	this.attack_power = 25;
	this.inventory = new Inventory();
	this.experience = 0;
	//xp needed to level
	this.levels = [0, 100, 200, 300, 500];
	this.currentLevel = 1;
}

CharacterPC.prototype = Object.create(BasicSprite.prototype);
CharacterPC.prototype.constructor = BasicSprite;

CharacterPC.prototype.update = function () {
	if	(!(this.is_dying || this.is_dead) && this.game.mouse_clicked_right) {
		this.end_x = this.game.rightclick.x;
		this.end_y = this.game.rightclick.y;
		this.path_start = true;
		this.game.mouse_clicked_right = false;	
	}
	if(this.experience >= this.levels[this.currentLevel]) {
		this.leveledUp = true;
		this.currentLevel++;
		this.experience = 0;
		this.attack_power += Math.floor(this.attack_power * .1);
	}
	
	getPath(this);
	//check if PC is dead in update
	BasicSprite.prototype.update.call(this);
	
	// If the player finds the exit door, complete the associated objective.
	if	(this.game.level.getTileFromPoint(this.x, this.y).type === "TYPE_EXIT_OPEN") {
		this.game.objectives.complete(objective_findexit);
	}
	
	this.game.x = SCREEN_WIDTH / 2 - this.x;
	this.game.y = SCREEN_HEIGHT / 2 - this.y;
	
}



// ====================================
//            E N E M I E S
// ====================================

// Enemy Melee Skeleton
function Enemy_Skeleton_Melee(game, spritesheet, x, y, offset, speed, scale) {
	BasicSprite.call(this, game, spritesheet, x, y, offset, speed, scale);
	this.animation.frames_state[0] = 7;
	this.animation.frames_state[2] = 10;
	this.animation.frames_state[3] = 10;
	this.type = "ENEMY";
	this.attack_power = 5;
	this.gold = Math.floor((Math.random() * 25) + 10);
	this.expGain = 25;
}

Enemy_Skeleton_Melee.prototype = Object.create(BasicSprite.prototype);
Enemy_Skeleton_Melee.prototype.constructor = BasicSprite;

// Enemy Large Melee Skeleton
function Large_Skeleton_Melee(game, spritesheet, x, y, offset, speed, scale) {
	BasicSprite.call(this, game, spritesheet, x, y, offset, speed, scale);
	this.animation.frames_state[0] = 7;
	this.animation.frames_state[2] = 10;
	this.animation.frames_state[3] = 10;
	this.type = "ENEMY";
	this.attack_power = 10;
	this.damage_range = 20;
	this.gold = Math.floor((Math.random() * 100) + 50);
	this.expGain = 50;
}

Large_Skeleton_Melee.prototype = Object.create(BasicSprite.prototype);
Large_Skeleton_Melee.prototype.constructor = BasicSprite;


// GORGANTHOR THE DEFILER
function GORGANTHOR(game, spritesheet, x, y, offset, speed, scale) {
	BasicSprite.call(this, game, spritesheet, x, y, offset, speed, 2);
	this.animation.frames_state[0] = 7;
	this.animation.frames_state[2] = 10;
	this.animation.frames_state[3] = 10;
	this.type = "ENEMY";
	this.attack_power = 10;
	this.damage_range = 20;
	this.gold = Math.floor((Math.random() * 100) + 200);
	this.key = 1;
	this.objective_complete = false;
	
}

GORGANTHOR.prototype = Object.create(Large_Skeleton_Melee.prototype);
GORGANTHOR.prototype.constructor = BasicSprite;

GORGANTHOR.prototype.draw = function() {
	BasicSprite.prototype.draw.call(this);
	
	if	(!(this.is_dead || this.is_dying)) {
		this.ctx.save();
		this.ctx.font = "italic bold 10px Times New Roman";
		this.ctx.fillStyle = "#FF0000";
		this.ctx.fillText("GORGANTHOR THE DEFILER",
					this.x + this.game.x - 65, this.y + this.game.y - 65);		
		this.ctx.restore();
		
	}
	
}

GORGANTHOR.prototype.update = function() {
	BasicSprite.prototype.update.call(this);
	
	// If Gorganthor dies, complete its objective.
	if	(this.objective_complete === false &&
		 this.is_dead === true) {
		this.game.objectives.complete(objective_killgorganthor);
		this.objective_complete = true;
	}
	
}


// ====================================
//             A L L I E S
// ====================================


// Basic Villager
function Ally_Villager(game, spritesheet, x, y, offset, speed, scale) {
	BasicSprite.call(this, game, spritesheet, x, y, offset, speed, scale);
	this.type = "ALLY";
}

Ally_Villager.prototype = Object.create(BasicSprite.prototype);
Ally_Villager.prototype.constructor = BasicSprite;


// ====================================
//   S H A R E D   F U N C T I O N S
// ====================================


// Handles movement for all Characters. Should be called from the Character.update() function.
function handleMovement(character) {
	if	(character.is_moving === true) {
		if	(Math.abs(character.x - character.desired_x) < 5 &&
			 Math.abs(character.y - character.desired_y) < 5) {
			character.x = character.desired_x;
			character.y = character.desired_y;
			character.is_moving = false;
			character.animation.state = 0;
			character.animation.state_switched = true;			
		} 
		else {
			character.animation.state = 1;

			
			// Tests to make sure the character is facing the appropriate direction.
			var desired_movement_arc = calculateMovementArc(character.x, character.y,
														character.desired_x, character.desired_y);
			if	(desired_movement_arc !== character.animation.facing) {
				character.animation.state_switched = true;
				character.animation.facing = desired_movement_arc;
				
			}
			
			var direction = Math.atan2(character.desired_y - (character.y),
										character.desired_x - (character.x));
			
			character.x += character.game.clockTick * character.speed * Math.cos(direction);
			character.y += character.game.clockTick * character.speed * Math.sin(direction) / 2;
			
		}
	
	}
	// Attack animation
	if (!(character.is_dying || character.is_dead) && character.is_attack === true){
		character.animation.state = 2;
		character.is_attack = false;
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

function getPath(character) {
	if	(character.path_start === true) {
		var start = character.game.level.getTileFromPoint(character.x, character.y);
		var end = character.game.level.getTileFromPoint(character.end_x - character.game.x, character.end_y - character.game.y);
		if(isNaN(end.xIndex) || isNaN(end.yIndex)) {
			return;
		}
		character.moveNodes = character.game.level.findPath(start.xIndex, start.yIndex, end.xIndex, end.yIndex);
		//console.log(character.moveNodes.toString());
		
		if	(end.isWalkable === true) {
			var node = character.moveNodes.shift();
			if(typeof node == 'undefined') {
				return;
			}
			//console.log(node);
			var coords = character.game.level.getPointFromTile(node.x, node.y);
			//console.log(coords);
			character.desired_x = coords[0];
			character.desired_y = coords[1];
			character.is_moving = true;
			
		}
		
		character.path_start = false;
		
	} else if (character.moveNodes.length > 0 && distanceFromNode(character) < 10) {
		var node = character.moveNodes.shift();
		//console.log(node);
		var coords = character.game.level.getPointFromTile(node.x, node.y);
		character.desired_x = coords[0];
		character.desired_y = coords[1];
		character.is_moving = true;
		
	}
	
}

function distanceFromNode(character) {
	var x = Math.abs(character.x - character.desired_x);
	var y = Math.abs(character.y - character.desired_y);
	var distance = Math.sqrt(x*x + y*y);
	return distance;
}

//set aggro range in this function(in pixels)
function checkAggro(character, entity) {
	var aggroRange = 90;
	var aggro = false;
	var distance = checkDistance(character, entity);
	if(distance < aggroRange) {
		//console.log("Aggro distance: " + distance);
		aggro = true;
	}
	return aggro;
}

function checkAttack(character, entity) {
	var attackRange = 25;
	var attack = false;
	var distance = checkDistance(character, entity);
	if (distance < attackRange) attack = true;
	return attack;
}

function checkDistance(character, entity) {
	var x = Math.abs(character.x - entity.x);
	var y = Math.abs(character.y - entity.y);
	var distance = Math.sqrt(x*x + y*y);
	return distance;
}

function killCharacter(character) {	
	character.is_moving = false;
	character.is_dying = true;
	character.animation.state = 3;
	character.is_dead = true;	
} 
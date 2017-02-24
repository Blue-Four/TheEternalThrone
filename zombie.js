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
    if  (this.state_switched === true) {
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

    //death animations
    this.animations['death4'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 99);
    this.animations['death0'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 243);
    this.animations['death2'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 27);
    this.animations['death6'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 171);

    //animation
    this.x = x;
    this.y = y;
    this.animation = this.animations['idle0'];
    this.collision_radius = 24;
    this.speed = 110;
    this.game = game;
    this.ctx = game.ctx;
    this.frameSize = 128;

    //Combat
    this.damage_range = 10;
    this.type = "ENEMY";
    this.attack_power = 5;
    this.health = 100;
    this.gold = 10;

    // Flags
    this.is_aggro = false;
    this.was_aggro = false;
    
    // Movement
    this.is_moving = false;
    this.is_attack = false;
    this.is_dying = false;
    this.is_dead = false;
    this.desired_x = x;
    this.desired_y = y;
    this.end_x = x;
    this.end_y = y;
    this.moveNodes = [];
    
}

Zombie.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, 
            this.ctx, this.x + this.game.x - this.frameSize/2, this.y + this.game.y - this.frameSize/2 - 15);
}

Zombie.prototype.update = function () {
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
                this.path_start = true;
                
                // Attack Player
                if (checkAttack(player, this)) {
                    //this.is_moving = false;
                    this.is_attack = true;
                }
                if (checkDistance(player, this) < this.damage_range) {
                    this.is_moving = false;
                    if (player.health > 0) {
                        player.health -= this.attack_power * 0.05;
                        if (player.health <= 0) {
                            player.health = 0;
                            this.attack = false;
                            killCharacter(player);
                        }
                    }

                    // Attack Enemy
                    if (player.game.mouse_down) {
                        this.health -= player.attack_power * 0.05;
                        console.log(this.health);
                        if (this.health <= 0) {
                            this.health = 0;
                            killCharacter(this);
                            player.inventory.setGold(this.gold);
                            player.experience += this.expGain;
                            if (this instanceof Large_Skeleton_Melee) {
                                player.inventory.setKey(this.key);
                            }
                        }
                    }           
                }
                this.was_aggro = true;
            }
            else {
                this.is_moving = true;
                if (player.health < 100) player.heatlh += 5 * .025
            }

            // Go back to wandering
            if (this.was_aggro) {
                enable_AI_Wander(this);
                this.was_aggro = false;
            }


        }

        // Player attack
        if (this.type === "PLAYER") {
            if (this.game.mouse_down) {
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
            this.animation = this.animations['death0'];
            this.is_dead = true;
            this.is_moving = false;
        } 
        else {
            getPath(this);
            zombieMovement(this);
        }
    }
}



//handle zombie movement, adapted from handleMovement
function zombieMovement(character) {
    if  (character.is_moving === true) {
        //var frameHalfSize = (character.animation.frameWidth / 2);
        var desired_movement_arc = calculateMovementArc(character.x, character.y,
                                            character.desired_x, character.desired_y);
        if  (Math.abs(character.x - character.desired_x) < 1 &&
             Math.abs(character.y - character.desired_y) < 1) {
            character.x = character.desired_x;
            character.y = character.desired_y;
            var idle = "idle" + desired_movement_arc;
            character.animation = character.animations[idle];
            character.is_moving = false;
            character.animation.state_switched = true;
            
        } else {
            character.animation.state = 1;
        
            if  (desired_movement_arc !== character.animation.facing) {
                character.animation.state_switched = true;
                var dir = "dir" + desired_movement_arc;
                character.animation = character.animations[dir];
                character.animation.facing = desired_movement_arc;
                
            }
            
            var direction = Math.atan2(character.desired_y - (character.y),
                                        character.desired_x - (character.x));
            
            character.x += character.game.clockTick * character.speed * Math.cos(direction);
            character.y += character.game.clockTick * character.speed * Math.sin(direction) / 2;
            
        }
    
    }
    
}

function killCharacter(character) { 
    character.is_moving = false;
    character.is_dying = true;
    character.animation = character.animations['death0'];
    character.is_dead = true;   
} 
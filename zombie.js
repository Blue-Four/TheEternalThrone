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
    this.animations['death4'] = new Animation(spritesheet, 128, 128, 36, 5, 1, true, 0.9, 107);
    this.animations['death0'] = new Animation(spritesheet, 128, 128, 36, 5, 1, true, 0.9, 251);
    this.animations['death2'] = new Animation(spritesheet, 128, 128, 36, 5, 1, true, 0.9, 35);
    this.animations['death6'] = new Animation(spritesheet, 128, 128, 36, 5, 1, true, 0.9, 179);
    this.animations['death3'] = new Animation(spritesheet, 128, 128, 36, 5, 1, true, 0.9, 71);
    this.animations['death5'] = new Animation(spritesheet, 128, 128, 36, 5, 1, true, 0.9, 143);
    this.animations['death7'] = new Animation(spritesheet, 128, 128, 36, 5, 1, true, 0.9, 215);
    this.animations['death1'] = new Animation(spritesheet, 128, 128, 36, 5, 1, true, 0.9, 251);

    //attack animations
    // this.animations['attack4'] = new Animation(spritesheet, 128, 128, 36, 0.15, 10, true, 0.9, 84);
    // this.animations['attack0'] = new Animation(spritesheet, 128, 128, 36, 0.15, 10, true, 0.9, 228);
    // this.animations['attack2'] = new Animation(spritesheet, 128, 128, 36, 0.15, 10, true, 0.9, 12);
    // this.animations['attack6'] = new Animation(spritesheet, 128, 128, 36, 0.15, 10, true, 0.9, 156);
    // this.animations['attack3'] = new Animation(spritesheet, 128, 128, 36, 0.15, 10, true, 0.9, 48);
    // this.animations['attack5'] = new Animation(spritesheet, 128, 128, 36, 0.15, 10, true, 0.9, 120);
    // this.animations['attack7'] = new Animation(spritesheet, 128, 128, 36, 0.15, 10, true, 0.9, 192);
    // this.animations['attack1'] = new Animation(spritesheet, 128, 128, 36, 0.15, 10, true, 0.9, 264);

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
    this.expGain = 25;
    this.gold = Math.floor((Math.random() * 25) + 10);

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

    //Sound
    this.zombieSound = document.getElementById("zombie");
    this.zombieDeathSound = document.getElementById("zombie_death");

    //Set Player
    this.player = game.player;
    
}

Zombie.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, 
            this.ctx, this.x + this.game.x - this.frameSize/2, this.y + this.game.y - this.frameSize/2 - 15);
}

Zombie.prototype.update = function () {
    if (!this.is_dead) {
        
        // Attack logic
        if(this.type === "ENEMY") {
            var isAggro = checkAggro(this.player, this);
            if(isAggro && !this.player.is_dead) {
                //disable AI wander so they don't change their mind
                disable_AI_Wander(this);
                this.desired_x = this.player.x;
                this.desired_y = this.player.y;
                this.is_moving = true;
                //this.path_start = true;
                
                // Attack Player
                if (checkAttack(this.player, this)) {
                    this.is_attack = true;
                    //var attackAnim = 'attack' + this.desired_movement_arc;
                    //this.animation = this.animations[attackAnim];
                }
                if (checkDistance(this.player, this) < this.damage_range) {
                    this.is_moving = false;
                    if (this.player.health > 0) {
                        this.player.health -= this.attack_power * 0.05;
                        this.playZombie();
                        if (this.player.health < 50 && !this.player.help_played) {
                            this.player.playHelp();
                            this.player.help_played = true;
                        }
                        if (this.player.health <= 0) {
                            this.player.health = 0;
                            this.is_attack = false;
                            killCharacter(this.player);
                            this.player.playPCDeath();
                        }
                    }

                    // Attack Enemy
                    if (this.player.game.mouse_down) {
                        this.health -= this.player.attack_power * 0.05;
                        //console.log(this.health);
                        if (this.health <= 0) {
                            this.health = 0;
                            killZombie(this);
                            this.playZombieDeath();
                            this.player.inventory.setGold(this.gold);
                            this.player.inventory.playCoin();
                            this.player.experience += this.expGain;
                        }
                    }           
                }
                this.was_aggro = true;
            }
            else {
                this.is_moving = true;
                if (this.player.health < 100) this.player.heatlh += 5 * .025
            }

            // Go back to wandering
            if (this.was_aggro) {
                enable_AI_Wander(this);
                this.was_aggro = false;
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
            //if (!isAggro) getPath(this);
            zombieMovement(this);
        }
    }
}

Zombie.prototype.playZombie = function() {
    this.zombieSound.loop = false;
    this.zombieSound.play();
}

Zombie.prototype.playZombieDeath = function() {
    this.zombieDeathSound.loop = false;
    this.zombieDeathSound.play();
}

//handle zombie movement, adapted from handleMovement
function zombieMovement(character) {
    if  (character.is_moving === true) {
        //var frameHalfSize = (character.animation.frameWidth / 2);
        this.desired_movement_arc = calculateMovementArc(character.x, character.y,
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

function killZombie(character) { 
    character.is_moving = false;
    character.is_dying = true;
    var deathAnim = "death" + this.desired_movement_arc;
    character.animation = character.animations[deathAnim];
    character.is_dead = true;   
} 
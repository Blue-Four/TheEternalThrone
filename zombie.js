"use strict";
//var AM = new AssetManager();
//var gameEngine;
//var ctx;
var zombies = [];
var debugDraw = false;
//var animations = [];

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
    this.animations = [];
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
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

//get distance between two collision radiis
function distance(a, b) {
    var dx = (a.collX) - (b.collX);
    var dy = (a.collY) - (b.collY);
    return Math.sqrt(dx * dx + dy * dy);
}

function SpawnZombie(canvasW, canvasH, gameEngine) {
    var zombie = new Zombie(gameEngine, AM.getAsset("./img/zombie.png"));
/*    ZombieDirection(zombie);
    zombie.x = Math.floor(Math.random() * canvasW);
    zombie.y = Math.floor(Math.random() * canvasH);
    zombie.speed = Math.floor(Math.random() * (100) + 60);*/
    //console.log("X  and Y Coord:" + zombie.x + ", " zombie.y);
    //console.log("Zombie direction/speed: " + zombie.direction + "/" + zombie.speed);
    gameEngine.addEntity(zombie);
}

function ZombieDirection(zombie) {
    var dir = Math.floor(Math.random() * (4));
    switch(dir) {
        case 0:
            zombie.direction = 'u';
            zombie.animation = zombie.animations['upW'];
            break;
        case 1:
            zombie.direction = 'r';
            zombie.animation = zombie.animations['rightW'];
            break;
        case 2:
            zombie.direction = 'd';
            zombie.animation = zombie.animations['downW'];
            break;
        case 3:
            zombie.direction = 'l';
            zombie.animation = zombie.animations['leftW'];
            break;
        default:
            console.log("ZombieDirection Error");

    }
}

function SwitchDirections() {
    for(var i = 0; i < zombies.length; i++) {
        ZombieDirection(zombies[i]);
    }
}

function Zombie(game, spritesheet) {
    this.animations = [];
    this.animations['upW'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 1, 76);
    this.animations['downW'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 1, 220);
    this.animations['leftW'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 1, 4);
    this.animations['rightW'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 1, 148);

    this.animations['upDeath'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 99);
    this.animations['downDeath'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 243);
    this.animations['leftDeath'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 27);
    this.animations['rightDeath'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, false, 1, 171);

    ZombieDirection(this);
    this.x = Math.floor(Math.random() * 800);
    this.y = Math.floor(Math.random() * 600);
    this.speed = Math.floor(Math.random() * (100) + 60);

    this.radius = 16;
    this.deltaCenterX = 64;
    this.deltaCenterY = 80;
    this.health = 20;
    this.game = game;
    this.ctx = game.ctx;
}

Zombie.prototype = new Entity();
Zombie.prototype.constructor = Zombie;
Zombie.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Zombie.prototype.playDeathAnimation = function (direction) {
    if(direction === 'r') this.animation = this.animations['rightDeath'];
    if(direction === 'l') this.animation = this.animations['leftDeath'];
    if(direction === 'u') this.animation = this.animations['upDeath'];
    if(direction === 'd') this.animation = this.animations['downDeath'];
};

Zombie.prototype.update = function () {
    this.collX = this.x + this.deltaCenterX;
    this.collY = this.y + this.deltaCenterY;

    for(var i = 0; i < zombies.length; i++) {
        var ent = zombies[i];
        if(ent != this && this.collide(ent) && ent.health > 0) {
            ZombieDirection(ent);
            ent.health--;
            this.health--;
            console.log("Health: " + this.health);
        }
    }
    if(this.health <= 0) {
        this.playDeathAnimation(this.direction);
    } else {
        if(this.direction === 'r') this.x += this.game.clockTick * this.speed;
        if(this.direction === 'l') this.x -= this.game.clockTick * this.speed;
        if(this.direction === 'u') this.y -= this.game.clockTick * this.speed;
        if(this.direction === 'd') this.y += this.game.clockTick * this.speed;
    }
/*    if(this.direction === 'r') this.x += this.game.clockTick * this.speed;
    if(this.direction === 'l') this.x -= this.game.clockTick * this.speed;
    if(this.direction === 'u') this.y -= this.game.clockTick * this.speed;
    if(this.direction === 'd') this.y += this.game.clockTick * this.speed;*/
    //have zombie wrap around to other side of canvas when it walks off the screen 
    if (this.x > 804) this.x = -128;
     else if (this.x < -128) this.x = 804;
    if (this.y > 664) this.y = -128;
     else if (this.y < -128) this.y = 600;
    Entity.prototype.update.call(this);
}

Zombie.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

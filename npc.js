"use strict";

//set which frame to start from and number of frames to select set to animate 
function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, 
                    loop, scale, startX, startY) {
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
    this.startX = startX;
    this.startY = startY;
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


function NPCDirection(theNPC) {
    var dir = Math.floor(Math.random() * (4));
    switch(dir) {
        case 0:
            theNPC.direction = 'u';
            theNPC.animation = theNPC.animations['upI'];
            break;
        case 1:
            theNPC.direction = 'r';
            theNPC.animation = theNPC.animations['rightI'];
            break;
        case 2:
            theNPC.direction = 'd';
            theNPC.animation = theNPC.animations['downI'];
            break;
        case 3:
            theNPC.direction = 'l';
            theNPC.animation = theNPC.animations['leftI'];
            break;
        default:
            console.log("NPCDirection Error");

    }
}

function NPC(game, spritesheet) {
    this.animations = [];
    this.animations['upI'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 1, 76);
    this.animations['downI'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 1, 220);
    this.animations['leftI'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 1, 4);
    this.animations['rightI'] = new Animation(spritesheet, 128, 128, 36, 0.15, 8, true, 1, 148);
    this.animations['appear'] = 
    this.animations['smoke'] = 

    //spawn in random location facing random direction
    NPCDirection(this);
    this.x = Math.floor(Math.random() * 800);
    this.y = Math.floor(Math.random() * 600);

    this.game = game;
    this.ctx = game.ctx;
}

NPC.prototype = new Entity();
NPC.prototype.constructor = NPC;
NPC.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

NPC.prototype.update = function () {
}

Zombie.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

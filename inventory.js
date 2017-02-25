function Inventory() {
	this.gold = 100;
	this.key = 0;
	this.sword = "Bronze";
	this.health_potion = 2;
	this.mana_potion = 2;
	this.potionSound = document.getElementById("potion");
	this.coinSound = document.getElementById("coin");
	this.pickupSound = document.getElementById("pickup");
}

Inventory.prototype.playPotion = function() {
    this.potionSound.loop = false;
    this.potionSound.play();
}

Inventory.prototype.playCoin = function() {
    this.coinSound.loop = false;
    this.coinSound.play();
}

Inventory.prototype.playPickup = function() {
    this.pickupSound.loop = false;
    this.pickupSound.play();
}

Inventory.prototype.getGold = function() {
	return this.gold;
}

Inventory.prototype.setGold = function(amount) {
	this.gold += amount;
}

Inventory.prototype.getKey = function() {
	return this.key;
}

Inventory.prototype.setKey = function(amount) {
	this.key += amount;
}

Inventory.prototype.getSword = function() {
	return this.sword;
}

Inventory.prototype.setSword = function(sword) {
	this.sword = sword;
}

Inventory.prototype.getHealthPotion = function() {
	return this.health_potion;
}

Inventory.prototype.setHealthPotion = function(amount) {
	this.health_potion += amount;
}

Inventory.prototype.getManaPotion = function() {
	return this.health_potion;
}

Inventory.prototype.setManaPotion = function(amount) {
	this.health_potion += amount;
}

// A visual representation of a potion in the game world.
function HealthPotion(game, sprite, x, y, player) {
    this.x = x;
    this.y = y;
    this.game = game;
    this.ctx = game.ctx;
	this.sprite = sprite;
	this.exists = true;
	this.player = player;
}

HealthPotion.prototype.draw = function () {
    if	(this.exists) { this.ctx.drawImage(this.sprite, this.x - 9 + this.game.x, this.y - 9 + this.game.y) };
}

HealthPotion.prototype.update = function () {
	if (this.game.mouse_down) {
		if	(this.exists &&
			Math.sqrt(Math.pow(this.x + this.game.x - this.game.mouse_anchor.x, 2) + Math.pow(this.y  + this.game.y - this.game.mouse_anchor.y, 2)) < 24 &&
			Math.sqrt(Math.pow((SCREEN_WIDTH / 2) - this.x - this.game.x, 2) + Math.pow((SCREEN_HEIGHT / 2) - this.y - this.game.y, 2)) < 64) {
			var player;
			console.log("Update");
			
			this.player.inventory.setHealthPotion(1);
			this.exists = false;
			
		}
		
	}
}
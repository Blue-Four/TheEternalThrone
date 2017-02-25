function Inventory() {
	this.gold = 100;
	this.key = 0;
	this.sword = "Bronze";
	this.health_potion = 1;
	this.mana_potion = 2;
}

}

}

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
// =======================
// === D I A L O G U E ===
// =======================

function dialogue_storefront(game) {
	var startingNode = new DialogueNode("My potions are too expensive for you, traveller! You cannot afford my potions!", function() {});
		
		var child_0 = new DialogueNode("But potion seller, I'm going into battle! *offer 50 GP*", function() {});
			// If player has enough gold, let them buy a potion. If not, tell them no.
			if	(game.player.inventory.gold >= 50) {
				var parent_1_0 = new DialogueNode("Very well. I suppose I can spare one potion.", function() {
					game.player.inventory.gold -= 50;
					game.player.inventory.health_potion += 1;
				});				
				var child_1_0 = new DialogueNode("Delicious!", function() {});
				parent_1_0.addChild(child_1_0);
				
				child_0.addChild(parent_1_0);
			} else {
				var parent_1_1 = new DialogueNode("You cannot afford my potions, traveller!", function() { return 0; }, function() {});
				var child_1_0 = new DialogueNode("Forsooth!", function() { return 0; }, function() {});
				parent_1_1.addChild(child_1_0);
				
				child_0.addChild(parent_1_1);
			}
			
		startingNode.addChild(child_0);
		

		var child_1 = new DialogueNode("Then I shall take my business elsewhere.", function() {});
		startingNode.addChild(child_1);
	var dialogue = new Dialogue(game, startingNode);
	return dialogue;
	
}

function Dialogue(game, startingNode) {
	this.game = game;
	this.ctx = game.ctx;
	this.currentNode = startingNode;
	this.destroy = false;
	this.text1 = "";
	this.text2 = "";
	this.option_transition = false;
	this.choice = 0;
	
}

Dialogue.prototype.draw = function() {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.lineWidth = 8;
	this.ctx.strokeStyle = '#000000';
	this.ctx.rect(SCREEN_WIDTH / 6 + 2, SCREEN_HEIGHT * 4 / 5 - 13, SCREEN_WIDTH * 4 / 6 - 4, SCREEN_HEIGHT / 5) - 4;
	this.ctx.stroke();
	this.ctx.closePath();
	
	this.ctx.beginPath();
	this.ctx.lineWidth = 5;
	this.ctx.strokeStyle = '#848383';
	this.ctx.rect(SCREEN_WIDTH / 6, SCREEN_HEIGHT * 4 / 5 - 15, SCREEN_WIDTH * 4 / 6, SCREEN_HEIGHT / 5);
	this.ctx.stroke();
	this.ctx.closePath();
	
	this.ctx.beginPath();
	this.ctx.rect(SCREEN_WIDTH / 6 + 5, SCREEN_HEIGHT * 4 / 5 - 10, SCREEN_WIDTH * 4 / 6 - 10, SCREEN_HEIGHT / 5 - 10);
	this.ctx.fillStyle = '#3a3a3a';
	this.ctx.fill();
	this.ctx.closePath();
	
	this.ctx.font = "bold 18px Times New Roman";
	this.ctx.fillStyle = "#FFFFFF";
	
	this.ctx.fillText(this.text1, SCREEN_WIDTH / 6 + 160, SCREEN_HEIGHT * 4 / 5 + 10);
	this.ctx.fillText(this.text2, SCREEN_WIDTH / 6 + 160, SCREEN_HEIGHT * 4 / 5 + 30);
	
	if	(this.text1.length + this.text2.length === this.currentNode.text.length) {
		for	(var iChild = 0; iChild < this.currentNode.children.length; iChild++) {
			if	(this.game.digits[iChild]) { this.ctx.fillStyle = "#DDDD55"; }
			else { this.ctx.fillStyle = "#FF2d2d"; }
			this.ctx.fillText((iChild + 1) + ") " + this.currentNode.children[iChild].text, 
							SCREEN_WIDTH / 6 + 170, SCREEN_HEIGHT * 4 / 5 + 55 + (iChild * 25));
			
		}
		
	}
	
	this.ctx.closePath();
	this.ctx.restore();
}

Dialogue.prototype.update = function() {
	// Set text variables a character at a time.
	if	(this.text1.length + this.text2.length < this.currentNode.text.length) {
		if	(this.text1.length < 80 || this.text1.charAt(this.text1.length - 1) !== ' ') {
			this.text1 = this.currentNode.text.substring(0, this.text1.length + 1);
		} else {
			this.text2 = this.currentNode.text.substring(this.text1.length, this.text1.length + this.text2.length + 1);
		}
	// If all text has been set, start listening for choices.
	} else if (!this.option_transition) {
		if	(this.game.digits[0] && 0 < this.currentNode.children.length) {
			this.option_transition = true;
			this.choice = 0;
			
		} else if (this.game.digits[1] && 1 < this.currentNode.children.length) {
			this.option_transition = true;
			this.choice = 1;
			
		} else if (this.game.digits[2] && 2 < this.currentNode.children.length) {
			this.option_transition = true;
			this.choice = 2;
			
		}
	// If a choice has been made, transition to the appropriate subnode, 
	// or close the dialogue if no such node exists.
	} else {
		this.option_transition = false;
		if	(this.currentNode.funct !== null) { this.currentNode.funct(); }
		if	(this.currentNode.children[this.choice].is_end) { this.destroy = true; }
		else { this.currentNode = this.currentNode.children[this.choice].children[0]; }
		this.text1 = "";
		this.text2 = "";
		
	}
	
}


function DialogueNode(text, funct) {
	this.text = text;
	this.children = [];
	this.parent;
	this.is_end = true;
	this.cond_return = 0;
	this.funct = funct;
}

DialogueNode.prototype.addChild = function(childNode) {
	childNode.parent = this;
	this.children.push(childNode);
	this.is_end = false;
}
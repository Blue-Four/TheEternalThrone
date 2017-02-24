// Test objectives
var objective_killgorganthor = ["KILL_GORGANTHOR", "Kill Gorganthor the Defiler"];
var objective_findexit = ["FIND_EXIT", "Find the Exit"];

// An entity for holding the player's objectives.
function Objectives(game, spritesheet) {
	this.game = game;
	this.objectives = [];
	this.spritesheet = spritesheet;
}

// Adds the given objective.
Objectives.prototype.add = function(objective) {
	objective.push(false);
	objective.push(new Date());
	this.objectives.push(objective);
	
}

// Completes an objective, removing it from the list.
Objectives.prototype.complete = function(objective) {
	var id = objective[0];
	
	for	(var count = 0; count < this.objectives.length; count++) {
		if	(this.objectives[count][0] === id) {
			if	(this.objectives[count][2] === false) {
				this.objectives[count][2] = true;
				this.objectives[count][3] = new Date();
				break;
			
			}
			
		}
		
	}
	
}

// Draws all objective text to the screen.
Objectives.prototype.draw = function() {
	var ctx = this.game.ctx;
	// Save context so this function doesn't mess with others too badly.
	ctx.save();
	
	// Fancy gold font.
	ctx.font = "bold 12px Times New Roman";
	ctx.fillStyle = "#DDDD55";
	
	for	(var count = 0; count < this.objectives.length; count++) {	
		// Draw the objective icon.
		ctx.drawImage(this.spritesheet,
						SCREEN_WIDTH - 240,
						(SCREEN_HEIGHT / 4) - 15 + (30 * count),
						21, 21);
		
		// Calculate the time difference since this objective was last changed.
		var timeDifference = new Date() - this.objectives[count][3];
		
		// If this objective was completed, print "Objective Complete!"
		if	(this.objectives[count][2] === true) {
			if	(timeDifference < 5000) {
				var alpha = 1;
				if (timeDifference > 3000) { alpha -= (timeDifference - 3000) / 2000; }
				ctx.fillStyle = "rgba(0, 255, 0, " + alpha + ")";
				ctx.fillText("Objective Complete!",
							SCREEN_WIDTH - 353, 
							(SCREEN_HEIGHT / 4) + (30 * count));
				
				// Print a nice red-text objective to show completion.
				ctx.fillStyle = "#FF2222";
				ctx.fillText(this.objectives[count][1],
					SCREEN_WIDTH - 210, 
					(SCREEN_HEIGHT / 4) + (30 * count));
					
			} else {
				// If the objective has reached the end of its completion fadeout timer, remove it.
				this.objectives.splice(count, 1);
				
			}
			
		} else { // If this objective is not in the process of being removed...
			// If this objective was added within the last five seconds, print "New Objective!"
			if	(timeDifference < 5000) {
				var alpha = 1;
				if (timeDifference > 3000) { alpha -= (timeDifference - 3000) / 2000; }
				ctx.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
				ctx.fillText("New Objective!",
							SCREEN_WIDTH - 327, 
							(SCREEN_HEIGHT / 4) + (30 * count));
			ctx.fillStyle = "#DDDD55";
		}
			// Print a gold-text objective.
			ctx.fillStyle = "#DDDD55";
			ctx.fillText(this.objectives[count][1],
					SCREEN_WIDTH - 210, 
					(SCREEN_HEIGHT / 4) + (30 * count));
			
		}
		
	}
	
	// Restore the context to its previous state.
	ctx.restore();
	
}
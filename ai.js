function apply_AI_Wander(character) {
	character.ai_active = true;
	
	var interval = setInterval(function () {
		if	(character.ai_active) {
			character.desired_x = character.desired_x + Math.floor(Math.random() * 100) - 50;
			character.desired_y = character.desired_y + Math.floor(Math.random() * 100) - 50;
			if (character.is_dying || character.is_dead) character.is_moving = false;
			else character.is_moving = true;
			
		} else {
			clearInterval(interval);
			
		}
	
			
	}, 5000 + (Math.floor(Math.random() * 2000) - 1000));
	
}
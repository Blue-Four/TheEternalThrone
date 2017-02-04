function apply_AI_Wander(character) {
	character.ai_active = true;
	
	var interval = setInterval(function () {
		if	(character.ai_active) {
			character.desired_x = character.desired_x + Math.floor(Math.random() * 100) - 50;
			character.desired_y = character.desired_y + Math.floor(Math.random() * 100) - 50;
			character.is_moving = true;
			
		} else {
			clearInterval(interval);
			
		}
	
			
	}, 5000 + (Math.floor(Math.random() * 2000) - 1000));
	
}

// function PathNode(x, y) {
	// this.x = x;
	// this.y = y;
	// this.next = null;
	
// }

// function findPath(startX, startY, endX, endY, walkableTerrain) {
	// var x = Math.round(startX / 48)	* 48;
	// var y = Math.round(startX / 24)	* 24;
	// var start_node = new PathNode(x, y);
	
	
	
	// return start_node;
	
// }

// function mapWalkability(image, image_x, image_y) {
    // var offscreenCanvas = document.createElement('canvas');
    // offscreenCanvas.width = image_x;
    // offscreenCanvas.height = image_y;
    // var offscreenCtx = offscreenCanvas.getContext('2d');
    // offscreenCtx.save();
    // offscreenCtx.drawImage(image, 0, 0);
    // offscreenCtx.restore();
	
	// var pixels = offscreenCtx.getImageData(0, 0, image_x, image_y).data;
	
	// var overArray = new Array();
	
	// for	(var outer_count = 0; outer_count < image_x; outer_count++) {
		// overArray[outer_count] = new Array();
		
		// for	(var inner_count = 0; inner_count < (image_y * 2); inner_count++) {
			// overArray[outer_count][inner_count] = ;
			
		// }
		
		
	// }
	
// }

// Calculates the percentage of opaque pixels within a single, 48 by 24 square.
function computeSquare(pixel_data, x, y, image_width, image_height) {
	var opaquePixels = 0;
	var sensitivity = 1;
	
	for	(var currentX = x; currentX < x + 48; currentX = currentX + sensitivity) {
		for	(var currentY = y; currentY < y + 24; currentY = currentY + sensitivity) {
			if	(pixel_data[(currentX + (currentY * image_width)) * 4 + 3] === 255) { opaquePixels++; }
			
		}
		
	}
	
	return opaquePixels / (1152 / sensitivity);
	
}
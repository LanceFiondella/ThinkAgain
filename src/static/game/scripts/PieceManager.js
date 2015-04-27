//Piece manager handles all the pieces on the play area. Addition, removal etc.
function PieceManager(){
	this._piece_list=[];
	this._total_pieces=0;
	this._num_steps=0;
	this.nPosX=160;
	this.nPosY=160;
	this.currentColumn=0;
	this.currentRow=0;
	this.conclusion_piece_number=null;
	//This array keeps track of the x position of the largest piece in each column
	this.col_x_positions = new Array();
	this.col_x_positions.push(0);

	this.addedSolvedPieces = [];
	};


	PieceManager.prototype.addPiece = function(st_list){
		cp = ClausePiece(st_list, this._total_pieces);
		cp.x = cp.homeX = this.nPosX;
		cp.y = cp.homeY = this.nPosY;

		
		//console.log("In add Piece : " + this.nPosX + " " + this.nPosY)
		//cp.piece_num = this._total_pieces;
        this.getMatchingPiecesPositions(cp);
		
		/*
		var piece_num_text = new createjs.Text(cp.piece_num, "30px Arial","red");
		piece_num_text.x = 20;
		cp.addChild(piece_num_text);
		*/

		this._piece_list.push(cp);
		this._total_pieces++;
		
		cp.scaleX = 0.2;
		cp.scaleY = 0.2;
		cp.cache(cp.getBounds().x-2,cp.getBounds().y-2,cp.width+4,cp.height+4);
		play_area.addChild(cp);

		
		
		
		//Animate the new piece
			createjs.Tween.get(cp).to({scaleX: 0.2, scaleY: 0.2}).to({scaleX: 1, scaleY: 1}, 250);
			createjs.Sound.play("bubble");
			
			//Check if new piece satisfies conclusion
			if (cp.keys.length == 0){
				
				//alert("You win!");
				el = document.getElementById("overlay");
				el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
				
			}
		
			
		this.nextPiecePosition();
		this.adjustPieces();
		return cp;
		
	};
	
	PieceManager.prototype.showPiece = function(st_list, piece_num){
		cp = ClausePieceShape(st_list, piece_num);
		//cp.regX = (cp.keys.length*100)/2;
		//cp.regY = 50;
		cp.x = this.nPosX;
		cp.y = this.nPosY;
		//console.log(this.nPosX + " " + this.nPosY)
		return cp;
	};
	
	PieceManager.prototype.getAllPieceValues = function(){
		var result = []
		var this_piece_list_length = this._piece_list.length;
		for(var i =0;i<this_piece_list_length;i++){
			result.push(this._piece_list[i].keys);
		}
		return result;
	};
	
	//Add the piece to the specified container
	PieceManager.prototype.displayPiece = function(container,piece_num){
		container.addChild(this._piece_list[piece_num]);
	};
	
	PieceManager.prototype.displayAllPieces = function(container){
		var this_piece_list_length = this._piece_list.length;
		for(var i =0;i<this_piece_list_length;i++){
			console.log("Displaying peice = " + i);
			container.addChild(this._piece_list[i]);
		}
		return container;
	};
	
	PieceManager.prototype.setConclusion =  function(st_list){
		this._conclusion = st_list;
		cp = ClausePiece(st_list);
		createjs.Tween.get(cp,{loop:true}).to({scaleX: 0.7, scaleY: 0.7},500).to({scaleX: 1.1, scaleY: 1.1},500).to({scaleX: 1, scaleY: 1},500);
		cp.piece_num = this._total_pieces;
		this.conclusion_piece_number = this._total_pieces;
		var piece_num_text = new createjs.Text(cp.piece_num, "30px Arial","red");
		cp.x = cp.homeX = this.nPosX;
		cp.y = cp.homeY = this.nPosY;
		this.nextPiecePosition();
		this.getMatchingPiecesPositions(cp);
        
        
		piece_num_text.x = 20;
		cp.addChild(piece_num_text);
		this._piece_list.push(cp);
		this._total_pieces++;
		cp.cache(cp.getBounds().x,cp.getBounds().y,cp.width,cp.height);
		return cp;
	};
	
	PieceManager.prototype.nextPiecePosition =  function(){
		if (this.currentRow == 9){
			this.nPosX = 320*(this.currentColumn +1) + 160;
			this.nPosY = 160;
			this.currentRow = 0;
			this.currentColumn++;
			this.col_x_positions.push(0);
			console.log("Col_x_pos = " + this.col_x_positions);
		}
		else{
			this.currentRow++;
			this.nPosY = 120*(this.currentRow + 1) + 50;
		}
	};
	
	PieceManager.prototype.getMatchingPieces =  function(selectedPiece){
		result = [];
		var this_piece_list_length = this._piece_list.length;
		for(var i =0;i<this_piece_list_length;i++){
			if(this.negationPresent(selectedPiece,this._piece_list[i])){
				result.push(this._piece_list[i]);
			}
			
		}
		return result;
	};
    
    PieceManager.prototype.getMatchingPiecesPositions =  function(selectedPiece){
        
		var this_piece_list_length = this._piece_list.length;
		for(var i =0;i<this_piece_list_length;i++){
			if(this.negationPresent(selectedPiece,this._piece_list[i]) && selectedPiece.piece_num != i){
				selectedPiece.matching[i] = true;
                this._piece_list[i].matching[selectedPiece.piece_num] = true;
			}
            else{
                selectedPiece.matching[i] = false;
                this._piece_list[i].matching[selectedPiece.piece_num] = false;
            }
			
		}
		//selectedPiece.matching[selectedPiece.piece_num] = true;
        
    };
    
	
	PieceManager.prototype.getAllPieces =  function(){
		result = [];
		var this_piece_list_length = this._piece_list.length;
		for(var i =0;i<this_piece_list_length;i++){
			result.push(this._piece_list[i]);
		}
		return result;
	};
	
	PieceManager.prototype.getPiece = function(piece_num){
		
		return this._piece_list[piece_num];
	};
	
	PieceManager.prototype.negationPresent = function(p1,p2){
		//Checks if only one negation is present in piece 1 and piece 2
		var result = false;
		var num_negations = 0;
		var p1_keys_length = p1.keys.length;
		var p2_keys_length = p2.keys.length;
		
		for(var i = 0; i < p1_keys_length; i++){
			for(var j = 0; j < p2_keys_length; j++){
				//console.log(p1.keys[i] + " " + -1*p2.keys[j]);
				if (p1.keys[i] == -1*p2.keys[j]){
					//console.log("Found negation!")
					num_negations++;
					
					//break;
				}

			}
		}			
		
		if (num_negations==1){
			result = true;
		}
		
		return result;
	};


	PieceManager.prototype.popPiece = function(){
			//cp = pm._piece_list.splice(piece_num,1)[0];
			cp = pm._piece_list.pop();
			pm._total_pieces--;
			play_area.removeChild(cp);
			
			var res1 = res[res.length-1].split(',');
			console.log(res1);
			
			pm._piece_list[parseInt(res1[0])].matching[parseInt(res1[1])] = true;
			pm._piece_list[parseInt(res1[1])].matching[parseInt(res1[0])] = true;


			var this_piece_list_length = this._piece_list.length;
			for(var i =0;i<this_piece_list_length;i++){
					delete this._piece_list[i].matching[cp.piece_num];
			}

			if (this.currentRow == 0){
				this.currentRow = 9;
				this.currentColumn--;
				this.nPosX = 320*(this.currentColumn +1) - 160;
				this.nPosY = 120*(this.currentRow + 1) + 50;
				
		}
		else{
			this.currentRow--;
			this.nPosY = 120*(this.currentRow + 1) + 50;
			
		}
			res.pop();
			game_state.saved_steps.pop();
			this.adjustPieces();

	};
	

	PieceManager.prototype.checkPiece = function(st_list){
		//This function checks if the piece passed to this function exists in the _piece_list. Accepts an array of integers representing the piece
		var result = false;
		for (var i =0; i< this._piece_list.length; i++){
                if(arraysEqual(st_list,this._piece_list[i].keys)){
                	result = true;
                	break;
                }
        }
		return result;
	};


	PieceManager.prototype.adjustPieces = function(){
		//Experimental function to adjust the spacing between pieces row wise ONLY. Columns are aligned by looking at the col_x_positions array.

		//Minimum space between each piece
		var min_space = 100;
		
		var biggest_spacing = 0;
		for(var currCol = 1; currCol <= this.currentColumn; currCol++){
			biggest_spacing = 0;
			for(var currRow =0; currRow < 10; currRow++){
				if (currCol == this.currentColumn && currRow == this.currentRow)
						break;
				else{	
						var spacing = pm._piece_list[(currCol-1)*10+currRow].x + (pm._piece_list[(currCol-1)*10+currRow].width/2) + min_space + (pm._piece_list[currCol*10+currRow].width/2);
					 	if (spacing > biggest_spacing){
					 		biggest_spacing = spacing;
					 		console.log("Biggest spacing = " + biggest_spacing);
					 		//this.col_x_positions[currCol] = spacing;
					 	}
					}
				}
				this.col_x_positions[currCol] = biggest_spacing;
			}

			
			console.log(this.col_x_positions);
			for(var i =10; i< this._total_pieces; i++)
				{
					//console.log("Col x pos " + this.col_x_positions[Math.floor(i/10)]);
					//pm._piece_list[i].x = pm._piece_list[i].homeX = this.col_x_positions[Math.floor(i/10)];
					pm._piece_list[i].homeX = this.col_x_positions[Math.floor(i/10)];
					createjs.Tween.get(pm._piece_list[i]).to({x: pm._piece_list[i].homeX, y: pm._piece_list[i].homeY}, 500, createjs.Ease.elasticOut);

				}

				

		};


	




	

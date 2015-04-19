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
	};


	PieceManager.prototype.addPiece = function(st_list){
		cp = ClausePiece(st_list);
		cp.x = cp.homeX = this.nPosX;
		cp.y = cp.homeY = this.nPosY;
		this.nextPiecePosition();
		console.log("In add Piece : " + this.nPosX + " " + this.nPosY)
		cp.piece_num = this._total_pieces;
        this.getMatchingPiecesPositions(cp);
		
		
		var piece_num_text = new createjs.Text(cp.piece_num, "30px Arial","red");
		piece_num_text.x = 20;
		cp.addChild(piece_num_text);
		this._piece_list.push(cp);
		this._total_pieces++;
		
		cp.scaleX = 0.2;
		cp.scaleY = 0.2;
		
		play_area.addChild(cp);
		
		
		//Animate the new piece
			createjs.Tween.get(cp).to({scaleX: 0.2, scaleY: 0.2}).to({scaleX: 1, scaleY: 1}, 1000, createjs.Ease.bounceOut);
			createjs.Sound.play("bubble");
			
			//Check if new piece satisfies conclusion
			if (cp.keys.length == 0){
				
				//alert("You win!");
				el = document.getElementById("overlay");
				el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
				
			}
		
		
		return cp;
		
	};
	
	PieceManager.prototype.showPiece = function(st_list, piece_num){
		cp = ClausePieceShape(st_list, piece_num);
		cp.regX = (cp.keys.length*100)/2;
		cp.regY = 50;
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
		//createjs.Tween.get(cp,{loop:true}).to({scaleX: 0.7, scaleY: 0.7},500).to({scaleX: 1.1, scaleY: 1.1},500).to({scaleX: 1, scaleY: 1},500);
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
		return cp;
	};
	
	PieceManager.prototype.nextPiecePosition =  function(){
		if (this.currentRow == 9){
			
			
			this.nPosX = 320*(this.currentColumn +1) + 160;
			
			this.nPosY = 160;
			this.currentRow = 0;
			this.currentColumn++;
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


	

	

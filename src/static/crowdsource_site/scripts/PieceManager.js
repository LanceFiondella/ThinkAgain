//Piece manager handles all the pieces on the play area. Addition, removal etc.
var PieceManager = {
	_piece_list:[],
	_total_pieces:0,
	_num_steps:0,
	nPosX:160,
	nPosY:160,
	currentColumn:0,
	currentRow:0,
	conclusion_piece_number:null,
	
	addPiece:function(st_list){
		cp = ClausePiece(st_list);
		cp.x = cp.homeX = this.nPosX;
		cp.y = cp.homeY = this.nPosY;
		this.nextPiecePosition();
		
		cp.piece_num = this._total_pieces;
        this.getMatchingPiecesPositions(cp);
		
		
		var piece_num_text = new createjs.Text(cp.piece_num, "40px Arial","black");
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
		
	},
	
	getAllPieceValues:function(){
		var result = []
		for(var i =0;i<this._piece_list.length;i++){
			result.push(this._piece_list[i].keys);
		}
		return result;
	},
	
	//Add the piece to the specified container
	displayPiece:function(container,piece_num){
		container.addChild(this._piece_list[piece_num]);
	},
	
	displayAllPieces:function(container){
		for (var i = 0; i< this._piece_list.length; i++){
			console.log("Displaying peice = " + i);
			container.addChild(this._piece_list[i]);
		}
		return container;
	},
	
	setConclusion: function(st_list){
		this._conclusion = st_list;
		cp = ClausePiece(st_list);
		createjs.Tween.get(cp,{loop:true}).to({scaleX: 0.7, scaleY: 0.7},500).to({scaleX: 1.1, scaleY: 1.1},500).to({scaleX: 1, scaleY: 1},500);
		cp.piece_num = this._total_pieces;
		this.conclusion_piece_number = this._total_pieces;
		var piece_num_text = new createjs.Text(cp.piece_num, "40px Arial","black");
		cp.x = cp.homeX = this.nPosX;
		cp.y = cp.homeY = this.nPosY;
		this.nextPiecePosition();
		this.getMatchingPiecesPositions(cp);
        
        
		piece_num_text.x = 20;
		cp.addChild(piece_num_text);
		this._piece_list.push(cp);
		this._total_pieces++;
		return cp;
	},
	
	nextPiecePosition: function(){
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
		
	},
	
	getMatchingPieces: function(selectedPiece){
		result = [];
		for(var i=0; i < this._piece_list.length; i++){
			if(this.negationPresent(selectedPiece,this._piece_list[i])){
				result.push(this._piece_list[i]);
			}
			
		}
		return result;
	},
    
    getMatchingPiecesPositions: function(selectedPiece){
        
		for(var i=0; i < this._piece_list.length; i++){
			if(this.negationPresent(selectedPiece,this._piece_list[i])){
				selectedPiece.matching[i] = true;
                this._piece_list[i].matching[selectedPiece.piece_num] = true;
			}
            else{
                selectedPiece.matching[i] = false;
                this._piece_list[i].matching[selectedPiece.piece_num] = false;
            }
			
		}
		selectedPiece.matching[selectedPiece.piece_num] = true;
        
    },
    
	
	getAllPieces: function(){
		result = [];
		for (var i=0; i< this._piece_list.length;i++){
			result.push(this._piece_list[i]);
		}
		return result;
	},
	
	getPiece: function(piece_num){
		
		return this._piece_list[piece_num];
	},
	
	negationPresent: function(p1,p2){
		var result = false;
		var num_negations = 0;
		for(var i = 0; i < p1.keys.length; i++){
			for(var j = 0; j < p2.keys.length; j++){
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
	},
};

	

	

//Piece manager handles all the pieces on the play area. Addition, removal etc.
function PieceManager(){
	this._initial_length=0;
	this._piece_list=[];
	this._total_pieces=0;
	this._num_steps=0;
	this.nPosX=160;
	this.nPosY=78;
	this.currentColumn=0;
	this.currentRow=0;
	this.conclusion_piece_number=null;
	this.new_piece_borders = [];
	//This array keeps track of the x position of the largest piece in each column
	this.col_x_positions = new Array();
	this.col_x_positions.push(160);

	this.addedSolvedPieces = [];
	this.panelList = {};
	this.panelListLength = 0;
	//Current length of a column
	this.column_length = 10;

	this.currentKeyHash = {};
	};

	/**
	*Change the alpha of non matching peices
	*@param {ClausePiece} selectedPiece - Piece that is clicked 
	*/
	PieceManager.prototype.tweenMatchingPieces = function(selectedPiece){
	    //console.log("tweenMatchingPieces function`");
		//Sets alpha of matching pieces to 1, everything else is 0.0
	    allPieces = this.getAllPieces();
	    for(k in selectedPiece.matching){
	        if (selectedPiece.matching[k]){
	            //allPieces[k].alpha = 1.0;
	            allPieces[k].visible = true;
	        }
	        else{
	            //allPieces[k].alpha = 0.0;
	            allPieces[k].visible = false;
	        }
	        
	    }

	};

	/**
	*Triggers when a piece is added to the board
	*1) JSON object representing the new piece sent to server
	*2) Add a green border to the new piece
	*3) Remove repeated results and verify the result, server side
	* @param {ClausePiece} piece - Solution piece that is clicked
	*/
	PieceManager.prototype.addedSolvedPiece = function(piece){
		//This function triggers when a solved piece on the board is clicked
		new_piece = this.addPiece(piece.keys);
		piece.parent1.matching[piece.parent2.pieceNum] = false;
        piece.parent2.matching[piece.parent1.pieceNum] = false;
        this._num_steps++;
        
        p1_json = {};
        p1_json.pn = piece.parent1.piece_num;
        p1_json.pk = piece.parent1.keys;

        p2_json = {};
        p2_json.pn = piece.parent2.piece_num;
        p2_json.pk = piece.parent2.keys;

        parents = {};
        parents ["p1"] = p1_json;
        parents ["p2"] = p2_json;

        step = {};
        step ["pn"] = new_piece.piece_num;
        step ["pk"] = new_piece.keys;

        step["t"] = this.coreGame.trackTime;
        step ["parents"] = parents;
        step["ip"] = sessionStorage.ipaddress;
		step["username"] = sessionStorage.getItem("username");
        this.coreGame.gameState.savedSteps.push(step);
		
		
        //Sending step data to server

        this.coreGame.sendStep(step);

        //res.push(this.parent1.piece_num+","+this.parent2.piece_num+","+new_piece.piece_num);
        piece.parent2.visible = true;
        piece.parent2.alpha = 0.3;
        piece.visible = false;


        //Adding a green border around a newly placed piece
        np_border = new createjs.Shape();
        np_border.graphics.setStrokeStyle(5).beginStroke("green").drawRoundRect(50,0, new_piece.width-2, new_piece.height-2,20);
        this.new_piece_borders.push(np_border);
        new_piece.addChild(np_border);
        
        //Adjusting the widths of removed piece
        piece.parent2.width = piece.parent2.getBounds().width;

        //Recalculate all solved pieces again. This is to remove repeated results from the board
        this.coreGame.resetBoard();
        this.tweenMatchingPieces(piece.parent1);
        this.replaceWithSolvedPiecesAlternate(piece.parent1);
		//this.addPiece(new_piece);

        //Check if new piece satisfies conclusion
        if (new_piece.keys.length == 0){
            this.verifyWin();

            }

	};

	/**
	* Replace all the pieces on the board with the results of resolution with the selected piece
	* @param {ClausePiece} selectedPiece - Piece that is clicked
	*/
	PieceManager.prototype.replaceWithSolvedPieces = function(selectedPiece){
		this.temp_piece_list = [];
		//console.log(this._total_pieces)
		for(i=0;i < this._total_pieces;i++){
			if (i != selectedPiece.pieceNum)
				this._piece_list[i].visible = false;
		}
	
		
		for(k in selectedPiece.matching){
	        if (selectedPiece.matching[k] && !this.checkPiece(selectedPiece.matchingSolutions[k])){
	            var new_keys = selectedPiece.matchingSolutions[k];
	            //console.log("New keys = " + new_keys);       
	            cp = new game.ClausePiece(new_keys, this._piece_list[k].pieceNum, selectedPiece, this._piece_list[k]);
	            //Experimental code may want to add it to a separate function
	            this._piece_list[k].width = cp.width;
	            //End experiment
	            //cp.x = allPieces[k].homeX;
	            cp.x = this._piece_list[k].homeX;
	            cp.y = this._piece_list[k].homeY;
	            cp.coreGame = this.coreGame;
	            //this.playArea.addChild(cp);
	            this.panelList[this._piece_list[k].keys.length].displayPiece(cp);
	            this.addedSolvedPieces.push(cp);
	        }
        }
	};

	
	/**
	* Instead of replacing the pieces at the same position, this function places the result in the appropriate panel
	*
	*/
	PieceManager.prototype.replaceWithSolvedPiecesAlternate = function(selectedPiece){
		this.temp_piece_list = [];
		//console.log(this._total_pieces)
		for(i=0;i < this._total_pieces;i++){
			if (i != selectedPiece.pieceNum)
				this._piece_list[i].visible = false;
		}
	
		
		for(k in selectedPiece.matching){
	        if (selectedPiece.matching[k] && !this.checkPiece(selectedPiece.matchingSolutions[k])){
	            var new_keys = selectedPiece.matchingSolutions[k];
	            //console.log("New keys = " + new_keys);       
	            cp = new game.ClausePiece(new_keys, this._piece_list[k].pieceNum, selectedPiece, this._piece_list[k]);
	            //Experimental code may want to add it to a separate function
	            //this._piece_list[k].width = cp.width;
	            //End experiment
	            //cp.x = allPieces[k].homeX;
	            cp.x = this._piece_list[k].homeX;
	            cp.y = this._piece_list[k].homeY;
	            cp.coreGame = this.coreGame;
	            //this.playArea.addChild(cp);
	            if(cp.keys.length in this.panelList){
	            	this.panelList[cp.keys.length].addTempPiece(cp);
	            }
	            else{
	            	this.addPanel(cp,true);
	            }
	            this.addedSolvedPieces.push(cp);
	        }
        }
        this.arrangePanels();
	}


	/**
	* This function ONLY solves the two pieces and returns an ARRAY for the new piece.
	* @param {ClausePiece} p1 - First clause/piece to be resolved
	* @param {ClausePiece} p2 - Second clause/piece to be resolved
	* @return {Array} new_keys - Array of the resolution of the 2 pieces 
	*/
	PieceManager.prototype.solveValues = function(p1,p2){
    	//console.log("solveValues function");
		var num_negations = 0;
        var p1_keys = p1.keys.slice();
        var p2_keys = p2.keys.slice();
		var p1_keys_length = p1_keys.length;
		var p2_keys_length = p2_keys.length;
        for(var i = 0; i < p1_keys_length; i++){
			for(var j = 0; j < p2_keys_length; j++){
                if(p1_keys[i] == -1*p2_keys[j]){
                    delete p1_keys[i];
                    delete p2_keys[j];
                    num_negations++;
                }
                else if(p1_keys[i] == p2_keys[j]){
                    delete p1_keys[i];
                }
            }
        }
        var new_keys = [];
        if(num_negations == 1){
            new_keys = p1_keys.concat(p2_keys).filter(Number);
            new_keys.sort();
        }
        return new_keys;
	};


	/**
	*Add piece to the board
	*@param {Array} st_list - List of integers that represents a clause
	*/
	PieceManager.prototype.addPiece = function(st_list){
		if (!(st_list.toString() in this.currentKeyHash)){
		//console.log("PieceManager.prototype.addPiece function");
    	cp = new game.ClausePiece(st_list, this._total_pieces);
		cp.x = cp.homeX = this.nPosX;
		cp.y = cp.homeY = this.nPosY;
        this.getMatchingPiecesPositions(cp);
		this._piece_list.push(cp);
		this._total_pieces++;
		cp.scaleX = 0.2;
		cp.scaleY = 0.2;
		//Animate the new piece
		createjs.Tween.get(cp).to({scaleX: 0.2, scaleY: 0.2}).to({scaleX: 1, scaleY: 1}, 250);
		createjs.Sound.play("bubble");
		this.nextPiecePosition();
		cp.coreGame = this.coreGame;
		console.log("Panel list length = " + (cp.keys.length in this.panelList));
		if(cp.keys.length in this.panelList){
					this.panelList[cp.keys.length].addPiece(cp)
				}
				else{
					this.addPanel(cp,false);
				}
		this.currentKeyHash[st_list.toString()] = true;
		return cp;
		}
		
	};


	/**
	*Remove piece from the panel
	*@param {ClausePiece} piece - The piece to be removed
	* 
	*/
	PieceManager.prototype.removePiece = function(piece){
		//var keyLength = piece.keys.length;
		panel = piece.parent;
		panel.removeChild(piece);
	}

	PieceManager.prototype.resetPanels = function(){
		for (k in this.panelList) {
			this.panelList[k].tempNPosY = 75;
			this.panelList[k].tempNPosX = (this.panelList[k].pieceLength*100+100)/2;
		}
	}

	/**
	*Adds a new panel based on the size of the supplied piece
	*@param - {ClausePiece} cp - Piece for which the new panel is to be created
	*@param - {Bool} temp - To indicate whether the piece to be added is temporary or permanent
	*/
	PieceManager.prototype.addPanel = function(cp,temp){
		keyLength = cp.keys.length;
		var panel = new game.PiecePanel(keyLength);
		this.coreGame.playArea.addChild(panel);
		if (!temp){
		this.panelList[keyLength] = panel;
		this.panelList[cp.keys.length].addPiece(cp);
		this.panelListLength += 1;
		}
		else{
			this.panelList[keyLength] = panel;
		this.panelList[cp.keys.length].addTempPiece(cp);
		this.panelListLength += 1;

		}
		
	};

	/**
	*Arranges the panels based on the piece length and the size of the previous panel
	*
	*/
	PieceManager.prototype.arrangePanels = function(){
		pieceSizes = [];
		for (k in this.panelList) {
			if (this.panelList.hasOwnProperty(k))
				pieceSizes.push(parseInt(k));
		}

		pieceSizes.sort(this.coreGame.sortNumber);
		//console.log("Piecesizes = " + pieceSizes);
		len = pieceSizes.length;
		this.panelList[pieceSizes[0]].x = 0;
		for(var i=1;i < len;i++){
			//console.log(this.panelList[pieceSizes[i-1]].x + " + " + this.panelList[pieceSizes[i-1]].getBounds().width);
			this.panelList[pieceSizes[i]].x = this.panelList[pieceSizes[i-1]].x + this.panelList[pieceSizes[i-1]].getBounds().width;
		}
	}

	/**
	*Adjust the size of the panel based on zoom level and the number of pieces in the panel (Needs work)
	*@param {float} zoomVal - Current value of the zoom
	*/
	PieceManager.prototype.adjustPanelSize = function(zoomVal){
		pieceSizes = [];
		for (k in this.panelList) {
			if (this.panelList.hasOwnProperty(k))
				pieceSizes.push(parseInt(k));
		}
		pieceSizes.sort(this.coreGame.sortNumber);
		len = pieceSizes.length;

		for(var i=0;i<len;i++){
			this.panelList[pieceSizes[i]].updatePanelSize(zoomVal);
			
		}
		this.arrangePanels();

	};

	/**
	*Verifies the winning piece on the server side. If it is the winning piece the game ends
	*
	*/
	PieceManager.prototype.verifyWin = function(){
				//console.log("PieceManager.prototype.verifyWin function");
    			el = document.getElementById("overlay");
				el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
				//Stop timer
				clearInterval(this.CoreGame.timerId);
				//Add time and steps to win window
				document.getElementById("steps_text").innerHTML = "Total Pieces : " + pm._total_pieces;
				document.getElementById("time_text").innerHTML = "Time : " + track_time + " seconds";
				createjs.Sound.play("cheer");
	};

	/**
	*Returns an array of all the keys on the board. Utility function
	* @return {Array} result - Array of all the key lists
	*/
	PieceManager.prototype.getAllPieceValues = function(){
		//console.log("PieceManager.prototype.getAllPieceValues function");
		var result = []
		var this_piece_list_length = this._piece_list.length;
		for(var i =0;i<this_piece_list_length;i++){
			result.push(this._piece_list[i].keys);
		}
		return result;
	};
	
	/**
	*Adds the negated conclusion to the board
	*@param {Array} st_list - Integer list of the negated conclusion
	*@return {ClausePiece} cp - ClausePiece with properties of a the negated conclusion
	*/
	PieceManager.prototype.setConclusion =  function(st_list){
		//console.log("PieceManager.prototype.setConclusion ");
		this._conclusion = st_list;
		cp = new game.ClausePiece(st_list);
		createjs.Tween.get(cp,{loop:true}).to({scaleX: 0.7, scaleY: 0.7},500).to({scaleX: 1.1, scaleY: 1.1},500).to({scaleX: 1, scaleY: 1},500);
		cp.pieceNum = this._total_pieces;
		this.conclusion_piece_number = this._total_pieces;
		var piece_num_text = new createjs.Text(cp.pieceNum, "30px Arial","red");
		cp.x = cp.homeX = this.nPosX;
		cp.y = cp.homeY = this.nPosY;
		this.nextPiecePosition();
		this.getMatchingPiecesPositions(cp);
        cp.coreGame = this.coreGame;
        piece_num_text.x = 20+50;
		cp.addChild(piece_num_text);
		this._piece_list.push(cp);
		this._total_pieces++;
		console.log("Panel list length = " + this.panelList);
		if(cp.keys.length in this.panelList){
					this.panelList[cp.keys.length].addPiece(cp)
				}
				else{
					
					this.addPanel(cp,false);
					
				}

		return cp;
	};
	
	/**
	* This function is called when a new piece is added so that the position of the next piece is set
	* 
	*/
	PieceManager.prototype.nextPiecePosition =  function(){
		//console.log("PieceManager.prototype.nextPiecePosition function");
		if (this.currentRow == this.column_length-1){
			this.nPosX = 320*(this.currentColumn +1) + 160;
			this.nPosY = 78;
			this.currentRow = 0;
			this.currentColumn++;
			this.col_x_positions.push(0);
			//console.log("Col_x_pos = " + this.col_x_positions);
		}
		else{
			this.currentRow++;
			//this.nPosY = 120*(this.currentRow + 1) + 50;
			this.nPosY += 78 + 50;
		}
	};
	

	/**
	* Returns an integer list of all the matching pieces on the board
	*
	*/
	PieceManager.prototype.getMatchingPieces =  function(selectedPiece){
		//console.log("PieceManager.prototype.getMatchingPieces  function");
		result = [];
		var this_piece_list_length = this._piece_list.length;
		for(var i =0;i<this_piece_list_length;i++){
			if(this.negationPresent(selectedPiece,this._piece_list[i])){
				result.push(this._piece_list[i]);
			}
		}
		return result;
	};
    
    /**
	* Checks and calculates the resolution of the selected Piece with all the pieces on the board
	* @param {ClausePiece} selectedPiece - Usually newly added piece
	*/
    PieceManager.prototype.getMatchingPiecesPositions =  function(selectedPiece){
        //console.log("PieceManager.prototype.getMatchingPiecesPositions function");
		var this_piece_list_length = this._piece_list.length;
		for(var i =0;i<this_piece_list_length;i++){
			if(this.negationPresent(selectedPiece,this._piece_list[i]) && selectedPiece.pieceNum != i){
				selectedPiece.matching[i] = true;
                this._piece_list[i].matching[selectedPiece.pieceNum] = true;
                selectedPiece.matchingSolutions[i] = this.solveValues(selectedPiece,this._piece_list[i]);
                this._piece_list[i].matchingSolutions[selectedPiece.pieceNum] = this.solveValues(selectedPiece,this._piece_list[i]);
            }
            else{
                selectedPiece.matching[i] = false;
                this._piece_list[i].matching[selectedPiece.pieceNum] = false;
			}
		}
	};
    
	/**
	* Returns a list of all the ClausePieces
	* @return {ClausePiece} result - List of ClausePieces
	*/
	PieceManager.prototype.getAllPieces =  function(){
		//console.log("PieceManager.prototype.getAllPieces function");
		result = [];
		var this_piece_list_length = this._piece_list.length;
		for(var i =0;i<this_piece_list_length;i++){
			result.push(this._piece_list[i]);
		}
		return result;
	};


	/**
	*Returns the ClausePiece from the piece list
	*@param {Integer} piece_num - Piece number needed
	*@return {ClausePiece} - Required ClausePiece
	*/
	PieceManager.prototype.getPiece = function(piece_num){
		//console.log("PieceManager.prototype.getPiece function");
		return this._piece_list[piece_num];
	};


	/**
	*Checks if only one negation is present in piece 1 and piece 2
	*@param {ClausePiece} p1 - Piece 1
	*@param {ClausePiece} p2 - Piece 2
	*@return {Bool} - True if negation is present else False
	*/
	PieceManager.prototype.negationPresent = function(p1,p2){
		//console.log("PieceManager.prototype.negationPresent function");
		//
		var result = false;
		var num_negations = 0;
		var p1_keys_length = p1.keys.length;
		var p2_keys_length = p2.keys.length;
		
		for(var i = 0; i < p1_keys_length; i++){
			for(var j = 0; j < p2_keys_length; j++){
				if (p1.keys[i] == -1*p2.keys[j]){
					num_negations++;
				}
			}
		}			
		
		if (num_negations==1){
			result = true;
		}
		
		return result;
	};

	
	/**
	*This function checks if the piece passed to this function exists in the _piece_list. Accepts an array of integers representing the piece
	*@param {Integer<Array>} - Key list of the piece to be checked 
	*@return {Bool}  
	*/
	PieceManager.prototype.checkPiece = function(st_list){
		//console.log("PieceManager.prototype.checkPiece function");
		
		var result = false;
		for (var i =0; i< this._piece_list.length; i++){
                if(arraysEqual(st_list,this._piece_list[i].keys)){
                	result = true;
                	break;
                }
        }
		return result;
	};

(function (window){
	window.game = window.game || {}
	function PiecePanel(pieceLength){
		this.initialize(pieceLength);

	}

	var p = PiecePanel.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(pieceLength){
		this.Container_initialize();
		this.pieceLength = pieceLength;
		this.colLen = 0;
		this.totalPieces = 0;
		this.pieceList = [];
		this.pieceKeyList = [];
		this.tempPieceList = [];
		this.addBorder();
		this.positionContainer();
		this.nPosX = this.tempNPosX = (this.pieceLength*100+100)/2;
		this.nPosY = this.tempNPosY = 75;

	}

	p.positionContainer = function(){
		this.x = (this.pieceLength-1)*200;
	}
	p.addBorder = function(){
		this.bg = new createjs.Shape();	
		this.bg.graphics.beginStroke("black").drawRect(0,0, (this.pieceLength*100)+100, canvas.height-100);

		this.setBounds(0,0,(this.pieceLength*100)+100,canvas.height-100);
		this.addChild(this.bg);
	}

	p.addPiece = function(newPiece){
		newPiece.x = this.nPosX;
		newPiece.y = this.nPosY;
		newPiece.homeX = this.nPosX;
		newPiece.homeY = this.nPosY;
		//console.log(newPiece.keys + "  " + newPiece.x+ "," + newPiece.y);
		
		this.addChild(newPiece);
		//console.log(newPiece.parent);
		this.nPosY = this.nPosY + 125;
		this.totalPieces += 1;
		this.pieceList.push(newPiece);
		this.pieceKeyList.push(newPiece.keys);
	}

	p.addTempPiece = function(newPiece){
		newPiece.x = newPiece.homeX = this.tempNPosX;
		newPiece.y = newPiece.homeY = this.tempNPosY;
		this.addChild(newPiece);
		this.tempNPosY += 125;
		//console.log(this.tempNPosY);
		this.tempPieceList.push(newPiece);
		this.rearrangeTempPieces(this.colLen);

	}

	p.displayPiece = function(solvedPiece){
		this.addChild(solvedPiece);
		//console.log(solvedPiece.parent);

	}

	p.updatePanelSize = function(zoomVal){
		//console.log(parseInt(this.parent.getBounds().height/(125*this.parent.scaleY))-2);
		this.rearrangePieces(parseInt(this.parent.getBounds().height/(125*this.parent.scaleY))-2);
		//this.bg.graphics.clear().beginStroke("black").drawRect(0,0, (this.pieceLength*100)+100, canvas.height-100);
		this.bg.scaleY = 1/this.parent.scaleY;
	}

	p.rearrangePieces = function(newColLen){
		
		//if (newColLen != this.colLen){
			this.nPosY = 75;
			this.nPosX = (this.pieceLength*100+100)/2;
			this.colLen = newColLen;
			this.rowLen = parseInt(this.totalPieces/this.colLen)+1;
			//console.log(this.colLen,this.rowLen);
			var currRow = 1;
			var currCol = 0;

			for (var i=0; i< this.totalPieces; i++){
				this.pieceList[i].x = this.pieceList[i].homeX = this.nPosX;
				this.pieceList[i].y = this.pieceList[i].homeY = this.nPosY;
				currRow++;
				if (currRow > this.colLen){
					currCol++;
					currRow = 1;
					this.nPosY = 75;
					this.nPosX = currCol*(this.pieceLength*100+100) + (this.pieceLength*100+100)/2;
				}
				else{
					this.nPosY = this.nPosY +125;

				}
			}
			this.bg.graphics.clear().beginStroke("black").drawRect(0,0, this.rowLen*((this.pieceLength*100)+100), canvas.height-100);
			this.setBounds(0,0, this.rowLen*((this.pieceLength*100)+100), canvas.height-100);

			
		//}
		
	}
	
	p.resetPanel = function(){
			this.tempNPosY = 75;
			this.tempNPosX = (this.pieceLength*100+100)/2;
			this.tempPieceList = [];
			this.resetPanelBoundary();
	
	}
	
	p.resetPanelBoundary = function(){
			this.bg.graphics.clear().beginStroke("black").drawRect(0,0, this.rowLen*((this.pieceLength*100)+100), canvas.height-100);
			this.setBounds(0,0, this.rowLen*((this.pieceLength*100)+100), canvas.height-100);
	
	}
	
	p.rearrangeTempPieces = function(newColLen){
		this.tempNPosY = 75;
			this.tempNPosX = (this.pieceLength*100+100)/2;
			this.tempColLen = newColLen;
			this.tempRowLen = parseInt(this.tempPieceList.length/this.tempColLen)+1;
			
			//console.log(this.tempPieceList.length);
			var currRow = 1;
			var currCol = 0;

			for (var i=0; i< this.tempPieceList.length; i++){
				this.tempPieceList[i].x = this.tempPieceList[i].homeX = this.tempNPosX;
				this.tempPieceList[i].y = this.tempPieceList[i].homeY = this.tempNPosY;
				currRow++;
				if (currRow > this.colLen){
					currCol++;
					currRow = 1;
					this.tempNPosY = 75;
					this.tempNPosX = currCol*(this.pieceLength*100+100) + (this.pieceLength*100+100)/2;
				}
				else{
					this.tempNPosY = this.tempNPosY +125;

				}
			}
			this.bg.graphics.clear().beginStroke("black").drawRect(0,0, this.tempRowLen*((this.pieceLength*100)+100), canvas.height-100);
			this.setBounds(0,0, this.tempRowLen*((this.pieceLength*100)+100), canvas.height-100);

	
	}

	p.sortPieces = function(){
		//sortedPieces = this.pieceList.sort(function(a,b){return a.keys.toString().localeCompare(b.keys);});
		
		this.pieceList.sort(function(a,b){
			var result = 0;
			for (var i =0; i< a.keys.length; i++){
				if (a.keys[i] === b.keys[i]) {
					continue;
				}else {
					result = (a.keys[i] < b.keys[i]) ? -1 : 1;
					break;
				}
				
			}
			return result;
		
		});
		
		
		this.rearrangePieces(this.colLen);
	}

	window.game.PiecePanel = PiecePanel;
	}(window));

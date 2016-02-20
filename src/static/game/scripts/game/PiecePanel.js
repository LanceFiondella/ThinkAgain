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
		this.tempPieceList = []
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
		console.log(newPiece.keys + "  " + newPiece.x+ "," + newPiece.y);
		
		this.addChild(newPiece);
		//console.log(newPiece.parent);
		this.nPosY = this.nPosY + 125;
		this.totalPieces += 1;
		this.pieceList.push(newPiece);
	}

	p.addTempPiece = function(newPiece){
		newPiece.x = newPiece.homeX = this.tempNPosX;
		newPiece.y = newPiece.homeY = this.tempNPosY;
		this.addChild(newPiece);
		this.tempNPosY += 125;
		this.tempPieceList.push(newPiece);

	}

	p.displayPiece = function(solvedPiece){
		this.addChild(solvedPiece);
		console.log(solvedPiece.parent);

	}

	p.updatePanelSize = function(zoomVal){
		//console.log(parseInt(this.parent.getBounds().height/(125*this.parent.scaleY))-2);
		this.rearrangePieces(parseInt(this.parent.getBounds().height/(125*this.parent.scaleY))-2);
		//this.bg.graphics.clear().beginStroke("black").drawRect(0,0, (this.pieceLength*100)+100, canvas.height-100);
		this.bg.scaleY = 1/this.parent.scaleY;
	}

	p.rearrangePieces = function(newColLen){
		
		if (newColLen != this.colLen){
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

			
		}
		
	}


	window.game.PiecePanel = PiecePanel;
	}(window));
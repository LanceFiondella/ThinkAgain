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
		
		this.addBorder();
		this.positionContainer();
		this.nPosX=(this.pieceLength*100+100)/2;
		this.nPosY=75;
	}

	p.positionContainer = function(){
		this.x = (this.pieceLength-1)*200;
	}
	p.addBorder = function(){
		this.bg = new createjs.Shape();
		this.bg.graphics.beginStroke("black").drawRect(0,0, (this.pieceLength*100)+100, canvas.height-100);
		this.addChild(this.bg);
	}

	p.addPiece = function(newPiece){
		newPiece.x = this.nPosX;
		newPiece.y = this.nPosY;
		console.log(newPiece.keys + "  " + newPiece.x+ "," + newPiece.y);
		
		this.addChild(newPiece);
		console.log(newPiece.parent);
		this.nPosY = this.nPosY + 125;
	}
	window.game.PiecePanel = PiecePanel;
	}(window));
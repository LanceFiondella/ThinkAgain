(function (window){
	window.game = window.game || {}
	const PIECE_H = 100;
	const PIECE_W = 100;
	const BORDER_THICKNESS = 1;
	function ClausePiece(st_list, piece_num, parent1, parent2){
		
		this.initialize();
		this.clausePieceShape(st_list, piece_num);
		this.matching = {};
		this.matchingSolutions = {};
		if(arguments.length <= 2)
			this.addMouseProperties();
		else if (arguments.length==4)
			this.addSolvedPieceMouseProperties(parent1, parent2)
		//Reference to core game
		//this.coreGame = this.parent.parent;
	}

	var p = ClausePiece.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;


	//p.matching = {};
	//p.matchingSolutions = {};
	p.initialize = function(){
		this.Container_initialize();
	}

	p.addSolvedPieceMouseProperties = function(parent1, parent2){
		console.log("Add solved mouse prop function");
		//console.log(parent1,parent2)
		this.parent1 = parent1;
		this.parent2 = parent2;

		//Adding a border around the piece to show that its different
		var border = new createjs.Shape();

		border.graphics.setStrokeStyle(6);
		border.graphics.beginStroke("blue");
		border.graphics.drawRoundRect(50, 0, 100*this.keys.length, 100,20);
		if (this.keys.length != 0)
			this.addChild(border);

		this.on("click", function(evt){
			console.log("solved piece clicked");
                var add_piece = true;
            
            if (this.coreGame.pm.checkPiece(evt.currentTarget.keys)){
                console.log("Duplicate piece!!!");
                
                    add_piece = false;
                    parent1.matching[this.parent2.pieceNum] = false;
                    parent2.matching[this.parent1.pieceNum] = false;

            }


                if (add_piece){
                	this.coreGame.pm.addedSolvedPiece(this);
        				}


	}.bind(this));

	}

	p.addMouseProperties = function(){
		this.on("mousedown",function(evt){
			console.log("UNsolved piece clicked");
			createjs.Tween.get(evt.currentTarget).to({scaleX: 1.0, scaleY: 1.0}).to({scaleX: 0.75, scaleY: 0.75}, 250);
			//this.coreGame.pm.replaceWithSolvedPieces(this);
			this.coreGame.pm.replaceWithSolvedPiecesAlternate(this);

			//Removing red border from previously selected piece
			prev_piece = this.coreGame.selected_piece_border.parent;
        	if(prev_piece != null){
	            prev_piece.removeChild(this.coreGame.selected_piece_border);
	            
	        }
	        this.coreGame.selected_piece_border.graphics.clear().setStrokeStyle(5).beginStroke("#ff0000").drawRoundRect(50, 0, evt.currentTarget.keys.length*100, evt.currentTarget.height, 20);
	        console.log("width = " + evt.currentTarget.keys.length);
	        this.addChild(this.coreGame.selected_piece_border);

	        //Removing green borders from pieces added from previous steps
	        var npb_length = this.coreGame.pm.new_piece_borders.length;
	        for (var i =npb_length-1; i>=0; i--){
	            green_piece = this.coreGame.pm.new_piece_borders[i].parent
	            green_piece.removeChild(this.coreGame.pm.new_piece_borders[i]);
	            delete this.coreGame.pm.new_piece_borders.pop();
		        }
		}.bind(this));
	}

	p.clausePieceShape = function(st_list, piece_num){
		
		this.keys = st_list;
		this.pieceNum = piece_num;

		var keysLength = this.keys.length;
		if (keysLength == 0){
			var star_image = new createjs.Bitmap("images/star.jpg");
        	star_image.scaleX = star_image.scaleY = 0.3;
        	star_image.x = 50;
        	//star_image.regX = star_image.getBounds().width/2;
        	//star_image.regY = star_image.getBounds().height/2;
            this.addChild(star_image);
		}

		for (var i =0; i< keysLength; i++){
			var atom = new createjs.Shape();
			atom.graphics.setStrokeStyle(2);

			var pieceLetterText;
			var chr = (Math.abs(this.keys[i]));

			if (this.keys[i] > 0) {
					pieceLetterText = new createjs.Text((chr), "bold 50px Arial","black");
					atom.graphics.beginFill("white");
                	atom.graphics.beginStroke("black");
				}
			else{
					pieceLetterText = new createjs.Text((0-chr), "bold 50px Arial","white");
                    atom.graphics.beginFill("black");   
                    atom.graphics.beginStroke("white");
				}

			atom.graphics.drawRoundRect(100*i+50, 0, 102-2*BORDER_THICKNESS, 102-2*BORDER_THICKNESS,20);
			atom.setBounds(100*i+50, 0, 102-2*BORDER_THICKNESS, 102-2*BORDER_THICKNESS);
			this.addChild(atom);
		
			pieceLetterText.x = 100*i + 25+50;
			//pieceLetterText.x = 100*i+50;
			pieceLetterText.y = 20;
        
			this.addChild(pieceLetterText);
		}

		var pieceNumText = new createjs.Text(this.pieceNum, "15px Arial","red");
		pieceNumText.x = 20+50;
		this.addChild(pieceNumText);
		if(this.getBounds() != null){
			this.height = this.getBounds().height;
			this.width = this.getBounds().width;
			
			this.regX = this.width/2+50;
			this.regY = this.height/2;

			this.orgX = -(this.width)/2; 
			this.orgY = -(this.height/2);
		}

	}


		window.game.ClausePiece = ClausePiece;
	}(window));
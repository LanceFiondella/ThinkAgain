//Bottom tab
var piece_combine_box;

//This global variable indicates whether a lock has been activated in the  combo box. The on click method of ClausePiece will check for this variable and combobox lock will set it
var alpha_locked = false;


function ComboBox() {
	this.position_1 = {x:0, y:0};
	this.position_2 = {x:0, y:0};
	this.position_3 = {x:0, y:0};
	
	this.piece_1 = null;
	this.piece_2 = null;
	this.piece_3 = null;
	this.piece_board = null;
	
	this.pos1_locked = false;
	this.pos2_locked = false;
	
	this.curr_pos = 1;
	this.arrow = null;
    this.lock1_container = null;
    this.lock2_container = null;
    
}

	ComboBox.prototype.initialize = function(){
		
		
		piece_combine_box = new createjs.Container();
		piece_combine_box.setBounds(0,0.8*stage.canvas.height, stage.canvas.width, 0.2*stage.canvas.height);
		piece_combine_box.y = stage.canvas.height;
		//piece_combine_box.regY = 0.2*stage.canvas.height;
		//piece_combine_box.scaleY = 0;
        
        
        this.position_1.x = 40;
		this.position_1.y = 0.05*stage.canvas.height;
		this.position_2.x = 40 + stage.canvas.width/3;
		this.position_2.y = 0.05*stage.canvas.height;
		this.position_3.x = 40 + stage.canvas.width*2/3;
		this.position_3.y = 0.05*stage.canvas.height;
		
		play_area_border = new createjs.Shape();
		play_area_border.graphics.setStrokeStyle(3);
		play_area_border.graphics.beginStroke("red");
		play_area_border.graphics.beginFill("white");
		play_area_border.graphics.drawRect(0,0,stage.canvas.width, 0.2*stage.canvas.height);
        play_area_border.on("mousedown", function(evt){
            //Stop play area from recieving mouse clicks from here
            evt.stopPropagation();
        }
        
        );
		//play_area_border.setBounds(0,0.8*stage.canvas.height,stage.canvas.width, 0.2*stage.canvas.height);
		piece_combine_box.addChild(play_area_border);
        
		
		var instructions = new createjs.Text("Click on 2 pieces to see its result here!", "bold 24px Ariel", "black");
		instructions.y = 10;
		instructions.x = 80;
		piece_combine_box.addChild(instructions);
	
        var plus_sign = new createjs.Text("+", "bold 40px Ariel", "black");
        plus_sign.x = stage.canvas.width/3;
        plus_sign.y = 0.08*stage.canvas.height;
        
        var equal_sign = new createjs.Text("=", "bold 40px Ariel", "black");
        equal_sign.x = stage.canvas.width*2/3;
        equal_sign.y = 0.08*stage.canvas.height;
        piece_combine_box.addChild(plus_sign);
        piece_combine_box.addChild(equal_sign);
		
		
		this.addButton();
        //this.addArrow();
        this.addLocks();
        this.addCombineButton();
        
		play_area_frame.addChild(piece_combine_box);
}
    
	
    
    ComboBox.prototype.addCombineButton = function(){
        var button = new createjs.Container();
		button.name = "combine";

		var button_bkg = new createjs.Shape();
		button_bkg.graphics.beginFill("red").drawRoundRect(0,0,75,40,5);
		var button_lbl = new createjs.Text("Combine!", "bold 12px Ariel", "#FFFFFF");
		button_lbl.textAlign = "center";
		button_lbl.textBaseline = "middle";
		button_lbl.x = 75/2;
		button_lbl.y = 40/2;
		button.addChild(button_bkg,button_lbl);
		button.y = 0.2*stage.canvas.height-50;
        button.x = stage.canvas.width-80;
        button_bkg.shadow = new createjs.Shadow("#000000", 5, 5, 10);
		
        
		
		button.on("mousedown", function(evt){
            
            solvePieces(pm.__proto__._piece_list[this.parent.getChildByName("Piece1").piece_num],pm.__proto__._piece_list[this.parent.getChildByName("Piece2").piece_num]);
            //createjs.Tween.get(evt.currentTarget).to({x:evt.currentTarget.x+5,y:evt.currentTarget.y+5}).wait(100).to({x:evt.currentTarget.x-5,y:evt.currentTarget.y-5})
            
        });
		piece_combine_box.addChild(button);

    }
    
   
	
    ComboBox.prototype.addLocks = function(){
        var lock_image = new createjs.Bitmap("images/lock.png");
        lock_image.scaleX = lock_image.scaleY= 0.07;
        
        var lock_image2 = new createjs.Bitmap("images/lock.png");
        lock_image2.scaleX = lock_image2.scaleY= 0.07;
        
        this.lock1_container = new createjs.Container();
        this.lock2_container = new createjs.Container();
        
		
		//References to variables of this object, Used in the "click event" handlers below. Spaghetti code!
        var lock1_localref = this.lock1_container;
        var lock2_localref = this.lock2_container;
        var piece1_localref = this.piece_1;
		var piece2_localref = this.piece_2;
		
		
        this.lock1_container.addChild(lock_image);
        this.lock2_container.addChild(lock_image2);
        
        this.lock1_container.x = this.position_1.x+120;
        this.lock1_container.y = 0.15*stage.canvas.height;
        this.lock1_container.lock = false;
        this.lock1_container.alpha = 0.5;
        
        this.lock2_container.lock = false;
        this.lock2_container.alpha = 0.5;
        
        this.lock1_container.on("click", function(evt){
                if (!lock1_localref.lock){
                    lock1_localref.lock = true;
                    lock1_localref.alpha = 1.0;
                    
                    lock2_localref.lock = false;
                    lock2_localref.alpha = 0.5;
					
					//Get a reference to the board piece and highlight its matching pieces
					piece_on_board = this.parent.getChildByName("Piece1");
					
					tweenMatchingPieces(pm.__proto__._piece_list[piece_on_board.piece_num]);
					
					//Enable global lock
					alpha_locked = true;
                    
                }
                else if(lock1_localref.lock){
                    lock1_localref.lock = false;
                    lock1_localref.alpha = 0.5;
					//Disable global lock
					alpha_locked  = false;
                }
        });

        this.lock2_container.on("click", function(evt){
                if (!lock2_localref.lock){
                    lock2_localref.lock = true;
                    lock2_localref.alpha = 1.0;
                    
                    lock1_localref.lock = false;
                    lock1_localref.alpha = 0.5;
					
                    
                    
					//Get a reference to the board piece and highlight its matching pieces
					piece_on_board = this.parent.getChildByName("Piece2");
					tweenMatchingPieces(pm.getPiece(piece_on_board.piece_num));
					
					//Enable global lock
					alpha_locked = true;
                    
                }
                else if(lock2_localref.lock){
                    lock2_localref.lock = false;
                    lock2_localref.alpha = 0.5;
					
					//Disable global lock
					alpha_locked  = false;
                }
        });
        
        
        this.lock2_container.x = this.position_2.x+120;
        this.lock2_container.y = 0.15*stage.canvas.height;
        
        piece_combine_box.addChild(this.lock1_container);
        piece_combine_box.addChild(this.lock2_container);
        
    }
    
    
    ComboBox.prototype.addArrow = function(){
        this.arrow = new createjs.Shape();
        this.arrow.graphics.beginStroke("black");
        this.arrow.graphics.beginFill("red");
        this.arrow.graphics.moveTo(15,0).lineTo(0,15).lineTo(10,15).lineTo(10,30).lineTo(20,30).lineTo(20,15).lineTo(30,15).lineTo(15,0);
        this.arrow.x = 40+150;
        this.arrow.y = 0.165*stage.canvas.height;
        piece_combine_box.addChild(this.arrow);
    }
    
    
	ComboBox.prototype.addButton = function(){
		var button = new createjs.Container();
		button.name = "open_panel";

		var button_bkg = new createjs.Shape();
		button_bkg.graphics.beginFill("red").drawRoundRect(0,0,75,32,5);
		var button_lbl = new createjs.Text("Open Panel", "bold 12px Ariel", "#FFFFFF");
		button_lbl.textAlign = "center";
		button_lbl.textBaseline = "middle";
		button_lbl.x = 75/2;
		button_lbl.y = 32/2;
		button.addChild(button_bkg,button_lbl);
		button.y = stage.canvas.height-32;
		
		button.panelOpen = false;
		button.on("click", function(evt){
			if(evt.currentTarget.panelOpen){
				createjs.Tween.get(evt.currentTarget).to({y:stage.canvas.height-32}, 1000, createjs.Ease.bounceOut);
                createjs.Tween.get(piece_combine_box).to({y:stage.canvas.height}, 1000, createjs.Ease.bounceOut);
				//createjs.Tween.get(piece_combine_box).to({scaleY: 0}, 1000, createjs.Ease.bounceOut);
				evt.currentTarget.panelOpen = false;
				button_lbl.text = "Open Panel";
			}
			else{
				createjs.Tween.get(evt.currentTarget).to({y:0.8*stage.canvas.height}, 1000, createjs.Ease.cubicOut);
                createjs.Tween.get(piece_combine_box).to({y:0.8*stage.canvas.height}, 1000, createjs.Ease.cubicOut);

				//createjs.Tween.get(piece_combine_box).to({scaleY: 1}, 1000, createjs.Ease.cubicOut);
				evt.currentTarget.panelOpen = true;
				button_lbl.text = "Close Panel";
			}
            
		});
        
        button_bkg.shadow = new createjs.Shadow("#000000", 5, 5, 10);
			stage.addChild(button)
	}
    
    ComboBox.prototype.solvePieces = function(p1,p2){
        
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
        
        if(num_negations == 1){
            
            
            var new_keys = p1_keys.concat(p2_keys).filter(Number);
            new_keys.sort();
            
            resultPiece = ClausePieceShape(new_keys);
            resultPiece.x = this.position_3.x;
            resultPiece.y = this.position_3.y;
            
            resultPiece.scaleX = resultPiece.scaleY = 1.0;
            
            if(this.piece_3 || new_keys.length == 0){
				piece_combine_box.removeChild(this.piece_3);
				
				//Add a copy of this piece on the board
				play_area.removeChild(this.piece_board);
			}
            this.piece_3 = resultPiece;
			//Setting properties of result piece
			this.piece_board = pm.showPiece(this.piece_3.keys,this.piece_3.piece_num);
			//console.log(this.piece_board.x + " " + this.piece_board.y);
			
			if(new_keys.length != 0){
				this.piece_3.name = "resultPiece";
                piece_combine_box.addChild(this.piece_3);
				play_area.addChild(this.piece_board);
            }
        }
        else {
            piece_combine_box.removeChild(this.piece_3);
			play_area.removeChild(this.piece_board);
            
        }
        
        
    }

	ComboBox.prototype.addPiece = function(piece){
        piece.scaleX = piece.scaleY = 0.8;
        
		if(this.curr_pos==1 && !this.lock1_container.lock){
			
			piece.x = this.position_1.x;
			piece.y = this.position_1.y;
			if(this.piece_1){
				piece_combine_box.removeChild(this.piece_1);
			}
			this.piece_1 = piece;
			this.piece_1.name = "Piece1";
			piece_combine_box.addChild(this.piece_1);
			this.curr_pos = 2;
            //this.arrow.x = this.position_2.x + 150;
		}
		else if(this.curr_pos==2 && !this.lock2_container.lock){
			
			piece.x = this.position_2.x;
			piece.y = this.position_2.y;
			if(this.piece_2){
				piece_combine_box.removeChild(this.piece_2);
			}
			this.piece_2 = piece;
			this.piece_2.name = "Piece2";
			piece_combine_box.addChild(this.piece_2);
			this.curr_pos = 1;
            //this.arrow.x = this.position_1.x + 150;
		}
        else if(this.curr_pos==1 && this.lock1_container.lock){
            this.curr_pos=2;
            //this.arrow.x = this.position_2.x + 150;
            this.addPiece(piece);
        }
        else if(this.curr_pos==2 && this.lock2_container.lock){
            this.curr_pos =1;
            //this.arrow.x = this.position_1.x + 150;
            this.addPiece(piece);
        }
		
		if(this.piece_1 && this.piece_2){
			
            this.solvePieces(this.piece_1,this.piece_2);
		}
	}

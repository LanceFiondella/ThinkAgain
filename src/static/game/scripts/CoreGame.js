(function (window){
	window.game = window.game || {}
	function CoreGame(){
		//console.log(this);
		this.initialize();
	}

	var p = CoreGame.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.pm = new PieceManager();
	p.trackTime = 0;
	p.res = [];
	p.scrollWheelTimer = null;
	p.playArea;
	p.alphaLocked = false;
	p.selected_piece_border = new createjs.Shape();
	p.gameState = {
		savedSteps:[],
		elapsedSeconds:0.0
	};

	p.initialize = function(){
		this.Container_initialize();
		this.addPlayBorder();
		this.addPlayArea();
		this.addPieces();

	}

	p.addPlayBorder = function(){
		this.playAreaFrame = new createjs.Container();
		this.playAreaFrame.setBounds(0,0,stage.canvas.width,stage.canvas.height);

		this.playArea = new createjs.Container();

		//Adding reference to play area 
		this.pm.playArea = this.playArea;
		this.pm.coreGame = this;
		this.playArea.setBounds(0,0,stage.canvas.width,stage.canvas.height);		

		canvas.addEventListener("mousewheel", this.MouseWheelHandler.bind(this), false);

		this.PlayAreaBorder =new createjs.Shape();
		this.PlayAreaBorder.graphics.setStrokeStyle(5);
		this.PlayAreaBorder.graphics.beginStroke("black");
		this.PlayAreaBorder.graphics.beginFill("#f7f7f7");
		this.PlayAreaBorder.graphics.drawRect(0,0,stage.canvas.width, stage.canvas.height);
		this.PlayAreaBorder.setBounds(0,0,stage.canvas.width, stage.canvas.height);
		this.addChild(this.PlayAreaBorder); 
		window.addEventListener('resize', this.resize.bind(this), false);
	}


	p.addPlayArea = function(){
		
		this.PlayAreaBorder.on("mousedown", function(evt){
					window.offset = {x:this.playArea.x-evt.stageX, y:this.playArea.y-evt.stageY};
					window.initialClick = {x:evt.stageX, y:evt.stageY};
					this.pressmoveFlag = false;
			}.bind(this));

		this.PlayAreaBorder.on("pressmove", function(evt){
					this.playArea.x = evt.stageX + window.offset.x;
					//Checks if the mouse has been dragged by 5 pixels
					if(Math.abs(initialClick.x-evt.stageX) > 5 || Math.abs(initialClick.y-evt.stageY)>5)
						this.pressmoveFlag = true;
			}.bind(this));

		this.PlayAreaBorder.on("pressup",function(evt){
				if(this.pressmoveFlag == false){
					//resetWidths();
					this.resetBoard();
					//pm.adjustPieces();
				}
			}.bind(this));

		//this.playArea.scaleX = this.playArea.scaleX = 0.6;
		
		this.playAreaText = new createjs.Text("Time - 0:00", "20px Arial","black");
		this.playAreaText.x = 20;
		this.playAreaText.y = 20;

		//Change parent to canvas later
		this.playArea.addChild(this.playAreaText);
		this.addChild(this.playArea);

		//TODO : Add mask

		//TODO : Animate Timer

		//TODO : Stage Level Name

	}


	p.resetBoard = function(){
		//allPieces = this.pm.getAllPieces();
		allPieces = this.pm._piece_list;
		var allpieces_length = allPieces.length;
		for(var i = 0; i<allpieces_length; i++){
		
			allPieces[i].alpha = 1.0;
			allPieces[i].visible = true;
			allPieces[i].scaleX = allPieces[i].scaleY = 1.0;

		}


		if (typeof this.pm.addedSolvedPieces !== 'undefined'){
	    	var addedSolvedPIeces_length = this.pm.addedSolvedPieces.length;
			for(var i = 0; i<addedSolvedPIeces_length;i++){
				this.playArea.removeChild(this.pm.addedSolvedPieces[i]);
				}
		}

	}

	p.resetWidths = function(){
		//Experimental function called after clicking the board to reset the width of all pieces to their true values
		allPieces = this.pm.getAllPieces();
		var allpieces_length = allPieces.length;
		for(var i = 0; i<allpieces_length; i++){
			allPieces[i].width = allPieces[i].getBounds().width;
			}
	}

	p.resize = function(){
			canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;  
            this.playArea.width = this.playAreaFrame.width = canvas.width;
            this.playArea.height = this.playAreaFrame.height = canvas.height;
            this.PlayAreaBorder.width = canvas.width;
            this.PlayAreaBorder.height = canvas.height;
           	stage.update();
	}


	p.addPieces = function(){

		var initialData = this.getProblem();

		var totalAtoms = parseInt(initialData.total_atoms,10);
		var pieceListText = initialData.piece_list;

		pieceNumberList = [];
		for (k in pieceListText){
			if (pieceListText.hasOwnProperty(k))
				pieceNumberList.push(parseInt(k,10));
		}
		
		pieceNumberList.sort(this.sortNumber);
		var pieceNumberLength = pieceNumberList.length;
		for (i=0; i<pieceNumberLength;i++){
			k = pieceNumberList[i];
			pieceVal = pieceListText[k];
			
			//Turning array of strings to int
			var temp = new Array();
			temp = pieceVal.split(",");
			for (a in temp){
				temp[a] = parseInt(temp[a],10);
			}
			temp.sort();
			//If piece is last one assign it as a conclusion piece
			if (i == pieceNumberList.length-1 ){
				con_piece = this.pm.setConclusion(temp);
				this.playArea.addChild(con_piece);
			}
			else{
				this.pm.addPiece(temp);

				this.playArea.addChild(this.pm._piece_list[i]);
				this.pm._piece_list[i].piece_num = i;
			}
		}
	}


	p.getProblem = function() {
		var response;
		var csrf_token = $.cookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                //if (!this.csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrf_token);
                //	}
            	}
        	});

	    $.ajax({
			  type: 'POST',
			  url: "/generate_problem/",
			  data: "filename=" + sessionStorage.getItem("filename"),
			  success: function(data){
			        response = data;
			    },
			  dataType: "json",
			  async:false
			});
      
    return response;
	}

	p.csrfSafeMethod = function(method) {
	   
    	// these HTTP methods do not require CSRF protection
    	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}

	p.sortNumber = function(a,b) {
	//console.log("sort number function");
    return a - b;
	}

	p.zoom = function(value){
		
		//if(scrollWheelTimer!=null){
		//	clearTimeout(scrollWheelTimer);
		//}
		//TODO : Remove comment after adjustRowLength is done
		//scrollWheelTimer = setTimeout(function(){adjustRowLength();},200);

	}

	p.MouseWheelHandler = function(e){
		if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))>0)
        zoom_val=.025;
    else
        zoom_val= -0.025;
    	//this.zoom(zoom_val);
    this.playArea.scaleX += zoom_val;
	this.playArea.scaleY += zoom_val;
	}

	p.sendStep = function(step){
	    console.log("sendStep function");
	    console.log(step);
	    //Sends steps to the server
	    var csrf_token = $.cookie('csrftoken');
	                console.log("Sending Step ajax!")
	                    $.ajaxSetup({
	                        beforeSend: function(xhr, settings) {
	                            //if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
	                                xhr.setRequestHeader("X-CSRFToken", csrf_token);
	                           // }
	                        }
	                    });

	                $.ajax({
	              type: 'POST',
	              url: '/save_step/',
	              data: "problem_name=" + sessionStorage.getItem("filename")+"&username="+ sessionStorage.getItem("username")+"&total_pieces=" + this.pm._total_pieces+ "&total_time=" + this.trackTime + "&solution=" + JSON.stringify(step),
	              success: function(data){
	                    response = data;
	                },
	              dataType: "json",
	              async:true
	            });

	}
	
	window.game.CoreGame = CoreGame;
	}(window));
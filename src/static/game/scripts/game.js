const PIECE_H = 100;
const PIECE_W = 100;
const BORDER_THICKNESS = 1;

var stage;
var play_area, side_bar;
var play_area_border;
var play_area_frame;
//var piece_list = [];
//var pm = Object.create(PieceManager);
var pm = new PieceManager();
var total_atoms;
var colors;
//var cb = new ComboBox();

//Text for timer
var play_area_text;
var track_time = 0.0;
var timerId;
var res = [];



//Temporarily shows resulting piece
var temp_piece = null;


var game_state = {
	saved_steps:[],
	elapsed_seconds:0.0

};

//var saved_steps = []; 

//Draws border around selected peice
var selected_piece_border = new createjs.Shape();
//This array stores the references to the animations/borders of newly added pieces
var new_piece_borders = [];

//Flag to detect drag
var pressmove_flag = false;



createjs.Sound.registerSound("./sounds/bubble.wav","bubble",4);
createjs.Sound.registerSound("./sounds/cheer.mp3","cheer",4);

function init() {
	//Canvas contains the whole game use other containers to manipulate game
	//console.log(sessionStorage.getItem("username"));
    stage = new createjs.Stage("canvas");
	
	stage.canvas.width = window.innerWidth;
	stage.canvas.height = window.innerHeight;
	
	window.addEventListener('resize', resize, false);   
	createjs.Touch.enable(stage, [allowDefault = false]);
	
	//Container defining the frame of the play area (All game play/scaling is done inside here) 
	play_area_frame = new createjs.Container();
	play_area_frame.setBounds(0,0, stage.canvas.width, stage.canvas.height);

	
	//Container where actual game is played
    play_area = new createjs.Container();
	play_area.setBounds(0,0, stage.canvas.width, stage.canvas.height);
	
	
	//Zooming of play area
	canvas.addEventListener("mousewheel", MouseWheelHandler, false);
	//canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	//canvas.addEventListener("mousedown", MouseDownHandler,false);
	
	//Defines the background of play_area
	play_area_border = new createjs.Shape();
	play_area_border.graphics.setStrokeStyle(5);
	play_area_border.graphics.beginStroke("black");
	play_area_border.graphics.beginFill("#f7f7f7");
	play_area_border.graphics.drawRect(0,0,stage.canvas.width, stage.canvas.height);
	play_area_border.setBounds(0,0,stage.canvas.width, stage.canvas.height);
	play_area_frame.addChild(play_area_border);
	
	
	//Panning of play area
	play_area_border.on("mousedown", function(evt){
					window.offset = {x:play_area.x-evt.stageX, y:play_area.y-evt.stageY};
					window.initialClick = {x:evt.stageX, y:evt.stageY};
					pressmove_flag = false;
	});
	
	play_area_border.on("pressmove", function(evt){
				//if (Math.abs(window.initialClick.y - evt.stageY)<15)
					play_area.x = evt.stageX + window.offset.x;
				//else if (Math.abs(window.initialClick.x - evt.stageX)<15)
					play_area.y = evt.stageY + window.offset.y;
					
					//Checks if the mouse has been dragged by 5 pixels
					if(Math.abs(initialClick.x-evt.stageX) > 5 || Math.abs(initialClick.y-evt.stageY))
						pressmove_flag = true;
	});

	play_area_border.on("pressup",function(evt){
		
			if(pressmove_flag == false){
					resetWidths();
					resetBoard();
					pm.adjustPieces();
				}
	});


	//Scaling down the play area to show 10x10 pieces
	play_area.scaleX = play_area.scaleY = 0.6;


	//This is temporary. Shows where the play area is. Add debugging text to it
	play_area_text = new createjs.Text("Time - 0:00", "20px Arial","black");
	play_area_text.x = 20;
	play_area_text.y = 20;

	


	//Mask the control area on the right
	var mask = new createjs.Shape();
	mask.graphics.beginFill("#f00").drawRect(0,0,stage.canvas.width, stage.canvas.height);
	play_area.mask = mask;	

	//Separate function to make pieces
	generatePieces();
	
	
	play_area_frame.addChild(play_area);
	stage.addChild(play_area_frame);
	//Initializing combobox
  	//cb.initialize();

  	//Adding a timer to stage
  	stage.addChild(play_area_text);
  	timerId = setInterval(function () {track_time++; 
  							if (Math.trunc(track_time%60) < 10)
  								play_area_text.text = "Time : " +  Math.trunc(track_time/60) +":0"+ (Math.trunc(track_time%60));
  							else
  								play_area_text.text = "Time : " + Math.trunc(track_time/60) +":"+ (Math.trunc(track_time%60));
  							 }, 1000);


  	//Adding level name to stage
  	var level_name_text = new createjs.Text("Level : " +sessionStorage.getItem('filename').split(".")[0], "20px Arial","black")
  	level_name_text.x = 200;
  	level_name_text.y = 20;
  	stage.addChild(level_name_text);
	//play_area.addChild(selected_piece_border);
    //selected_piece_border.graphics.beginStroke("#ff0000").drawRect(0,0,0,0);


    runTutorial();

    startGame();

}





function sortNumber(a,b) {
    return a - b;
}

function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;  
            play_area.width = play_area_frame.width = play_area_border.width = canvas.width;
            play_area.height = play_area_frame.height = play_area_border.height = canvas.height;
           stage.update();
}

function generateColors(colors){
	colors =  colors+1;
	color_list = [];
	
    if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
	for(var i = 0;i <colors;i++){
		color_list.push("hsl(" + Math.floor(i * (360 / colors) % 360) + ","+ Math.floor(Math.random()*(80-20+1)+20) + "%,"+ Math.floor(Math.random()*(80-20+1)+20) + "%)");
		//console.log("ColorNum = " + i + "   " + color_list[i]);
	}
	
    return color_list;
}

function generatePieces(){
	//Calling generate problem from the django server
	var result = httpPOST("/generate_problem/");

	//Handles the data, converts into array of integers
    data = result;
	total_atoms = parseInt(data.total_atoms,10);             
	colors = generateColors(total_atoms);
	var piece_list = data.piece_list;
	piece_nums = []
	for (k in piece_list){
		if (piece_list.hasOwnProperty(k))
			
			piece_nums.push(parseInt(k,10));
	}

	//Sorting each piece internally (by its keys)
	piece_nums.sort(sortNumber);
	//console.log(piece_nums);
	
	//Adding peices to the play area (if the piece is last in the list, it is negated conclusion)
	
	var piece_nums_length = piece_nums.length;
	for (i=0; i<piece_nums_length;i++){
		k = piece_nums[i];
		piece_val = piece_list[k];
		
		//Turning array of strings to int
		var temp = new Array();
		temp = piece_val.split(",");
		for (a in temp){
			temp[a] = parseInt(temp[a],10);
		}
		temp.sort();
		//If piece is last one assign it as a conclusion piece
		if (i == piece_nums.length-1 ){
			con_piece = pm.setConclusion(temp);
			//con_piece.x = 100;
			//con_piece.y = 100;
			play_area.addChild(con_piece);
		}
		else{
			pm.addPiece(temp);
			play_area.addChild(pm._piece_list[i]);
			pm._piece_list[i].piece_num = i;
		}
		
	}

	//Setting initial length of the problem (Used in undo function)
	pm._initial_length = piece_nums_length;
	
}


function MouseWheelHandler(e){
	if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))>0)
        zoom=.025;
    else
        zoom= -0.025;


//var point = play_area.localToGlobal(stage.mouseX, stage.mouseY);
//play_area.x=stage.mouseX ;
//play_area.y=stage.mouseY ;

//play_area.regX=stage.mouseX ;
//play_area.regY=stage.mouseY ;

play_area.scaleX += zoom;
play_area.scaleY += zoom;

}


function currentKeyNegIn(piece,key){
    var i;
    var result = false;
	var piece_keys_length =piece.keys.length;
    for (i=0;i<piece_keys_length;i++){
        if( piece.keys[i] == (-1*key) ){
            //Global variable to keep track of current Negation piece
            currNegPos = i;
            result = true;
            break;
        }
    }
    return result;
}


function startGame() {
	
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", function(e){
	
	stage.update(e);
    });


}

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( "filename=" + sessionStorage.getItem("filename") );
    return xmlHttp.responseText;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function httpPOST(theUrl){
    //console.log(sessionStorage.getItem("filename"));
    var response;
    var csrf_token = $.cookie('csrftoken');
    //console.log("Sending Ajax!")
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrf_token);
                }
            }
        });

    $.ajax({
  type: 'POST',
  url: theUrl,
  data: "filename=" + sessionStorage.getItem("filename"),
  success: function(data){
        response = data;
    },
  dataType: "json",
  async:false
});
    console.log(response);    
    return response;
}


function resetBoard(){
	//Actions to perform when want to reset the board to its original state

	allPieces = pm.getAllPieces();
	var allpieces_length = allPieces.length;
	for(var i = 0; i<allpieces_length; i++){
		
		allPieces[i].alpha = 1.0;
		allPieces[i].visible = true;
		allPieces[i].scaleX = allPieces[i].scaleY = 1.0;

	}

	if (typeof pm.addedSolvedPieces !== 'undefined'){
    	var addedSolvedPIeces_length = pm.addedSolvedPieces.length;
	for(var i = 0; i<addedSolvedPIeces_length;i++){
		play_area.removeChild(pm.addedSolvedPieces[i]);
		}
	}


}

function resetWidths(){
//Experimental function called after clicking the board to reset the width of all pieces to their true values

allPieces = pm.getAllPieces();
					var allpieces_length = allPieces.length;
	for(var i = 0; i<allpieces_length; i++){
		//console.log(allPieces[i].width + " " + allPieces[i].getBounds().width);
		allPieces[i].width = allPieces[i].getBounds().width;
		//console.log(allPieces[i].width + " " + allPieces[i].getBounds().width);
	}

	//pm.adjustPieces();
}
const PIECE_H = 100;
const PIECE_W = 100;
const BORDER_THICKNESS = 1;
var stage;
var play_area, side_bar;
var play_area_border;
var play_area_frame;
//var piece_list = [];
var pm = Object.create(PieceManager);
var total_atoms;
var colors;
var cb = Object.create(ComboBox);


createjs.Sound.registerSound("./sounds/bubble.wav","bubble",4);

function init() {
	//Canvas contains the whole game use other containers to manipulate game
    stage = new createjs.Stage("canvas");
	
	stage.canvas.width = window.innerWidth;
	stage.canvas.height = window.innerHeight;
	
	createjs.Touch.enable(stage);
	
	//Container defining the frame of the play area (All game play/scaling is done inside here) 
	play_area_frame = new createjs.Container();
	play_area_frame.setBounds(0,0, stage.canvas.width, stage.canvas.height);
	
	
	
	
	//Container where actual game is played
    play_area = new createjs.Container();
	play_area.setBounds(0,0, stage.canvas.width, stage.canvas.height);
	
	
	//Zooming of play area
	canvas.addEventListener("mousewheel", MouseWheelHandler, false);
	canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
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
					allPieces = pm.getAllPieces();
	for(var i = 0; i<allPieces.length; i++){
		
		allPieces[i].alpha = 1.0;
	}
	
	});
	
	play_area_border.on("pressmove", function(evt){
					play_area.x = evt.stageX + window.offset.x;
					play_area.y = evt.stageY + window.offset.y;
					
	}
	
);
	//Scaling down the play area to show 10x10 pieces
//	play_area.scaleX = play_area.scaleY = 0.55;
	play_area.scaleX = 0.30;
	play_area.scaleY = 0.30;

	//This is temporary. Shows where the play area is. Add debugging text to it
	var play_area_text = new createjs.Text("Play area", "20px Arial","black");
	play_area_text.x = 20;
//	play_area.addChild(play_area_text);


	//Mask the control area on the right
	var mask = new createjs.Shape();
	mask.graphics.beginFill("#f00").drawRect(0,0,stage.canvas.width, stage.canvas.height);
	play_area.mask = mask;	
	
	
	
	
	//Separate function to make pieces
	generatePieces();
	
	
	play_area_frame.addChild(play_area);

	//Initializing combobox
	
	
	
    stage.addChild(play_area_frame);
	//stage.addChild(side_bar);
	cb.initialize();
//	
//	addZoomButtons();
	
	
    startGame();
	//stage.update();
}


function addZoomButtons(){
    var zoom_in = new createjs.Container();
		zoom_in.name = "zoom_in";

		var zoom_in_bkg = new createjs.Shape();
		zoom_in_bkg.graphics.beginFill("red").drawCircle(0,0,20);
		var zoom_in_lbl = new createjs.Text("+", "bold 40px Ariel", "#FFFFFF");
		zoom_in_lbl.textAlign = "center";
		zoom_in_lbl.textBaseline = "middle";
		zoom_in_lbl.x = 0;
		zoom_in_lbl.y = 0;
		zoom_in.addChild(zoom_in_bkg,zoom_in_lbl);
        zoom_in.x = stage.canvas.width-50;
		zoom_in.y = 50;
		
		zoom_in.on("click", function(evt){});
        play_area_frame.addChild(zoom_in);
    
    
    var zoom_out = new createjs.Container();
		zoom_out.name = "zoom_out";

		var zoom_out_bkg = new createjs.Shape();
		zoom_out_bkg.graphics.beginFill("red").drawCircle(0,0,20);
		var zoom_out_lbl = new createjs.Text("-", "bold 40px Ariel", "#FFFFFF");
		zoom_out_lbl.textAlign = "center";
		zoom_out_lbl.textBaseline = "middle";
		zoom_out_lbl.x = 0;
		zoom_out_lbl.y = 0;
		zoom_out.addChild(zoom_out_bkg,zoom_out_lbl);
        zoom_out.x = stage.canvas.width-50;
		zoom_out.y = 100;
		
		zoom_out.on("click", function(evt){});
        play_area_frame.addChild(zoom_out);
    
    
    
}


function sortNumber(a,b) {
    return a - b;
}



function generateColors(colors){
	colors =  colors+1;
	color_list = [];
	
    if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
	for(var i = 0;i <colors;i++){
		color_list.push("hsl(" + Math.floor(i * (360 / colors) % 360) + ","+ Math.floor(Math.random()*(80-20+1)+20) + "%,"+ Math.floor(Math.random()*(80-20+1)+20) + "%)");
		console.log("ColorNum = " + i + "   " + color_list[i]);
	}
	
    return color_list;
}

function generatePieces(){
	
	
	//play_area = pm.displayAllPieces(play_area);
	var result = httpPOST("/generate_problem/");
	//data = JSON.parse(result);
    data = result;
	total_atoms = parseInt(data.total_atoms,10);             
	colors = generateColors(total_atoms);

	
	var piece_list = data.piece_list;
	
	//console.log(piece_list);
	piece_nums = []
	for (k in piece_list){
		if (piece_list.hasOwnProperty(k))
			
			piece_nums.push(parseInt(k,10));
	}
	//Sorting the pieces by piece number (by its keys)
	piece_nums.sort(sortNumber);
	console.log(piece_nums);
	
	//Adding peices to the play area (if the piece is last in the list, it is negated conclusion)
	for (i=0; i<piece_nums.length;i++){
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
	
}


function MouseWheelHandler(e){
/*
localPoint = play_area.globalToLocal(stage.mouseX, stage.mouseY);
play_area.regX = localPoint.x;
play_area.regY = localPoint.y;
*/

if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))>0)
        zoom=.025;
    else
        zoom= -0.025;
play_area.scaleX += zoom;
play_area.scaleY += zoom;
//console.log("scale = " + play_area.scaleX);
}






function currentKeyNegIn(piece,key){
    var i;
    var result = false;
    for (i=0;i<piece.keys.length;i++){
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
    createjs.Ticker.addEventListener("tick", function(e){
		
    stage.update();
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

function httpPOST(theUrl){
    console.log(sessionStorage.getItem("filename"));
    var response;
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
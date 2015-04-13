const PIECE_H = 100;
const PIECE_W = 100;
const BORDER_THICKNESS = 1;
var main_stage;
var stage;
var pieces = [];
var slots = [];
var score = 0;
var currNegPos = 0;
var zoom;
var mousePoint = new createjs.Point(0,0);

createjs.Sound.registerSound("./scripts/click.wav","click",4);
createjs.Sound.registerSound("./scripts/woosh.wav","woosh",4);


function init() {
    main_stage = new createjs.Stage("canvas");
	main_stage.canvas.width = window.innerWidth;
	main_stage.canvas.height = window.innerHeight;
    stage = new createjs.Container();
	
	var c = new window.ClausePiece([1,2]);
	var c2 = new window.ClausePiece([-1,-4]);
	//c.createPieces();
	stage.addChild(c);
	stage.addChild(c2);
    //setupCanvas();
    main_stage.addChild(stage);
    startGame();
}


function setupCanvas(){
//Add mouse X and y co-ordinates
var coOrdText = new createjs.Text(mousePoint, "15px Arial", "black");
coOrdText.y = 45;
coOrdText.x = 10;
main_stage.addChild(coOrdText);	
	
	
//Zoom and pan functions for the canvas

canvas.addEventListener("mousewheel", MouseWheelHandler, false);
canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);


main_stage.addEventListener("stagemousedown", function(e) {
var offset={x:main_stage.x-e.stageX,y:main_stage.y-e.stageY};
main_stage.addEventListener("stagemousemove",function(ev) {
    main_stage.x = ev.stageX+offset.x;
    main_stage.y = ev.stageY+offset.y;
	mousePoint.x = main_stage.mouseX;
	mousePoint.y = main_stage.mouseY;
	
    main_stage.update();
             delete offset; 
});
main_stage.addEventListener("stagemouseup", function(){
    main_stage.removeAllEventListeners("stagemousemove");
});
}); 


}


function MouseWheelHandler(e){
	/*
if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))>0)
        zoom=.1;
    else
        zoom= -.1;
stage.scaleX += zoom;
stage.scaleY +=zoom;
main_stage.update();*/
if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))>0)
    zoom=1.1;
else
    zoom=1/1.1;
main_stage.regX=main_stage.mouseX;
main_stage.regY=main_stage.mouseY;
main_stage.x=main_stage.mouseX;
main_stage.y=main_stage.mouseY;   
main_stage.scaleX=main_stage.scaleY*=zoom;

main_stage.update();
delete zoom; 


}






function checkCollision(e) {
    currP = e.currentTarget;
    currPx = e.currentTarget.x;
    currPy = e.currentTarget.y;
    currKeys = e.currentTarget.keys
    var i;
    for(i=0;i<currKeys.length;i++){
        currentKey = currKeys[i];
        var j;
        for(j=0;j<pieces.length;j++){
            if(collide(pieces[j],currP)){
                if(currentKeyNegIn(pieces[j],currentKey)){
//                console.log("Curr neg pos = " + currNegPos);
                    var neg_piece = pieces[j].getChildAt(currNegPos);
  //                  console.log("Piece x = " + neg_piece.x);
                    var Localpt = new createjs.Point(PIECE_W*currNegPos,0);
                    var point = pieces[j].localToGlobal(Localpt.x+(PIECE_W/2),Localpt.y+(PIECE_H/2));
    //                console.log(Localpt.x + "," + Localpt.y); 
               		createjs.Tween.get(currP).to({x:point.x, y:point.y},200, createjs.Ease.quadOut)
			        //createjs.Tween.get(pieces[j].getChildAt(currNegPos)).wait(500).to({alpha:0}, 1000);
		  	        //createjs.Tween.get(currP.getChildAt(i)).wait(500).to({alpha:0}, 1000);
                    createjs.Sound.play("./scripts/click.wav",createjs.Sound.INTERRUPT_NONE,0,0,1,.5,0);
                    //pieces[j].removeChildAt(currNegPos);
                    //currP.removeChildAt(i);
                    break;    
                }
            }
        }    
    }
}


function collide(rect2, rect1){
if (rect1.x < (rect2.x+((rect2.keys.length*PIECE_W)/2)) && rect1.x > (rect2.x-((rect2.keys.length*PIECE_W)/2)) && rect1.y < rect2.y + (PIECE_H/2) && rect1.y > rect2.y - (PIECE_H/2) )
       { 
//console.log("COLLIDING!");
return true;}
else
    {
//console.log("NOT COLLIDING!");
return false;}


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
    main_stage.update();
    });
}


 

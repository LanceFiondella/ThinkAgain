instructions_tut1 = ["Welcome to Think Again! We will now guide you step by step through the process of playing this game! <br> Click 'Next' to continue", 
				"The goal of this game is to combine the pieces on the board and produce a 'null' clause" +
				"<br>(At any point if you would like to go back to the previous instruction, click 'Previous')",
				"First, let's look at the game area. On the top left is the timer, which keeps track of how much time you spend on this level."+
				"<br> Next to the timer is the name of the level.<br>On the right hand side of the window is the control panel. <br> To move this tutorial window click on the red bar above and drag.",
				" The white space all around is the 'Play Area'. You can reposition all the pieces by clicking and dragging the white background." +
				"<br> Try it now! Once you are finished dragging, click next. ",
				"You can also make the pieces bigger or smaller by using the scroll wheel of your mouse or click the zoom in and zoom out buttons on the control panel. ",
				"Next, let's combine pieces. Click on Piece 0. <br> Did you notice how the other pieces change? <br> Essentially, the Pieces 1 and 2 morph into the result of combining with Piece 0" +
				"<br> It gives us a 'preview' of what we'll get if those pieces are combined. ",

				"Notice after clicking Piece 0, Piece 2 fades a little. This means no result it produced by combining 0 and 2.<br> Now make sure you have clicked Piece 0 and then click on Piece 1",
				"Congratulations! You just made your first piece! <br> The idea here is by combining pieces, the 'opposites' (or negated parts) get eliminated and whatever is left over gets added to the board."+
				"<br>After you are done adding pieces, reset the board by clicking the background",
				"If you've been following the tutorial, you'll see Pieces 2 and 3 are negated. Click on either one of them. "+
				"<br> Do you see a star? This means you found the null clause! Click on the star to win this level!"
				];


instructions_tut2 = ["Now we can solve a much bigger problem! <br> But before you do that, we need to explain a few things ",
					"Why is that one piece growing and shrinking? <br> The pulsating piece is the most important part of the level." + 
					"You MUST use that piece at least once in your solution. It does not matter at which point you use it.",
					"If you add a piece to the board and then change your mind. Click on the garbage can on the right to 'undo'" +
					"<br>The floppy disk icon saves the current state of your game (Save does not currently function)",
					"And finally, the pause button on the right stops the timer and pauses the game. <br> That's it! You are now on your own. Try to solve this puzzle before you move on to get a hang of the gameplay" +
					"<br> After solving this puzzle please solve the next level called '3-Beginner' atleast 3 times. You can continue playing the 4th and 5th levels if you like (No one has solved the 5th level yet)" +
					"<br> If you find any issues that prevent you from playing, please email me at vshekar@umassd.edu <br> Happy Thinking! <br> (If you need a hint click next)",
					"To solve this puzzle start by clicking the last piece (Piece 11). Produce a piece by combining it with Piece 3. Use only the new pieces you make to produce more single pieces"
					]

var instructions;
var currentStep;
var tutText;

function runTutorial(){
	//var tut = new TutorialDialog();
	//play_area.addChild(tut.dialogBox);
	currentStep = 0;
	var modal = document.getElementById("tutorial-overlay");
	var tutorialDialog = new createjs.DOMElement(modal);
	if(sessionStorage.getItem('filename').split(".")[0] == '1-Tutorial1'){
		instructions = instructions_tut1;
		bootstrapTut(tutorialDialog);
		}

	if(sessionStorage.getItem('filename').split(".")[0] == '2-Tutorial2'){
		instructions = instructions_tut2;
		bootstrapTut(tutorialDialog);
		}


}

function bootstrapTut(tutorialDialog){
	
	//tutorialDialog.x = 400;
	//tutorialDialog.y = 55;

	tutorialDialog.scaleX = tutorialDialog.scaleY = 1.75;

	var dragContainer = new createjs.Container();
	var dragBar = new createjs.Shape();
	dragBar.graphics.setStrokeStyle(1).beginStroke("red").beginFill("red").drawRoundRect(0,0, 1050, 55,10);

	dragContainer.addChild(tutorialDialog,dragBar);


	dragContainer.on("mousedown", function(evt){
			var global = play_area.localToGlobal(evt.currentTarget.x, evt.currentTarget.y);
		evt.currentTarget.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};

		});

	dragContainer.on("pressmove", function(evt){
			var local = play_area.globalToLocal(evt.stageX + evt.currentTarget.offset.x, evt.stageY + evt.currentTarget.offset.y);
            evt.currentTarget.x = local.x;
            evt.currentTarget.y = local.y;});

	dragContainer.x = 500;
	dragContainer.y = 500;

	play_area.addChild(dragContainer);

	tutText = document.getElementById("instruction-text");
	tutText.innerHTML =  instructions[currentStep];



}


function nextStep(){
	console.log(currentStep);
	console.log(instructions.length);
	if (currentStep<instructions.length-1){
		currentStep++;
		tutText.innerHTML =  instructions[currentStep];	
		
	}

}

function prevStep(){
	console.log(currentStep);
if (currentStep>0){
	currentStep--;
	tutText.innerHTML =  instructions[currentStep];		
	
	}
}







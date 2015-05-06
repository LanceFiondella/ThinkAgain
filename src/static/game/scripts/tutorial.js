function runTutorial(){
	var tut = new TutorialDialog();
	play_area.addChild(tut.dialogBox);
}



function TutorialDialog(){
	this._text = new createjs.Text("", "bold 35px Arial","black");
	this.dialogBox = new createjs.Container();
	this.nextButton = new createjs.Container();
	this.prevButton = new createjs.Container();

	//Defining next button shape
	var nextButtonShape = new createjs.Shape();
	var nextButtonText = new createjs.Text("Next", "30px Arial","white");
	nextButtonText.x = 30;
	nextButtonText.y = 10;
	nextButtonShape.graphics.setStrokeStyle(5).beginStroke("#67B767").beginFill("#67B767").drawRoundRect(0,0, 150, 55,10);

	this.nextButton.addChild(nextButtonShape,nextButtonText);
	this.nextButton.x = 250;

	var prevButtonShape = new createjs.Shape();
	var prevButtonText = new createjs.Text("Previous", "30px Arial","white");

	prevButtonText.x = 22;
	prevButtonText.y = 10;
	prevButtonShape.graphics.setStrokeStyle(5).beginStroke("#67B767").beginFill("#67B767").drawRoundRect(0,0, 150, 55,10);
	this.prevButton.addChild(prevButtonShape,prevButtonText);

	//Placing the containers
	this.dialogBox.addChild(this._text, this.nextButton, this.prevButton);


	this.dialogBox.on("mousedown", function(evt){
		var global = play_area.localToGlobal(evt.currentTarget.x, evt.currentTarget.y);
		evt.currentTarget.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};});


	this.dialogBox.on("pressmove", function(evt){
			var local = play_area.globalToLocal(evt.stageX + evt.currentTarget.offset.x, evt.stageY + evt.currentTarget.offset.y);
            evt.currentTarget.x = local.x;
            evt.currentTarget.y = local.y;});
}



function BranchExplorer(){
	//Variables related to branchexplorer
	this.be_box;
	this.resultBox;
	this.columnList = [];
	this.mask;
	this.all_keys;
};

BranchExplorer.prototype.initialize = function(){

	//Initializing the box
	this.be_box = new createjs.Container();
	//this.be_box.setBounds(0,0, 0.8*stage.canvas.width, stage.canvas.height);
	this.be_box.setBounds(0,0, 0.1*stage.canvas.width, stage.canvas.height);
	this.be_box.x = -0.8*stage.canvas.width;

	be_box_border = new createjs.Shape();
	be_box_border.graphics.setStrokeStyle(3);
	be_box_border.graphics.beginStroke("red");
	be_box_border.graphics.beginFill("white");
	//be_box_border.graphics.drawRect(0,0,0.8*stage.canvas.width, stage.canvas.height);
	be_box_border.graphics.drawRect(0,0,0.1*stage.canvas.width, stage.canvas.height);
	be_box_border.on("mousedown", function(evt){
            //Stop play area from recieving mouse clicks from here
            evt.stopPropagation();
        });
	this.be_box.addChild(be_box_border);


	this.mask = new createjs.Shape();
	//this.mask.graphics.beginFill("#f00").drawRect(0,0,0.8*stage.canvas.width, stage.canvas.height);
	this.mask.graphics.beginFill("#f00").drawRect(0,0,0.1*stage.canvas.width, stage.canvas.height);
	this.be_box.mask = this.mask;	

	//Adding resultBox which displays the results of combinations
	this.resultBox = new createjs.Container();
	//this.resultBox.setBounds(0,0.2*stage.canvas.height,0.8*stage.canvas.width,0.8*stage.canvas.height);
	this.resultBox.setBounds(0,0.2*stage.canvas.height,0.1*stage.canvas.width,0.8*stage.canvas.height);
	this.resultBox.y = 0.2*stage.canvas.height;

	

	this.resultBox.results = [];
	this.be_box.addChild(this.resultBox);



	//this.addButton()
	//Add to stage
	//stage.addChild(this.be_box);
}

BranchExplorer.prototype.resetResultBox = function(){
	this.be_box.removeChild(this.columnList[0]);
	this.columnList = [];

}


BranchExplorer.prototype.addFirstColumn = function(piece_list, all_key_list){
	this.all_keys = all_key_list;
	columnContainer = new createjs.Container();
	columnContainer.x = columnContainer.y = 0;
	var max_width = 0;
	for(var i=0;i<piece_list.length;i++){
		if (piece_list[i].width*piece_list[i].scaleX > max_width){
			max_width = piece_list[i].width*piece_list[i].scaleX;
		}

		piece_list[i].on("mousedown",function(evt){
			//be.addColumn()
			console.log("Clicked!");
			be.addColumn(1,[this],[]);
		});
	}

	columnBackground = new createjs.Shape();
	var max_height = 0;
	if (piece_list.length*50 > window.innerHeight){
		max_height = piece_list.length*50 + 50;
	}else{
		max_height = window.innerHeight;
	}
	columnBackground.graphics.beginFill("#CCCCFF").drawRect(0,0,max_width+20,max_height);
	columnContainer.addChild(columnBackground);
	for (var i=0;i<piece_list.length;i++){
		piece_list[i].x = (max_width+20)/2;
		piece_list[i].y = (i+2)*50;
		columnContainer.addChild(piece_list[i]);

	}

	columnBackground.on("mousedown", function(evt){
					window.offset = {x:evt.currentTarget.parent.x-evt.stageX, y:evt.currentTarget.parent.y-evt.stageY};
					window.initialClick = {x:evt.stageX, y:evt.stageY};
					pressmove_flag = false;
	});
	columnBackground.on("pressmove", function(evt){
				
					evt.currentTarget.parent.y = evt.stageY + window.offset.y;
					
					//Checks if the mouse has been dragged by 5 pixels
					if(Math.abs(initialClick.x-evt.stageX) > 5 || Math.abs(initialClick.y-evt.stageY)>5)
						pressmove_flag = true;
	});
	console.log("max width = " + max_width);
	columnContainer.setBounds(0,0,max_width,max_height);
	this.columnList.push(columnContainer);
	this.be_box.addChild(columnContainer);

}


BranchExplorer.prototype.addColumn = function(col_number, piece_list, all_key_list){
columnContainer = new createjs.Container();
console.log(this.columnList[col_number-1].x);
columnContainer.x = (this.columnList[col_number-1].getBounds().width +20) + this.columnList[col_number-1].x;
columnContainer.y = 0;
var max_width = 100;
	for(var i=0;i<piece_list.length;i++){
		piece_list[i].col_number = col_number;
		if (piece_list[i].width*piece_list[i].scaleX > max_width){
			max_width = piece_list[i].width*piece_list[i].scaleX;
		}

		piece_list[i].on("mousedown",function(evt){
			//be.addColumn()
			console.log("Clicked!");
			be.addColumn(evt.currentTarget.col_number+1,[this],[]);
		});
	}
	columnBackground = new createjs.Shape();
	var max_height = 0;
	if (piece_list.length*50 > window.innerHeight){
		max_height = piece_list.length*50 + 50;
	}else{
		max_height = window.innerHeight;
	}
columnBackground.graphics.beginFill("#CCCCFF").drawRect(0,0,max_width+20,max_height);
	columnContainer.addChild(columnBackground);
	for (var i=0;i<piece_list.length;i++){
		piece_list[i].x = (max_width+20)/2;
		piece_list[i].y = (i+2)*50;
		columnContainer.addChild(piece_list[i]);

	}

	columnBackground.on("mousedown", function(evt){
					window.offset = {x:evt.currentTarget.parent.x-evt.stageX, y:evt.currentTarget.parent.y-evt.stageY};
					window.initialClick = {x:evt.stageX, y:evt.stageY};
					pressmove_flag = false;
	});
	columnBackground.on("pressmove", function(evt){
				
					evt.currentTarget.parent.y = evt.stageY + window.offset.y;
					
					//Checks if the mouse has been dragged by 5 pixels
					if(Math.abs(initialClick.y-evt.stageY)>5)
						pressmove_flag = true;
	});

	columnContainer.setBounds( (this.columnList[col_number-1].width+ this.columnList[col_number-1].x),0,max_width,max_height);

	if(this.columnList[col_number]){
		this.be_box.removeChild(this.columnList[col_number]);
		this.columnList[col_number] = columnContainer;	
		this.be_box.addChild(columnContainer);
	}
	else{
		this.columnList.push(columnContainer);
		this.be_box.addChild(columnContainer);
	}
	

}



BranchExplorer.prototype.addButton = function(){
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
		button.y = 0;
		
		button.panelOpen = false;
		button.on("click", function(evt){
			if(evt.currentTarget.panelOpen){
				createjs.Tween.get(evt.currentTarget).to({x:0}, 1000, createjs.Ease.bounceOut);
                createjs.Tween.get(be.be_box).to({x:-0.8*stage.canvas.width}, 1000, createjs.Ease.bounceOut);
                createjs.Tween.get(be.mask).to({x:-0.8*stage.canvas.width}, 1000, createjs.Ease.bounceOut);
				//createjs.Tween.get(piece_combine_box).to({scaleY: 0}, 1000, createjs.Ease.bounceOut);
				evt.currentTarget.panelOpen = false;
				button_lbl.text = "Open Panel";
			}
			else{
				createjs.Tween.get(evt.currentTarget).to({x:0.1*stage.canvas.width}, 1000, createjs.Ease.cubicOut);

                createjs.Tween.get(be.be_box).to({x:0}, 1000, createjs.Ease.cubicOut);
                createjs.Tween.get(be.mask).to({x:0}, 1000, createjs.Ease.cubicOut);

				//createjs.Tween.get(piece_combine_box).to({scaleY: 1}, 1000, createjs.Ease.cubicOut);
				evt.currentTarget.panelOpen = true;
				button_lbl.text = "Close Panel";
			}
            
		});
        
        button_bkg.shadow = new createjs.Shadow("#000000", 5, 5, 10);
			stage.addChild(button)
	}
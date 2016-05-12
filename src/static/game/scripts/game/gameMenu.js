(function (window){
	window.game = window.game || {}

	function GameMenu(){
		this.initialize();
	}

	var p = GameMenu.prototype = new createjs.Container();

	p.Container_initialize = p.initialize;

	p.titleTxt = null;
	p.count = 0;

	p.initialize = function(){
		this.Container_initialize();
		
		
		
		
		this.addBG();
		this.addTitle();
		this.addSinglePlayerButton();
		this.addMultiplayerButton();
		this.run();
		

		
	}

	p.addBG = function(){
		var bg = new createjs.Shape();
		bg.graphics.beginFill('0').drawRect(0,0, canvas.width, canvas.height);
		this.addChild(bg);
	}


	p.addTitle = function(){
		this.titleTxt = new createjs.Text("Think Again!", '40px Arial','#FFF');
		this.titleTxt.x = canvas.width /2;
		this.titleTxt.y = 200;
		this.titleTxt.textAlign = 'center';
		this.addChild(this.titleTxt);
	}

	p.addSinglePlayerButton = function(){
		//var this.btn;
		var event;
		this.btn = new ui.SimpleButton('Single Player Game');
		this.btn.on('click', this.playGame,this);
		this.btn.regX = this.btn.width/2;
		this.btn.x = canvas.width/2;
		this.btn.y = 400;
		this.btn.setButton({upColor:'#FF0000', color:'#FFF', borderColor:'#FFF',overColor:'#900'});
		this.addChild(this.btn);
	}

	p.addMultiplayerButton = function(){
		var btn, event;
		btn = new ui.SimpleButton('Multiplayer Game');
		btn.on('click', this.playMultiplayerGame,this);
		btn.regX = btn.width/2;
		btn.x = canvas.width/2;
		btn.y = 500;
		btn.setButton({upColor:'#FF0000', color:'#FFF', borderColor:'#FFF',overColor:'#900'});
		this.addChild(btn);	
	}

	p.playGame = function(e){
		this.dispatchEvent(game.GameStateEvents.GAME);
	}

	p.playMultiplayerGame = function(e){
		this.dispatchEvent(game.GameStateEvents.MULTIPLAYER);	
	}

	p.run = function(tickEvent) {
		this.titleTxt.alpha = Math.cos(this.count++ * 0.1) * 0.4 + 0.6;
		
	}
	window.game.GameMenu = GameMenu;

}(window));
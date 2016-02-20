(function (window) {
	window.game = window.game || {}

	function gameOver() {
		this.initialize();
	}

	var p = gameOver.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function() {
		var bg = new createjs.Shape();
		bg.graphics.beginFill('#09E').drawRect(0,0,canvas.width,canvas.height);
		this.addChild(bg);
	}

	p.addButton = function(){
		var btn;
		btn = new ui.SimpleButton('Main Menu');
		btn.regX = btn.width / 2;
		btn.x = canvas.width / 2;
		btn.y = 280;
		btn.on('click',this.mainMenu, this);
		this.addChild(btn);
		btn = new ui.SimpleButton('Play Again');
		btn.regX = btn.width / 2;
		btn.x = canvas.width / 2;
		btn.y = 350;
		btn.on('click',this.playGame, this);
		this.addChild(btn);
	}

	p.mainMenu = function (e){
		this.dispatchEvent(game.GameStateEvents.MAIN_MENU);
	}
	p.playGame = function(e){
		this.dispatchEvent(game.GameStateEvents.GAME);
	}

	window.game.gameOver = gameOver;
}(window)); 
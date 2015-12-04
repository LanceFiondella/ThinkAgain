(function (window){
	window.game = window.game || {}

	function Multiplayer(){
		this.initialize();
	}

	var p = Multiplayer.prototype= new createjs.Container();

	p.initialize = function(){
		window.game.multiplayerGame = true;
		this.g = new game.CoreGame();
		this.addChild(this.g);

	}

		window.game.Multiplayer = Multiplayer;
	}(window));

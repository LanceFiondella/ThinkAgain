(function (window){
	window.game = window.game || {}

	function SinglePlayer(){
		this.initialize();
	}

	var p = SinglePlayer.prototype= new createjs.Container();

	p.initialize = function(){
		window.game.multiplayerGame = false;
		this.g = new game.CoreGame();
		this.addChild(this.g);

	}

		window.game.SinglePlayer = SinglePlayer;
	}(window));

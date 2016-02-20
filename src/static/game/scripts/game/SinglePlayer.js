(function (window){
	window.game = window.game || {}

	function SinglePlayer(){
		this.initialize();
	}

	var p = SinglePlayer.prototype= new createjs.Container();

	p.initialize = function(){
		g = new game.CoreGame();
		this.addChild(g);

	}

		window.game.SinglePlayer = SinglePlayer;
	}(window));
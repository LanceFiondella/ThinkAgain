(function (window){
	window.game = window.game || {}

	function Multiplayer(){
		this.initialize();
	}

	var p = Multiplayer.prototype= new createjs.Container();

	p.initialize = function(){
		sessionStorage.setItem('gametype','mp');
		g = new game.CoreGame();
		this.addChild(g);

	}

		window.game.Multiplayer = Multiplayer;
	}(window));

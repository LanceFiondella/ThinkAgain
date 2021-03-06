(function(window){
	window.game = window.game || {}

	function thinkAgain() {
		this.initialize();
	}

	var p = thinkAgain.prototype;

	p.currentGameStateFunction;
	p.currentGameState;
	p.currentScene;

	p.initialize = function(){
		canvas = document.getElementById('canvas');
		stage = new createjs.Stage(canvas);
		stage.canvas.width = window.innerWidth;
		stage.canvas.height = window.innerHeight;
		createjs.Ticker.setFPS(60);
		createjs.Ticker.on('tick',this.onTick, this);
		var gameType = sessionStorage.getItem("gameType");
		if (gameType = "sp"){
			this.changeState(game.GameStates.GAME);	
			
		}
		else if(gameType = "mp")
		{
			this.changeState(game.GameStates.MULTIPLAYER);
			
		}
		//this.changeState(game.GameStates.MAIN_MENU);
	}

	p.changeState = function (state) {
		this.currentGameState = state;
		switch (this.currentGameState) {
			case game.GameStates.MAIN_MENU:
				this.currentGameStateFunction = this.gameStateMainMenu;
				break;
			case game.GameStates.GAME:
				this.currentGameStateFunction = this.gameStateGame;
				break;
			case game.GameStates.MULTIPLAYER:
				this.currentGameStateFunction= this.gameStateMultiplayer;
				break;
			case game.GameStates.RUN_SCENE:
				this.currentGameStateFunction = this.gameStateRunScene;
				break;
			case game.GameStates.GAME_OVER:
				this.currentGameStateFunction = this.gameStateGameOver;
				break;
		}
	}

	p.onStateEvent = function (e,data){
		this.changeState(data.state);
	}

	p.gameStateMainMenu = function () {
		var scene = new game.GameMenu();
		console.log(this);
		scene.on(game.GameStateEvents.GAME, this.onStateEvent, this, false, {state:game.GameStates.GAME});
		scene.on(game.GameStateEvents.MULTIPLAYER, this.onStateEvent, this, false, {state:game.GameStates.MULTIPLAYER});
		stage.addChild(scene);
		stage.removeChild(this.currentScene);
		this.currentScene = scene;
		this.changeState(game.GameStates.RUN_SCENE);
	}

	p.gameStateGame = function() {
		var scene = new game.SinglePlayer();
		
		scene.on(game.GameStateEvents.GAME_OVER, this.onStateEvent, this, false, {state:game.GameStates.GAME_OVER});
		stage.addChild(scene);
		stage.removeChild(this.currentScene);
		this.currentScene = scene;
		this.changeState(game.GameStates.RUN_SCENE);
	}

	p.gameStateMultiplayer = function() {
		var scene = new game.Multiplayer();
		console.log(scene);
		scene.on(game.GameStateEvents.GAME_OVER, this.onStateEvent, this, false, {state:game.GameStates.GAME_OVER});
		stage.addChild(scene);
		stage.removeChild(this.currentScene);
		this.currentScene = scene;
		this.changeState(game.GameStates.RUN_SCENE);	
	}

	p.gameStateGameOver = function() {
		var scene = new game.GameOver();
		stage.addChild(scene);
		scene.on(game.GameStateEvents.MAIN_MENU, this.onStateEvent, this, false, {state:game.GameStates.MAIN_MENU});
		scene.on(game.GameStateEvents.GAME, this.onStateEvent, this, false, {state:game.GameStates.GAME});
		
		stage.removeChild(this.currentScene);
		this.currentScene = scene;
		this.changeState(game.GameStates.RUN_SCENE);
	}

	p.run = function() {
		if (this.currentGameStateFunction != null) {
			this.currentGameStateFunction();
		}
	}

	p.onTick = function(e) {
		this.run();
		stage.update();
	}



	window.game.thinkAgain = thinkAgain;

}(window));

	function arraysEqual(a, b) {

	//Checks if two arrays are equal in value
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

	var a_length = a.length
  for (var i = 0; i < a_length ; ++i) {
    if (a[i] !== b[i]) return false;
  }
  console.log("Returning");
  return true;
}
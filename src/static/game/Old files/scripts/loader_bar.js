const LOADER_WIDTH = 400;
var stage, loaderBar, loadInterval;
var percentLoaded = 0;

function init(){
setupStage();
buildLoaderBar();
startLoad();
}

function setupStage(){
stage = new createjs.Stage(document.getElementById('canvas'));
createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick", function(e){
stage.update();
});
}

function buildLoaderBar(){
loaderBar = new createjs.Shape();
loaderBar.x = loaderBar.y = 100;
loaderBar.graphics.setStrokeStyle(2);
loaderBar.graphics.beginStroke("#000");
loaderBar.graphics.drawRect(0,0,LOADER_WIDTH,40);
stage.addChild(loaderBar);
}

function updateLoaderBar(){
loaderBar.graphics.clear();
loaderBar.graphics.beginFill('#00ff00');
loaderBar.graphics.drawRect(0,0,LOADER_WIDTH * percentLoaded, 40);
loaderBar.graphics.endFill();
loaderBar.graphics.setStrokeStyle(2);
loaderBar.graphics.beginStroke("#000");
loaderBar.graphics.drawRect(0,0, LOADER_WIDTH, 40);
loaderBar.graphics.endStroke();
}

function startLoad(){
loadInterval = setInterval(updateLoad,50);
}

function updateLoad() {
 percentLoaded += 0.05;
updateLoaderBar();
if (percentLoaded >= 1){
    clearInterval(loadInterval);
    stage.removeChild(loaderBar);
}
}



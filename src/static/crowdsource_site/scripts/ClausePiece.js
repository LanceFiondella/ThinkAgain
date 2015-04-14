function ClausePiece(st_list) {
	//p is the container that holds the peices and properties associated
	var p = new createjs.Container();
	
	//Settings properties of the peice
	p.keys = st_list;
    p.matching = {};
	p.regX = (p.keys.length*100)/2;
	p.regY = 50;
	p.height = PIECE_H;
	p.width = PIECE_W*p.keys.length;
	p.orgX = -(p.keys.length*100)/2; 
	p.orgY = -50;
	
	//Setting mouse interaction with the whole piece

	//Behaviour on clicking piece
	p.on("mousedown", function(evt){

		evt.stopPropagation();
		play_area.setChildIndex(evt.currentTarget,play_area.getNumChildren() - 1);
		var global = play_area.localToGlobal(evt.currentTarget.x, evt.currentTarget.y);
		evt.currentTarget.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
		
		if(!alpha_locked){
			tweenMatchingPieces(evt.currentTarget);
			
		}
			
		
		//Adding the piece to combobox on click
		//cb.addPiece(ClausePieceShape(evt.currentTarget.keys,evt.currentTarget.piece_num));
	
    });
	
	//On dragging
	p.on("pressmove", function(evt){
			var local = play_area.globalToLocal(evt.stageX + evt.currentTarget.offset.x, evt.stageY + evt.currentTarget.offset.y);
            evt.currentTarget.x = local.x;
            evt.currentTarget.y = local.y;

            console.log("Moving  !!");

            for(var i = 0;i < pm._piece_list.length;i++){
    			if(pieceCollision(evt.currentTarget,pm._piece_list[i]) && (evt.currentTarget.piece_num != pm._piece_list[i].piece_num)){
					console.log("Collision detected on Move! : " + p.piece_num + "[" + p.keys+ " collided with " + i + "[" + pm._piece_list[i].keys + pieceCollision(evt.currentTarget,pm._piece_list[i]));
					//If 2 pieces collide solve them
    				cb.addPiece(ClausePieceShape(pm._piece_list[i].keys, pm._piece_list[i].piece_num));
    				cb.addPiece(ClausePieceShape(evt.currentTarget.keys,evt.currentTarget.piece_num));
				}
    		}

    
     });
    
    //Check for collision for mouse up
    
    p.on("pressup",function(evt){
    		
    		for(var i = 0;i < pm._piece_list.length;i++){
    			if(pieceCollision(evt.currentTarget, pm._piece_list[i]) && (evt.currentTarget.piece_num != pm._piece_list[i].piece_num)){
					console.log("Collision detected! : " + p.piece_num + "[" + p.keys+ " collided with " + i + "[" + pm._piece_list[i].keys + pieceCollision(evt.currentTarget,pm._piece_list[i]));
					//If 2 pieces collide solve them
    				solvePieces(p,pm._piece_list[i], true);
    				cb.removePiece(ClausePieceShape(pm._piece_list[i].keys, pm._piece_list[i].piece_num));
    				cb.removePiece(ClausePieceShape(evt.currentTarget.keys,evt.currentTarget.piece_num));
				}
    		}
			createjs.Tween.get(evt.currentTarget).to({x: evt.currentTarget.homeX, y: evt.currentTarget.homeY}, 1000, createjs.Ease.elasticOut);
			
    });
    
    
    //On double clicking
    p.on("dblclick",function(evt){
                           
	});
	//Generating individual atoms and adding it to the piece
	for (var i = 0; i< p.keys.length; i++){
		var atom = new createjs.Shape();
		atom.graphics.setStrokeStyle(10);
		
		//Generating atom color
		var atom_color = colors[Math.abs(p.keys[i])];
		
		//If atom is positive fill the block and no border
		if (p.keys[i] > 0){
			atom.graphics.beginFill(atom_color);
		}
		//If atom is negative draw border no fill
		else if(p.keys[i] < 0){
			atom.graphics.beginStroke(atom_color);
		}
		
		//Define hit area (Pieces with border only do not have hit areas in the middle)
		hit = new createjs.Shape();
		hit.graphics.beginFill("#000").rect(PIECE_W*i, 0, PIECE_W, PIECE_H);
		atom.hitArea = hit;
		
		//Draw atom
		atom.graphics.drawRoundRect((PIECE_W)*i, 0, PIECE_W-2*BORDER_THICKNESS, PIECE_H-2*BORDER_THICKNESS,20);
		
		//Define other properties of the atom
		atom.key = p.keys[i];
		atom.setBounds(PIECE_W*i, 0, PIECE_W-2*BORDER_THICKNESS, PIECE_H-2*BORDER_THICKNESS);
		p.addChild(atom);
	}
	
	return p;
	
}


function ClausePieceShape(st_list,piece_num){
    //p is the container that holds the peices and properties associated
	var p = new createjs.Container();
	
	//Settings properties of the peice
	p.keys = st_list;
	//p.regX = (p.keys.length*100)/2;
	//p.regY = 50;
	p.height = PIECE_H;
	p.width = PIECE_W*p.keys.length;
	p.orgX = -(p.keys.length*100)/2; 
	p.orgY = -50;
	p.piece_num = piece_num;
    
    
	//Generating individual atoms and adding it to the piece
	for (var i = 0; i< p.keys.length; i++){
		var atom = new createjs.Shape();
		atom.graphics.setStrokeStyle(10);
		
		//Generating atom color
		var atom_color = colors[Math.abs(p.keys[i])];
		
		//If atom is positive fill the block and no border
		if (p.keys[i] > 0){
			
			atom.graphics.beginFill(atom_color);
		}
		//If atom is negative draw border no fill
		else if(p.keys[i] < 0){
			
			atom.graphics.beginStroke(atom_color);
		}
		
		//Draw atom
		atom.graphics.drawRoundRect(80*i, 0, 80-2*BORDER_THICKNESS, 80-2*BORDER_THICKNESS,20);
		p.addChild(atom);
	}
	
	var piece_num_text = new createjs.Text(piece_num, "40px Arial","black");
	piece_num_text.x = 20;
	p.addChild(piece_num_text);
	
	return p;
    
    
    
}


function tweenMatchingPieces(selectedPiece){
    allPieces = pm.getAllPieces();
    for(k in selectedPiece.matching){
        if (selectedPiece.matching[k]){
            allPieces[k].alpha = 1.0;
        }
        else{
            allPieces[k].alpha = 0.3;
        }
        
    }
    
    /*
	allPieces = pm.getAllPieces();
	for(var i = 0; i<allPieces.length; i++){
		//createjs.Tween.get(pm._piece_list[i]).to({alpha: 0.5});
		allPieces[i].alpha = 0.3;
	}
	resultPieces = pm.getMatchingPieces(selectedPiece);
	selectedPiece.alpha = 1.0;
	
	for (var i=0;i<resultPieces.length;i++){
		//createjs.Tween.get(resultPieces[i]).to({alpha: 1.0});
		resultPieces[i].alpha = 1.0;
	}
    */
}






function pieceCollision(p1,p2){
	
	/*
	if((p1.x - (p2.x + (p2.width*play_area.scaleX))) >= 0 ||
	((p1.x + (p1.width*play_area.scaleX)) - p2.x) <= 0||
	(p1.y - (p2.y + (p2.height*play_area.scaleY)))>= 0 ||
	((p1.y + (p1.height*play_area.scaleY)) - p2.y)<= 0)*/
	if((p1.x+p1.orgX - (p2.x+p2.orgX + (p2.width*play_area.scaleX))) >= 0 ||
	((p1.x+p1.orgX + (p1.width*play_area.scaleX)) - (p2.x+p2.orgX)) <= 0||
	(p1.y-p1.orgY - (p2.y-p2.orgY + (p2.height*play_area.scaleY)))>= 0 ||
	((p1.y-p1.orgY + (p1.height*play_area.scaleY)) - (p2.y-p1.orgY))<= 0)
		{
			
			return false;
		}
	else{
		//console.log(p1.x+ " " + (p1.x+p1.orgX));
		return true;
	}
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

//function clearComboBox() {
//	alert.window("combobox cleared.... :)");
//}


function solvePieces(p1,p2, addToSolution){
    var num_negations = 0;
    var p1_keys = p1.keys.slice();
    var p2_keys = p2.keys.slice();
    
    if(p1.matching[p2.piece_num]){

        for(var i = 0; i < p1_keys.length; i++){
            for(var j = 0; j < p2_keys.length; j++){
                if(p1_keys[i] == -1*p2_keys[j]){
                    delete p1_keys[i];
                    delete p2_keys[j];
                    num_negations++;
                    
                }
                else if(p1_keys[i] == p2_keys[j]){
                    delete p1_keys[i];
                    
                }
            
            }
        }
        
        if(num_negations == 1){
            console.log("num_negations = " + num_negations);
            
            var new_keys = p1_keys.concat(p2_keys).filter(Number);
            new_keys.sort();
            console.log("result keys = " + new_keys);
            var add_piece = true;
            for (var i =0; i< pm._piece_list.length; i++){
                if(arraysEqual(new_keys,pm._piece_list[i].keys)){
                    console.log("Duplicate piece!!!");
                    //Flash the piece
                    createjs.Tween.get(pm._piece_list[i]).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:1});
                    add_piece = false;
                    p1.matching[p2.piece_num] = false;
                    p2.matching[p1.piece_num] = false;
                    
                    //Write failed graphviz statement
                    /*
                    document.getElementById("graphviz").innerHTML +=  "\"" + p1.piece_num.toString() +"(" + p1.keys.toString() +")\" -> "+ "\"Repeated : " + pm._piece_list[i].piece_num.toString() +"(" + pm._piece_list[i].keys.toString() +")\"" + " [label=\" \"];<br>";
                    document.getElementById("graphviz").innerHTML +=  "\"" + p2.piece_num.toString() +"(" + p2.keys.toString() +")\" -> "+ "\"Repeated : " + pm._piece_list[i].piece_num.toString() +"(" + pm._piece_list[i].keys.toString() +")\"" + " [label=\" \"];<br>";
                    */
                    break;
                }
            
            }
            
            if (add_piece){
                p1.matching[p2.piece_num] = false;
                p2.matching[p1.piece_num] = false;
                pm._num_steps++;
                new_piece = pm.addPiece(new_keys);
                
                
                //Add node and links to graph. 
                //**************************Following code is only for graph
                var parent_node1 = {id: p1.piece_num, label: p1.piece_num.toString()};
                var parent_node2 = {id: p2.piece_num, label: p2.piece_num.toString()};
                var graph_node = {id: new_piece.piece_num, label: new_piece.piece_num.toString()};
                //graph_node.id = new_piece.piece_num;
                //graph_node.label = new_piece.piece_num.toString();
                add_graph_node(parent_node1);
                add_graph_node(parent_node2);
                add_graph_node(graph_node);
                
                var graph_edge1 = {from: p1.piece_num, to: new_piece.piece_num, label: "Step " + pm._num_steps.toString()};
                            
                var graph_edge2 = {from: p2.piece_num, to: new_piece.piece_num, label: "Step " + pm._num_steps.toString()};
                
                
                graph_edges.add([graph_edge1,graph_edge2]);
                
                /*
                document.getElementById("graphviz").innerHTML +=  "\"" + p1.piece_num.toString() +"(" + p1.keys.toString() +")\" -> "+ "\"" + new_piece.piece_num.toString() +"(" + new_piece.keys.toString() +")\"" + " [label=\"Step "+ pm._num_steps.toString()+"\"];<br>";
                document.getElementById("graphviz").innerHTML +=  "\"" + p2.piece_num.toString() +"(" + p2.keys.toString() +")\" -> "+ "\"" + new_piece.piece_num.toString() +"(" + new_piece.keys.toString() +")\"" + " [label=\"Step "+ pm._num_steps.toString()+"\"];<br>";
                
                */
                console.log(graph_edges);
                
                
                //**************************End of graph code
                
                
                
                
                
                
            }
        
        }
        else{
            //If the pieces don't resolve at all just write to graphvix statement
            /*
            document.getElementById("graphviz").innerHTML +=  "\"" + p1.piece_num.toString() +"(" + p1.keys.toString() +")\" -> "+ "\" No Resolution \"" + " [label=\" \"];<br>";
            document.getElementById("graphviz").innerHTML +=  "\"" + p2.piece_num.toString() +"(" + p2.keys.toString() +")\" -> "+ "\" No Resolution \"" + " [label=\" \"];<br>";
            */
        }
    }
}

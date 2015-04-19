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
		resetBoard();
		evt.stopPropagation();
		play_area.setChildIndex(evt.currentTarget,play_area.getNumChildren() - 1);
		var global = play_area.localToGlobal(evt.currentTarget.x, evt.currentTarget.y);
		evt.currentTarget.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
		
		if(!alpha_locked){
			tweenMatchingPieces(evt.currentTarget);
			evt.currentTarget.alpha = 1;
		}
	
    });
	
	//On dragging
	p.on("pressmove", function(evt){
			var local = play_area.globalToLocal(evt.stageX + evt.currentTarget.offset.x, evt.stageY + evt.currentTarget.offset.y);
            evt.currentTarget.x = local.x;
            evt.currentTarget.y = local.y;
			
			
            //console.log("Moving  !!");
			var pl_length = pm._piece_list.length
            for(var i = 0;i < pl_length;i++){
				if(zim.hitTestBounds(evt.currentTarget, pm._piece_list[i])&& (evt.currentTarget.piece_num != pm._piece_list[i].piece_num)){
					cb.addPiece(ClausePieceShape(pm._piece_list[i].keys, pm._piece_list[i].piece_num));
    				cb.addPiece(ClausePieceShape(evt.currentTarget.keys,evt.currentTarget.piece_num));
				}				
    		}
     });
    
    //Check for collision for mouse up
    
    p.on("pressup",function(evt){
    		var pl_length = pm._piece_list.length;
    		for(var i = 0;i < pl_length;i++){
				
				
    			if(pieceCollision(evt.currentTarget, pm._piece_list[i]) && (evt.currentTarget.piece_num != pm._piece_list[i].piece_num)){
					
					//If 2 pieces collide solve them
    				solvePieces(p,pm._piece_list[i], true);

					
					play_area.removeChild(cb.piece_board);
				}
    		}
			createjs.Tween.get(evt.currentTarget).to({x: evt.currentTarget.homeX, y: evt.currentTarget.homeY}, 1000, createjs.Ease.elasticOut);
			
    });
    
    
    //On double clicking
    p.on("dblclick",function(evt){
		resetBoard();
		if(!alpha_locked){
			tweenMatchingPieces(evt.currentTarget);
			evt.currentTarget.alpha = 1;
		}
		replaceWithSolvedPieces(evt.currentTarget);
	});
	
	
	//Generating individual atoms and adding it to the piece
	var pkeys_length = p.keys.length;
	for (var i = 0; i< pkeys_length; i++){
			var atom = new createjs.Shape();
			atom.graphics.setStrokeStyle(3);
			//Generating atom color
			var atom_color = colors[Math.abs(p.keys[i])];
			var piece_letter_text;									
			var chr = String.fromCharCode(96 + Math.abs(p.keys[i]));
			//var chr = String.fromCharCode(0x4E00 + Math.abs(p.keys[i]));
			//var chr = String.fromCharCode(0x0904 + Math.abs(p.keys[i]));
			//var chr = String.fromCharCode(0x0400 + Math.abs(p.keys[i]));
			//If atom is positive fill the block and no border
			if (p.keys[i] > 0){
				piece_letter_text = new createjs.Text(chr, "bold 50px Arial","black");
				atom.graphics.beginFill("white");
				atom.graphics.beginStroke("black");
			}
			//If atom is negative draw border no fill
			else if(p.keys[i] < 0){
				piece_letter_text = new createjs.Text(chr, "bold 50px Arial","white");
				atom.graphics.beginFill("black");	
				atom.graphics.beginStroke("white");
				}
			//Draw atom
			atom.graphics.drawRoundRect(80*i, 0, 80-2*BORDER_THICKNESS, 80-2*BORDER_THICKNESS,20);
			atom.setBounds(80*i, 0, 80-2*BORDER_THICKNESS, 80-2*BORDER_THICKNESS);
			piece_letter_text.x = 80*i + 25;
			piece_letter_text.y = 20;
			p.addChild(atom);
			p.addChild(piece_letter_text);
			}
	//Settings piece bounds for zim collision		
	//p.setBounds(0,0,p.height,p.width);
	
	//console.log(p.getBounds());
	p.height = p.getBounds().height;
	p.width = p.getBounds().width;
	//console.log(p.height + " " + p.width)
	return p;
}


function replaceWithSolvedPieces(selectedPiece){
	allPieces = pm.getAllPieces();
	window.addedSolvedPieces = [];
    for(k in selectedPiece.matching){
        if (selectedPiece.matching[k]){
            allPieces[k].visible = false;
            cp = ClausePieceShape(solveValues(selectedPiece,allPieces[k]) , allPieces[k].piece_num);
            cp.x = allPieces[k].x;
            cp.y = allPieces[k].y;
            play_area.addChild(cp);
            createjs.Tween.get(cp).to({alpha:0}).to({alpha:1}, 1000, createjs.Ease.bounceOut);
            addedSolvedPieces.push(cp);


        }
        
    }
}


function ClausePieceShape(st_list,piece_num){
    //p is the container that holds the peices and properties associated
	var p = new createjs.Container();
	
	//Settings properties of the peice
	p.keys = st_list;
	p.height = PIECE_H;
	p.width = PIECE_W*p.keys.length;
	p.orgX = -(p.keys.length*100)/2; 
	p.orgY = -50;
	p.regX = (p.keys.length*100)/2;
	p.regY = 50;
	p.piece_num = piece_num;
    
	//Generating individual atoms and adding it to the piece
	var pkeys_length = p.keys.length;
	for (var i = 0; i< pkeys_length; i++){
		var atom = new createjs.Shape();
		atom.graphics.setStrokeStyle(2);
		
		//Generating atom color
		var atom_color = colors[Math.abs(p.keys[i])];
		var piece_letter_text;									
			var chr = String.fromCharCode(96 + Math.abs(p.keys[i]));
			//var chr = String.fromCharCode(0x4E00 + Math.abs(p.keys[i]));
			//var chr = String.fromCharCode(0x0904 + Math.abs(p.keys[i]));
			//var chr = String.fromCharCode(0x0400 + Math.abs(p.keys[i]));
			//If atom is positive fill the block and no border
			if (p.keys[i] > 0){
				piece_letter_text = new createjs.Text(chr, "bold 50px Arial","black");
				atom.graphics.beginFill("white");
				atom.graphics.beginStroke("black");
			}
			//If atom is negative draw border no fill
			else if(p.keys[i] < 0){
				piece_letter_text = new createjs.Text(chr, "bold 50px Arial","white");
				atom.graphics.beginFill("black");	
				atom.graphics.beginStroke("white");
				}
		
		//Draw atom
		
		atom.graphics.drawRoundRect(80*i, 0, 80-2*BORDER_THICKNESS, 80-2*BORDER_THICKNESS,20);
		p.addChild(atom);
		piece_letter_text.x = 80*i + 25;
			piece_letter_text.y = 20;
		p.addChild(piece_letter_text);
	}
	
	var piece_num_text = new createjs.Text(piece_num, "40px Arial","red");
	piece_num_text.x = 20;
	p.addChild(piece_num_text);
	
	return p;
}


function tweenMatchingPieces(selectedPiece){
	//Sets alpha of matching pieces to 1, everything else is 0.3
    allPieces = pm.getAllPieces();
    for(k in selectedPiece.matching){
        if (selectedPiece.matching[k]){
            allPieces[k].alpha = 1.0;
        }
        else{
            allPieces[k].alpha = 0.3;
        }
        
    }

}

function pieceCollision(p1,p2){
	//Detects collision of 2 pieces
	if((p1.x+p1.orgX - (p2.x+p2.orgX + (p2.width))) >= 0 ||
	((p1.x+p1.orgX + (p1.width)) - (p2.x+p2.orgX)) <= 0||
	(p1.y-p1.orgY - (p2.y-p2.orgY + (p2.height)))>= 0 ||
	((p1.y-p1.orgY + (p1.height)) - (p2.y-p1.orgY))<= 0)
		{
			
			return false;
		}
	else{
		return true;
	}
}

function arraysEqual(a, b) {
	//Checks if two arrays are equal in value
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

	var a_length = a.length
  for (var i = 0; i < a_length ; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


function solveValues(p1,p2){
//This function ONLY solves the two pieces and returns an array for the new piece. 
//Should be used to solve not display
 		var num_negations = 0;
        var p1_keys = p1.keys.slice();
        var p2_keys = p2.keys.slice();
		
		var p1_keys_length = p1_keys.length;
		var p2_keys_length = p2_keys.length;
        for(var i = 0; i < p1_keys_length; i++){
			for(var j = 0; j < p2_keys_length; j++){
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
        
        var new_keys = [];
        if(num_negations == 1){
            new_keys = p1_keys.concat(p2_keys).filter(Number);
        }
        
        return new_keys;
}


function solvePieces(p1,p2, addToSolution){
	//Solves 2 pieces together and adds it to the board
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
    //Flashing the piece
                    createjs.Tween.get(pm._piece_list[i]).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:0.3});
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

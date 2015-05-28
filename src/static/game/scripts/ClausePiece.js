function ClausePiece(st_list, piece_num) {
	//p is the container that holds the peices and properties associated
	var p = ClausePieceShape(st_list, piece_num);
	
	//Settings properties of the peice
	//p.keys = st_list;
    p.matching = {};

	//Setting mouse interaction with the whole piece

	//Behaviour on clicking piece
	p.on("mousedown", function(evt){
		resetBoard();
        resetWidths();
		evt.stopPropagation();
		play_area.setChildIndex(evt.currentTarget,play_area.getNumChildren() - 1);
		var global = play_area.localToGlobal(evt.currentTarget.x, evt.currentTarget.y);
		evt.currentTarget.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
		
		if(!alpha_locked){
			tweenMatchingPieces(evt.currentTarget);
			evt.currentTarget.alpha = 1;
		}

        //Single click to replace pieces with result.
        createjs.Tween.get(evt.currentTarget).to({scaleX: 1.0, scaleY: 1.0}).to({scaleX: 0.75, scaleY: 0.75}, 250);
        
        //Adding red border around selected piece and resetting green borders from previous step
        prev_parent = selected_piece_border.parent;
        
        if(prev_parent != null){
            prev_parent.removeChild(selected_piece_border);
            prev_parent.updateCache();
        }

        selected_piece_border.graphics.clear().setStrokeStyle(5).beginStroke("#ff0000").drawRect(0, 0, evt.currentTarget.width, evt.currentTarget.height);
        evt.currentTarget.addChild(selected_piece_border);
        evt.currentTarget.updateCache();
        var npb_length = new_piece_borders.length;
        for (var i =npb_length-1; i>=0; i--){
            //play_area.removeChild();
            green_piece = new_piece_borders[i].parent
            green_piece.removeChild(new_piece_borders[i]);
            green_piece.updateCache();
            delete new_piece_borders.pop();

        }
        replaceWithSolvedPieces(evt.currentTarget);

      
	
    });
	
	//On dragging
	p.on("pressmove", function(evt){
        /*
			var local = play_area.globalToLocal(evt.stageX + evt.currentTarget.offset.x, evt.stageY + evt.currentTarget.offset.y);
            evt.currentTarget.x = local.x;
            evt.currentTarget.y = local.y;


            
			var pl_length = pm._piece_list.length
            for(var i = 0;i < pl_length;i++){

				if(pieceCollision(evt.currentTarget, pm._piece_list[i])&& (evt.currentTarget.piece_num != pm._piece_list[i].piece_num) && pm._piece_list[i].matching[evt.currentTarget.piece_num]){
					
					var result_val = [];
					if (temp_piece != null) play_area.removeChild(temp_piece);
					result_val = solveValues(pm._piece_list[i], evt.currentTarget);
					//console.log("Solve values : " + result_val);
					if (result_val.length > 0){
							
							temp_piece = pm.showPiece(result_val,pm._total_pieces);
							play_area.addChild(temp_piece);
					}
					//cb.addPiece(ClausePieceShape(pm._piece_list[i].keys, pm._piece_list[i].piece_num));
    				//cb.addPiece(ClausePieceShape(evt.currentTarget.keys,evt.currentTarget.piece_num));
				}


    		}*/
     });
    
    //Check for collision for mouse up
    
    p.on("pressup",function(evt){
        /*
    		var pl_length = pm._piece_list.length;
    		if (temp_piece != null) play_area.removeChild(temp_piece);
    		for(var i = 0;i < pl_length;i++){
				if(pieceCollision(evt.currentTarget, pm._piece_list[i]) && (evt.currentTarget.piece_num != pm._piece_list[i].piece_num)){
					
					//If 2 pieces collide solve them
    				solvePieces(p,pm._piece_list[i], true);
					
				}
    		}

            */
			createjs.Tween.get(evt.currentTarget).to({x: evt.currentTarget.homeX, y: evt.currentTarget.homeY}, 500, createjs.Ease.elasticOut);
            
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
	
	//console.log(p.height + " " + p.width)
	return p;
}

function replaceWithSolvedPieces(selectedPiece){
	// Replaces all the pieces that can be solved with the selectedPiece with the resultant piece
	allPieces = pm.getAllPieces();
	pm.addedSolvedPieces = [];
    be.resetResultBox();
    temp_piece_list = [];
    
    for(k in selectedPiece.matching){
        if (selectedPiece.matching[k]){
            var new_keys = solveValues(selectedPiece,allPieces[k]);
            
            if (pm.checkPiece(new_keys) == false){

                    allPieces[k].visible = false;
                    cp = SolvedPiece(new_keys, allPieces[k].piece_num, selectedPiece, allPieces[k]);
                    

                    //Experimental code may want to add it to a separate function
                    allPieces[k].width = cp.width;
                    
                    //End experiment


                    //cp.x = allPieces[k].homeX;
                    cp.x = allPieces[k].homeX;
                    cp.y = allPieces[k].homeY;

                    play_area.addChild(cp);
                    
                    //Adding the same piece to branch explorer : Experiment
                    cp2 = ClausePieceShape(new_keys, allPieces[k].piece_num);
    
                    cp2.scaleY = cp2.scaleX = 0.5;                    
                    //cp2.x = 100;
                    //cp2.y = 50*pm.addedSolvedPieces.length;

                    //be.resultBox.addChild(cp2);
                    //be.resultBox.results.push(cp2);
                    temp_piece_list.push(cp2);

                    //End experiment

                    pm.addedSolvedPieces.push(cp);
            }
            else
                allPieces[k].alpha = 0.0;

        }
        
    }

    be.addFirstColumn(temp_piece_list,pm.getAllPieceValues());
    pm.adjustPieces();
}

function SolvedPiece(st_list, piece_num, parent1, parent2){
	//This function is used in replaceWithSolvedPieces. Replaces a piece on the board. Has only one property, on click add itself to the game board
	var p = ClausePieceShape(st_list, piece_num);
	p.parent1 = parent1;
	p.parent2 = parent2;

	p.on("click", function(evt){
                var add_piece = true;
            
            if (pm.checkPiece(st_list)){
                console.log("Duplicate piece!!!");
                //Flashing the piece
                    //createjs.Tween.get(pm._piece_list[i]).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:0.3});
                    add_piece = false;
                    parent1.matching[parent2.piece_num] = false;
                    parent2.matching[parent1.piece_num] = false;

            }


                if (add_piece){
        				new_piece = pm.addPiece(evt.currentTarget.keys);
        				p.parent1.matching[p.parent2.piece_num] = false;
                        p.parent2.matching[p.parent1.piece_num] = false;
                        pm._num_steps++;
                        
                        
                        p1_json = {};
                        p1_json.pn = p.parent1.piece_num;
                        p1_json.pk = p.parent1.keys;

                        p2_json = {};
                        p2_json.pn = p.parent2.piece_num;
                        p2_json.pk = p.parent2.keys;

                        parents = {};
                        parents ["p1"] = p1_json;
                        parents ["p2"] = p2_json;

                        step = {};
                        step ["pn"] = new_piece.piece_num;
                        step ["pk"] = new_piece.keys;
                        step["t"] = track_time;
                        step ["parents"] = parents;

                        game_state.saved_steps.push(step);

                        //Sending step data to server

                        sendStep(step);

                        res.push(p.parent1.piece_num+","+p.parent2.piece_num+","+new_piece.piece_num);
                        p.parent2.visible = true;
                        p.parent2.alpha = 0.3;
                        p.visible = false;


                        //Adding a green border around a newly placed piece
                        np_border = new createjs.Shape();
                        //np_border.graphics.setStrokeStyle(5).beginStroke("green").drawRect(new_piece.x+new_piece.orgX, new_piece.y+new_piece.orgY, new_piece.width-2, new_piece.height-2)
                        np_border.graphics.setStrokeStyle(5).beginStroke("green").drawRect(0,0, new_piece.width-2, new_piece.height-2)
                        new_piece_borders.push(np_border);
                        new_piece.addChild(np_border);
                        new_piece.updateCache();
                        


                        //Adjusting the widths of removed piece
                        parent2.width = parent2.getBounds().width;


                        //Recalculate all solved pieces again. This is to remove repeated results from the board
                        resetBoard();
                        //pm.adjustPieces();
                        tweenMatchingPieces(parent1);
                        replaceWithSolvedPieces(parent1);
                        //Check if new piece satisfies conclusion
                        if (new_piece.keys.length == 0){
                            pm.verifyWin();
                
                            }
                        
                }


	});
    
	return p;
}

function sendStep(step){

    //Sends steps to the server
    var csrf_token = $.cookie('csrftoken');
                console.log("Sending Step ajax!")
                    $.ajaxSetup({
                        beforeSend: function(xhr, settings) {
                            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                                xhr.setRequestHeader("X-CSRFToken", csrf_token);
                            }
                        }
                    });

                $.ajax({
              type: 'POST',
              url: '/save_step/',
              data: "problem_name=" + sessionStorage.getItem("filename")+"&username="+ sessionStorage.getItem("username")+"&total_pieces=" + pm._total_pieces+ "&total_time=" + track_time + "&solution=" + JSON.stringify(step),
              success: function(data){
                    response = data;
                },
              dataType: "json",
              async:true
            });

}


function abandonGame(){

    var csrf_token = $.cookie('csrftoken');
                console.log("Sending Step ajax!")
                    $.ajaxSetup({
                        beforeSend: function(xhr, settings) {
                            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                                xhr.setRequestHeader("X-CSRFToken", csrf_token);
                            }
                        }
                    });

                $.ajax({
              type: 'POST',
              url: '/abandon_game/',
              data: "problem_name=" + sessionStorage.getItem("filename")+"&username="+ sessionStorage.getItem("username"),
              success: function(data){
                    response = data;
                },
              dataType: "json",
              async:true
            });

}


function ClausePieceShape(st_list,piece_num){
	//This function ONLY contstructs the visual of the piece. Properties of the piece are added by other functions
    //p is the container that holds the peices and properties associated
	var p = new createjs.Container();
	
	//Settings properties of the peice
	p.keys = st_list;
	
	
	p.piece_num = piece_num;
    
	//Generating individual atoms and adding it to the piece
	var pkeys_length = p.keys.length;
    if (pkeys_length == 0){
        var star_image = new createjs.Bitmap("images/star.jpg");
        star_image.scaleX = star_image.scaleY = 0.3;
                //console.log(star_image);
                p.addChild(star_image);
                //p.cache(p.getBounds().x,p.getBounds().y,p.width,p.height);

    }


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
			//var chr = String.fromCharCode(0x0C91 + Math.abs(p.keys[i]));
            //var chr = String.fromCharCode(0x03B0 + Math.abs(p.keys[i]));
			
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
		p.addChild(atom);
		
		piece_letter_text.x = 80*i + 25;
		piece_letter_text.y = 20;
		p.addChild(piece_letter_text);

	}
	
	var piece_num_text = new createjs.Text(piece_num, "40px Arial","red");
	piece_num_text.x = 20;
	p.addChild(piece_num_text);
	if(p.getBounds() != null){
			p.height = p.getBounds().height;
			p.width = p.getBounds().width;
			//console.log(p.width + " " + p.height);
			p.regX = p.width/2;
			p.regY = p.height/2;

			p.orgX = -(p.width)/2; 
			p.orgY = -(p.height/2);
	}


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
            allPieces[k].alpha = 0.0;
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
            new_keys.sort();
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
          
            if (pm.checkPiece(new_keys))
            {
                    console.log("Duplicate piece!!!");
                    //Flashing the piece
                    //createjs.Tween.get(pm._piece_list[i]).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:1}).wait(250).to({alpha:0}).wait(250).to({alpha:0.3});
                    add_piece = false;
                    p1.matching[p2.piece_num] = false;
                    p2.matching[p1.piece_num] = false;
                    

            }
            
            if (add_piece){
                p1.matching[p2.piece_num] = false;
                p2.matching[p1.piece_num] = false;
                pm._num_steps++;
                new_piece = pm.addPiece(new_keys);
                
                        
                        p1_json = {};
                        p1_json.pn = p.parent1.piece_num;
                        p1_json.pk = p.parent1.keys;

                        p2_json = {};
                        p2_json.pn = p.parent2.piece_num;
                        p2_json.pk = p.parent2.keys;

                        parents = {};
                        parents ["p1"] = p1_json;
                        parents ["p2"] = p2_json;

                        step = {};
                        step ["pn"] = new_piece.piece_num;
                        step ["pk"] = new_piece.keys;
                        step ["parents"] = parents;


                        game_state.saved_steps.push(step);
                
                res.push(p1.piece_num+","+p2.piece_num+","+new_piece.piece_num);

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

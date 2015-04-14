//This script draws a graph of all the steps the player takes

var graph_container
var graph_nodes = new vis.DataSet();
var graph_edges = new vis.DataSet();
var graph_data = {
	nodes: graph_nodes,
	edges: graph_edges
};
var graph_network;

var graph_options = {
	/*
	hierarchicalLayout: {
		layout: "direction",
		direction: "UD",
		
	},*/
	stabilize: true,
	stabilizationIterations: 100,
	
	edges: {
		color: 'red',
		style: 'arrow',
		width: 2
	},
};


function graphInit(){
	
	graph_container =  document.getElementById('graph_div');
	console.log(graph_container);
 graph_network = new vis.Network(graph_container, graph_data, graph_options) ;
 
 
}


function add_graph_node(node){
	if(graph_nodes.get(node.id) == null){
		graph_nodes.add([node]);
	}
	
}
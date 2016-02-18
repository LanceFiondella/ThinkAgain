//global variables
window.spList = {};
window.mpList = {};
window.keys = [];
window.activeTab = "sp";
window.selItem = 0;
window.selMultiItem = 0;


function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function init(){
  
  var csrf_token = $.cookie('csrftoken');
  console.log(sessionStorage.getItem("username"));
  
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrf_token);
        }
    }
});

$.ajax({
    url : "/get_level_list/",
    type : "POST",
    data: "username="+ sessionStorage.getItem("username"),

    success: function(data){
      window.spList = data['singleplayer'];
      window.mpList = data['multiplayer'];
      window.lastSol = data['last_sol'];
      console.log("Getting level_list_data");
      
      populate_list();
      }

  });

  

}//end init


function populate_list(){
var singlePlayerList = document.getElementById('singlePlayerList');
var multiPlayerList =  document.getElementById('multiPlayerList');
console.log(window.spList);
window.keys = [];
var k, i, len;
for (var key in window.spList) {
  if (window.spList.hasOwnProperty(key)) {
    window.keys.push(key);
    //
  }
}

window.keys.sort();
len = window.keys.length;

for (i = 0; i < len; i++) {
  k = window.keys[i];
  
  singlePlayerList.innerHTML += '<div onClick="selectedItem('+i.toString() + ')" id="singleplayer'+i.toString()+'" class="list-group-item row "><div class="col-xs-3"><h5 style="color:green">'+ window.spList[k].current_status+'<h5></div><div class="col-xs-5"><h4>'+ k + '</h4></div><div class="col-xs-2"><h4>'+window.spList[k].complete_count.toString()+'</h4></div><div class="col-xs-2"><h4>'+window.spList[k].abandoned_count.toString()+'</h4></div>';
  multiPlayerList.innerHTML +='<div onClick="selectedMultiItem('+i.toString() + ')" id="multiplayer'+i.toString()+'" class="list-group-item row "><div class="col-xs-3"><h5 style="color:green">'+ window.mpList[k].current_status+'<h5></div><div class="col-xs-5"><h4>'+ k + '</h4></div><div class="col-xs-2"><h4>'+window.mpList[k].complete_count.toString()+'</h4></div><div class="col-xs-2"><h4>'+window.mpList[k].abandoned_count.toString()+'</h4></div>';
}



}


function selectedItem(id){
    if (window.selItem != null){
      var i = document.getElementById("singleplayer"+window.selItem);
      $(i).removeClass("active");   
    }
   window.selItem = id;
   var i = document.getElementById("singleplayer"+id);
   $(i).addClass("active");
   window.activeTab = "sp";
}

function selectedMultiItem(id){
    if (window.selMultiItem != null){
    var i = document.getElementById("multiplayer"+window.selMultiItem);
    $(i).removeClass("active");   
  }
 window.selMultiItem = id;
 var i = document.getElementById("multiplayer"+id);
 $(i).addClass("active"); 
 window.activeTab = "mp";
}

function listToMainMenu(){
  $('#level-list').hide();
  $('#options-menu').hide();
  //$('#main-menu').collapse();
  $('#main-menu').show();
}

function showLevelList(){
  
  $('#main-menu').hide();
  $('#options-menu').hide();
  //$('#level-list').collapse();
  $('#level-list').show();
}

function showOptions(){
  $('#main-menu').hide();
  $('#level-list').hide();
  $('#options-menu').show();
}

$(function() {
$( "#mptab" ).click(function() {
  window.activeTab = "mp";
});

$( "#sptab" ).click(function() {
  window.activeTab = "sp";
});
});

function play(){
  if (window.activeTab == "sp"){
    console.log(window.keys[window.selItem]);
    sessionStorage.setItem("filename",window.keys[window.selItem]);
    sessionStorage.setItem("gameType",window.activeTab);
  }else if (window.activeTab == "mp"){
    console.log(window.keys[window.selMultiItem]);
    sessionStorage.setItem("filename",window.keys[window.selMultiItem]);
    sessionStorage.setItem("gameType",window.activeTab);
  }
}

function continueLast(){
  if(window.last_sol != null){
    sessionStorage.setItem("filename",window.last_sol['name']);
    sessionStorage.setItem("gameType",window.last_sol['type']);
  }
}


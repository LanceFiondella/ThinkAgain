window.unreadMessages = 0;

function addMessage(message,username, date){
	var chatBody = document.getElementById('chatBody');
	chatBody.innerHTML += '<li class="right clearfix"><div class="chat-body clearfix"><div class="header"><strong class="primary-font">';
	chatBody.innerHTML += username;
	//var date = Date();
	chatBody.innerHTML += '</strong> <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>' + date +'</small>';
	chatBody.innerHTML += '</div><p>' +message+ '</p></div></li>'
	

}

function getAllChat(){
	var response;
				var csrf_token = $.cookie('csrftoken');

				$.ajaxSetup({
							beforeSend: function(xhr, settings) {
							//if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
							    xhr.setRequestHeader("X-CSRFToken", csrf_token);
							  //             }
							            }
					        });

				$.ajax({
							  type: 'POST',
							  url: '/get_all_messages/',
							  data: "problem_name=" + sessionStorage.getItem("filename")+"&initiator="+ "vshekar",
							  success: function(data){
							        response =data;
							    },
							  dataType: "json",
							  async:false
							});

	for(i = 0; i<response.length; i++){
		addMessage(response[i].message, response[i].username, response[i].timestamp);
	}
				console.log("Get all chat");
				console.log(response);

}



function sendMessage(){
		var message = document.getElementById("btn-input").value;
		document.getElementById("btn-input").value = '';
		console.log(message);
			if(message.length >0){
			var response;
				var csrf_token = $.cookie('csrftoken');

				$.ajaxSetup({
							beforeSend: function(xhr, settings) {
							//if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
							    xhr.setRequestHeader("X-CSRFToken", csrf_token);
							  //             }
							            }
					        });

				$.ajax({
							  type: 'POST',
							  url: '/send_chat_message/',
							  data: "problem_name=" + sessionStorage.getItem("filename")+"&initiator="+ "vshekar" +"&message="+ message,
							  success: function(data){
							        response =data;
							    },
							  dataType: "json",
							  async:false
							});
			

				console.log(response);
				}
				return false;
}

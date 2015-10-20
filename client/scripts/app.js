// YOUR CODE HERE:
var app = {};
var posts = [];

app.init = function(){};

app.send = function(message){
  $.ajax({
    url : "https://api.parse.com/1/classes/chatterbox",
    type: "POST",
    data: JSON.stringify(message),
    contentType : "application/json",
    success: function(data) {
      console.log('chatterbox: message sent!');
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(){
  $.ajax({
    url:  "https://api.parse.com/1/classes/chatterbox",
    type: "GET",
    success: function(data) {
      console.log('working');
      posts = data.results;
      displayPosts();
    },
    error: function(data) {
      console.error('chatterbox: failed to fetch message')
    }
  });
};

var displayPosts = function() {
  _.each(posts, function(p){
    app.addMessage(p); 
  });
};

app.clearMessages = function(){
  $("#chats").children().remove();
};

app.addMessage = function(message){
  var container = $("<div></div>");
  container.addClass("container");
  container.attr("id", message.roomname);
  var userName = $("<div></div>");
  userName.addClass('username');
  userName.text(message.username);

  var text = $("<p></p>");
  text.text(message.text);
  container.append(userName);
  container.append(text);
  $("#chats").append(container);
};

app.addRoom = function(roomName){
  var temp = $("<option></option>");
  temp.text(roomName);
  $("#roomSelect").append(temp);
};

app.addFriend = function(name){
  var friend = $('<li></li>');
  friend.text(name);
  $("#friendsList").append(friend);
};



var sendData = {
};
//message and send button
$(document).ready(function(){
  $("#send").on("click", function(){
    var inputMsg = $("#sendMessage").val();
    
    sendData.username = window.location.search.slice(10);
    sendData.text = inputMsg;
    sendData.roomname = "test";

    app.send(sendData);

  });
  $("#fetch").on("click", function(){
    app.fetch();
  });
  $("body").on("click",".username", function(){
    app.addFriend(this.innerText);
    console.log("sdaf");
  });
});

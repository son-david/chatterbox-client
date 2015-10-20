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
      app.updateRooms();
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

app.clearMessages = function(selector){
  if (selector === undefined) {
    $("#chats").children().remove();
  } else {
    _.each($("#chats").children(), function(child){
      child = $(child);
      if (child.attr('id') !== selector) {
        child.remove();
      }
    })
  }

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
  $("#chats").prepend(container);
};

app.addRoom = function(roomName){
  if (roomName !== undefined && roomName !== "") {
    var fullName = roomName;
    roomName = roomName.split(" ").join('')
    roomName = removeFunnies(roomName);
    var temp = $("<option id=" + roomName + "></option>");
    temp.text(fullName);

    if (!$('#roomSelect').find($('#'+roomName)).length){
      $("#roomSelect").append(temp);
    }
  }
};

app.addFriend = function(name){
  var friend = $('<li></li>');
  friend.text(name);
  $("#friendsList").append(friend);
};

app.updateRooms = function(){
  var children = $("#chats").children();
  _.each(children, function(child) {
    child = $(child);
    app.addRoom(child.attr('id')); 
  });
};

var sendData = {};
//message and send button
$(document).ready(function(){
  
  $("#send").on("click", function(){
    var inputMsg = $("#sendMessage").val();

    sendData.username = window.location.search.slice(10);
    sendData.text = inputMsg;
    sendData.roomname = $('#roomSelect option:selected').val();

    app.send(sendData);

  });
  $("#main").on("click","#fetch", function(){
    app.clearMessages();
    app.fetch();
  });

  $("body").on("click",".username", function(){
    app.addFriend(this.innerText);
    console.log("sdaf");
  });

  $('#addRoom').on('click', function(){
    var roomName = $('#inputRoom').val();
    app.addRoom(roomName);
  });

  $("#roomSelect").on('select', function(){
    app.clearMessages($('#roomSelect option:selected').val());
  })
});

var removeFunnies = function(string){
  var desired = string.replace(/[^\w\s]/gi, '');
  return desired;
};
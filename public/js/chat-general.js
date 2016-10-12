$(document).ready(function(){
	var socket = io('/general');
	var input = $('#chatBox');
	var messages = $('#messages');
	
	var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };
	
	input.on('keydown', function(event) {
		event.preventDefault();
    if (event.keyCode != 13) {
        return;
    }

    var message = input.val();
    addMessage(message);
    socket.emit('message', message);
    input.val('');
});
	
});
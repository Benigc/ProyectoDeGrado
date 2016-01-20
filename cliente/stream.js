$(function(){
	io.on('liveStream', function(url) {
   		$('#stream').attr('src', url);
    	$('.start').hide();
 	});
});
function startStream() {
    io.emit('start-stream');
    $('.start').hide();
}
function startStop() {
    io.emit('start-stream');
    $('.stop').hide();
}
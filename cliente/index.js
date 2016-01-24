$(document).ready(function(){
	var a = ['sads','sdfd'];
	//$('#registro').click(function(){
		a.each('dato',function(){
			$('#di').html($(this).text());
		})
	
})
$(function() {

    io.on( 'mensaje', function( msg ) {
        $("#pn_mensajes").html( msg.mensaje + "<br/>" )
    });
    $('.mostrar').on( 'click', function() {
        console.log( "evento click - mostrar" );
        io.emit('mostrar', { hey: 'server' }, function(data) {
            console.log( data.success )
        })
    });
});
$(document).ready(function(){

    $(".button-collapse").sideNav();

    var a = ['sads','sdfd'];
    //$('#registro').click(function(){
    a.forEach( function( v , k ){
       console.log( v );
        $('#di').html( v );
    });

    io.on( 'mensaje', function( msg ) {
        $("#pn_mensajes").html( msg.mensaje + "<br/>" )
    });
    $('.mostrar').on( 'click', function() {
        console.log( "evento click - mostrar" );
        io.emit('mostrar', { hey: 'server' }, function(data) {
            console.log( data.success )
        })
    });



  io.on('news', function (data) {
    console.log(data);
    io.emit('my other event', { my: 'data' });
  });

    io.emit('index_hello', { my: 'data' });

    io.on( 'registro', function( msg ) {
        //$("#pn_mensajes").html( msg.mensaje + "<br/>" )
        $("input[name=codigo]").val(msg.codigo);
        console.log(msg);
    });
});
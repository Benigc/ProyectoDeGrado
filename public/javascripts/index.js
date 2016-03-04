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

    io.on('registro', function( msg ) {
        //$("#pn_mensajes").html( msg.mensaje + "<br/>" )
        $("input[name=codigo]").val(msg.codigo);
        console.log(msg);
    });
    io.on('rfid',function(mg){
        $("table#rfi tbody").append("<tr><td>"+mg.obrero.img+"</td><td>"+mg.obrero.nombre+"</td><td>"+mg.obrero.codigo+"</td></tr>");
        console.log(mg.obrero.nombre);
    });
        //$('select').material_select();
    io.on('mos',function(mg){
        console.log(mg.obrero.nombre);
        $("table#resp tbody").append("<tr><td>img(src="+mg.obrero.img+")</td><td>"+mg.obrero.nombre+"</td></tr>");
    });
    io.on('buscar',function(mg){
        $("table#buscar tbody").append("<tr><td>img(src="+mg.obrero.nombre+")</td><td>"+mg.obrero.apellido+"</td></tr>");
    })
});
$(function() {

    io.on( 'mensaje', function( msg ) {
        $("#pn_mensajes").html( msg.mensaje + "<br/>" )
    });
    $('.create').on( 'click', function() {
        console.log( "evento click - create" );
        io.emit('create', { hey: 'server' }, function(data) {
            console.log( data.success )
        })
    });
    $('.register').on('click',function(){
        //obtenemos los valores que necesitamos para procesar el formulario
        var username = $(".username").val(),
        password = $(".password").val();
        //repassword = $(".repassword").val();
        if(username.length < 3 || password.length < 4)
        {
           // showModal("Error formulario","Los campos no pueden estar vacios");
            return false;
        }else{
        //console.log(username +' '+ password);
        io.emit('register', { username:$(".username").val(),password:$(".password").val() imag:$(".fotos").val(),seccion:$(".seccion").val(),ocupacion:$(".ocupacion").val() }, function(data) {
            console.log(data.success )
        });
        }
    });
});
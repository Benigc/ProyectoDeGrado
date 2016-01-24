var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Nodeblok1.csv');
UserModel = {};
UserModel.createUsersTable = function(){
	db.serialize(function(){
		db.run("DROP TABLE IF EXISTS usuarios");
		db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, username NCHAR(13),password NCHAR(20),hora NCHAR(10), img NCHAR(30),seccion NCHAR(30),ocupacion NCHAR(20) )");
		console.log("la tabla de usuarios ha sido creado");
	});
}
UserModel.getUsers = function(callback){
	db.all("SELECT * FROM usuarios",function(err,rows){
		if(err){
			throw err;
		}
		else{
			callback(null, rows);
		}
	});
}
UserModel.getUser = function(userData){
	db.all("SELECT*FROM usuarios WHERE password=?", [userData.pass], function(error, result){
         if(error){
            throw error;
         }else{
            var resultado = result;
            if(resultado.length > 0){
            	stmt = db.prepare("INSERT INTO diatrabajo VALUES (?,?,?,?,?,?,?)")	;
				stmt.bind(null,resultado.username,resultado.password,resultado.hora,resultado.img,resultado.seccion,resultado.ocupacion);
               console.log(resultado[0].username + ' ' + resultado[0].password + '  ' + resultado[0].hora);
            }else{
               console.log('Registro no encontrado');
            }
        }
    });
}

UserModel.registrarUser = function(userData, callback){
	var response = {};
	stmt = db.prepare("SELECT*FROM usuarios WHERE username = ?");
	stmt.bind(userData.username);
	stmt.get(function(error, rows){
		if (error){
			throw err;
		}
		else{
			if(rows){
				callback({msg:"existe"});
			}
			else{
				stmt = db.prepare("INSERT INTO usuarios VALUES (?,?,?,?,?,?,?)")	;
				stmt.bind(null,userData.username,userData.password,userData.hora,userData.img,userData.seccion,userData.ocupacion);
				stmt.run(function(err, result){
					if (err) {
						throw err;
					}
					else{
						callback({msg:"creado"});
					}
				});
			}
		}
	});
	stmt.finalize();
}
function getDia(){
    var a = new Date();
    a = a.getHours()+':'+a.getMinutes()+':'+a.getSeconds();
    	return a;
}
module.exports=UserModel;
